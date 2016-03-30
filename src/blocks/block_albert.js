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
        ports: {
            "leftProximity":{name: Lang.Blocks.ALBERT_sensor_leftProximity, type: "input", pos: {x : 178, y: 401}},
            "rightProximity":{name: Lang.Blocks.ALBERT_sensor_rightProximity, type: "input", pos: {x: 66, y: 359}},
            "battery":{name: Lang.Blocks.ALBERT_sensor_battery , type: "input", pos: {x : 88, y: 368}},
            "light":{name: Lang.Blocks.ALBERT_sensor_light, type: "input", pos: {x: 147, y: 391}},
            "leftWheel":{name: "왼쪽 바퀴", type: "output", pos: {x: 299, y: 406}},
            "rightWheel":{name: "오른쪽 바퀴", type: "output", pos: {x: 22, y: 325}},
            "buzzer":{name: "부저 1", type: "output", pos: {x: 111, y: 217}},
            "leftEye":{name: "왼쪽 눈", type: "output", pos: {x: 260, y:46}},
            "rightEye":{name: "오른쪽 눈", type: "output", pos: {x: 164, y: 33}},
            "note":{name: "부저 2", type: "output", pos: {x: 212, y: 228}},
            "bodyLed":{name: "몸통 불빛", type: "output", pos: {x: 367, y: 308}},
            "frontLed":{name: "앞쪽 불빛", type: "output", pos: {x: 117, y: 379}}
        }
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

Blockly.Blocks.albert_value = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.ALBERT_sensor_leftProximity ,"leftProximity"],
			[Lang.Blocks.ALBERT_sensor_rightProximity,"rightProximity"],
			[Lang.Blocks.ALBERT_sensor_light         ,"light"],
			[Lang.Blocks.ALBERT_sensor_battery       ,"battery"],
			[Lang.Blocks.ALBERT_sensor_signalStrength,"signalStrength"],
			[Lang.Blocks.ALBERT_sensor_frontOid,"frontOid"],
			[Lang.Blocks.ALBERT_sensor_backOid,"backOid"],
			[Lang.Blocks.ALBERT_sensor_positionX,"positionX"],
			[Lang.Blocks.ALBERT_sensor_positionY,"positionY"],
			[Lang.Blocks.ALBERT_sensor_orientation,"orientation"]
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
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"]
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
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
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
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
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
		.appendField(Lang.Blocks.ALBERT_set_pad_size_to_1);
		this.appendValueInput("WIDTH")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_pad_size_to_2);
		this.appendValueInput("HEIGHT")
		.setCheck(["Number", "String"]);
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_pad_size_to_3)
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

//led
Blockly.Blocks.albert_set_eye_to = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.ALBERT_set_eye_to_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
		]), "DIRECTION")
		.appendField(Lang.Blocks.ALBERT_set_eye_to_2)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.red,"4"],
			[Lang.General.yellow,"6"],
			[Lang.General.green,"2"],
			[Lang.Blocks.ALBERT_color_cyan,"3"],
			[Lang.General.blue,"1"],
			[Lang.Blocks.ALBERT_color_magenta,"5"],
			[Lang.General.white,"7"]
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
			[Lang.General.left,"LEFT"],
			[Lang.General.right,"RIGHT"],
			[Lang.General.both,"BOTH"]
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
		.appendField(Lang.Blocks.ALBERT_body_led_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.turn_on,"ON"],
			[Lang.General.turn_off,"OFF"]
		]), "STATE")
		.appendField(Lang.Blocks.ALBERT_body_led_2)
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
		.appendField(Lang.Blocks.ALBERT_front_led_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.General.turn_on,"ON"],
			[Lang.General.turn_off,"OFF"]
		]), "STATE")
		.appendField(Lang.Blocks.ALBERT_front_led_2)
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



// previous block
Blockly.Blocks.albert_move_forward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_forward)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_move_forward = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        sq.leftWheel = 30;
        sq.rightWheel = 30;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.albert_move_backward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_backward)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_move_backward = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = -30;
        sq.rightWheel = -30;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.albert_turn_around = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_turn_around_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_turn_around_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_turn_around = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var direction = script.getField("DIRECTION", script);
        var isLeft = direction == 'LEFT';
        script.leftValue = isLeft ? -30 : 30;
        script.rightValue = isLeft ? 30 : -30;
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = script.leftValue;
        sq.rightWheel = script.rightValue;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.leftValue;
        delete script.rightValue;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.albert_set_led_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_led_to_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.ALBERT_set_led_to_2)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.red,"4"],
      [Lang.General.yellow,"6"],
      [Lang.General.green,"2"],
      [Lang.General.skyblue,"3"],
      [Lang.General.blue,"1"],
      [Lang.General.purple,"5"],
      [Lang.General.white,"7"]
      ]), "COLOR")
    .appendField(Lang.Blocks.HAMSTER_set_led_to_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_set_led_to = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    var color = Number(script.getField("COLOR", script));
    if (direction == 'FRONT') {
        sq.leftEye = color;
        sq.rightEye = color;
    } else if (direction == 'LEFT')
        sq.leftEye = color;
    else
        sq.rightEye = color;

    return script.callReturn();
};

Blockly.Blocks.albert_clear_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_clear_led_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.ALBERT_clear_led_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_clear_led = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    if (direction == 'FRONT') {
        sq.leftEye = 0;
        sq.rightEye = 0;
    } else if (direction == 'LEFT') sq.leftEye = 0;
    else sq.rightEye = 0;

    return script.callReturn();
};

Blockly.Blocks.albert_change_wheels_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_wheels_by_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_change_wheels_by_2);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_wheels_by_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_change_wheels_by = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var pd = Entry.hw.portData;
    var direction = script.getField('DIRECTION');
    var value = script.getNumberValue('VALUE');

    if (direction == 'LEFT') {
        sq.leftWheel = sq.leftWheel != undefined ?
            sq.leftWheel + value : pd.leftWheel + value;
    } else if (direction == 'RIGHT')
        sq.rightWheel = sq.rightWheel != undefined ?
            sq.rightWheel + value : pd.rightWheel + value;
    else {
        sq.leftWheel = sq.leftWheel != undefined ?
            sq.leftWheel + value : pd.leftWheel + value;
        sq.rightWheel = sq.rightWheel != undefined ?
            sq.rightWheel + value : pd.rightWheel + value;
    }

    return script.callReturn();
};

Blockly.Blocks.albert_set_wheels_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_wheels_to_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_set_wheels_to_2);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_wheels_to_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.albert_set_wheels_to = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField('DIRECTION');
    var value = script.getNumberValue('VALUE');

    if (direction == 'LEFT') sq.leftWheel = value;
    else if (direction == 'RIGHT') sq.rightWheel = value;
    else {
        sq.leftWheel = value;
        sq.rightWheel = value;
    }

    return script.callReturn();
};