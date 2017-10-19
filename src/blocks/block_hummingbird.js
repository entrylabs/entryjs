"use strict";

Entry.hummingbird = {	

	PORT_MAP: {
		triLEDR1: 256, //D7
		triLEDG1: 256, //D4
		triLEDB1: 256, //D12
		triLEDR2: 256, //D11
		triLEDG2: 256, //D6
        triLEDB2: 256, //D5	
		led1: 256, //D3
		led2: 256, //D2
		led3: 256, //HWB
		led4: 256, //A0
		vibrat1: 256, //D9
		vibrat2: 256, //D10
		dcMotor1: 256, //spi
		dcMotor2: 256, //spi
		//servo1: 256,  //spi
		//servo2: 256,  //spi
		//servo3: 256, //spi
		//servo4: 256  //spi
	},
	setZero: function() {
		var portMap = Entry.hummingbird.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var hummingbird = Entry.hummingbird;
		hummingbird.removeAllTimeouts();
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

	//장치이름, 부사장님과 상의가 필요 일단 허밍버드로
	name: 'hummingbird'
};


//sensor
//각센서는 adc1~4로 잠정적으로 명칭하였습니다.
Blockly.Blocks.hummingbird_sensorValue = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField('')
		.appendField(new Blockly.FieldDropdown([
			["1", "adc1"],
			["2", "adc2"],
			["3", "adc3"],
			["4", "adc4"],
		]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Number');
	}
};


Entry.block.hummingbird_sensorValue = function (sprite, script) {
	var pd = Entry.hw.portData;
	var dev = script.getField('DEVICE');
	return pd[dev];
};


//진동모터
//진동모터 이름은 하드웨어쪽에서 이름이 정해지기 전에 일단 viveMotor1,2로 명칭하였습니다.
Blockly.Blocks.hummingbird_viveMotor = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.hummingbird_analog)
			.appendField(new Blockly.FieldDropdown([
					["1", "viveMotor1"],
					["2", "viveMotor2"]
				]), "DEVICE")
			.appendField(Lang.Blocks.hummingbird_pin_Output_Value)
		this.appendValueInput("VALUE")
    		.setCheck(["Number", "String"]);
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hummingbird_viveMotor = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var dev = script.getStringField("DEVICE", script);
	var value = script.getNumberValue("VALUE", script);
	
	if (dev == 'viveMotor1')
	{
		sq.vibrat1 = value;
	}
	
	else if(dev == 'viveMotor2')
	{
		sq.vibrat2 = value;
	}	
	
	return script.callReturn();
};

//서보모터
Blockly.Blocks.hummingbird_servo = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField("서보모터")
			.appendField(new Blockly.FieldDropdown([
				["1번서보", servo1],
				["2번서보", servo2],
                ["3번서보", servo3],
                ["4번서보", servo4]                
            ]), "DEVICE")
			.appendField("각도")
		this.appendValueInput("VALUE")
    		.setCheck(["Number", "String"]);
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true)
	}
};


Entry.block.hummingbird_servo = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var mtype = script.getStringField("DEVICE", script);
	var angle = script.getNumberValue("VALUE", script);

	if(mtype == 'servo1')
	{
		sq.servo1 = angle;
	}
	else if(mtype == 'servo2')
	{
		sq.servo2 = angle;
	}
	else if(mtype == 'servo3')
	{
		sq.servo3 = angle;
    }
    else if(mtype == 'servo4')
        {
            sq.servo4 = angle;
        }
	return script.callReturn();
};

//DCmotor
Blockly.Blocks.hummingbird_dcMotor = {
	init: function() {
		this.setColour("#00979D");
		this.appendDummyInput()
		.appendField("DC모터")
		.appendField(new Blockly.FieldDropdown([
				["1번 DC모터", "dcMotor1"],
                ["2번 DC모터", "dcMotor2"]
				]), "DEVICE")		
		.appendField(Lang.Blocks.hummingbird_speed)
		this.appendValueInput("VALUE")
    		.setCheck(["Number", "String"]);
    	this.appendDummyInput()
    		.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.hummingbird_dcMotor = function (sprite, script) {
	var sq = Entry.hw.sendQueue;
	var dir = script.getStringField("DEVICE", script);
	var speed =script.getNumberValue('VALUE', script);

	if (dir == 'dcMotor1')
		sq.dcMotor1 = speed;	
	else if (dir == 'dcMotor2')
		sq.dcMotor2 = speed;
	return script.callReturn();
};

//triLED
//드랍다운으로 led 번호 선택, rgb필드 입력
Blockly.Blocks.hummingbird_triLED = {
    init: function() {
    	this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("TriLED")
        .appendField(new Blockly.FieldDropdown([
            ["1번", "triLED1"],
            ["2번", "triLED2"]
            ]), "DEVICE")	
        this.appendValueInput("red")
        .appendField("cRED")        
        .setCheck(["Number", "String"]);
        this.appendValueInput("green")
        .appendField("cGREEN")        
        .setCheck(["Number", "String"]);
        this.appendValueInput("blue")
        .appendField("cBLUE")        
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
    }    
};


Entry.block.hummingbird_triLED = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var ledtype = script.getStringField("DEVICE", script);
    var colorRed = script.getNumberValue("cRED", script);
    var colorGreen = script.getNumberValue("cGREEN", script);
    var colorBlue = script.getNumberValue("cBLUE", script);
            
    if(ledtype == 'triLED1')
    {
        sq.triLEDR1 = colorRed;
        sq.triLEDG1 = colorGreen;
        sq.triLEDB1 = colorBlue;
        }
    else if(ledtype == 'triLED2')
    {
        sq.triLEDR2 = colorRed;
        sq.triLEDG2 = colorGreen;
        sq.triLEDB2 = colorBlue;
        }
    return script.callReturn();
    };

    Blockly.Blocks.hummingbird_triLED = {
        init: function() {
            this.setColour("#00979D");
            this.appendDummyInput()
            .appendField("TriLED")
            .appendField(new Blockly.FieldDropdown([
                ["1번", "triLED1"],
                ["2번", "triLED2"]
                ]), "DEVICE")	
            this.appendValueInput("red")
            .appendField("cRED")        
            .setCheck(["Number", "String"]);
            this.appendValueInput("green")
            .appendField("cGREEN")        
            .setCheck(["Number", "String"]);
            this.appendValueInput("blue")
            .appendField("cBLUE")        
            .setCheck(["Number", "String"]);
            this.appendDummyInput()
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }    
    };



//led
//드랍다운으로 led 번호 선택, value필드 입력
Blockly.Blocks.hummingbird_led = {
    init: function() {
    	this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("LED")
        .appendField(new Blockly.FieldDropdown([
            ["1번", "led1"],
            ["2번", "led2"],
            ["3번", "led3"],
            ["4번", "led4"],
            ]), "DEVICE")	
        this.appendValueInput("값")
        .appendField("ledValue")        
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
    }    
};


Entry.block.hummingbird_led = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var ledtype = script.getStringField("DEVICE", script);
    var value = script.getNumberValue("ledValue", script);

    if(ledtype == 'led1')
    {
        sq.led1 = value;
    }
    else if(ledtype == 'led2')
    {
        sq.led2 = value;
    }
    else if(ledtype == 'led3')
    {
        sq.led3 = value;
    }
    else if(ledtype == 'led4')
    {
        sq.led4 = value;
    }
    return script.callReturn();
};