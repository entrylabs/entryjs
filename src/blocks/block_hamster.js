"use strict";

Entry.Hamster = {
	PORT_MAP: {
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
		ioModeB: 0
	},
	setZero: function() {
		var portMap = Entry.Hamster.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var hamster = Entry.Hamster;
		hamster.lineTracerModeId = 0;
		hamster.lineTracerStateId = -1;
		hamster.tempo = 60;
		hamster.removeAllTimeouts();
	},
	lineTracerModeId: 0,
	lineTracerStateId: -1,
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
	setLineTracerMode: function(sq, mode) {
		this.lineTracerModeId = (this.lineTracerModeId + 1) & 0xff;
		sq.lineTracerMode = mode;
		sq.lineTracerModeId = this.lineTracerModeId;
	},
	name: 'hamster',
	monitorTemplate: {
        imgPath: "hw/hamster.png",
        width: 256,
        height: 256,
        listPorts:{
            "temperature":{name: Lang.Blocks.HAMSTER_sensor_temperature, type: "input", pos: {x: 0, y: 0}},
            "accelerationX":{name: Lang.Blocks.HAMSTER_sensor_accelerationX, type: "input", pos: {x: 0, y: 0}},
            "accelerationY":{name: Lang.Blocks.HAMSTER_sensor_accelerationY, type: "input", pos: {x: 0, y: 0}},
            "accelerationZ":{name: Lang.Blocks.HAMSTER_sensor_accelerationZ, type: "input", pos: {x: 0, y: 0}},
            "buzzer":{name: "부저 1", type: "output", pos: {x: 0, y: 0}},
            "note":{name: "부저 2", type: "output", pos: {x: 0, y: 0}},
            "outputA":{name: "outputA", type: "output", pos: {x: 0, y: 0}},
            "outputB":{name: "outputB", type: "output", pos: {x: 0, y: 0}}
        },
        ports: {
            "leftProximity":{name: Lang.Blocks.HAMSTER_sensor_leftProximity, type: "input", pos: {x: 122, y: 156}},
            "rightProximity":{name: Lang.Blocks.HAMSTER_sensor_rightProximity, type: "input", pos: {x : 10, y: 108}},
            "leftFloor":{name: Lang.Blocks.HAMSTER_sensor_leftFloor, type: "input", pos: {x: 100, y: 234}},
            "rightFloor":{name: Lang.Blocks.HAMSTER_sensor_rightFloor, type: "input", pos: {x: 13, y: 180}},
            "lightsensor":{name: "빛센서", type: "input", pos: {x: 56, y: 189}},
            "leftWheel":{name: "왼쪽 바퀴", type: "output", pos: {x: 209, y: 115}},
            "rightWheel":{name: "오른쪽 바퀴", type: "output", pos: {x: 98, y: 30}},           
            "leftLed":{name: "왼쪽 LED", type: "output", pos: {x: 87, y: 210}},
            "rightLed":{name: "오른쪽 LED", type: "output", pos: {x: 24, y: 168}},
        },
      mode : 'both'
    }
};

//sensor
Blockly.Blocks.hamster_hand_found = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_hand_found);
		this.setOutput(true, 'Boolean');
		this.setInputsInline(true);
	}
};

Entry.block.hamster_hand_found = function (sprite, script) {
	var pd = Entry.hw.portData;
	return pd.leftProximity > 50 || pd.rightProximity > 50;
};

