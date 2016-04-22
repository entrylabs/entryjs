"use strict";

Entry.Xbot = {
	PORT_MAP: {
		rightWheel: 0,
		leftWheel: 0,
		head: 90,
		armR: 90,
		armL: 90,
		analogD5: 127,//D4
		analogD6: 127,//D5
		D4: 0,
		D7: 0,
		D12: 0,
		D13: 0,
		ledR: 0,
		ledG: 0,
		ledB: 0,
		lcdNum: 0,
		lcdTxt: '                ',
		note: 262,
		duration: 0		
	},
	setZero: function() {
		var portMap = Entry.Xbot.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var Xbot = Entry.Xbot;
		Xbot.removeAllTimeouts();
	},
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
	name: 'xbot_epor_edge'
};


//sensor
Blockly.Blocks.xbot_digitalInput = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.XBOT_D2_digitalInput, "D2"],
			[Lang.Blocks.XBOT_D3_digitalInput, "D3"],
			[Lang.Blocks.XBOT_D11_digitalInput, "D11"]
		]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Boolean');
	}
};

Entry.block.xbot_digitalInput = function (sprite, script) {
	var pd = Entry.hw.portData;
	var dev = script.getField('DEVICE');
	return pd[dev];
};

Blockly.Blocks.xbot_analogValue = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.XBOT_CDS, "light"],
			[Lang.Blocks.XBOT_MIC, "mic"],
			[Lang.Blocks.XBOT_analog0, "adc0"],
			[Lang.Blocks.XBOT_analog1, "adc1"],
			[Lang.Blocks.XBOT_analog2, "adc2"],
			[Lang.Blocks.XBOT_analog3, "adc3"],
		]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Number');
	}
};

Entry.block.xbot_analogValue = function (sprite, script) {
	var pd = Entry.hw.portData;
	var dev = script.getField('DEVICE');
	return pd[dev];
};

Blockly.Blocks.xbot_digitalOutput = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.XBOT_digital)
			.appendField(new Blockly.FieldDropdown([
				["LED", "D13"],
				["D4", "D4"],
				["D7", "D7"],
				["D12 ", "D12"]
			]), "DEVICE")
			.appendField(Lang.Blocks.XBOT_pin_OutputValue)
			.appendField(new Blockly.FieldDropdown([
				[Lang.Blocks.XBOT_High, "HIGH"],
				[Lang.Blocks.XBOT_Low, "LOW"],
				]),"VALUE")
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true)
	}
};

Entry.block.xbot_digitalOutput = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var dev = script.getStringField("DEVICE", script);
	var value = script.getStringField('VALUE', script);

	if (dev == 'D13' && value == 'HIGH')
	{
		sq.D13 = 1;
	}
	else
	{
		sq.D13 = 0;
	}

	if (dev == 'D4' && value == 'HIGH')
	{
		sq.D4 = 1;
	}
	else
	{
		sq.D4 = 0;
	}

	if (dev == 'D7' && value == 'HIGH')
	{
		sq.D7 = 1;
	}
	else
	{
		sq.D7 = 0;
	}

	if (dev == 'D12' && value == 'HIGH')
	{
		sq.D12 = 1;
	}
	else
	{
		sq.D12 = 0;
	}
	//sq.D13 = 1;
	return script.callReturn();
};

Blockly.Blocks.xbot_analogOutput = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.XBOT_analog)
			.appendField(new Blockly.FieldDropdown([
					["D5", "analogD5"],
					["D6", "analogD6"]
				]), "DEVICE")
			.appendField(Lang.Blocks.XBOT_pin_Output_Value)
		this.appendValueInput("VALUE")
    		.setCheck(["Number", "String"]);
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.xbot_analogOutput = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var dev = script.getStringField("DEVICE", script);
	var value = script.getNumberValue("VALUE", script);
	
	if (dev == 'analogD5')
	{
		sq.analogD5 = value;
	}
	
	else if(dev == 'analogD6')
	{
		sq.analogD6 = value;
	}	
	
	return script.callReturn();
};

Blockly.Blocks.xbot_servo = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.XBOT_Servo)
			.appendField(new Blockly.FieldDropdown([
				[Lang.Blocks.XBOT_Head,"head"],
				[Lang.Blocks.XBOT_ArmR, "right"],
				[Lang.Blocks.XBOT_ArmL, "left"]
				]), "DEVICE")
			.appendField(Lang.Blocks.XBOT_angle)
		this.appendValueInput("VALUE")
    		.setCheck(["Number", "String"]);
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true)
	}
};


