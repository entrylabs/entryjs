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

//sensor
Blockly.Blocks.albert_hand_found = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_hand_found);
		this.setOutput(true, 'Boolean');
		this.setInputsInline(true);
	}
};

Entry.block.albert_hand_found = function (sprite, script) {
	var pd = Entry.hw.portData;
	return pd.leftProximity > 40 || pd.rightProximity > 40;
};

Blockly.Blocks.albert_is_oid_value = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_is_oid_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_front_oid,"FRONT"],
			[Lang.Blocks.ALBERT_back_oid,"BACK"]
		]), "OID")
		.appendField(Lang.Blocks.ALBERT_is_oid_2);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_is_oid_3);
		this.setOutput(true, 'Boolean');
		this.setInputsInline(true);
	}
};

Entry.block.albert_is_oid_value = function (sprite, script) {
	var pd = Entry.hw.portData;
	var oid = script.getField("OID", script);
	var value = script.getNumberValue("VALUE");
	if (oid == 'FRONT') {
		return pd.frontOid == value;
	} else {
		return pd.backOid == value;
	}
};

Blockly.Blocks.albert_value = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_sensor_left_proximity ,"leftProximity"],
			[Lang.Blocks.ALBERT_sensor_right_proximity,"rightProximity"],
			[Lang.Blocks.ALBERT_sensor_acceleration_x, "accelerationX"],
			[Lang.Blocks.ALBERT_sensor_acceleration_y, "accelerationY"],
			[Lang.Blocks.ALBERT_sensor_acceleration_z, "accelerationZ"],
			[Lang.Blocks.ALBERT_sensor_front_oid,"frontOid"],
			[Lang.Blocks.ALBERT_sensor_back_oid,"backOid"],
			[Lang.Blocks.ALBERT_sensor_position_x,"positionX"],
			[Lang.Blocks.ALBERT_sensor_position_y,"positionY"],
			[Lang.Blocks.ALBERT_sensor_orientation,"orientation"],
			[Lang.Blocks.ALBERT_sensor_light         ,"light"],
			[Lang.Blocks.ALBERT_sensor_temperature, "temperature"],
			[Lang.Blocks.ALBERT_sensor_battery       ,"battery"],
			[Lang.Blocks.ALBERT_sensor_signal_strength,"signalStrength"]
		]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Number');
	}
};

Entry.block.albert_value = function (sprite, script) {
	var pd = Entry.hw.portData;
	var dev = script.getField('DEVICE');
	return pd[dev];
};

//wheel
Blockly.Blocks.albert_move_forward_for_secs = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_forward_for_secs_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_forward_for_secs_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_move_forward_for_secs = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		sq.leftWheel = 30;
		sq.rightWheel = 30;
		var timeValue = script.getNumberValue("VALUE") * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Albert.removeTimeout(timer);
		}, timeValue);
		Entry.Albert.timeouts.push(timer);
		return script;
	} else if (script.timeFlag == 1) {
		return script;
	} else {
		delete script.isStart;
		delete script.timeFlag;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_move_backward_for_secs = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_backward_for_secs_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_backward_for_secs_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_move_backward_for_secs = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		sq.leftWheel = -30;
		sq.rightWheel = -30;
		var timeValue = script.getNumberValue("VALUE") * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Albert.removeTimeout(timer);
		}, timeValue);
		Entry.Albert.timeouts.push(timer);
		return script;
	} else if (script.timeFlag == 1) {
		return script;
	} else {
		delete script.isStart;
		delete script.timeFlag;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_turn_for_secs = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_turn_for_secs_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_turn_left,"LEFT"],
			[Lang.Blocks.ALBERT_turn_right,"RIGHT"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.ALBERT_turn_for_secs_2)
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_turn_for_secs_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_turn_for_secs = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		var direction = script.getField("DIRECTION", script);
		if (direction == 'LEFT') {
			sq.leftWheel = -30;
			sq.rightWheel = 30;
		} else {
			sq.leftWheel = 30;
			sq.rightWheel = -30;
		}
		var timeValue = script.getNumberValue("VALUE") * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Albert.removeTimeout(timer);
		}, timeValue);
		Entry.Albert.timeouts.push(timer);
		return script;
	} else if (script.timeFlag == 1) {
		return script;
	} else {
		delete script.isStart;
		delete script.timeFlag;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_change_both_wheels_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_both_wheels_by_1);
		this.appendValueInput("LEFT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_both_wheels_by_2)
		this.appendValueInput("RIGHT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_both_wheels_by_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_change_both_wheels_by = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var left = script.getNumberValue('LEFT');
	var right = script.getNumberValue('RIGHT');
	sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + left : left;
	sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + right : right;
	return script.callReturn();
};

Blockly.Blocks.albert_set_both_wheels_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_both_wheels_to_1);
		this.appendValueInput("LEFT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_both_wheels_to_2);
		this.appendValueInput("RIGHT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_both_wheels_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_both_wheels_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.leftWheel = script.getNumberValue('LEFT');
	sq.rightWheel = script.getNumberValue('RIGHT');
	return script.callReturn();
};

Blockly.Blocks.albert_change_wheel_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_wheel_by_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_left_wheel,"LEFT"],
			[Lang.Blocks.ALBERT_right_wheel,"RIGHT"],
			[Lang.Blocks.ALBERT_both_wheels,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.ALBERT_change_wheel_by_2);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_wheel_by_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_change_wheel_by = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var direction = script.getField('DIRECTION');
	var value = script.getNumberValue('VALUE');
	if (direction == 'LEFT') {
		sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
	} else if (direction == 'RIGHT') {
		sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
	} else {
		sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
		sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
	}
	return script.callReturn();
};