Blockly.Blocks.hamster_value = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_sensor_leftProximity, "leftProximity"],
			[Lang.Blocks.HAMSTER_sensor_rightProximity, "rightProximity"],
			[Lang.Blocks.HAMSTER_sensor_leftFloor, "leftFloor"],
			[Lang.Blocks.HAMSTER_sensor_rightFloor, "rightFloor"],
			[Lang.Blocks.HAMSTER_sensor_accelerationX, "accelerationX"],
			[Lang.Blocks.HAMSTER_sensor_accelerationY, "accelerationY"],
			[Lang.Blocks.HAMSTER_sensor_accelerationZ, "accelerationZ"],
			[Lang.Blocks.HAMSTER_sensor_light, "light"],
			[Lang.Blocks.HAMSTER_sensor_temperature, "temperature"],
			[Lang.Blocks.HAMSTER_sensor_signalStrength, "signalStrength"],
			[Lang.Blocks.HAMSTER_sensor_inputA, "inputA"],
			[Lang.Blocks.HAMSTER_sensor_inputB, "inputB"]
		]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Number');
	}
};

Entry.block.hamster_value = function (sprite, script) {
	var pd = Entry.hw.portData;
	var dev = script.getField('DEVICE');
	return pd[dev];
};

//board
Blockly.Blocks.hamster_move_forward_once = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_move_forward_once)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_move_forward_once = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var pd = Entry.hw.portData;
	if (!script.isStart) {
		script.isStart = true;
		script.isMoving = true;
		script.count = 0;
		script.boardState = 1;
		sq.leftWheel = 45;
		sq.rightWheel = 45;
		Entry.Hamster.setLineTracerMode(sq, 0);
		return script;
	} else if (script.isMoving) {
		switch(script.boardState) {
			case 1: {
				if(script.count < 2) {
					if(pd.leftFloor < 50 && pd.rightFloor < 50)
						script.count ++;
					else
						script.count = 0;
					var diff = pd.leftFloor - pd.rightFloor;
					sq.leftWheel = 45 + diff * 0.25;
					sq.rightWheel = 45 - diff * 0.25;
				} else {
					script.count = 0;
					script.boardState = 2;
				}
				break;
			}
			case 2: {
				var diff = pd.leftFloor - pd.rightFloor;
				sq.leftWheel = 45 + diff * 0.25;
				sq.rightWheel = 45 - diff * 0.25;
				script.boardState = 3;
				var timer = setTimeout(function() {
					script.boardState = 4;
					Entry.Hamster.removeTimeout(timer);
				}, 250);
				Entry.Hamster.timeouts.push(timer);
				break;
			}
			case 3: {
				var diff = pd.leftFloor - pd.rightFloor;
				sq.leftWheel = 45 + diff * 0.25;
				sq.rightWheel = 45 - diff * 0.25;
				break;
			}
			case 4: {
				sq.leftWheel = 0;
				sq.rightWheel = 0;
				script.boardState = 0;
				script.isMoving = false;
				break;
			}
		}
		return script;
	} else {
		delete script.isStart;
		delete script.isMoving;
		delete script.count;
		delete script.boardState;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

Blockly.Blocks.hamster_turn_once = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_turn_once_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_turn_once_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_turn_once = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var pd = Entry.hw.portData;
	if (!script.isStart) {
		script.isStart = true;
		script.isMoving = true;
		script.count = 0;
		script.boardState = 1;
		var direction = script.getField("DIRECTION", script);
		if (direction == 'LEFT') {
			script.isLeft = true;
			sq.leftWheel = -45;
			sq.rightWheel = 45;
		} else {
			script.isLeft = false;
			sq.leftWheel = 45;
			sq.rightWheel = -45;
		}
		Entry.Hamster.setLineTracerMode(sq, 0);
		return script;
	} else if (script.isMoving) {
		if(script.isLeft) {
			switch(script.boardState) {
				case 1: {
					if(script.count < 2) {
						if(pd.leftFloor > 50)
							script.count ++;
					} else {
						script.count = 0;
						script.boardState = 2;
					}
					break;
				}
				case 2: {
					if(pd.leftFloor < 20) {
						script.boardState = 3;
					}
					break;
				}
				case 3: {
					if(script.count < 2) {
						if(pd.leftFloor < 20)
							script.count ++;
					} else {
						script.count = 0;
						script.boardState = 4;
					}
					break;
				}
				case 4: {
					if(pd.leftFloor > 50) {
						script.boardState = 5;
					}
					break;
				}
				case 5: {
					var diff = pd.leftFloor - pd.rightFloor;
					if(diff > -15) {
						sq.leftWheel = 0;
						sq.rightWheel = 0;
						script.boardState = 0;
						script.isMoving = false;
					} else {
						sq.leftWheel = diff * 0.5;
						sq.rightWheel = -diff * 0.5;
					}
					break;
				}
			}
		} else {
			switch(script.boardState) {
				case 1: {
					if(script.count < 2) {
						if(pd.rightFloor > 50)
							script.count ++;
					} else {
						script.count = 0;
						script.boardState = 2;
					}
					break;
				}
				case 2: {
					if(pd.rightFloor < 20) {
						script.boardState = 3;
					}
					break;
				}
				case 3: {
					if(script.count < 2) {
						if(pd.rightFloor < 20)
							script.count ++;
					} else {
						script.count = 0;
						script.boardState = 4;
					}
					break;
				}
				case 4: {
					if(pd.rightFloor > 50) {
						script.boardState = 5;
					}
					break;
				}
				case 5: {
					var diff = pd.rightFloor - pd.leftFloor;
					if(diff > -15) {
						sq.leftWheel = 0;
						sq.rightWheel = 0;
						script.boardState = 0;
						script.isMoving = false;
					} else {
						sq.leftWheel = -diff * 0.5;
						sq.rightWheel = diff * 0.5;
					}
					break;
				}
			}
		}
		return script;
	} else {
		delete script.isStart;
		delete script.isMoving;
		delete script.count;
		delete script.boardState;
		delete script.isLeft;
		Entry.engine.isContinue = false;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		return script.callReturn();
	}
};