Entry.block.xbot_servo = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var mtype = script.getStringField("DEVICE", script);
	var angle = script.getNumberValue("VALUE", script);

	if(mtype == 'head')
	{
		sq.head = angle;
	}
	
	else if(mtype == 'right')
	{
		sq.armR = angle;
	}

	else if(mtype == 'left')
	{
		sq.armL = angle;
	}


	return script.callReturn();
};

//wheel

Blockly.Blocks.xbot_oneWheel = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.XBOT_DC)
		.appendField(new Blockly.FieldDropdown([
				[Lang.Blocks.XBOT_rightWheel,"rightWheel"],
				[Lang.Blocks.XBOT_leftWheel, "leftWheel"],
				[Lang.Blocks.XBOT_bothWheel, "bothWheel"]
				]), "DEVICE")		
		.appendField(Lang.Blocks.XBOT_speed)
		this.appendValueInput("VALUE")
    		.setCheck(["Number", "String"]);
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.xbot_oneWheel = function (sprite, script) {
	//console.log('xbot_move_forward_for_secs'); 	
	var sq = Entry.hw.sendQueue;
	var dir = script.getStringField("DEVICE", script);
	var speed =script.getNumberValue('VALUE', script);

	if (dir == 'rightWheel')
		sq.rightWheel = speed;	
	else if (dir == 'leftWheel')
		sq.leftWheel = speed;
	else
		sq.rightWheel = sq.leftWheel = speed;
	
	return script.callReturn();
};

Blockly.Blocks.xbot_twoWheel = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.XBOT_rightSpeed);
		this.appendValueInput("rightWheel")
    		.setCheck(["Number", "String"]);
		
		this.appendDummyInput()
			.appendField(Lang.Blocks.XBOT_leftSpeed);
		this.appendValueInput("leftWheel")
    		.setCheck(["Number", "String"]);
		this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.xbot_twoWheel = function (sprite, script) {
	//console.log('xbot_move_forward_for_secs'); 	
	var sq = Entry.hw.sendQueue;

	sq.rightWheel = script.getNumberValue('rightWheel');
	sq.leftWheel = script.getNumberValue('leftWheel');

	return script.callReturn();
};




Blockly.Blocks.xbot_rgb = {
	init: function() {
	this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.XBOT_RGBLED_R);
    this.appendValueInput("ledR")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.XBOT_RGBLED_G);
    this.appendValueInput("ledG")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.XBOT_RGBLED_B);
    this.appendValueInput("ledB")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.xbot_rgb = function (sprite, script) {
	var sq = Entry.hw.sendQueue;

	sq.ledR = script.getNumberValue('ledR');
	sq.ledG = script.getNumberValue('ledG');
	sq.ledB = script.getNumberValue('ledB');

	//console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB); 
	return script.callReturn();
};


Blockly.Blocks.xbot_rgb_picker = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.XBOT_RGBLED_color)
    .appendField(new Blockly.FieldColour('#ff0000'),'VALUE')
    .appendField(Lang.Blocks.XBOT_set)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.xbot_rgb_picker = function (sprite, script) {
    var port = script.getStringField("VALUE");
	var sq = Entry.hw.sendQueue;

	sq.ledR = parseInt(parseInt(port.substr(1,2), 16) * 0.3);
	sq.ledG =  parseInt(parseInt(port.substr(3,2), 16) * 0.3);
	sq.ledB = parseInt(parseInt(port.substr(5,2), 16) * 0.3); 

    return script.callReturn();
};

