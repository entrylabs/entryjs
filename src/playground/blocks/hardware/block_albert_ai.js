'use strict';

function AlbertAiController() {
	this.prevDirection = 0;
	this.prevDirectionFinal = 0;
	this.directionCount = 0;
	this.directionCountFinal = 0;
	this.positionCount = 0;
	this.positionCountFinal = 0;
	this.isBackward = false;
}

AlbertAiController.prototype.PI = 3.14159265;
AlbertAiController.prototype.PI2 = 6.2831853;
AlbertAiController.prototype.GAIN_ANGLE = 30;
AlbertAiController.prototype.GAIN_ANGLE_FINE = 30;
AlbertAiController.prototype.GAIN_POSITION_FINE = 30;
AlbertAiController.prototype.STRAIGHT_SPEED = 50;//30;
AlbertAiController.prototype.MAX_BASE_SPEED = 50;//30;
AlbertAiController.prototype.GAIN_BASE_SPEED = 2;//1.5;
AlbertAiController.prototype.GAIN_POSITION = 70;//52.5;
AlbertAiController.prototype.POSITION_TOLERANCE_FINE = 3;
AlbertAiController.prototype.POSITION_TOLERANCE_FINE_LARGE = 5;
AlbertAiController.prototype.POSITION_TOLERANCE_ROUGH = 5;
AlbertAiController.prototype.POSITION_TOLERANCE_ROUGH_LARGE = 10;
AlbertAiController.prototype.ORIENTATION_TOLERANCE_FINAL = 0.087;
AlbertAiController.prototype.ORIENTATION_TOLERANCE_FINAL_LARGE = 0.122;
AlbertAiController.prototype.ORIENTATION_TOLERANCE_FINAL_LARGE_LARGE = 0.262;
AlbertAiController.prototype.ORIENTATION_TOLERANCE_ROUGH = 0.122;
AlbertAiController.prototype.ORIENTATION_TOLERANCE_ROUGH_LARGE = 0.262;
AlbertAiController.prototype.ORIENTATION_TOLERANCE_ROUGH_LARGE_LARGE = 0.524;
AlbertAiController.prototype.MINIMUM_WHEEL_SPEED = 18;
AlbertAiController.prototype.MINIMUM_WHEEL_SPEED_FINE = 15;

AlbertAiController.prototype.clear = function() {
	this.prevDirection = 0;
	this.prevDirectionFinal = 0;
	this.directionCount = 0;
	this.directionCountFinal = 0;
	this.positionCount = 0;
	this.positionCountFinal = 0;
};

AlbertAiController.prototype.setBackward = function(backward) {
	this.isBackward = backward;
};

AlbertAiController.prototype.controlAngleInitial = function(wheels, currentRadian, targetRadian) {
	if(this.isBackward) {
		currentRadian += this.PI;
	}
	var diff = this.validateRadian(targetRadian - currentRadian);
	var mag = Math.abs(diff);
	if (mag < this.ORIENTATION_TOLERANCE_ROUGH) return true;
	
	var direction = diff > 0 ? 1 : -1;
	if(mag < this.ORIENTATION_TOLERANCE_ROUGH_LARGE && direction * this.prevDirection < 0) return true;
	this.prevDirection = direction;
	
	var value = 0;
	if(diff > 0) {
		value = Math.log(1 + mag) * this.GAIN_ANGLE;
		if(value < this.MINIMUM_WHEEL_SPEED) value = this.MINIMUM_WHEEL_SPEED;
	} else {
		value = -Math.log(1 + mag) * this.GAIN_ANGLE;
		if(value > -this.MINIMUM_WHEEL_SPEED) value = -this.MINIMUM_WHEEL_SPEED;
	}
	value = parseInt(value);
	wheels.left = -value;
	wheels.right = value;
	return false;
};

AlbertAiController.prototype.controlAngleFinal = function(wheels, currentRadian, targetRadian) {
	var diff = this.validateRadian(targetRadian - currentRadian);
	var mag = Math.abs(diff);
	if(mag < this.ORIENTATION_TOLERANCE_FINAL) return true;

	var direction = diff > 0 ? 1 : -1;
	if(mag < this.ORIENTATION_TOLERANCE_FINAL_LARGE && direction * this.prevDirectionFinal < 0) return true;
	if(mag < this.ORIENTATION_TOLERANCE_FINAL_LARGE_LARGE && direction * this.prevDirectionFinal < 0) {
		if(++this.directionCountFinal > 3) return true;
	}
	this.prevDirectionFinal = direction;
	
	var value = 0;
	if(diff > 0) {
		value = Math.log(1 + mag) * this.GAIN_ANGLE_FINE;
		if(value < this.MINIMUM_WHEEL_SPEED) value = this.MINIMUM_WHEEL_SPEED;
	} else {
		value = -Math.log(1 + mag) * this.GAIN_ANGLE_FINE;
		if(value > -this.MINIMUM_WHEEL_SPEED) value = -this.MINIMUM_WHEEL_SPEED;
	}
	value = parseInt(value);
	wheels.left = -value;
	wheels.right = value;
	return false;
};

AlbertAiController.prototype.controlPositionFine = function(wheels, currentX, currentY, currentRadian, targetX, targetY) {
	var targetRadian = -Math.atan2(targetY - currentY, targetX - currentX);
	if(this.isBackward) {
		currentRadian += this.PI;
	}
	var diff = this.validateRadian(targetRadian - currentRadian);
	var mag = Math.abs(diff);
	var ex = targetX - currentX;
	var ey = targetY - currentY;
	var dist = Math.sqrt(ex * ex + ey * ey);
	if(dist < this.POSITION_TOLERANCE_FINE) return true;
	if(dist < this.POSITION_TOLERANCE_FINE_LARGE) {
		if (++this.positionCountFinal > 5) {
			this.positionCountFinal = 0;
			return true;
		}
	}
	var value = 0;
	if (diff > 0) value = Math.log(1 + mag) * this.GAIN_POSITION_FINE;
	else value = -Math.log(1 + mag) * this.GAIN_POSITION_FINE;
	if(this.isBackward) {
		value = -value;
	}
	value = parseInt(value);
	wheels.left = this.MINIMUM_WHEEL_SPEED_FINE - value;
	wheels.right = this.MINIMUM_WHEEL_SPEED_FINE + value;
	if(this.isBackward) {
		wheels.left = -wheels.left;
		wheels.right = -wheels.right;
	}
	return false;
};

AlbertAiController.prototype.controlPosition = function(wheels, currentX, currentY, currentRadian, targetX, targetY) {
	var targetRadian = -Math.atan2(targetY - currentY, targetX - currentX);
	if(this.isBackward) {
		currentRadian += this.PI;
	}
	var diff = this.validateRadian(targetRadian - currentRadian);
	var mag = Math.abs(diff);
	var ex = targetX - currentX;
	var ey = targetY - currentY;
	var dist = Math.sqrt(ex * ex + ey * ey);
	if(dist < this.POSITION_TOLERANCE_ROUGH) return true;
	if(dist < this.POSITION_TOLERANCE_ROUGH_LARGE) {
		if(++this.positionCount > 10) {
			this.positionCount = 0;
			return true;
		}
	} else {
		this.positionCount = 0;
	}
	if(mag < 0.01) {
		wheels.left = this.STRAIGHT_SPEED;
		wheels.right = this.STRAIGHT_SPEED;
	} else {
		var base = (this.MINIMUM_WHEEL_SPEED + 0.5 / mag) * this.GAIN_BASE_SPEED;
		if(base > this.MAX_BASE_SPEED) base = this.MAX_BASE_SPEED;
		
		var value = 0;
		if(diff > 0) value = Math.log(1 + mag) * this.GAIN_POSITION;
		else value = -Math.log(1 + mag) * this.GAIN_POSITION;
		if(this.isBackward) {
			value = -value;
		}
		base = parseInt(base);
		value = parseInt(value);
		wheels.left = base - value;
		wheels.right = base + value;
	}
	if(this.isBackward) {
		wheels.left = -wheels.left;
		wheels.right = -wheels.right;
	}
	return false;
};

AlbertAiController.prototype.validateRadian = function(radian) {
	if(radian > this.PI) return radian - this.PI2;
	else if(radian < -this.PI) return radian + this.PI2;
	return radian;
};

AlbertAiController.prototype.toRadian = function(degree) {
	return degree * 3.14159265 / 180.0;
};

function AlbertAiNavigator() {
	this.controller = new AlbertAiController();
	this.mode = 0;
	this.state = 0;
	this.initialized = false;
	this.currentX = -1;
	this.currentY = -1;
	this.currentTheta = -200;
	this.targetX = -1;
	this.targetY = -1;
	this.targetTheta = -200;
	this.wheels = { completed: false, left: 0, right: 0 };
}

AlbertAiNavigator.prototype.clear = function() {
	this.mode = 0;
	this.state = 0;
	this.initialized = false;
	this.currentX = -1;
	this.currentY = -1;
	this.currentTheta = -200;
	this.targetX = -1;
	this.targetY = -1;
	this.targetTheta = -200;
	this.wheels.completed = false;
	this.wheels.left = 0;
	this.wheels.right = 0;
	this.controller.clear();
};

AlbertAiNavigator.prototype.setBackward = function(backward) {
	this.controller.setBackward(backward);
};

AlbertAiNavigator.prototype.moveTo = function(x, y) {
	this.clear();
	this.targetX = x;
	this.targetY = y;
	this.state = 1;
	this.mode = 1;
};

AlbertAiNavigator.prototype.turnTo = function(deg) {
	this.clear();
	this.targetTheta = deg;
	this.state = 1;
	this.mode = 2;
};