//wheel
Blockly.Blocks.hamster_move_forward_for_secs = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_move_forward_for_secs_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_move_forward_for_secs_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_move_forward_for_secs = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		sq.leftWheel = 30;
		sq.rightWheel = 30;
		Entry.Hamster.setLineTracerMode(sq, 0);
		var timeValue = script.getNumberValue("VALUE") * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Hamster.removeTimeout(timer);
		}, timeValue);
		Entry.Hamster.timeouts.push(timer);
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

Blockly.Blocks.hamster_move_backward_for_secs = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_move_backward_for_secs_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_move_backward_for_secs_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_move_backward_for_secs = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		sq.leftWheel = -30;
		sq.rightWheel = -30;
		Entry.Hamster.setLineTracerMode(sq, 0);
		var timeValue = script.getNumberValue("VALUE") * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Hamster.removeTimeout(timer);
		}, timeValue);
		Entry.Hamster.timeouts.push(timer);
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

Blockly.Blocks.hamster_turn_for_secs = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_turn_for_secs_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_turn_for_secs_2)
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_turn_for_secs_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_turn_for_secs = function (sprite, script) {
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
		Entry.Hamster.setLineTracerMode(sq, 0);
		var timeValue = script.getNumberValue("VALUE") * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Hamster.removeTimeout(timer);
		}, timeValue);
		Entry.Hamster.timeouts.push(timer);
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

Blockly.Blocks.hamster_change_both_wheels_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_1);
		this.appendValueInput("LEFT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_2)
		this.appendValueInput("RIGHT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_change_both_wheels_by = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var left = script.getNumberValue('LEFT');
	var right = script.getNumberValue('RIGHT');
	sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + left : left;
	sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + right : right;
	Entry.Hamster.setLineTracerMode(sq, 0);
	return script.callReturn();
};

Blockly.Blocks.hamster_set_both_wheels_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_1);
		this.appendValueInput("LEFT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_2);
		this.appendValueInput("RIGHT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_both_wheels_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.leftWheel = script.getNumberValue('LEFT');
	sq.rightWheel = script.getNumberValue('RIGHT');
	Entry.Hamster.setLineTracerMode(sq, 0);
	return script.callReturn();
};

Blockly.Blocks.hamster_change_wheel_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_wheel_by_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_change_wheel_by_2);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_wheel_by_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_change_wheel_by = function (sprite, script) {
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
	Entry.Hamster.setLineTracerMode(sq, 0);
	return script.callReturn();
};