Blockly.Blocks.albert_set_wheel_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_wheel_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_left_wheel,"LEFT"],
			[Lang.Blocks.ALBERT_right_wheel,"RIGHT"],
			[Lang.Blocks.ALBERT_both_wheels,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.ALBERT_set_wheel_to_2);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_wheel_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_wheel_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var direction = script.getField('DIRECTION');
	var value = script.getNumberValue('VALUE');
	if (direction == 'LEFT') {
		sq.leftWheel = value;
	} else if (direction == 'RIGHT') {
		sq.rightWheel = value;
	} else {
		sq.leftWheel = value;
		sq.rightWheel = value;
	}
	return script.callReturn();
};

Blockly.Blocks.albert_stop = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_stop)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_stop = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.leftWheel = 0;
	sq.rightWheel = 0;
	return script.callReturn();
};

Blockly.Blocks.albert_set_pad_size_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_board_size_to_1);
		this.appendValueInput("WIDTH")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_board_size_to_2);
		this.appendValueInput("HEIGHT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_board_size_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_pad_size_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.padWidth = script.getNumberValue('WIDTH');
	sq.padHeight = script.getNumberValue('HEIGHT');
	return script.callReturn();
};

Blockly.Blocks.albert_move_to_x_y_on_board = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_to_x_y_1);
		this.appendValueInput("X")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_to_x_y_2);
		this.appendValueInput("Y")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_move_to_x_y_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_move_to_x_y_on_board = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var pd = Entry.hw.portData;
	var controller = Entry.Albert.controller;
	if (!script.isStart) {
		script.isStart = true;
		script.isMoving = true;
		script.initialized = false;
		script.boardState = 1;
		script.x = -1;
		script.y = -1;
		script.theta = -200;
		script.targetX = script.getNumberValue('X');
		script.targetY = script.getNumberValue('Y');
		controller.clear();
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script;
	} else if (script.isMoving) {
		if(pd.positionX >= 0) script.x = pd.positionX;
		if(pd.positionY >= 0) script.y = pd.positionY;
		script.theta = pd.orientation;
		switch(script.boardState) {
			case 1: {
				if(script.initialized == false) {
					if(script.x < 0 || script.y < 0) {
						sq.leftWheel = 20;
						sq.rightWheel = -20;
						return script;
					}
					script.initialized = true;
				}
				var current = controller.toRadian(script.theta);
				var dx = script.targetX - script.x;
				var dy = script.targetY - script.y;
				var target = Math.atan2(dy, dx);
				if(controller.controlAngle(current, target) == false)
					script.boardState = 2;
				break;
			}
			case 2: {
				if(controller.controlPosition(script.x, script.y, controller.toRadian(script.theta), script.targetX, script.targetY) == false)
					script.boardState = 3;
				break;
			}
			case 3: {
				if(controller.controlPositionFine(script.x, script.y, controller.toRadian(script.theta), script.targetX, script.targetY) == false) {
					sq.leftWheel = 0;
					sq.rightWheel = 0;
					script.isMoving = false;
				}
				break;
			}
		}
		return script;
	} else {
		delete script.isStart;
		delete script.isMoving;
		delete script.initialized;
		delete script.boardState;
		delete script.x;
		delete script.y;
		delete script.theta;
		delete script.targetX;
		delete script.targetY;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_set_orientation_on_board = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_orientation_to_1);
		this.appendValueInput("ORIENTATION")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_orientation_to_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_orientation_on_board = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var pd = Entry.hw.portData;
	var controller = Entry.Albert.controller;
	if (!script.isStart) {
		script.isStart = true;
		script.isMoving = true;
		script.boardState = 1;
		script.theta = -200;
		script.targetTheta = script.getNumberValue('ORIENTATION');
		controller.clear();
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script;
	} else if (script.isMoving) {
		script.theta = pd.orientation;
		switch(script.boardState) {
			case 1: {
				var current = controller.toRadian(script.theta);
				var target = controller.toRadian(script.targetTheta);
				if(controller.controlAngle(current, target) == false)
					script.boardState = 2;
				break;
			}
			case 2: {
				var current = controller.toRadian(script.theta);
				var target = controller.toRadian(script.targetTheta);
				if(controller.controlAngleFine(current, target) == false) {
					sq.leftWheel = 0;
					sq.rightWheel = 0;
					script.isMoving = false;
				}
				break;
			}
		}
		return script;
	} else {
		delete script.isStart;
		delete script.isMoving;
		delete script.boardState;
		delete script.theta;
		delete script.targetTheta;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

//led
Blockly.Blocks.albert_set_eye_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_eye_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_left_eye,"LEFT"],
			[Lang.Blocks.ALBERT_right_eye,"RIGHT"],
			[Lang.Blocks.ALBERT_both_eyes,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.ALBERT_set_eye_to_2)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.red,"4"],
			[Lang.General.yellow,"6"],
			[Lang.General.green,"2"],
			[Lang.Blocks.ALBERT_color_cyan,"3"],
			[Lang.General.blue,"1"],
			[Lang.Blocks.ALBERT_color_magenta,"5"],
			[Lang.Blocks.ALBERT_color_white,"7"]
		]), "COLOR")
		.appendField(Lang.Blocks.ALBERT_set_eye_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_eye_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var direction = script.getField("DIRECTION", script);
	var color = Number(script.getField("COLOR", script));
	if (direction == 'LEFT') {
		sq.leftEye = color;
	} else if (direction == 'RIGHT') {
		sq.rightEye = color;
	} else {
		sq.leftEye = color;
		sq.rightEye = color;
	}
	return script.callReturn();
};

