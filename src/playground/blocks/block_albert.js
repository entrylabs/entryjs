"use strict";

Entry.Albert = {
	PORT_MAP: {
		leftWheel: 0,
		rightWheel: 0,
		buzzer: 0,
		leftEye: 0,
		rightEye: 0,
		note: 0,
		bodyLed: 0,
		frontLed: 0,
		padWidth: 0,
		padHeight: 0
	},
	setZero: function() {
		var portMap = Entry.Albert.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var albert = Entry.Albert;
		albert.tempo = 60;
		albert.removeAllTimeouts();
	},
    monitorTemplate: {
        imgPath: "hw/albert.png",
        width: 387,
        height: 503,
        listPorts: {
            "temperature":{name: Lang.Blocks.ALBERT_sensor_temperature, type: "input", pos: {x: 0, y: 0}},
            "accelerationX": {name: Lang.Blocks.ALBERT_sensor_acceleration_x, type: "input", pos: {x: 0, y: 0}},
            "accelerationY": {name: Lang.Blocks.ALBERT_sensor_acceleration_y, type: "input", pos: {x: 0, y: 0}},
            "accelerationZ": {name: Lang.Blocks.ALBERT_sensor_acceleration_z, type: "input", pos: {x: 0, y: 0}},
            "frontOid": {name: Lang.Blocks.ALBERT_sensor_front_oid, type: "input", pos: {x: 0, y: 0}},
            "backOid": {name: Lang.Blocks.ALBERT_sensor_back_oid, type: "input", pos: {x: 0, y: 0}},
            "positionX": {name: Lang.Blocks.ALBERT_sensor_position_x, type: "input", pos: {x: 0, y: 0}},
            "positionY": {name: Lang.Blocks.ALBERT_sensor_position_y, type: "input", pos: {x: 0, y: 0}},
            "orientation": {name: Lang.Blocks.ALBERT_sensor_orientation, type: "input", pos: {x: 0, y: 0}},
        	"buzzer":{name: Lang.Hw.buzzer , type: "output", pos: {x: 0, y: 0}},
        	"note":{name: Lang.Hw.note , type: "output", pos: {x: 0, y: 0}}
        },
        ports: {
            "leftProximity":{name: Lang.Blocks.ALBERT_sensor_left_proximity, type: "input", pos: {x : 178, y: 401}},
            "rightProximity":{name: Lang.Blocks.ALBERT_sensor_right_proximity, type: "input", pos: {x: 66, y: 359}},
            "battery":{name: Lang.Blocks.ALBERT_sensor_battery , type: "input", pos: {x : 88, y: 368}},
            "light":{name: Lang.Blocks.ALBERT_sensor_light, type: "input", pos: {x: 127, y: 391}},
            "leftWheel":{name: Lang.Hw.leftWheel , type: "output", pos: {x: 299, y: 406}},
            "rightWheel":{name: Lang.Hw.rightWheel , type: "output", pos: {x: 22, y: 325}},
            "leftEye":{name: Lang.Hw.leftEye , type: "output", pos: {x: 260, y:26}},
            "rightEye":{name: Lang.Hw.rightEye, type: "output", pos: {x: 164, y: 13}},
            "bodyLed":{name: Lang.Hw.body + " " + Lang.Hw.led_en, type: "output", pos: {x: 367, y: 308}},
            "frontLed":{name:  Lang.Hw.front + " " + Lang.Hw.led_en, pos: {x: 117, y: 410}}
        },
        mode : 'both'
    },
	tempo: 60,
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
	controller: {
		PI: 3.14159265,
		PI2: 6.2831853,
		prevDirection: 0,
		prevDirectionFine: 0,
		directionFineCount: 0,
		positionCount: 0,
		finalPositionCount: 0,
		GAIN_ANGLE: 30,
		GAIN_ANGLE_FINE: 30,
		GAIN_POSITION_FINE: 30,
		STRAIGHT_SPEED: 20,
		MAX_BASE_SPEED: 20,
		GAIN_BASE_SPEED: 1.0,
		GAIN_POSITION: 35,
		POSITION_TOLERANCE_FINE: 3,
		POSITION_TOLERANCE_FINE_LARGE: 5,
		POSITION_TOLERANCE_ROUGH: 5,
		POSITION_TOLERANCE_ROUGH_LARGE: 10,
		ORIENTATION_TOLERANCE_FINE: 0.08,
		ORIENTATION_TOLERANCE_ROUGH: 0.09,
		ORIENTATION_TOLERANCE_ROUGH_LARGE: 0.18,
		MINIMUM_WHEEL_SPEED: 18,
		MINIMUM_WHEEL_SPEED_FINE: 15,
		clear: function() {
			this.prevDirection = 0;
			this.prevDirectionFine = 0;
			this.directionFineCount = 0;
			this.positionCount = 0;
			this.finalPositionCount = 0;
		},
		controlAngleFine: function(currentRadian, targetRadian) {
			var sq = Entry.hw.sendQueue;
			var diff = this.validateRadian(targetRadian - currentRadian);
			var mag = Math.abs(diff);
			if(mag < this.ORIENTATION_TOLERANCE_FINE)
				return false;

			var direction = diff > 0 ? 1 : -1;
			if(direction * this.prevDirectionFine < 0) {
				if(++this.directionFineCount > 5)
					return false;
			}
			this.prevDirectionFine = direction;

			var value = 0;
			if(diff > 0) {
				value = Math.log(1 + mag) * this.GAIN_ANGLE_FINE;
				if(value < this.MINIMUM_WHEEL_SPEED) value = this.MINIMUM_WHEEL_SPEED;
			} else {
				value = -Math.log(1 + mag) * this.GAIN_ANGLE_FINE;
				if(value > -this.MINIMUM_WHEEL_SPEED) value = -this.MINIMUM_WHEEL_SPEED;
			}
			value = parseInt(value);
			sq.leftWheel = -value;
			sq.rightWheel = value;
			return true;
		},
		controlAngle: function(currentRadian, targetRadian) {
			var sq = Entry.hw.sendQueue;
			var diff = this.validateRadian(targetRadian - currentRadian);
			var mag = Math.abs(diff);
			if(mag < this.ORIENTATION_TOLERANCE_ROUGH)
				return false;

			var direction = diff > 0 ? 1 : -1;
			if(mag < this.ORIENTATION_TOLERANCE_ROUGH_LARGE && direction * this.prevDirection < 0)
				return false;
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
			sq.leftWheel = -value;
			sq.rightWheel = value;
			return true;
		},
		controlPositionFine: function(currentX, currentY, currentRadian, targetX, targetY) {
			var sq = Entry.hw.sendQueue;
			var targetRadian = Math.atan2(targetY - currentY, targetX - currentX);
			var diff = this.validateRadian(targetRadian - currentRadian);
			var mag = Math.abs(diff);
			var ex = targetX - currentX ;
			var ey = targetY - currentY;
			var dist = Math.sqrt(ex * ex + ey * ey);
			if(dist < this.POSITION_TOLERANCE_FINE)
				return false;
			if(dist < this.POSITION_TOLERANCE_FINE_LARGE) {
				if(++this.finalPositionCount > 5) {
					this.finalPositionCount = 0;
					return false;
				}
			}
			var value = 0;
			if(diff > 0)
				value = Math.log(1 + mag) * this.GAIN_POSITION_FINE;
			else
				value = -Math.log(1 + mag) * this.GAIN_POSITION_FINE;
			value = parseInt(value);
			sq.leftWheel = this.MINIMUM_WHEEL_SPEED_FINE - value;
			sq.rightWheel = this.MINIMUM_WHEEL_SPEED_FINE + value;
			return true;
		},
		controlPosition: function(currentX, currentY, currentRadian, targetX, targetY) {
			var sq = Entry.hw.sendQueue;
			var targetRadian = Math.atan2(targetY - currentY, targetX - currentX);
			var diff = this.validateRadian(targetRadian - currentRadian);
			var mag = Math.abs(diff);
			var ex = targetX - currentX ;
			var ey = targetY - currentY;
			var dist = Math.sqrt(ex * ex + ey * ey);
			if(dist < this.POSITION_TOLERANCE_ROUGH)
				return false;
			if(dist < this.POSITION_TOLERANCE_ROUGH_LARGE) {
				if(++this.positionCount > 10) {
					this.positionCount = 0;
					return false;
				}
			} else {
				this.positionCount = 0;
			}
			if(mag < 0.01) {
				sq.leftWheel = this.STRAIGHT_SPEED;
				sq.rightWheel = this.STRAIGHT_SPEED;
			} else {
				var base = (this.MINIMUM_WHEEL_SPEED + 0.5 / mag) * this.GAIN_BASE_SPEED;
				if(base > this.MAX_BASE_SPEED) base = this.MAX_BASE_SPEED;

				var value = 0;
				if(diff > 0)
					value = Math.log(1 + mag) * this.GAIN_POSITION;
				else
					value = -Math.log(1 + mag) * this.GAIN_POSITION;
				base = parseInt(base);
				value = parseInt(value);
				sq.leftWheel = base - value;
				sq.rightWheel = base + value;
			}
			return true;
		},
		validateRadian: function(radian)
		{
			if(radian > this.PI)
				return radian - this.PI2;
			else if(radian < -this.PI)
				return radian + this.PI2;
			return radian;
		},
		toRadian: function(degree) {
			return degree * 3.14159265 / 180.0;
		}
	},
	name: 'albert'
};