Blockly.Blocks.hamster_set_wheel_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_wheel_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_set_wheel_to_2);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_wheel_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_wheel_to = function (sprite, script) {
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
	Entry.Hamster.setLineTracerMode(sq, 0);
	return script.callReturn();
};

Blockly.Blocks.hamster_follow_line_using = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_follow_line_using_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_color_black,"BLACK"],
			[Lang.General.white,"WHITE"]
		]), "COLOR")
		.appendField(Lang.Blocks.HAMSTER_follow_line_using_2)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_follow_line_using_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_follow_line_using = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var color = script.getField('COLOR');
	var direction = script.getField('DIRECTION');

	var mode = 1;
	if (direction == 'RIGHT') mode = 2;
	else if (direction == 'BOTH') mode = 3;
	if (color == 'WHITE') mode += 7;

	sq.leftWheel = 0;
	sq.rightWheel = 0;
	Entry.Hamster.setLineTracerMode(sq, mode);
	return script.callReturn();
};

Blockly.Blocks.hamster_follow_line_until = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_follow_line_until_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_color_black,"BLACK"],
			[Lang.General.white,"WHITE"]
		]), "COLOR")
		.appendField(Lang.Blocks.HAMSTER_follow_line_until_2)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.Blocks.HAMSTER_front,"FRONT"],
			[Lang.Blocks.HAMSTER_rear,"REAR"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_follow_line_until_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_follow_line_until = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var pd = Entry.hw.portData;
	var color = script.getField('COLOR');
	var direction = script.getField('DIRECTION');

	var mode = 4;
	if (direction == 'RIGHT') mode = 5;
	else if (direction == 'FRONT') mode = 6;
	else if (direction == 'REAR') mode = 7;
	if (color == 'WHITE') mode += 7;

	if (!script.isStart) {
		script.isStart = true;
		sq.leftWheel = 0;
		sq.rightWheel = 0;
		Entry.Hamster.setLineTracerMode(sq, mode);
		return script;
	} else {
		var hamster = Entry.Hamster;
		if (pd.lineTracerStateId != hamster.lineTracerStateId) {
			hamster.lineTracerStateId = pd.lineTracerStateId;
			if (pd.lineTracerState == 0x40) {
				delete script.isStart;
				Entry.engine.isContinue = false;
				hamster.setLineTracerMode(sq, 0);
				return script.callReturn();
			}
		}
		return script;
	}
};

Blockly.Blocks.hamster_set_following_speed_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_following_speed_to_1)
		.appendField(new Blockly.FieldDropdown([
			["1","1"],
			["2","2"],
			["3","3"],
			["4","4"],
			["5","5"],
			["6","6"],
			["7","7"],
			["8","8"],
		]), "SPEED")
		.appendField(Lang.Blocks.HAMSTER_set_following_speed_to_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_following_speed_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.lineTracerSpeed = Number(script.getField("SPEED", script));
	return script.callReturn();
};

Blockly.Blocks.hamster_stop = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_stop)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_stop = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.leftWheel = 0;
	sq.rightWheel = 0;
	Entry.Hamster.setLineTracerMode(sq, 0);
	return script.callReturn();
};