AlbertAiNavigator.prototype.handleSensory = function(sensory) {
	if(this.mode == 1) {
		var x = sensory.positionX;
		var y = sensory.positionY;
		if(x >= 0) this.currentX = x;
		if(y >= 0) this.currentY = y;
		this.currentTheta = sensory.orientation;
		switch(this.state) {
			case 1: {
				if(this.initialized == false) {
					if(this.currentX < 0 || this.currentY < 0) {
						this.wheels.left = 20;
						this.wheels.right = -20;
					} else {
						this.initialized = true;
					}
				}
				if(this.initialized) {
					var currentRadian = this.controller.toRadian(this.currentTheta);
					var dx = this.targetX - this.currentX;
					var dy = this.targetY - this.currentY;
					var targetRadian = -Math.atan2(dy, dx);
					if(this.controller.controlAngleInitial(this.wheels, currentRadian, targetRadian)) {
						this.state = 2;
					}
				}
				break;
			}
			case 2: {
				var currentRadian = this.controller.toRadian(this.currentTheta);
				if(this.controller.controlPosition(this.wheels, this.currentX, this.currentY, currentRadian, this.targetX, this.targetY)) {
					this.state = 3;
				}
				break;
			}
			case 3: {
				var currentRadian = this.controller.toRadian(this.currentTheta);
				if(this.controller.controlPositionFine(this.wheels, this.currentX, this.currentY, currentRadian, this.targetX, this.targetY)) {
					this.clear();
					this.wheels.completed = true;
				}
				break;
			}
		}
	} else if(this.mode == 2) {
		this.currentTheta = sensory.orientation;
		switch(this.state) {
			case 1: {
				var currentRadian = this.controller.toRadian(this.currentTheta);
				var targetRadian = this.controller.toRadian(this.targetTheta);
				if(this.controller.controlAngleInitial(this.wheels, currentRadian, targetRadian)) {
					this.state = 2;
				}
				break;
			}
			case 2: {
				var currentRadian = this.controller.toRadian(this.currentTheta);
				var targetRadian = this.controller.toRadian(this.targetTheta);
				if(this.controller.controlAngleFinal(this.wheels, currentRadian, targetRadian)) {
					this.clear();
					this.wheels.completed = true;
				}
				break;
			}
		}
	}
	return this.wheels;
};

function AlbertAiRobot(index) {
    this.sensory = {
        signalStrength: 0,
        leftProximity: 0,
        rightProximity: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationZ: 0,
        positionX: -1,
        positionY: -1,
        orientation: -200,
        light: 0,
        micTouch: 0,
        volumeUpTouch: 0,
        volumeDownTouch: 0,
        playTouch: 0,
        backTouch: 0,
        oidMode: 0,
        oid: -1,
        lift: 0,
        pulseCount: 0,
        batteryState: 2,
        tilt: 0,
    };
    this.motoring = {
        group: 'albertai',
        module: 'albertai',
        index,
    };
    this.pulseId = 0;
    this.soundId = 0;
    this.motionId = 0;
    this.micClickedId = -1;
    this.volumeUpClickedId = -1;
    this.volumeDownClickedId = -1;
    this.playClickedId = -1;
    this.backClickedId = -1;
    this.micLongPressedId = -1;
    this.volumeUpLongPressedId = -1;
    this.volumeDownLongPressedId = -1;
    this.playLongPressedId = -1;
    this.backLongPressedId = -1;
    this.micLongLongPressedId = -1;
    this.volumeUpLongLongPressedId = -1;
    this.volumeDownLongLongPressedId = -1;
    this.playLongLongPressedId = -1;
    this.backLongLongPressedId = -1;
    this.tapId = -1;
    this.wheelStateId = -1;
    this.soundStateId = -1;
    this.blockId = 0;
    this.navigationCallback = undefined;
    this.navigator = undefined;
    this.motionCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.micClicked = false;
    this.volumeUpClicked = false;
    this.volumeDownClicked = false;
    this.playClicked = false;
    this.backClicked = false;
    this.micLongPressed = false;
    this.volumeUpLongPressed = false;
    this.volumeDownLongPressed = false;
    this.playLongPressed = false;
    this.backLongPressed = false;
    this.micLongLongPressed = false;
    this.volumeUpLongLongPressed = false;
    this.volumeDownLongLongPressed = false;
    this.playLongLongPressed = false;
    this.backLongLongPressed = false;
    this.tap = false;
    this.tempo = 60;
    this.timeouts = [];
}

AlbertAiRobot.prototype.__PORT_MAP = {
    group: 'albertai',
    module: 'albertai',
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
    pulse: 0,
    pulseId: 0,
    note: 0,
    sound: 0,
    soundRepeat: 1,
    soundId: 0,
    boardWidth: 0,
    boardHeight: 0,
    motionId: 0,
    motionType: 0,
    motionUnit: 0,
    motionSpeed: 0,
    motionValue: 0,
    motionRadius: 0,
};

AlbertAiRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
    }
    this.pulseId = 0;
    this.soundId = 0;
    this.motionId = 0;
    this.micClickedId = -1;
    this.volumeUpClickedId = -1;
    this.volumeDownClickedId = -1;
    this.playClickedId = -1;
    this.backClickedId = -1;
    this.micLongPressedId = -1;
    this.volumeUpLongPressedId = -1;
    this.volumeDownLongPressedId = -1;
    this.playLongPressedId = -1;
    this.backLongPressedId = -1;
    this.micLongLongPressedId = -1;
    this.volumeUpLongLongPressedId = -1;
    this.volumeDownLongLongPressedId = -1;
    this.playLongLongPressedId = -1;
    this.backLongLongPressedId = -1;
    this.tapId = -1;
    this.wheelStateId = -1;
    this.soundStateId = -1;
    this.blockId = 0;
    this.navigationCallback = undefined;
    this.navigator = undefined;
    this.motionCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.micClicked = false;
    this.volumeUpClicked = false;
    this.volumeDownClicked = false;
    this.playClicked = false;
    this.backClicked = false;
    this.micLongPressed = false;
    this.volumeUpLongPressed = false;
    this.volumeDownLongPressed = false;
    this.playLongPressed = false;
    this.backLongPressed = false;
    this.micLongLongPressed = false;
    this.volumeUpLongLongPressed = false;
    this.volumeDownLongLongPressed = false;
    this.playLongLongPressed = false;
    this.backLongLongPressed = false;
    this.tap = false;
    this.tempo = 60;
    this.__removeAllTimeouts();
};

AlbertAiRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

AlbertAiRobot.prototype.afterSend = function(sq) {
    this.micClicked = false;
    this.volumeUpClicked = false;
    this.volumeDownClicked = false;
    this.playClicked = false;
    this.backClicked = false;
    this.micLongPressed = false;
    this.volumeUpLongPressed = false;
    this.volumeDownLongPressed = false;
    this.playLongPressed = false;
    this.backLongPressed = false;
    this.micLongLongPressed = false;
    this.volumeUpLongLongPressed = false;
    this.volumeDownLongLongPressed = false;
    this.playLongLongPressed = false;
    this.backLongLongPressed = false;
    this.tap = false;
};

AlbertAiRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

AlbertAiRobot.prototype.__setModule = function() {
    this.motoring.group = 'albertai';
    this.motoring.module = 'albertai';
};

AlbertAiRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

AlbertAiRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

AlbertAiRobot.prototype.__setPulse = function(pulse) {
    this.pulseId = (this.pulseId % 255) + 1;
    this.motoring.pulse = pulse;
    this.motoring.pulseId = this.pulseId;
};

AlbertAiRobot.prototype.__getNavigator = function() {
    if(this.navigator == undefined) {
        this.navigator = new AlbertAiNavigator();
    }
    return this.navigator;
};

AlbertAiRobot.prototype.__cancelNavigation = function() {
    this.navigationCallback = undefined;
    if(this.navigator) {
        this.navigator.clear();
    }
};

AlbertAiRobot.prototype.__setMotion = function(type, unit, speed, value, radius) {
    this.motionId = (this.motionId % 255) + 1;
    const motoring = this.motoring;
    motoring.motionType = type;
    motoring.motionUnit = unit;
    motoring.motionSpeed = speed;
    motoring.motionValue = value;
    motoring.motionRadius = radius;
    motoring.motionId = this.motionId;
};

AlbertAiRobot.prototype.__cancelMotion = function() {
    this.motionCallback = undefined;
};

AlbertAiRobot.prototype.__runSound = function(sound, count) {
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

AlbertAiRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

AlbertAiRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

AlbertAiRobot.prototype.__cancelNote = function() {
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

AlbertAiRobot.prototype.handleSensory = function() {
    const self = this;
    const sensory = self.sensory;
    
    self.micClicked = sensory.micClicked == 1;
    self.volumeUpClicked = sensory.volumeUpClicked == 1;
    self.volumeDownClicked = sensory.volumeDownClicked == 1;
    self.playClicked = sensory.playClicked == 1;
    self.backClicked = sensory.backClicked == 1;
    self.micLongPressed = sensory.micLongPressed == 1;
    self.volumeUpLongPressed = sensory.volumeUpLongPressed == 1;
    self.volumeDownLongPressed = sensory.volumeDownLongPressed == 1;
    self.playLongPressed = sensory.playLongPressed == 1;
    self.backLongPressed = sensory.backLongPressed == 1;
    self.micLongLongPressed = sensory.micLongLongPressed == 1;
    self.volumeUpLongLongPressed = sensory.volumeUpLongLongPressed == 1;
    self.volumeDownLongLongPressed = sensory.volumeDownLongLongPressed == 1;
    self.playLongLongPressed = sensory.playLongLongPressed == 1;
    self.backLongLongPressed = sensory.backLongLongPressed == 1;
    self.tap = sensory.tap == 1;

    if (self.motionCallback) {
        if (sensory.wheelStateId != self.wheelStateId) {
            self.wheelStateId = sensory.wheelStateId;
            if (sensory.wheelState == 2) {
                self.motoring.leftWheel = 0;
                self.motoring.rightWheel = 0;
                const callback = self.motionCallback;
                self.__cancelMotion();
                if (callback) {
                    callback();
                }
            }
        }
    }
    if(this.navigationCallback) {
        if(this.navigator) {
            var result = this.navigator.handleSensory(this.sensory);
            this.motoring.leftWheel = result.left;
            this.motoring.rightWheel = result.right;
            if(result.completed) {
                var callback = this.navigationCallback;
                this.__cancelNavigation();
                if(callback) callback();
            }
        }
    }
    if (self.soundCallback) {
        if (sensory.soundStateId != self.soundStateId) {
            self.soundStateId = sensory.soundStateId;
            if (sensory.soundState == 0) {
                const callback = self.soundCallback;
                self.__cancelSound();
                if (callback) {
                    callback();
                }
            }
        }
    }
};

AlbertAiRobot.prototype.__SENSORS = {
    SIGNAL_STRENGTH: 'signalStrength',
    LEFT_PROXIMITY: 'leftProximity',
    RIGHT_PROXIMITY: 'rightProximity',
    ACCELERATION_X: 'accelerationX',
    ACCELERATION_Y: 'accelerationY',
    ACCELERATION_Z: 'accelerationZ',
    POSITION_X: 'positionX',
    POSITION_Y: 'positionY',
    ORIENTATION: 'orientation',
    LIGHT: 'light',
    MIC_TOUCH: 'micTouch',
    VOLUME_UP_TOUCH: 'volumeUpTouch',
    VOLUME_DOWN_TOUCH: 'volumeDownTouch',
    PLAY_TOUCH: 'playTouch',
    BACK_TOUCH: 'backTouch',
    OID_MODE: 'oidMode',
    OID: 'oid',
    LIFT: 'lift',
    PULSE_COUNT: 'pulseCount',
    BATTERY_STATE: 'batteryState',
    TILT: 'tilt',
};

AlbertAiRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');

    const sensor = this.__SENSORS[dev] || dev;
    return this.sensory[sensor];
};

AlbertAiRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    const dev = script.getField('DEVICE');
    let value = 0;
    if(dev.startsWith('TILT')) {
        if(sensory.tilt === undefined) {
            if(sensory.accelerationZ < 8192 && sensory.accelerationX > 8192 && sensory.accelerationY > -4096 && sensory.accelerationY < 4096) value = 1;
            else if(sensory.accelerationZ < 8192 && sensory.accelerationX < -8192 && sensory.accelerationY > -4096 && sensory.accelerationY < 4096) value = -1;
            else if(sensory.accelerationZ < 8192 && sensory.accelerationY > 8192 && sensory.accelerationX > -4096 && sensory.accelerationX < 4096) value = 2;
            else if(sensory.accelerationZ < 8192 && sensory.accelerationY < -8192 && sensory.accelerationX > -4096 && sensory.accelerationX < 4096) value = -2;
            else if(sensory.accelerationZ > 12288 && sensory.accelerationX > -8192 && sensory.accelerationX < 8192 && sensory.accelerationY > -8192 && sensory.accelerationY < 8192) value = 3;
            else if(sensory.accelerationZ < -12288 && sensory.accelerationX > -4096 && sensory.accelerationX < 4096 && sensory.accelerationY > -4096 && sensory.accelerationY < 4096) value = -3;
            else value = 0;
        } else {
            value = sensory.tilt;
        }
        switch(dev) {
            case 'TILT_FORWARD': return value == 1;
            case 'TILT_BACKWARD': return value == -1;
            case 'TILT_LEFT': return value == 2;
            case 'TILT_RIGHT': return value == -2;
            case 'TILT_FLIP': return value == 3;
            case 'TILT_NOT': return value == -3;
        }
        return false;
    } else {
        switch (dev) {
            case 'TAP': return this.tap;
            case 'LIFT': return sensory.lift === 1;
            case 'BATTERY_NORMAL': return sensory.batteryState === 2;
            case 'BATTERY_LOW': return sensory.batteryState === 1;
            case 'BATTERY_EMPTY': return sensory.batteryState === 0;
        }
        return false;
    }
};