Blockly.Blocks.albert_clear_eye = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_clear_eye_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_left_eye,"LEFT"],
			[Lang.Blocks.ALBERT_right_eye,"RIGHT"],
			[Lang.Blocks.ALBERT_both_eyes,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.ALBERT_clear_eye_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_clear_eye = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var direction = script.getField("DIRECTION", script);
	if (direction == 'LEFT') {
		sq.leftEye = 0;
	} else if (direction == 'RIGHT') {
		sq.rightEye = 0;
	} else {
		sq.leftEye = 0;
		sq.rightEye = 0;
	}
	return script.callReturn();
};

Blockly.Blocks.albert_body_led = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_turn_body_led_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_turn_on,"ON"],
			[Lang.Blocks.ALBERT_turn_off,"OFF"]
		]), "STATE")
		.appendField(Lang.Blocks.ALBERT_turn_body_led_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_body_led = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var state = script.getField("STATE", script);
	if (state == 'ON') sq.bodyLed = 1;
	else sq.bodyLed = 0;
	return script.callReturn();
};

Blockly.Blocks.albert_front_led = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_turn_front_led_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_turn_on,"ON"],
			[Lang.Blocks.ALBERT_turn_off,"OFF"]
		]), "STATE")
		.appendField(Lang.Blocks.ALBERT_turn_front_led_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_front_led = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var state = script.getField("STATE", script);
	if (state == 'ON') sq.frontLed = 1;
	else sq.frontLed = 0;
	return script.callReturn();
};