//led
Blockly.Blocks.hamster_set_led_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_led_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_set_led_to_2)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.red,"4"],
			[Lang.General.yellow,"6"],
			[Lang.General.green,"2"],
			[Lang.Blocks.HAMSTER_color_cyan,"3"],
			[Lang.General.blue,"1"],
			[Lang.Blocks.HAMSTER_color_magenta,"5"],
			[Lang.General.white,"7"]
		]), "COLOR")
		.appendField(Lang.Blocks.HAMSTER_set_led_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_led_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var direction = script.getField("DIRECTION", script);
	var color = Number(script.getField("COLOR", script));
	if (direction == 'LEFT') {
		sq.leftLed = color;
	} else if (direction == 'RIGHT') {
		sq.rightLed = color;
	} else {
		sq.leftLed = color;
		sq.rightLed = color;
	}
	return script.callReturn();
};

Blockly.Blocks.hamster_clear_led = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_clear_led_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.HAMSTER_clear_led_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_clear_led = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var direction = script.getField("DIRECTION", script);
	if (direction == 'LEFT') {
		sq.leftLed = 0;
	} else if (direction == 'RIGHT') {
		sq.rightLed = 0;
	} else {
		sq.leftLed = 0;
		sq.rightLed = 0;
	}
	return script.callReturn();
};

//buzzer
Blockly.Blocks.hamster_beep = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_beep)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_beep = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		sq.buzzer = 440;
		sq.note = 0;
		var timeValue = 0.2 * 1000;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Hamster.removeTimeout(timer);
		}, timeValue);
		Entry.Hamster.timeouts.push(timer);
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

Blockly.Blocks.hamster_change_buzzer_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_buzzer_by_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_buzzer_by_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_change_buzzer_by = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var value = script.getNumberValue('VALUE');
	sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
	sq.note = 0;
	return script.callReturn();
};

Blockly.Blocks.hamster_set_buzzer_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_buzzer_to_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_buzzer_to_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_buzzer_to = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.buzzer = script.getNumberValue('VALUE');
	sq.note = 0;
	return script.callReturn();
};

Blockly.Blocks.hamster_clear_buzzer = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_clear_buzzer)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_clear_buzzer = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	sq.buzzer = 0;
	sq.note = 0;
	return script.callReturn();
};

Blockly.Blocks.hamster_play_note_for = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_play_note_for_1)
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
		.appendField(Lang.Blocks.HAMSTER_play_note_for_2)
		.appendField(new Blockly.FieldDropdown([
			['1',"1"],
			['2',"2"],
			['3',"3"],
			['4',"4"],
			['5',"5"],
			['6',"6"],
			['7',"7"]
		]), "OCTAVE")
		.appendField(Lang.Blocks.HAMSTER_play_note_for_3)
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_play_note_for_4)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_play_note_for = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		var note = script.getNumberField("NOTE", script);
		var octave = script.getNumberField("OCTAVE", script);
		var beat = script.getNumberValue("VALUE", script);
		var tempo = Entry.Hamster.tempo;
		note += (octave-1)*12;
		var timeValue = beat*60*1000/tempo;
		script.isStart = true;
		script.timeFlag = 1;
		sq.buzzer = 0;
		sq.note = note;
		if (timeValue > 100) {
			var timer1 = setTimeout(function() {
				sq.note = 0;
				Entry.Hamster.removeTimeout(timer1);
			}, timeValue-100);
			Entry.Hamster.timeouts.push(timer1);
		}
		var timer2 = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Hamster.removeTimeout(timer2);
		}, timeValue);
		Entry.Hamster.timeouts.push(timer2);
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

Blockly.Blocks.hamster_rest_for = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_rest_for_1)
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_rest_for_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_rest_for = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	if (!script.isStart) {
		script.isStart = true;
		script.timeFlag = 1;
		var timeValue = script.getNumberValue('VALUE');
		timeValue = timeValue*60*1000/Entry.Hamster.tempo;
		sq.buzzer = 0;
		sq.note = 0;
		var timer = setTimeout(function() {
			script.timeFlag = 0;
			Entry.Hamster.removeTimeout(timer);
		}, timeValue);
		Entry.Hamster.timeouts.push(timer);
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

Blockly.Blocks.hamster_change_tempo_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_tempo_by_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_tempo_by_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_change_tempo_by = function (sprite, script) {
	Entry.Hamster.tempo += script.getNumberValue('VALUE');
	if (Entry.Hamster.tempo < 1) Entry.Hamster.tempo = 1;
	return script.callReturn();
};

Blockly.Blocks.hamster_set_tempo_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_tempo_to_1);
		this.appendValueInput("VALUE")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_tempo_to_2)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_tempo_to = function (sprite, script) {
	Entry.Hamster.tempo = script.getNumberValue('VALUE');
	if (Entry.Hamster.tempo < 1) Entry.Hamster.tempo = 1;
	return script.callReturn();
};

