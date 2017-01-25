"use strict";

Entry.robotori = {
	PORT_MAP:{
		A0: 0,
		A1: 0,
		A2: 0,
		A3: 0,
		A4: 0,
		A5: 0,
		D2: 0,
		D3: 0,
		D10: 0,
		D11: 0,
		D12: 0,
		D13: 0,
		AOUT5: 0,
		AOUT6: 0,
		AOUT9: 0,
		SERVO: 90,
		rightMotor: 0,
		leftMotor: 0
	},
	setZero: function() {
		//Entry.hw.sendQueue.readablePorts = [];
	
		var portMap = Entry.robotori.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
			//sq[portMap[port] = 0;

			//Entry.hw.sendQueue.readablePorts.push(port);
		}
		Entry.hw.update();
		var Robotori = Entry.robotori;
	},
	name: 'robotori',
	monitorTemplate: {
        imgPath: "hw/robotori.png",
        width: 395,
        height: 372,
        listPorts: {
            "A0":{name: "A0", type: "input", pos: {x: 0, y: 0}},
            "A1":{name: "A1", type: "input", pos: {x: 0, y: 0}},
            "A2":{name: "A2", type: "input", pos: {x: 0, y: 0}},
            "A3":{name: "A3", type: "input", pos: {x: 0, y: 0}},
            "A4":{name: "A4", type: "input", pos: {x: 0, y: 0}},
            "A5":{name: "A5", type: "input", pos: {x: 0, y: 0}},
            "D2":{name: "D2", type: "input", pos: {x: 0, y: 0}},
            "D3":{name: "D3", type: "input", pos: {x: 0, y: 0}},
        },
        mode: 'both'
    }
};



Blockly.Blocks.robotori_digitalInput = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			[Lang.Blocks.robotori_D2_Input, "D2"],
			[Lang.Blocks.robotori_D3_Input, "D3"]
		]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Boolean');
	}
};

Entry.block.robotori_digitalInput = function (sprite, script) {
	var pd = Entry.hw.portData;
	var dev = script.getField('DEVICE');
	//console.log("dev"+dev + "pd" + pd[dev]);
	return pd[dev];
};

Blockly.Blocks.robotori_digitalOutput = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField("Digital Out")
			.appendField(new Blockly.FieldDropdown([
				[Lang.Blocks.robotori_D10_Output, "D10"],
				[Lang.Blocks.robotori_D11_Output, "D11"],
				[Lang.Blocks.robotori_D12_Output, "D12"],
				[Lang.Blocks.robotori_D13_Output, "D13"],
			]), "DEVICE")
			.appendField("pin")
			.appendField(new Blockly.FieldDropdown([
				[Lang.Blocks.robotori_On, "ON"],
				[Lang.Blocks.robotori_Off, "OFF"],
				]),"VALUE")
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true)
	}
};


Entry.block.robotori_digitalOutput = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var dev = script.getStringField("DEVICE", script);
	var value = script.getStringField('VALUE', script);

	if (dev == 'D10' && value == 'ON')
	{
		sq.D10 = 1;
	}
	else
	{
		sq.D10 = 0;
	}

	if (dev == 'D11' && value == 'ON')
	{
		sq.D11 = 1;
	}
	else
	{
		sq.D11 = 0;
	}

	if (dev == 'D12' && value == 'ON')
	{
		sq.D12 = 1;
	}
	else
	{
		sq.D12 = 0;
	}

	if (dev == 'D13' && value == 'ON')
	{
		sq.D13 = 1;
	}
	else
	{
		sq.D13 = 0;
	}
	//sq.D13 = 1;
	return script.callReturn();
};


//add