Blockly.Blocks.xbot_buzzer = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField(Lang.Blocks.HAMSTER_play_note_for_1)
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.XBOT_c ,"C"],
			[Lang.Blocks.XBOT_d ,"D"],
			[Lang.Blocks.XBOT_e ,"E"],
			[Lang.Blocks.XBOT_f ,"F"],
			[Lang.Blocks.XBOT_g ,"G"],
			[Lang.Blocks.XBOT_a ,"A"],
			[Lang.Blocks.XBOT_b ,"B"]
		]), "NOTE")
		.appendField(" ")
		.appendField(new Blockly.FieldDropdown([
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
		.appendField(Lang.Blocks.XBOT_melody_ms)
		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.xbot_buzzer = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var note = script.getStringField("NOTE", script);
	var octave = script.getStringField("OCTAVE", script);
	var duration = script.getNumberValue("VALUE", script);


	var noteOctave = note + octave; // 'C'+ 2 = "C2"
	//console.log('xbot_buzzer noteOctave' + note + ' ' + octave + ' ' + duration);

	if(noteOctave == "C2")
		sq.note = 65;	
	else if(noteOctave == "D2")
		sq.note = 73;
	else if(noteOctave == "E2")
		sq.note = 82;
	else if(noteOctave == "F2")
		sq.note = 87;
	else if(noteOctave == "G2")
		sq.note = 98;
	else if(noteOctave == "A2")
		sq.note = 110;
	else if(noteOctave == "B2")
		sq.note = 123;
	else if(noteOctave == "C3")
		sq.note = 131;	
	else if(noteOctave == "D3")
		sq.note = 147;
	else if(noteOctave == "E3")
		sq.note = 165;
	else if(noteOctave == "F3")
		sq.note = 175;
	else if(noteOctave == "G3")
		sq.note = 196;
	else if(noteOctave == "A3")
		sq.note = 220;
	else if(noteOctave == "B3")
		sq.note = 247;
	else if(noteOctave == "C4")
		sq.note = 262;	
	else if(noteOctave == "D4")
		sq.note = 294;
	else if(noteOctave == "E4")
		sq.note = 330;
	else if(noteOctave == "F4")
		sq.note = 349;
	else if(noteOctave == "G4")
		sq.note = 392;
	else if(noteOctave == "A4")
		sq.note = 440;
	else if(noteOctave == "B4")
		sq.note = 494;
	else if(noteOctave == "C5")
		sq.note = 523;	
	else if(noteOctave == "D5")
		sq.note = 587;
	else if(noteOctave == "E5")
		sq.note = 659;
	else if(noteOctave == "F5")
		sq.note = 698;
	else if(noteOctave == "G5")
		sq.note = 784;
	else if(noteOctave == "A5")
		sq.note = 880;
	else if(noteOctave == "B5")
		sq.note = 988;
	else if(noteOctave == "C6")
		sq.note = 1047;	
	else if(noteOctave == "D6")
		sq.note = 1175;
	else if(noteOctave == "E6")
		sq.note = 1319;
	else if(noteOctave == "F6")
		sq.note = 1397;
	else if(noteOctave == "G6")
		sq.note = 1568;
	else if(noteOctave == "A6")
		sq.note = 1760;
	else if(noteOctave == "B6")
		sq.note = 1976;
	else if(noteOctave == "C7")
		sq.note = 2093;	
	else if(noteOctave == "D7")
		sq.note = 2349;
	else if(noteOctave == "E7")
		sq.note = 2637;
	else if(noteOctave == "F7")
		sq.note = 2794;
	else if(noteOctave == "G7")
		sq.note = 3136;
	else if(noteOctave == "A7")
		sq.note = 3520;
	else if(noteOctave == "B7")
		sq.note = 3951;
	else
		sq.note = 262;	


	//sq.duration = 200; 

	duration *= 40; //  convert to mSec
	
	sq.duration =  duration;

	return script.callReturn();
};


Blockly.Blocks.xbot_lcd = {
	init: function() {
	this.setColour("#00979D");
    this.appendDummyInput()
    	.appendField('LCD')
    	.appendField(new Blockly.FieldDropdown([
    		['0',"0"],
			['1',"1"]
    		]), "LINE")
    	.appendField(Lang.Blocks.XBOT_Line)
    	.appendField(', ')
    	.appendField(Lang.Blocks.XBOT_outputValue)
    this.appendValueInput("VALUE")
    		.setCheck(['String','Number']);
	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
	this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.xbot_lcd = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var line = script.getNumberField("LINE", script);
	var str =  script.getStringValue("VALUE", script);

	if (line == 0)
	{
		sq.lcdNum = 0;
		sq.lcdTxt = str;
	}
	else if (line == 1)
	{
		sq.lcdNum = 1;
		sq.lcdTxt = str;
	}
	//console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB); 
	return script.callReturn();
};




