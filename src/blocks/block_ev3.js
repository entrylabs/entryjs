"use strict";

Entry.EV3 = {
	PORT_MAP: {
		A: 0,
		B: 0,
		C: 0,
		D: 0,
		'1': undefined,
		'2': undefined,
		'3': undefined,
		'4': undefined
	},
	deviceType: {
		NxtTouch: 1,
		NxtLight: 2,
		NxtSound: 3,
		NxtColor: 4,
		NxtUltrasonic: 5,
		NxtTemperature: 6,
		LMotor: 7,
		MMotor: 8,
		Touch: 16,
		Color: 29,
		Ultrasonic: 30,
		Gyroscope: 32,
		Infrared: 33,
		Initializing: 0x7d,
		Empty: 0x7e,
		WrongPort: 0x7f,
		Unknown: 0xff
	},
	setZero: function() {
		var portMap = this.PORT_MAP;
		Object.keys(portMap).forEach(function (port) {
			Entry.hw.sendQueue[port] = portMap[port];
		});
		Entry.hw.update();
	},
	name: 'EV3'
};

//Motor
Blockly.Blocks.ev3_port_out = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			['A', 'A'],
			['B', 'B'],
			['C', 'C'],
			['D', 'D']
		]), "PORT")
		.appendField('의 값을');
		this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
        this.appendDummyInput()
		.appendField('으로 변환');
	    // this.setOutput(true, 'Number');
        this.setInputsInline(true);
	    this.setPreviousStatement(true);
	    this.setNextStatement(true);
	}
};

Entry.block.ev3_port_out = function (sprite, script) {
	var port = script.getStringField("PORT", script);
	var value = script.getValue("VALUE", script);
	Entry.hw.sendQueue[port] = value;
	return script.callReturn();
};

//sensor
Blockly.Blocks.ev3_touch_sensor = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			['1', '1'],
			['2', '2'],
			['3', '3'],
			['4', '4']
		]), "PORT")
		.appendField('의 터치센서가 작동되었는가?');
	    this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
	}
};

Entry.block.ev3_touch_sensor = function (sprite, script) {
	var port = script.getStringField("PORT", script);
	var portData = Entry.hw.getDigitalPortValue(script.getNumberField("PORT", script));
	result = false;
	if(portData.type == Entry.EV3.deviceType.Touch) {
		if(Number(portData.siValue) >= 1) {
			result = true;
		}
	}

	return result;
};