AlbertAiRobot.prototype.checkHandFound = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    return sensory.handFound === undefined ? sensory.leftProximity > 40 || sensory.rightProximity > 40 : sensory.handFound;
};

AlbertAiRobot.prototype.checkTouchState = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    const state = script.getField('STATE');
    switch(dev) {
        case 'MIC':
            switch(state) {
                case 'CLICKED': return this.micClicked;
                case 'LONG_PRESSED': return this.micLongPressed;
                case 'LONG_LONG_PRESSED': return this.micLongLongPressed;
            }
            break;
        case 'VOLUME_UP':
            switch(state) {
                case 'CLICKED': return this.volumeUpClicked;
                case 'LONG_PRESSED': return this.volumeUpLongPressed;
                case 'LONG_LONG_PRESSED': return this.volumeUpLongLongPressed;
            }
            break;
        case 'VOLUME_DOWN':
            switch(state) {
                case 'CLICKED': return this.volumeDownClicked;
                case 'LONG_PRESSED': return this.volumeDownLongPressed;
                case 'LONG_LONG_PRESSED': return this.volumeDownLongLongPressed;
            }
            break;
        case 'PLAY':
            switch(state) {
                case 'CLICKED': return this.playClicked;
                case 'LONG_PRESSED': return this.playLongPressed;
                case 'LONG_LONG_PRESSED': return this.playLongLongPressed;
            }
            break;
        case 'BACK':
            switch(state) {
                case 'CLICKED': return this.backClicked;
                case 'LONG_PRESSED': return this.backLongPressed;
                case 'LONG_LONG_PRESSED': return this.backLongLongPressed;
            }
            break;
    }
    return false;
};

AlbertAiRobot.prototype.checkOid = function(script) {
    this.__setModule();
    const value = script.getNumberValue('VALUE');
    return this.sensory.oid == value;
};