Blockly.Blocks.hamster_set_port_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_port_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_port_a, "A"],
			[Lang.Blocks.HAMSTER_port_b, "B"],
			[Lang.Blocks.HAMSTER_port_ab, "AB"]
		]), "PORT")
		.appendField(Lang.Blocks.HAMSTER_set_port_to_2)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_analog_input, "0"],
			[Lang.Blocks.HAMSTER_digital_input, "1"],
			[Lang.Blocks.HAMSTER_servo_output, "8"],
			[Lang.Blocks.HAMSTER_pwm_output, "9"],
			[Lang.Blocks.HAMSTER_digital_output, "10"]
		]), "MODE")
		.appendField(Lang.Blocks.HAMSTER_set_port_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hamster_set_port_to = function(sprite, script) {
	var sq = Entry.hw.sendQueue;
	var port = script.getField("PORT", script);
	var mode = Number(script.getField("MODE", script));
	if (port == 'A') {
		sq.ioModeA = mode;
	} else if (port == 'B') {
		sq.ioModeB = mode;
	} else {
		sq.ioModeA = mode;
		sq.ioModeB = mode;
	}
	return script.callReturn();
};

Blockly.Blocks.hamster_change_output_by = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_output_by_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_port_a, "A"],
			[Lang.Blocks.HAMSTER_port_b, "B"],
			[Lang.Blocks.HAMSTER_port_ab, "AB"]
		]), "PORT")
		.appendField(Lang.Blocks.HAMSTER_change_output_by_2);
		this.appendValueInput("VALUE").setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_change_output_by_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
		this.setInputsInline(!0);
		this.setPreviousStatement(!0);
		this.setNextStatement(!0);
	}
};

Entry.block.hamster_change_output_by = function(sprite, script) {
	var sq = Entry.hw.sendQueue;
	var port = script.getField('PORT');
	var value = script.getNumberValue('VALUE');
	if (port == 'A') {
		sq.outputA = sq.outputA != undefined ? sq.outputA + value : value;
	} else if (port == 'B') {
		sq.outputB = sq.outputB != undefined ? sq.outputB + value : value;
	} else {
		sq.outputA = sq.outputA != undefined ? sq.outputA + value : value;
		sq.outputB = sq.outputB != undefined ? sq.outputB + value : value;
	}
	return script.callReturn();
};

Blockly.Blocks.hamster_set_output_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_output_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.HAMSTER_port_a, "A"],
			[Lang.Blocks.HAMSTER_port_b, "B"],
			[Lang.Blocks.HAMSTER_port_ab, "AB"]
		]), "PORT")
		.appendField(Lang.Blocks.HAMSTER_set_output_to_2);
		this.appendValueInput("VALUE").setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_set_output_to_3)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
		this.setInputsInline(!0);
		this.setPreviousStatement(!0);
		this.setNextStatement(!0);
	}
};

Entry.block.hamster_set_output_to = function(sprite, script) {
	var sq = Entry.hw.sendQueue;
	var port = script.getField('PORT');
	var value = script.getNumberValue('VALUE');
	if (port == 'A') {
		sq.outputA = value;
	} else if (port == 'B') {
		sq.outputB = value;
	} else {
		sq.outputA = value;
		sq.outputB = value;
	}
	return script.callReturn();
};