Blockly.Blocks.robotori_analogInput = {
  init:function() {
  this.setColour("#00979D");
  this.appendDummyInput()
  	  .appendField("")
  	  .appendField(new Blockly.FieldDropdown([
  	               [Lang.Blocks.robotori_A0_Input, "A0"], 
  	               [Lang.Blocks.robotori_A1_Input, "A1"], 
  	               [Lang.Blocks.robotori_A2_Input, "A2"], 
  	               [Lang.Blocks.robotori_A3_Input, "A3"], 
  	               [Lang.Blocks.robotori_A4_Input, "A4"], 
  	               [Lang.Blocks.robotori_A5_Input, "A5"]
  	  ]), "DEVICE");
  this.setInputsInline(true);
  this.setOutput(true, "Number");
}};


Entry.block.robotori_analogInput = function(sprite, script) {
  var pd = Entry.hw.portData;
  var dev  = script.getField("DEVICE");
  return pd[dev];
};


Blockly.Blocks.robotori_analogOutput = {
  init:function() {
  this.setColour("#00979D");
  this.appendDummyInput()
      .appendField(Lang.Blocks.robotori_analog)
      .appendField(new Blockly.FieldDropdown([
                  [Lang.Blocks.robotori_analog5, "AOUT5"], 
                  [Lang.Blocks.robotori_analog6, "AOUT6"], 
                  [Lang.Blocks.robotori_analog9, "AOUT9"]
      ]), "DEVICE")
      .appendField(Lang.Blocks.robotori_pin_OutputValue);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
}};

Entry.block.robotori_analogOutput = function(sprite, script) {
  var sq = Entry.hw.sendQueue;
  var dev = script.getStringField("DEVICE", script);
  var value = script.getNumberValue("VALUE", script);

  if( dev == "AOUT5" )
  {
  	sq.AOUT5 = value;
  }
  if( dev == "AOUT6" )
  {
  	sq.AOUT6 = value;
  }
  if( dev == "AOUT9" )
  {
  	sq.AOUT9 = value;
  }
  
  return script.callReturn();
};


Blockly.Blocks.robotori_servo = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.robotori_Servo);
  this.appendValueInput("SERVO").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
}};


Entry.block.robotori_servo = function(sprite, script) {
  var sq = Entry.hw.sendQueue;
  
  sq.SERVO = script.getNumberValue("SERVO");
  return script.callReturn();
};


Blockly.Blocks.robotori_dc_direction = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput()
      .appendField(Lang.Blocks.robotori_DC)
      .appendField(new Blockly.FieldDropdown([
                   [Lang.Blocks.robotori_DC_rightmotor, "RIGHT_MOTOR"], 
                   [Lang.Blocks.robotori_DC_leftmotor, "LEFT_MOTOR"]
      ]), "DEVICE")
      .appendField(Lang.Blocks.robotori_DC_select)
      .appendField(new Blockly.FieldDropdown([
                   [Lang.Blocks.robotori_DC_STOP, "STOP"], 
                   [Lang.Blocks.robotori_DC_CW, "CW"], 
                   [Lang.Blocks.robotori_DC_CCW, "CCW"]
      ]), "VALUE");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
}};

Entry.block.robotori_dc_direction = function(sprite, script) {
  var sq = Entry.hw.sendQueue;
  var dev = script.getStringField("DEVICE", script);
  var value = script.getStringField("VALUE", script);

  if( dev == "RIGHT_MOTOR" )
  {
  	if( value == 'STOP' )
	{
		sq.RIGHT_MOTOR = 0xFF;
	}
	else if( value == 'CW' )
	{
		sq.RIGHT_MOTOR = 0x00;
	}
	else if( value == 'CCW' )
	{
		sq.RIGHT_MOTOR = 0xB4;
	}
  }

  if( dev == "LEFT_MOTOR" )
  {
  	if( value == 'STOP' )
	{
		sq.LEFT_MOTOR = 0xFF;
	}
	else if( value == 'CW' )
	{
		sq.LEFT_MOTOR = 0x00;
	}
	else if( value == 'CCW' )
	{
		sq.LEFT_MOTOR = 0xB4;
	}
  }

  return script.callReturn();
};