AlbertAiRobot.prototype.__motionUnit = function(type, unit, value, callback) {
    const motoring = this.motoring;
    this.__cancelNavigation();
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

AlbertAiRobot.prototype.__UNITS = {
    CM: 1,
    DEG: 1,
    SEC: 2,
    PULSE: 3,
};

AlbertAiRobot.prototype.moveForwardUnit = function(script) {
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

AlbertAiRobot.prototype.moveBackwardUnit = function(script) {
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

AlbertAiRobot.prototype.turnUnit = function(script) {
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

AlbertAiRobot.prototype.pivotUnit = function(script) {
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

AlbertAiRobot.prototype.setWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelNavigation();
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

AlbertAiRobot.prototype.changeWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelNavigation();
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

AlbertAiRobot.prototype.setWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelNavigation();
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

AlbertAiRobot.prototype.changeWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelNavigation();
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

AlbertAiRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelNavigation();
    this.__cancelMotion();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    return script.callReturn();
};

AlbertAiRobot.prototype.moveToOnBoard = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelNavigation();
        this.__cancelMotion();
        const toward = script.getField('TOWARD');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        x = parseInt(x);
        y = parseInt(y);
        const navi = this.__getNavigator();
        if((typeof x == 'number') && (typeof y == 'number') && x >= 0 && y >= 0) {
            const motoring = this.motoring;
            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            navi.setBackward(toward == 'BACKWARD');
            navi.moveTo(x, y);
            this.navigationCallback = () => {
                script.isMoving = false;
            };
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

AlbertAiRobot.prototype.setOrientationToOnBoard = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelNavigation();
        this.__cancelMotion();
        let degree = script.getNumberValue('DEGREE');
        degree = parseInt(degree);
        if(typeof degree == 'number') {
            const navi = this.__getNavigator();
            const motoring = this.motoring;
            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            navi.setBackward(false);
            navi.turnTo(degree);
            this.navigationCallback = () => {
                script.isMoving = false;
            };
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

AlbertAiRobot.prototype.__RGB_COLORS = {
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

AlbertAiRobot.prototype.setEyeColor = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    const color = script.getField('COLOR');

    const rgb = this.__RGB_COLORS[color];
    if (rgb) {
        const motoring = this.motoring;
        if (eye == 'LEFT') {
            motoring.leftRgb = `${rgb[0]},${rgb[1]},${rgb[2]}`;
            motoring.leftRed = rgb[0];
            motoring.leftGreen = rgb[1];
            motoring.leftBlue = rgb[2];
        } else if (eye == 'RIGHT') {
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

AlbertAiRobot.prototype.pickEyeColor = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    const color = script.getField('COLOR');

    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);

    const motoring = this.motoring;
    if (eye == 'LEFT') {
        motoring.leftRgb = `${red},${green},${blue}`;
        motoring.leftRed = red;
        motoring.leftGreen = green;
        motoring.leftBlue = blue;
    } else if (eye == 'RIGHT') {
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

AlbertAiRobot.prototype.setEyeRgb = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    const motoring = this.motoring;
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if (eye == 'LEFT') {
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
    } else if (eye == 'RIGHT') {
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

AlbertAiRobot.prototype.changeEyeRgb = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    const motoring = this.motoring;
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if (eye == 'LEFT') {
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
    } else if (eye == 'RIGHT') {
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

AlbertAiRobot.prototype.clearEye = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');

    const motoring = this.motoring;
    if (eye == 'LEFT') {
        motoring.leftRgb = '0,0,0';
        motoring.leftRed = 0;
        motoring.leftGreen = 0;
        motoring.leftBlue = 0;
    } else if (eye == 'RIGHT') {
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

AlbertAiRobot.prototype.__SOUNDS = {
    BEEP: 1,
    RANDOM_BEEP: 2,
    NOISE: 10,
    SIREN: 3,
    ENGINE: 4,
    ROBOT: 5,
    MARCH: 6,
    BIRTHDAY: 7,
    DIBIDIBIDIP: 8,
    GOOD_JOB: 9,
};

AlbertAiRobot.prototype.playSound = function(script) {
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

AlbertAiRobot.prototype.playSoundUntil = function(script) {
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

AlbertAiRobot.prototype.setBuzzer = function(script) {
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

AlbertAiRobot.prototype.changeBuzzer = function(script) {
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

AlbertAiRobot.prototype.clearSound = function(script, motoring) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

AlbertAiRobot.prototype.__NOTES = {
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
};

AlbertAiRobot.prototype.playNote = function(script) {
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

AlbertAiRobot.prototype.playNoteBeat = function(script) {
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

AlbertAiRobot.prototype.restBeat = function(script) {
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

AlbertAiRobot.prototype.setTempo = function(script) {
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

AlbertAiRobot.prototype.changeTempo = function(script) {
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

Entry.AlbertAi = {
    robot: undefined,
    getRobot() {
        if(Entry.AlbertAi.robot == undefined) Entry.AlbertAi.robot = new AlbertAiRobot(0);
        Entry.AlbertAi.robot.setMotoring(Entry.hw.sendQueue);
        return Entry.AlbertAi.robot;
    },
    setZero() {
        if(Entry.AlbertAi.robot) Entry.AlbertAi.robot.setZero();
        Entry.hw.update();
    },
    afterReceive(pd) {
        const robot = Entry.AlbertAi.getRobot();
        if(robot) robot.afterReceive(pd);
    },
    afterSend(sq) {
        const robot = Entry.AlbertAi.getRobot();
        if(robot) robot.afterSend(sq);
    },
    id: '2.A',
    name: 'albertai',
    url: 'http://albert.school',
    imageName: 'albertai.png',
    title: {
        en: 'Albert AI',
        ko: '알버트 AI',
        jp: 'アルバートAI',
        vn: 'Albert AI',
    },
    monitorTemplate: () => ({
        imgPath: 'hw/albertai.png',
        width: 297,
        height: 512,
        listPorts: {
            accelerationX: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            oidMode: {
                name: Lang.Blocks.ROBOID_sensor_oid_mode,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            oid: {
                name: Lang.Blocks.ROBOID_sensor_oid,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            lift: {
                name: Lang.Blocks.ROBOID_sensor_lift,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            positionX: {
                name: Lang.Blocks.ROBOID_sensor_position_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            positionY: {
                name: Lang.Blocks.ROBOID_sensor_position_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            orientation: {
                name: Lang.Blocks.ROBOID_sensor_orientation,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            signalStrength: {
                name: Lang.Blocks.ROBOID_sensor_signal_strength,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Blocks.ROBOID_monitor_buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: {
                name: Lang.Blocks.ROBOID_monitor_note,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            leftProximity: {
                name: Lang.Blocks.ROBOID_sensor_left_proximity,
                type: 'input',
                pos: { x: 221, y: 459 },
            },
            rightProximity: {
                name: Lang.Blocks.ROBOID_sensor_right_proximity,
                type: 'input',
                pos: { x: 77, y: 459 },
            },
            micTouch: {
                name: Lang.Blocks.ROBOID_sensor_mic_touch,
                type: 'input',
                pos: { x: 148, y: 334 },
            },
            volumeUpTouch: {
                name: Lang.Blocks.ROBOID_sensor_volume_up_touch,
                type: 'input',
                pos: { x: 204, y: 338 },
            },
            volumeDownTouch: {
                name: Lang.Blocks.ROBOID_sensor_volume_down_touch,
                type: 'input',
                pos: { x: 93, y: 338 },
            },
            playTouch: {
                name: Lang.Blocks.ROBOID_sensor_play_touch,
                type: 'input',
                pos: { x: 224, y: 418 },
            },
            backTouch: {
                name: Lang.Blocks.ROBOID_sensor_back_touch,
                type: 'input',
                pos: { x: 73, y: 418 },
            },
            light: {
                name: Lang.Blocks.ROBOID_sensor_light,
                type: 'input',
                pos: { x: 148, y: 463 },
            },
            leftWheel: {
                name: Lang.Blocks.ROBOID_monitor_left_wheel,
                type: 'output',
                pos: { x: 260, y: 500 },
            },
            rightWheel: {
                name: Lang.Blocks.ROBOID_monitor_right_wheel,
                type: 'output',
                pos: { x: 35, y: 500 },
            },
            leftRgb: {
                name: Lang.Blocks.ROBOID_monitor_left_eye,
                type: 'output',
                pos: { x: 214, y: 141 },
            },
            rightRgb: {
                name: Lang.Blocks.ROBOID_monitor_right_eye,
                type: 'output',
                pos: { x: 80, y: 141 },
            },
        },
        mode: 'both',
    }),
};

Entry.AlbertAi.setLanguage = () => ({
    ko: {
        template: {
            albertai_value: '%1',
            albertai_hand_found: '손 찾음?',
            albertai_touch_state: '%1 터치 센서를 %2 ?',
            albertai_is_oid: 'OID가 %1인가?',
            albertai_boolean: '%1?',
            albertai_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
            albertai_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
            albertai_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
            albertai_pivot_around_unit_in_direction: '%1 바퀴 중심으로 %2 %3 %4 방향으로 돌기 %5',
            albertai_change_both_wheels_by: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
            albertai_set_both_wheels_to: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
            albertai_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
            albertai_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
            albertai_stop: '정지하기 %1',
            albertai_move_to_x_y_on_board: '밑판 %1 x: %2 y: %3 위치로 이동하기 %4',
            albertai_set_orientation_on_board: '말판 %1도 방향으로 돌기 %2',
            albertai_set_eye_to: '%1 눈을 %2 으로 정하기 %3',
            albertai_pick_eye: '%1 눈을 %2로 정하기 %3',
            albertai_change_eye_by_rgb: '%1 눈을 R: %2 G: %3 B: %4 만큼 바꾸기 %5',
            albertai_set_eye_to_rgb: '%1 눈을 R: %2 G: %3 B: %4 (으)로 정하기 %5',
            albertai_clear_eye: '%1 눈 끄기 %2',
            albertai_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            albertai_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            albertai_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
            albertai_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
            albertai_clear_sound: '소리 끄기 %1',
            albertai_play_note: '%1 %2 음을 연주하기 %3',
            albertai_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
            albertai_rest_for: '%1 박자 쉬기 %2',
            albertai_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
            albertai_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
        },
        Helper: {
            albertai_value: '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -8192 ~ 8191, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -8192 ~ 8191, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -8192 ~ 8191, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>마이크 터치: 마이크 터치 센서의 값 (터치하면 1, 아니면 0, 초기값: 0)<br/>소리 크게 터치: 소리 크게 터치 센서의 값 (터치하면 1, 아니면 0, 초기값: 0)<br/>소리 작게 터치: 소리 작게 터치 센서의 값 (터치하면 1, 아니면 0, 초기값: 0)<br/>실행 터치: 실행 터치 센서의 값 (터치하면 1, 아니면 0, 초기값: 0)<br/>뒤로 터치: 뒤로 터치 센서의 값 (터치하면 1, 아니면 0, 초기값: 0)<br/>OID 모드: OID 모드의 값 (0: 멀리 떨어짐, 1: 위치 모드, 2: OID 버전 2, 3: OID 버전 3, 15: OID 아님, 초기값: 0)<br/>OID: OID 센서의 값 (값의 범위: -1 ~ 268435455, 초기값: -1)<br/>들어올림: 들어올림 센서의 값 (들어올리면 1, 아니면 0, 초기값: 0)<br/>x 위치: 말판 위에서 로봇의 위치 x좌표 값 (값의 범위: -1 ~ 268435454, 초기값: -1)<br/>y 위치: 말판 위에서 로봇의 위치 y좌표 값 (값의 범위: -1 ~ 268435454, 초기값: -1)<br/>방향: 말판 위에서 로봇의 방향 값 (값의 범위: -179 ~ 180, 초기값: -200)<br/>밝기: 밝기 센서의 값 (값의 범위: 0 ~ 65535, 초기값: 0) 밝을 수록 값이 커집니다.<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.',
            albertai_hand_found: "근접 센서 앞에 손 또는 물체가 있으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            albertai_touch_state: "터치 센서를 클릭했으면/길게 눌렀으면/아주 길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            albertai_is_oid: "OID 센서가 감지한 OID 값이 입력한 숫자와 같으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            albertai_boolean: "앞으로 기울임: 앞으로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집었으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않았으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>두드림: 두드렸으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>들어올림: 들어올렸으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            albertai_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            albertai_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            albertai_turn_unit_in_place: '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            albertai_pivot_around_unit_in_direction: '왼쪽/오른쪽 바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
            albertai_change_both_wheels_by: '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            albertai_set_both_wheels_to: '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            albertai_change_wheel_by: '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            albertai_set_wheel_to: '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            albertai_stop: '양쪽 바퀴를 정지합니다.',
            albertai_move_to_x_y_on_board: '밑판 위에서 입력한 x, y 위치로 이동합니다.',
            albertai_set_orientation_on_board: '말판 위에서 입력한 각도 방향으로 회전합니다.',
            albertai_set_eye_to: '왼쪽/오른쪽/양쪽 눈을 선택한 색깔로 켭니다.',
            albertai_pick_eye: '왼쪽/오른쪽/양쪽 눈을 선택한 색깔로 켭니다.',
            albertai_change_eye_by_rgb: '왼쪽/오른쪽/양쪽 눈의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            albertai_set_eye_to_rgb: '왼쪽/오른쪽/양쪽 눈의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            albertai_clear_eye: '왼쪽/오른쪽/양쪽 눈을 끕니다.',
            albertai_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            albertai_play_sound_times_until_done: '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            albertai_change_buzzer_by: '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            albertai_set_buzzer_to: '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 버저 소리를 끕니다.',
            albertai_clear_sound: '소리를 끕니다.',
            albertai_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
            albertai_play_note_for: '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            albertai_rest_for: '입력한 박자만큼 쉽니다.',
            albertai_change_tempo_by: '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            albertai_set_tempo_to: '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
        },
        Blocks: {
            ROBOID_monitor_left_wheel: '왼쪽 바퀴',
            ROBOID_monitor_right_wheel: '오른쪽 바퀴',
            ROBOID_monitor_left_eye: '왼쪽 눈',
            ROBOID_monitor_right_eye: '오른쪽 눈',
            ROBOID_monitor_buzzer: '버저',
            ROBOID_monitor_note: '음표',
            ROBOID_sensor_signal_strength: '신호 세기',
            ROBOID_sensor_left_proximity: '왼쪽 근접 센서',
            ROBOID_sensor_right_proximity: '오른쪽 근접 센서',
            ROBOID_sensor_acceleration_x: 'x축 가속도',
            ROBOID_sensor_acceleration_y: 'y축 가속도',
            ROBOID_sensor_acceleration_z: 'z축 가속도',
            ROBOID_sensor_position_x: 'x 위치',
            ROBOID_sensor_position_y: 'y 위치',
            ROBOID_sensor_orientation: '방향',
            ROBOID_sensor_light: '밝기',
            ROBOID_sensor_mic_touch: '마이크 터치',
            ROBOID_sensor_volume_up_touch: '소리 크게 터치',
            ROBOID_sensor_volume_down_touch: '소리 작게 터치',
            ROBOID_sensor_play_touch: '실행 터치',
            ROBOID_sensor_back_touch: '뒤로 터치',
            ROBOID_sensor_oid_mode: 'OID 모드',
            ROBOID_sensor_oid: 'OID',
            ROBOID_sensor_lift: '들어올림',
            ROBOID_button_mic: '마이크',
            ROBOID_button_volume_up: '소리 크게',
            ROBOID_button_volume_down: '소리 작게',
            ROBOID_button_play: '실행',
            ROBOID_button_back: '뒤로',
            ROBOID_button_clicked: '클릭했는가',
            ROBOID_button_long_pressed: '오래 눌렀는가(1.5초)',
            ROBOID_button_long_long_pressed: '아주 오래 눌렀는가(3초)',
            ROBOID_tilt_forward: '앞으로 기울임',
            ROBOID_tilt_backward: '뒤로 기울임',
            ROBOID_tilt_left: '왼쪽으로 기울임',
            ROBOID_tilt_right: '오른쪽으로 기울임',
            ROBOID_tilt_flip: '거꾸로 뒤집음',
            ROBOID_tilt_not: '기울이지 않음',
            ROBOID_tap: '두드림',
            ROBOID_lift: '들어올림',
            ROBOID_battery_normal: '배터리 정상',
            ROBOID_battery_low: '배터리 부족',
            ROBOID_battery_empty: '배터리 없음',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: '초',
            ROBOID_unit_pulse: '펄스',
            ROBOID_unit_deg: '도',
            ROBOID_left: '왼쪽',
            ROBOID_right: '오른쪽',
            ROBOID_both: '양쪽',
            ROBOID_forward: '앞쪽',
            ROBOID_backward: '뒤쪽',
            ROBOID_color_red: '빨간색',
            ROBOID_color_orange: '주황색',
            ROBOID_color_yellow: '노란색',
            ROBOID_color_green: '초록색',
            ROBOID_color_sky_blue: '하늘색',
            ROBOID_color_blue: '파란색',
            ROBOID_color_violet: '보라색',
            ROBOID_color_purple: '자주색',
            ROBOID_color_white: '하얀색',
            ROBOID_sound_beep: '삐',
            ROBOID_sound_random_beep: '무작위 삐',
            ROBOID_sound_noise: '지지직',
            ROBOID_sound_siren: '사이렌',
            ROBOID_sound_engine: '엔진',
            ROBOID_sound_robot: '로봇',
            ROBOID_sound_dibidibidip: '디비디비딥',
            ROBOID_sound_good_job: '잘 했어요',
            ROBOID_sound_march: '행진',
            ROBOID_sound_birthday: '생일',
            ROBOID_note_c: '도',
            ROBOID_note_c_sharp: '도♯(레♭)',
            ROBOID_note_d: '레',
            ROBOID_note_d_sharp: '레♯(미♭)',
            ROBOID_note_e: '미',
            ROBOID_note_f: '파',
            ROBOID_note_f_sharp: '파♯(솔♭)',
            ROBOID_note_g: '솔',
            ROBOID_note_g_sharp: '솔♯(라♭)',
            ROBOID_note_a: '라',
            ROBOID_note_a_sharp: '라♯(시♭)',
            ROBOID_note_b: '시',
        },
    },
    en: {
        template: {
            albertai_value: '%1',
            albertai_hand_found: 'hand found?',
            albertai_touch_state: '%1 touch sensor %2 ?',
            albertai_is_oid: 'oid %1?',
            albertai_boolean: '%1?',
            albertai_move_forward_unit: 'move forward %1 %2 %3',
            albertai_move_backward_unit: 'move backward %1 %2 %3',
            albertai_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            albertai_pivot_around_unit_in_direction: 'pivot around %1 wheel %2 %3 in %4 direction %5',
            albertai_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
            albertai_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
            albertai_change_wheel_by: 'change %1 wheel by %2 %3',
            albertai_set_wheel_to: 'set %1 wheel to %2 %3',
            albertai_stop: 'stop %1',
            albertai_move_to_x_y_on_board: 'move %1 to x: %2 y: %3 on board %4',
            albertai_set_orientation_on_board: 'turn towards %1 degrees on board %2',
            albertai_set_eye_to: 'set %1 eye to %2 %3',
            albertai_pick_eye: 'set %1 eye to %2 %3',
            albertai_change_eye_by_rgb: 'change %1 eye by r: %2 g: %3 b: %4 %5',
            albertai_set_eye_to_rgb: 'set %1 eye to r: %2 g: %3 b: %4 %5',
            albertai_clear_eye: 'clear %1 eye %2',
            albertai_play_sound_times: 'play sound %1 %2 times %3',
            albertai_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            albertai_change_buzzer_by: 'change buzzer by %1 %2',
            albertai_set_buzzer_to: 'set buzzer to %1 %2',
            albertai_clear_sound: 'clear sound %1',
            albertai_play_note: 'play note %1 %2 %3',
            albertai_play_note_for: 'play note %1 %2 for %3 beats %4',
            albertai_rest_for: 'rest for %1 beats %2',
            albertai_change_tempo_by: 'change tempo by %1 %2',
            albertai_set_tempo_to: 'set tempo to %1 bpm %2',
        },
        Helper: {
            albertai_value: "left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>mic touch: value of mic touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>volume up touch: value of volume up touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>volume down touch: value of volume down touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>play touch: value of play touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>back touch: value of back touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>oid mode: oid mode value (0: far, 1: position mode, 2: oid version 2, 3: oid version 3, 15: not oid, initial value: 0)<br/>oid: value of oid sensor (range: -1 ~ 268435455, initial value: -1)<br/>lift: value of lift sensor (when lifted 1, otherwise 0, initial value: 0)<br/>x position: x-coordinate value of robot's position on the board (range: -1 ~ 268435454, initial value: -1)<br/>y position: y-coordinate value of robot's position on the board (range: -1 ~ 268435454, initial value: -1)<br/>orientation: orientation angle value (degree) of robot on the board (range: -179 ~ 180, initial value: -200)<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.",
            albertai_hand_found: 'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            albertai_touch_state: 'If the touch sensor clicked/long-pressed/long-long-pressed, true, otherwise false.',
            albertai_is_oid: 'If the oid value detected by the oid sensor is equal to the entered number, true, otherwise false.',
            albertai_boolean: "tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>tap: If tapped, true, otherwise false<br/>lift: If lifted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false",
            albertai_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            albertai_move_backward_unit: 'Moves backward for the number of cm/seconds/pulses entered.',
            albertai_turn_unit_in_place: 'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            albertai_pivot_around_unit_in_direction: 'Pivots around the left/right wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            albertai_change_both_wheels_by: 'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            albertai_set_both_wheels_to: 'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            albertai_change_wheel_by: 'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            albertai_set_wheel_to: 'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            albertai_stop: 'Stops both wheels.',
            albertai_move_to_x_y_on_board: 'Moves to the entered x, y position on the board.',
            albertai_set_orientation_on_board: 'Turns toward the entered angle (degrees) on the board.',
            albertai_set_eye_to: 'Turns left/right/both eyes to the selected color.',
            albertai_pick_eye: 'Turns left/right/both eyes to the selected color.',
            albertai_change_eye_by_rgb: 'Adds the entered values to the current R, G, B values of left/right/both eyes, respectively.',
            albertai_set_eye_to_rgb: 'Sets the R, G, B values of left/right/both eyes to the entered values.',
            albertai_clear_eye: 'Turns off the left/right/both eyes.',
            albertai_play_sound_times: 'Plays the selected sound as many times as entered.',
            albertai_play_sound_times_until_done: 'Plays the selected sound as many times as entered, and waits for completion.',
            albertai_change_buzzer_by: 'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            albertai_set_buzzer_to: 'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            albertai_clear_sound: 'Turns off sound.',
            albertai_play_note: 'It sounds the selected tone and octave.',
            albertai_play_note_for: 'It sounds the selected tone and octave as much as the beat you entered.',
            albertai_rest_for: 'Rests as much as the beat you entered.',
            albertai_change_tempo_by: 'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            albertai_set_tempo_to: 'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_left_wheel: 'left wheel',
            ROBOID_monitor_right_wheel: 'right wheel',
            ROBOID_monitor_left_eye: 'left eye',
            ROBOID_monitor_right_eye: 'right eye',
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_sensor_left_proximity: 'left proximity',
            ROBOID_sensor_right_proximity: 'right proximity',
            ROBOID_sensor_acceleration_x: 'x acceleration',
            ROBOID_sensor_acceleration_y: 'y acceleration',
            ROBOID_sensor_acceleration_z: 'z acceleration',
            ROBOID_sensor_position_x: 'x position',
            ROBOID_sensor_position_y: 'y position',
            ROBOID_sensor_orientation: 'orientation',
            ROBOID_sensor_light: 'light',
            ROBOID_sensor_mic_touch: 'mic touch',
            ROBOID_sensor_volume_up_touch: 'volume up touch',
            ROBOID_sensor_volume_down_touch: 'volume down touch',
            ROBOID_sensor_play_touch: 'play touch',
            ROBOID_sensor_back_touch: 'back touch',
            ROBOID_sensor_oid_mode: 'oid mode',
            ROBOID_sensor_oid: 'oid',
            ROBOID_sensor_lift: 'lift',
            ROBOID_button_mic: 'mic',
            ROBOID_button_volume_up: 'volume up',
            ROBOID_button_volume_down: 'volume down',
            ROBOID_button_play: 'play',
            ROBOID_button_back: 'back',
            ROBOID_button_clicked: 'clicked',
            ROBOID_button_long_pressed: 'long-pressed (1.5 secs)',
            ROBOID_button_long_long_pressed: 'long-long-pressed (3 secs)',
            ROBOID_tilt_forward: 'tilt forward',
            ROBOID_tilt_backward: 'tilt backward',
            ROBOID_tilt_left: 'tilt left',
            ROBOID_tilt_right: 'tilt right',
            ROBOID_tilt_flip: 'tilt flip',
            ROBOID_tilt_not: 'not tilt',
            ROBOID_tap: 'tap',
            ROBOID_lift: 'lift',
            ROBOID_battery_normal: 'battery normal',
            ROBOID_battery_low: 'battery low',
            ROBOID_battery_empty: 'battery empty',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: 'seconds',
            ROBOID_unit_pulse: 'pulses',
            ROBOID_unit_deg: 'degrees',
            ROBOID_left: 'left',
            ROBOID_right: 'right',
            ROBOID_both: 'both',
            ROBOID_forward: 'forward',
            ROBOID_backward: 'backward',
            ROBOID_color_red: 'red',
            ROBOID_color_orange: 'orange',
            ROBOID_color_yellow: 'yellow',
            ROBOID_color_green: 'green',
            ROBOID_color_sky_blue: 'sky blue',
            ROBOID_color_blue: 'blue',
            ROBOID_color_violet: 'violet',
            ROBOID_color_purple: 'purple',
            ROBOID_color_white: 'white',
            ROBOID_sound_beep: 'beep',
            ROBOID_sound_random_beep: 'random beep',
            ROBOID_sound_noise: 'noise',
            ROBOID_sound_siren: 'siren',
            ROBOID_sound_engine: 'engine',
            ROBOID_sound_robot: 'robot',
            ROBOID_sound_dibidibidip: 'dibidibidip',
            ROBOID_sound_good_job: 'good job',
            ROBOID_sound_march: 'march',
            ROBOID_sound_birthday: 'birthday',
            ROBOID_note_c: 'C',
            ROBOID_note_c_sharp: 'C♯(D♭)',
            ROBOID_note_d: 'D',
            ROBOID_note_d_sharp: 'D♯(E♭)',
            ROBOID_note_e: 'E',
            ROBOID_note_f: 'F',
            ROBOID_note_f_sharp: 'F♯(G♭)',
            ROBOID_note_g: 'G',
            ROBOID_note_g_sharp: 'G♯(A♭)',
            ROBOID_note_a: 'A',
            ROBOID_note_a_sharp: 'A♯(B♭)',
            ROBOID_note_b: 'B',
        },
    },
    jp: {
        template: {
            albertai_value: '%1',
            albertai_hand_found: '手を見つけたか?',
            albertai_touch_state: '%1 タッチセンサーを %2 ?',
            albertai_is_oid: 'OIDが %1ですか?',
            albertai_boolean: '%1?',
            albertai_move_forward_unit: '前へ%1%2移動する %3',
            albertai_move_backward_unit: '後ろへ%1%2移動する %3',
            albertai_turn_unit_in_place: '%1へ%2%3その場で回す %4',
            albertai_pivot_around_unit_in_direction: '%1車輪を中心に%2%3%4方向に回す %5',
            albertai_change_both_wheels_by: '左車輪を%1右車輪を%2ずつ変える %3',
            albertai_set_both_wheels_to: '左車輪を%1右車輪を%2にする %3',
            albertai_change_wheel_by: '%1車輪を%2ずつ変える %3',
            albertai_set_wheel_to: '%1車輪を%2にする %3',
            albertai_stop: '停止する %1',
            albertai_move_to_x_y_on_board: 'ボード板上で %1 x: %2 y: %3 位置に移動する %4',
            albertai_set_orientation_on_board: 'ボード板上で %1 度に向ける %2',
            albertai_set_eye_to: '%1眼を%2にする %3',
            albertai_pick_eye: '%1眼を%2にする %3',
            albertai_change_eye_by_rgb: '%1眼をR:%2G:%3B:%4ずつ変える %5',
            albertai_set_eye_to_rgb: '%1眼をR:%2G:%3B:%4にする %5',
            albertai_clear_eye: '%1眼を消す %2',
            albertai_play_sound_times: '%1音を%2回鳴らす %3',
            albertai_play_sound_times_until_done: '終わるまで%1音を%2回鳴らす %3',
            albertai_change_buzzer_by: 'ブザー音を%1ずつ変える %2',
            albertai_set_buzzer_to: 'ブザー音を%1にする %2',
            albertai_clear_sound: '音を消す %1',
            albertai_play_note: '%1%2音を鳴らす %3',
            albertai_play_note_for: '%1%2音を%3拍鳴らす %4',
            albertai_rest_for: '%1拍休む %2',
            albertai_change_tempo_by: 'テンポを%1ずつ変える %2',
            albertai_set_tempo_to: 'テンポを%1BPMにする %2',
        },
        Helper: {
            albertai_value: "left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>mic touch: value of mic touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>volume up touch: value of volume up touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>volume down touch: value of volume down touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>play touch: value of play touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>back touch: value of back touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>oid mode: oid mode value (0: far, 1: position mode, 2: oid version 2, 3: oid version 3, 15: not oid, initial value: 0)<br/>oid: value of oid sensor (range: -1 ~ 268435455, initial value: -1)<br/>lift: value of lift sensor (when lifted 1, otherwise 0, initial value: 0)<br/>x position: x-coordinate value of robot's position on the board (range: -1 ~ 268435454, initial value: -1)<br/>y position: y-coordinate value of robot's position on the board (range: -1 ~ 268435454, initial value: -1)<br/>orientation: orientation angle value (degree) of robot on the board (range: -179 ~ 180, initial value: -200)<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.",
            albertai_hand_found: 'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            albertai_touch_state: 'If the touch sensor clicked/long-pressed/long-long-pressed, true, otherwise false.',
            albertai_is_oid: 'If the oid value detected by the oid sensor is equal to the entered number, true, otherwise false.',
            albertai_boolean: "tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>tap: If tapped, true, otherwise false<br/>lift: If lifted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false",
            albertai_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            albertai_move_backward_unit: 'Moves backward for the number of cm/seconds/pulses entered.',
            albertai_turn_unit_in_place: 'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            albertai_pivot_around_unit_in_direction: 'Pivots around the left/right wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            albertai_change_both_wheels_by: 'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            albertai_set_both_wheels_to: 'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            albertai_change_wheel_by: 'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            albertai_set_wheel_to: 'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            albertai_stop: 'Stops both wheels.',
            albertai_move_to_x_y_on_board: 'Moves to the entered x, y position on the board.',
            albertai_set_orientation_on_board: 'Rotates toward the entered angle (degrees) on the board.',
            albertai_set_eye_to: 'Turns left/right/both eyes to the selected color.',
            albertai_pick_eye: 'Turns left/right/both eyes to the selected color.',
            albertai_change_eye_by_rgb: 'Adds the entered values to the current R, G, B values of left/right/both eyes, respectively.',
            albertai_set_eye_to_rgb: 'Sets the R, G, B values of left/right/both eyes to the entered values.',
            albertai_clear_eye: 'Turns off the left/right/both eyes.',
            albertai_play_sound_times: 'Plays the selected sound as many times as entered.',
            albertai_play_sound_times_until_done: 'Plays the selected sound as many times as entered, and waits for completion.',
            albertai_change_buzzer_by: 'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            albertai_set_buzzer_to: 'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            albertai_clear_sound: 'Turns off sound.',
            albertai_play_note: 'It sounds the selected tone and octave.',
            albertai_play_note_for: 'It sounds the selected tone and octave as much as the beat you entered.',
            albertai_rest_for: 'Rests as much as the beat you entered.',
            albertai_change_tempo_by: 'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            albertai_set_tempo_to: 'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_left_wheel: '左車輪',
            ROBOID_monitor_right_wheel: '右車輪',
            ROBOID_monitor_left_eye: '左眼',
            ROBOID_monitor_right_eye: '右眼',
            ROBOID_monitor_buzzer: 'ブザー',
            ROBOID_monitor_note: '音符',
            ROBOID_sensor_signal_strength: '信号強度',
            ROBOID_sensor_left_proximity: '左近接センサー',
            ROBOID_sensor_right_proximity: '右近接センサー',
            ROBOID_sensor_acceleration_x: 'x軸加速度',
            ROBOID_sensor_acceleration_y: 'y軸加速度',
            ROBOID_sensor_acceleration_z: 'z軸加速度',
            ROBOID_sensor_position_x: 'x位置',
            ROBOID_sensor_position_y: 'y位置',
            ROBOID_sensor_orientation: '方向',
            ROBOID_sensor_light: '照度',
            ROBOID_sensor_mic_touch: 'マイクタッチ',
            ROBOID_sensor_volume_up_touch: '音量大タッチ',
            ROBOID_sensor_volume_down_touch: '音量小タッチ',
            ROBOID_sensor_play_touch: '実行タッチ',
            ROBOID_sensor_back_touch: 'もどるタッチ',
            ROBOID_sensor_oid_mode: 'OIDモード',
            ROBOID_sensor_oid: 'OID',
            ROBOID_sensor_lift: '持ち上ぐ',
            ROBOID_button_mic: 'マイク',
            ROBOID_button_volume_up: '音量大',
            ROBOID_button_volume_down: '音量小',
            ROBOID_button_play: '実行',
            ROBOID_button_back: 'もどる',
            ROBOID_button_clicked: 'クリックしたか',
            ROBOID_button_long_pressed: '長く押したか(1.5秒)',
            ROBOID_button_long_long_pressed: '非常に長く押したか(3秒)',
            ROBOID_tilt_forward: '前に傾けたか',
            ROBOID_tilt_backward: '後に傾けたか',
            ROBOID_tilt_left: '左に傾けたか',
            ROBOID_tilt_right: '右に傾けたか',
            ROBOID_tilt_flip: '上下裏返したか',
            ROBOID_tilt_not: '傾けなかったか',
            ROBOID_tap: '叩いたか',
            ROBOID_lift: '持ち上げるか',
            ROBOID_battery_normal: '電池が正常か',
            ROBOID_battery_low: '電池が足りないか',
            ROBOID_battery_empty: '電池がないか',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: '秒',
            ROBOID_unit_pulse: 'パルス',
            ROBOID_unit_deg: '度',
            ROBOID_left: '左',
            ROBOID_right: '右',
            ROBOID_both: '両',
            ROBOID_forward: '前',
            ROBOID_backward: '後',
            ROBOID_color_red: '赤色',
            ROBOID_color_orange: '橙色',
            ROBOID_color_yellow: '黄色',
            ROBOID_color_green: '緑色',
            ROBOID_color_sky_blue: '水色',
            ROBOID_color_blue: '青色',
            ROBOID_color_violet: '青紫色',
            ROBOID_color_purple: '紫色',
            ROBOID_color_white: '白色',
            ROBOID_sound_beep: 'ビープ',
            ROBOID_sound_random_beep: 'ランダムビープ',
            ROBOID_sound_noise: 'ノイズ',
            ROBOID_sound_siren: 'サイレン',
            ROBOID_sound_engine: 'エンジン',
            ROBOID_sound_robot: 'ロボット',
            ROBOID_sound_dibidibidip: 'ディバディバディップ',
            ROBOID_sound_good_job: 'よくやった',
            ROBOID_sound_march: '行進',
            ROBOID_sound_birthday: '誕生',
            ROBOID_note_c: 'ド',
            ROBOID_note_c_sharp: 'ド♯(レ♭)',
            ROBOID_note_d: 'レ',
            ROBOID_note_d_sharp: 'レ♯(ミ♭)',
            ROBOID_note_e: 'ミ',
            ROBOID_note_f: 'ファ',
            ROBOID_note_f_sharp: 'ファ♯(ソ♭)',
            ROBOID_note_g: 'ソ',
            ROBOID_note_g_sharp: 'ソ♯(ラ♭)',
            ROBOID_note_a: 'ラ',
            ROBOID_note_a_sharp: 'ラ♯(シ♭)',
            ROBOID_note_b: 'シ',
        },
    },
    vn: {
        template: {
            albertai_value: '%1',
            albertai_hand_found: 'hand found?',
            albertai_touch_state: '%1 touch sensor %2 ?',
            albertai_is_oid: 'oid %1?',
            albertai_boolean: '%1?',
            albertai_move_forward_unit: 'move forward %1 %2 %3',
            albertai_move_backward_unit: 'move backward %1 %2 %3',
            albertai_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            albertai_pivot_around_unit_in_direction: 'pivot around %1 wheel %2 %3 in %4 direction %5',
            albertai_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
            albertai_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
            albertai_change_wheel_by: 'change %1 wheel by %2 %3',
            albertai_set_wheel_to: 'set %1 wheel to %2 %3',
            albertai_stop: 'stop %1',
            albertai_set_eye_to: 'set %1 eye to %2 %3',
            albertai_pick_eye: 'set %1 eye to %2 %3',
            albertai_change_eye_by_rgb: 'change %1 eye by r: %2 g: %3 b: %4 %5',
            albertai_set_eye_to_rgb: 'set %1 eye to r: %2 g: %3 b: %4 %5',
            albertai_clear_eye: 'clear %1 eye %2',
            albertai_play_sound_times: 'play sound %1 %2 times %3',
            albertai_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            albertai_change_buzzer_by: 'change buzzer by %1 %2',
            albertai_set_buzzer_to: 'set buzzer to %1 %2',
            albertai_clear_sound: 'clear sound %1',
            albertai_play_note: 'play note %1 %2 %3',
            albertai_play_note_for: 'play note %1 %2 for %3 beats %4',
            albertai_rest_for: 'rest for %1 beats %2',
            albertai_change_tempo_by: 'change tempo by %1 %2',
            albertai_set_tempo_to: 'set tempo to %1 bpm %2',
        },
        Helper: {
            albertai_value: "left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -8192 to 8191, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>mic touch: value of mic touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>volume up touch: value of volume up touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>volume down touch: value of volume down touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>play touch: value of play touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>back touch: value of back touch sensor (when touched 1, otherwise 0, initial value: 0)<br/>oid mode: oid mode value (0: far, 1: position mode, 2: oid version 2, 3: oid version 3, 15: not oid, initial value: 0)<br/>oid: value of oid sensor (range: -1 ~ 268435455, initial value: -1)<br/>lift: value of lift sensor (when lifted 1, otherwise 0, initial value: 0)<br/>x position: x-coordinate value of robot's position on the board (range: -1 ~ 268435454, initial value: -1)<br/>y position: y-coordinate value of robot's position on the board (range: -1 ~ 268435454, initial value: -1)<br/>orientation: orientation angle value (degree) of robot on the board (range: -179 ~ 180, initial value: -200)<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.",
            albertai_hand_found: 'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            albertai_touch_state: 'If the touch sensor clicked/long-pressed/long-long-pressed, true, otherwise false.',
            albertai_is_oid: 'If the oid value detected by the oid sensor is equal to the entered number, true, otherwise false.',
            albertai_boolean: "tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>tap: If tapped, true, otherwise false<br/>lift: If lifted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false",
            albertai_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            albertai_move_backward_unit: 'Moves backward for the number of cm/seconds/pulses entered.',
            albertai_turn_unit_in_place: 'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            albertai_pivot_around_unit_in_direction: 'Pivots around the left/right wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            albertai_change_both_wheels_by: 'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            albertai_set_both_wheels_to: 'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            albertai_change_wheel_by: 'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            albertai_set_wheel_to: 'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            albertai_stop: 'Stops both wheels.',
            albertai_move_to_x_y_on_board: 'Moves to the entered x, y position on the board.',
            albertai_set_orientation_on_board: 'Rotates toward the entered angle (degrees) on the board.',
            albertai_set_eye_to: 'Turns left/right/both eyes to the selected color.',
            albertai_pick_eye: 'Turns left/right/both eyes to the selected color.',
            albertai_change_eye_by_rgb: 'Adds the entered values to the current R, G, B values of left/right/both eyes, respectively.',
            albertai_set_eye_to_rgb: 'Sets the R, G, B values of left/right/both eyes to the entered values.',
            albertai_clear_eye: 'Turns off the left/right/both eyes.',
            albertai_play_sound_times: 'Plays the selected sound as many times as entered.',
            albertai_play_sound_times_until_done: 'Plays the selected sound as many times as entered, and waits for completion.',
            albertai_change_buzzer_by: 'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            albertai_set_buzzer_to: 'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            albertai_clear_sound: 'Turns off sound.',
            albertai_play_note: 'It sounds the selected tone and octave.',
            albertai_play_note_for: 'It sounds the selected tone and octave as much as the beat you entered.',
            albertai_rest_for: 'Rests as much as the beat you entered.',
            albertai_change_tempo_by: 'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            albertai_set_tempo_to: 'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_left_wheel: 'left wheel',
            ROBOID_monitor_right_wheel: 'right wheel',
            ROBOID_monitor_left_eye: 'left eye',
            ROBOID_monitor_right_eye: 'right eye',
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_sensor_left_proximity: 'left proximity',
            ROBOID_sensor_right_proximity: 'right proximity',
            ROBOID_sensor_acceleration_x: 'x acceleration',
            ROBOID_sensor_acceleration_y: 'y acceleration',
            ROBOID_sensor_acceleration_z: 'z acceleration',
            ROBOID_sensor_position_x: 'x position',
            ROBOID_sensor_position_y: 'y position',
            ROBOID_sensor_orientation: 'orientation',
            ROBOID_sensor_light: 'light',
            ROBOID_sensor_mic_touch: 'mic touch',
            ROBOID_sensor_volume_up_touch: 'volume up touch',
            ROBOID_sensor_volume_down_touch: 'volume down touch',
            ROBOID_sensor_play_touch: 'play touch',
            ROBOID_sensor_back_touch: 'back touch',
            ROBOID_sensor_oid_mode: 'oid mode',
            ROBOID_sensor_oid: 'oid',
            ROBOID_sensor_lift: 'lift',
            ROBOID_button_mic: 'mic',
            ROBOID_button_volume_up: 'volume up',
            ROBOID_button_volume_down: 'volume down',
            ROBOID_button_play: 'play',
            ROBOID_button_back: 'back',
            ROBOID_button_clicked: 'clicked',
            ROBOID_button_long_pressed: 'long-pressed (1.5 secs)',
            ROBOID_button_long_long_pressed: 'long-long-pressed (3 secs)',
            ROBOID_tilt_forward: 'tilt forward',
            ROBOID_tilt_backward: 'tilt backward',
            ROBOID_tilt_left: 'tilt left',
            ROBOID_tilt_right: 'tilt right',
            ROBOID_tilt_flip: 'tilt flip',
            ROBOID_tilt_not: 'not tilt',
            ROBOID_tap: 'tap',
            ROBOID_lift: 'lift',
            ROBOID_battery_normal: 'battery normal',
            ROBOID_battery_low: 'battery low',
            ROBOID_battery_empty: 'battery empty',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: 'seconds',
            ROBOID_unit_pulse: 'pulses',
            ROBOID_unit_deg: 'degrees',
            ROBOID_left: 'left',
            ROBOID_right: 'right',
            ROBOID_both: 'both',
            ROBOID_forward: 'forward',
            ROBOID_backward: 'backward',
            ROBOID_color_red: 'red',
            ROBOID_color_orange: 'orange',
            ROBOID_color_yellow: 'yellow',
            ROBOID_color_green: 'green',
            ROBOID_color_sky_blue: 'sky blue',
            ROBOID_color_blue: 'blue',
            ROBOID_color_violet: 'violet',
            ROBOID_color_purple: 'purple',
            ROBOID_color_white: 'white',
            ROBOID_sound_beep: 'beep',
            ROBOID_sound_random_beep: 'random beep',
            ROBOID_sound_noise: 'noise',
            ROBOID_sound_siren: 'siren',
            ROBOID_sound_engine: 'engine',
            ROBOID_sound_robot: 'robot',
            ROBOID_sound_dibidibidip: 'dibidibidip',
            ROBOID_sound_good_job: 'good job',
            ROBOID_sound_march: 'march',
            ROBOID_sound_birthday: 'birthday',
            ROBOID_note_c: 'C',
            ROBOID_note_c_sharp: 'C♯(D♭)',
            ROBOID_note_d: 'D',
            ROBOID_note_d_sharp: 'D♯(E♭)',
            ROBOID_note_e: 'E',
            ROBOID_note_f: 'F',
            ROBOID_note_f_sharp: 'F♯(G♭)',
            ROBOID_note_g: 'G',
            ROBOID_note_g_sharp: 'G♯(A♭)',
            ROBOID_note_a: 'A',
            ROBOID_note_a_sharp: 'A♯(B♭)',
            ROBOID_note_b: 'B',
        },
    },
});

Entry.AlbertAi.blockMenuBlocks = [
    'albertai_value',
    'albertai_hand_found',
    'albertai_touch_state',
    'albertai_is_oid',
    'albertai_boolean',
    'albertai_move_forward_unit',
    'albertai_move_backward_unit',
    'albertai_turn_unit_in_place',
    'albertai_pivot_around_unit_in_direction',
    'albertai_change_both_wheels_by',
    'albertai_set_both_wheels_to',
    'albertai_change_wheel_by',
    'albertai_set_wheel_to',
    'albertai_stop',
    'albertai_move_to_x_y_on_board',
    'albertai_set_orientation_on_board',
    'albertai_set_eye_to',
    'albertai_pick_eye',
    'albertai_change_eye_by_rgb',
    'albertai_set_eye_to_rgb',
    'albertai_clear_eye',
    'albertai_play_sound_times',
    'albertai_play_sound_times_until_done',
    'albertai_change_buzzer_by',
    'albertai_set_buzzer_to',
    'albertai_clear_sound',
    'albertai_play_note',
    'albertai_play_note_for',
    'albertai_rest_for',
    'albertai_change_tempo_by',
    'albertai_set_tempo_to',
];

Entry.AlbertAi.getBlocks = function() {
    return {
        albertai_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sensor_left_proximity, 'LEFT_PROXIMITY'],
                        [Lang.Blocks.ROBOID_sensor_right_proximity, 'RIGHT_PROXIMITY'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                        [Lang.Blocks.ROBOID_sensor_mic_touch, 'MIC_TOUCH'],
                        [Lang.Blocks.ROBOID_sensor_volume_up_touch, 'VOLUME_UP_TOUCH'],
                        [Lang.Blocks.ROBOID_sensor_volume_down_touch, 'VOLUME_DOWN_TOUCH'],
                        [Lang.Blocks.ROBOID_sensor_play_touch, 'PLAY_TOUCH'],
                        [Lang.Blocks.ROBOID_sensor_back_touch, 'BACK_TOUCH'],
                        [Lang.Blocks.ROBOID_sensor_oid_mode, 'OID_MODE'],
                        [Lang.Blocks.ROBOID_sensor_oid, 'OID'],
                        [Lang.Blocks.ROBOID_sensor_lift, 'LIFT'],
                        [Lang.Blocks.ROBOID_sensor_position_x, 'POSITION_X'],
                        [Lang.Blocks.ROBOID_sensor_position_y, 'POSITION_Y'],
                        [Lang.Blocks.ROBOID_sensor_orientation, 'ORIENTATION'],
                        [Lang.Blocks.ROBOID_sensor_light, 'LIGHT'],
                        [Lang.Blocks.ROBOID_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                    ],
                    value: 'LEFT_PROXIMITY',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albertai_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'albertai_sensor',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sensor_left_proximity, 'LEFT_PROXIMITY'],
                                    [Lang.Blocks.ROBOID_sensor_right_proximity, 'RIGHT_PROXIMITY'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                                    [Lang.Blocks.ROBOID_sensor_mic_touch, 'MIC_TOUCH'],
                                    [Lang.Blocks.ROBOID_sensor_volume_up_touch, 'VOLUME_UP_TOUCH'],
                                    [Lang.Blocks.ROBOID_sensor_volume_down_touch, 'VOLUME_DOWN_TOUCH'],
                                    [Lang.Blocks.ROBOID_sensor_play_touch, 'PLAY_TOUCH'],
                                    [Lang.Blocks.ROBOID_sensor_back_touch, 'BACK_TOUCH'],
                                    [Lang.Blocks.ROBOID_sensor_oid_mode, 'OID_MODE'],
                                    [Lang.Blocks.ROBOID_sensor_oid, 'OID'],
                                    [Lang.Blocks.ROBOID_sensor_lift, 'LIFT'],
                                    [Lang.Blocks.ROBOID_sensor_position_x, 'POSITION_X'],
                                    [Lang.Blocks.ROBOID_sensor_position_y, 'POSITION_Y'],
                                    [Lang.Blocks.ROBOID_sensor_orientation, 'ORIENTATION'],
                                    [Lang.Blocks.ROBOID_sensor_light, 'LIGHT'],
                                    [Lang.Blocks.ROBOID_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                                ],
                                value: 'LEFT_PROXIMITY',
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
        albertai_hand_found: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'albertai_hand_found',
            },
            class: 'albertai_sensor',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.checkHandFound(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.hand_found()',
                        blockType: 'param',
                    },
                ],
            },
        },
        albertai_touch_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_button_mic, 'MIC'],
                        [Lang.Blocks.ROBOID_button_volume_up, 'VOLUME_UP'],
                        [Lang.Blocks.ROBOID_button_volume_down, 'VOLUME_DOWN'],
                        [Lang.Blocks.ROBOID_button_play, 'PLAY'],
                        [Lang.Blocks.ROBOID_button_back, 'BACK'],
                    ],
                    value: 'MIC',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_button_clicked, 'CLICKED'],
                        [Lang.Blocks.ROBOID_button_long_pressed, 'LONG_PRESSED'],
                        [Lang.Blocks.ROBOID_button_long_long_pressed, 'LONG_LONG_PRESSED'],
                    ],
                    value: 'CLICKED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'albertai_touch_state',
            },
            paramsKeyMap: {
                DEVICE: 0,
                STATE: 1,
            },
            class: 'albertai_sensor',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.checkTouchState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.is_touch(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_button_mic, 'MIC'],
                                    [Lang.Blocks.ROBOID_button_volume_up, 'VOLUME_UP'],
                                    [Lang.Blocks.ROBOID_button_volume_down, 'VOLUME_DOWN'],
                                    [Lang.Blocks.ROBOID_button_play, 'PLAY'],
                                    [Lang.Blocks.ROBOID_button_back, 'BACK'],
                                ],
                                value: 'MIC',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_button_clicked, 'CLICKED'],
                                    [Lang.Blocks.ROBOID_button_long_pressed, 'LONG_PRESSED'],
                                    [Lang.Blocks.ROBOID_button_long_long_pressed, 'LONG_LONG_PRESSED'],
                                ],
                                value: 'CLICKED',
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
        albertai_is_oid: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                ],
                type: 'albertai_is_oid',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albertai_sensor',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.checkOid(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.is_oid(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        blockType: 'param',
                    },
                ],
            },
        },
        albertai_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_tilt_forward, 'TILT_FORWARD'],
                        [Lang.Blocks.ROBOID_tilt_backward, 'TILT_BACKWARD'],
                        [Lang.Blocks.ROBOID_tilt_left, 'TILT_LEFT'],
                        [Lang.Blocks.ROBOID_tilt_right, 'TILT_RIGHT'],
                        [Lang.Blocks.ROBOID_tilt_flip, 'TILT_FLIP'],
                        [Lang.Blocks.ROBOID_tilt_not, 'TILT_NOT'],
                        [Lang.Blocks.ROBOID_tap, 'TAP'],
                        [Lang.Blocks.ROBOID_lift, 'LIFT'],
                        [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
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
                type: 'albertai_boolean',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'albertai_sensor',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.boolean_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_tilt_forward, 'TILT_FORWARD'],
                                    [Lang.Blocks.ROBOID_tilt_backward, 'TILT_BACKWARD'],
                                    [Lang.Blocks.ROBOID_tilt_left, 'TILT_LEFT'],
                                    [Lang.Blocks.ROBOID_tilt_right, 'TILT_RIGHT'],
                                    [Lang.Blocks.ROBOID_tilt_flip, 'TILT_FLIP'],
                                    [Lang.Blocks.ROBOID_tilt_not, 'TILT_NOT'],
                                    [Lang.Blocks.ROBOID_tap, 'TAP'],
                                    [Lang.Blocks.ROBOID_lift, 'LIFT'],
                                    [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
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
        albertai_move_forward_unit: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'CM',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'albertai_move_forward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.moveForwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.move_forward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'CM',
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
        albertai_move_backward_unit: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'CM',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'albertai_move_backward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.moveBackwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.move_backward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'CM',
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
        albertai_turn_unit_in_place: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'albertai_turn_unit_in_place',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.turnUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.turn(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
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
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
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
        albertai_pivot_around_unit_in_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_forward, 'FORWARD'],
                        [Lang.Blocks.ROBOID_backward, 'BACKWARD'],
                    ],
                    value: 'FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'albertai_pivot_around_unit_in_direction',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VALUE: 1,
                UNIT: 2,
                TOWARD: 3,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.pivotUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.pivot(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
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
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_forward, 'FORWARD'],
                                    [Lang.Blocks.ROBOID_backward, 'BACKWARD'],
                                ],
                                value: 'FORWARD',
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
        albertai_change_both_wheels_by: {
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_change_both_wheels_by',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.add_wheels(%1, %2)',
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
        albertai_set_both_wheels_to: {
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'albertai_set_both_wheels_to',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_wheels(%1, %2)',
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
        albertai_change_wheel_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_change_wheel_by',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.add_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
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
        albertai_set_wheel_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'albertai_set_wheel_to',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
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
        albertai_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albertai_stop',
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.stop()',
                    },
                ],
            },
        },
        albertai_move_to_x_y_on_board: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_forward2, 'FORWARD'],
                        [Lang.Blocks.ROBOID_backward2, 'BACKWARD'],
                    ],
                    value: 'FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'albertai_move_to_x_y_on_board',
            },
            paramsKeyMap: {
                TOWARD: 0,
                X: 1,
                Y: 2,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func: function(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.moveToOnBoard(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.move_to(%1, %2, %3)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_forward2, 'FORWARD'],
                                    [Lang.Blocks.ROBOID_backward2, 'BACKWARD'],
                                ],
                                value: 'FORWARD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
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
        albertai_set_orientation_on_board: {
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'albertai_set_orientation_on_board',
            },
            paramsKeyMap: {
                DEGREE: 0,
            },
            class: 'albertai_wheel',
            isNotFor: ['albertai'],
            func: function(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setOrientationToOnBoard(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_orientation(%1)',
                        blockType: 'param',
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
        albertai_set_eye_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'albertai_set_eye_to',
            },
            paramsKeyMap: {
                EYE: 0,
                COLOR: 1,
            },
            class: 'albertai_eye',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setEyeColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_eye(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
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
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
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
        albertai_pick_eye: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'albertai_pick_eye',
            },
            paramsKeyMap: {
                EYE: 0,
                COLOR: 1,
            },
            class: 'albertai_eye',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.pickEyeColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.pick_eye(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        albertai_change_eye_by_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'albertai_change_eye_by_rgb',
            },
            paramsKeyMap: {
                EYE: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'albertai_eye',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.changeEyeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.add_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
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
        albertai_set_eye_to_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'albertai_set_eye_to_rgb',
            },
            paramsKeyMap: {
                EYE: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'albertai_eye',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setEyeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
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
        albertai_clear_eye: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'albertai_clear_eye',
            },
            paramsKeyMap: {
                EYE: 0,
            },
            class: 'albertai_eye',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.clearEye(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.clear_eye(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
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
        albertai_play_sound_times: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                        [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                        [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                        [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                        [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                    ],
                    value: 'BEEP',
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.play_sound(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                    [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                    [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                ],
                                value: 'BEEP',
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
        albertai_play_sound_times_until_done: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                        [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                        [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                        [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                        [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                    ],
                    value: 'BEEP',
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.play_sound_until_done(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                    [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                    [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                ],
                                value: 'BEEP',
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
        albertai_change_buzzer_by: {
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_change_buzzer_by',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.add_buzzer(%1)',
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
        albertai_set_buzzer_to: {
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_set_buzzer_to',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_buzzer(%1)',
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
        albertai_clear_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albertai_clear_sound',
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.clear_sound()',
                        params: [null],
                    },
                ],
            },
        },
        albertai_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_note_c, 'C'],
                        [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                        [Lang.Blocks.ROBOID_note_d, 'D'],
                        [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                        [Lang.Blocks.ROBOID_note_e, 'E'],
                        [Lang.Blocks.ROBOID_note_f, 'F'],
                        [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                        [Lang.Blocks.ROBOID_note_g, 'G'],
                        [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                        [Lang.Blocks.ROBOID_note_a, 'A'],
                        [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                        [Lang.Blocks.ROBOID_note_b, 'B'],
                    ],
                    value: 'C',
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '4', null],
                type: 'albertai_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.play_note(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_note_c, 'C'],
                                    [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                    [Lang.Blocks.ROBOID_note_d, 'D'],
                                    [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                    [Lang.Blocks.ROBOID_note_e, 'E'],
                                    [Lang.Blocks.ROBOID_note_f, 'F'],
                                    [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                    [Lang.Blocks.ROBOID_note_g, 'G'],
                                    [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                    [Lang.Blocks.ROBOID_note_a, 'A'],
                                    [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                    [Lang.Blocks.ROBOID_note_b, 'B'],
                                ],
                                value: 'C',
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
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        albertai_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_note_c, 'C'],
                        [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                        [Lang.Blocks.ROBOID_note_d, 'D'],
                        [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                        [Lang.Blocks.ROBOID_note_e, 'E'],
                        [Lang.Blocks.ROBOID_note_f, 'F'],
                        [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                        [Lang.Blocks.ROBOID_note_g, 'G'],
                        [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                        [Lang.Blocks.ROBOID_note_a, 'A'],
                        [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                        [Lang.Blocks.ROBOID_note_b, 'B'],
                    ],
                    value: 'C',
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                BEAT: 2,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.play_note_beat(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_note_c, 'C'],
                                    [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                    [Lang.Blocks.ROBOID_note_d, 'D'],
                                    [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                    [Lang.Blocks.ROBOID_note_e, 'E'],
                                    [Lang.Blocks.ROBOID_note_f, 'F'],
                                    [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                    [Lang.Blocks.ROBOID_note_g, 'G'],
                                    [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                    [Lang.Blocks.ROBOID_note_a, 'A'],
                                    [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                    [Lang.Blocks.ROBOID_note_b, 'B'],
                                ],
                                value: 'C',
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
                                converter: Entry.block.converters.returnStringOrNumberByValue,
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
        albertai_rest_for: {
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_rest_for',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.rest_beat(%1)',
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
        albertai_change_tempo_by: {
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_change_tempo_by',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.add_tempo(%1)',
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
        albertai_set_tempo_to: {
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
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'albertai_set_tempo_to',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'albertai_sound',
            isNotFor: ['albertai'],
            func(sprite, script) {
                const robot = Entry.AlbertAi.getRobot();
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AlbertAi.set_tempo(%1)',
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
    };
};

module.exports = Entry.AlbertAi;