//buzzer
Blockly.Blocks.albert_beep = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_beep)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_beep = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		sq.buzzer = 440;
		sq.note = 0;
		var timeValue = 0.2 * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Albert.removeTimeout(timer);
		}, timeValue);
		Entry.Albert.timeouts.push(timer);
		return script;
	} else if (script.timeFlag == 1) {
		return script;
	} else {
		delete script.isStart;
		delete script.timeFlag;
		Entry.engine.isContinue = false;
		sq.buzzer = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_change_buzzer_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_buzzer_by_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_buzzer_by_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_change_buzzer_by = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var value = script.getNumberValue('VALUE');
	sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
	sq.note = 0;
	return script.callReturn();
};

Blockly.Blocks.albert_set_buzzer_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_buzzer_to_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_buzzer_to_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_buzzer_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.buzzer = script.getNumberValue('VALUE');
	sq.note = 0;
	return script.callReturn();
};

Blockly.Blocks.albert_clear_buzzer = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_clear_buzzer)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_clear_buzzer = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.buzzer = 0;
	sq.note = 0;
	return script.callReturn();
};

Blockly.Blocks.albert_play_note_for = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_play_note_for_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.note_c + '',"4"],
			[Lang.General.note_c + '#',"5"],
			[Lang.General.note_d + '',"6"],
			[Lang.General.note_e + 'b',"7"],
			[Lang.General.note_e + '',"8"],
			[Lang.General.note_f + '',"9"],
			[Lang.General.note_f + '#',"10"],
			[Lang.General.note_g + '',"11"],
			[Lang.General.note_g + '#',"12"],
			[Lang.General.note_a + '',"13"],
			[Lang.General.note_b + 'b',"14"],
			[Lang.General.note_b + '',"15"]
		]), "NOTE")
		.appendField(Lang.Blocks.ALBERT_play_note_for_2)
		.appendField(new Blockly.FieldDropdown([
			['1',"1"],
			['2',"2"],
			['3',"3"],
			['4',"4"],
			['5',"5"],
			['6',"6"],
			['7',"7"]
		]), "OCTAVE")
		.appendField(Lang.Blocks.ALBERT_play_note_for_3)
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_play_note_for_4)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_play_note_for = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		var note = script.getNumberField("NOTE", script);
		var octave = script.getNumberField("OCTAVE", script);
		var beat = script.getNumberValue("VALUE", script);
		var tempo = Entry.Albert.tempo;
		note += (octave-1)*12;
		var timeValue = beat*60*1000/tempo;
		script.isStart = true;
		script.timeFlag = 1;
		sq.buzzer = 0;
		sq.note = note;
		if (timeValue > 100) {
			var timer1 = setTimeout(function() {
				sq.note = 0;
				Entry.Albert.removeTimeout(timer1);
			}, timeValue-100);
			Entry.Albert.timeouts.push(timer1);
		}
		var timer2 = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Albert.removeTimeout(timer2);
		}, timeValue);
		Entry.Albert.timeouts.push(timer2);
		return script;
	} else if (script.timeFlag == 1) {
		return script;
	} else {
		delete script.isStart;
		delete script.timeFlag;
		Entry.engine.isContinue = false;
		sq.note = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_rest_for = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_rest_for_1)
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_rest_for_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_rest_for = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		var timeValue = script.getNumberValue('VALUE');
		timeValue = timeValue*60*1000/Entry.Albert.tempo;
		sq.buzzer = 0;
		sq.note = 0;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Albert.removeTimeout(timer);
		}, timeValue);
		Entry.Albert.timeouts.push(timer);
		return script;
	} else if (script.timeFlag == 1) {
		return script;
	} else {
		delete script.isStart;
		delete script.timeFlag;
		Entry.engine.isContinue = false;
		return script.callReturn();
	}
};

Blockly.Blocks.albert_change_tempo_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_tempo_by_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_change_tempo_by_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_change_tempo_by = function (sprite, script) {
	Entry.Albert.tempo += script.getNumberValue('VALUE');
	if (Entry.Albert.tempo < 1) Entry.Albert.tempo = 1;
	return script.callReturn();
};

Blockly.Blocks.albert_set_tempo_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_tempo_to_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_tempo_to_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.albert_set_tempo_to = function (sprite, script) {
	Entry.Albert.tempo = script.getNumberValue('VALUE');
	if (Entry.Albert.tempo < 1) Entry.Albert.tempo = 1;
	return script.callReturn();
};
