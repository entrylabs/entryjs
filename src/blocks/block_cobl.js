"use strict";

Entry.Cobl = {
    name: 'cobl',
    setZero: function() {
        for (var port = 0; port < 14; port++) {
          Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update();
    }
};


//    ["r", "초음파 거래재기(0~400)", "ultrason"],
Blockly.Blocks.cobl_read_ultrason = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("초음파 거리재기(0~400)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_ultrason = function (sprite, script) {
//    console.log("cobl_read_ultrason");  
  return Entry.hw.getAnalogPortValue("ultrason");
};

 //   ["r", "가변저항 읽기(0~1023)", "potenmeter"],  
Blockly.Blocks.cobl_read_potenmeter = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("가변저항 읽기(0~1023)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_potenmeter = function (sprite, script) {  
  console.log("cobl_read_potenmeter");
  return Entry.hw.getAnalogPortValue("potenmeter");
};


 //   ["r", "IR1 읽기(0~1023)", "irread1"],
Blockly.Blocks.cobl_read_irread1 = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("IR1 읽기(0~1023)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_irread1 = function (sprite, script) {  
    return Entry.hw.getAnalogPortValue("potenmeter");
};

 //   ["r", "IR2 읽기(0~1023)", "irread2"],
Blockly.Blocks.cobl_read_irread2 = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("IR2 읽기(0~1023)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_irread2 = function (sprite, script) {  
    var signal = script.getValue("irread2", script);
    return Entry.hw.getAnalogPortValue("irread2");
};

 //   ["r", "조이스틱X축 읽기(1,0,-1)", "joyx"],
Blockly.Blocks.cobl_read_joyx = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("조이스틱X축 읽기(1,0,-1)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_joyx = function (sprite, script) {  
  return Entry.hw.getAnalogPortValue("joyx");
};

 //   ["r", "조이스틱Y축 읽기(1,0,-1)", "joyy"],
Blockly.Blocks.cobl_read_joyy = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("조이스틱Y축 읽기(1,0,-1)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_joyy = function (sprite, script) {  
  return Entry.hw.getAnalogPortValue("joyy");
};

 //   ["r", "센서1 읽기(0~1023)", "sens1"],
Blockly.Blocks.cobl_read_sens1 = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("센서1 읽기(0~1023)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_sens1 = function (sprite, script) {  
  return Entry.hw.getAnalogPortValue("sens1");
};

 //   ["r", "센서2 읽기(0~1023)", "sens2"],
Blockly.Blocks.cobl_read_sens2 = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("센서2 읽기(0~1023)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_sens2 = function (sprite, script) {  
  return Entry.hw.getAnalogPortValue("sens2");
};

 //   ["r", "기울기센서 읽기(0~4)", "tilt"],
Blockly.Blocks.cobl_read_tilt = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("기울기센서 읽기(0~4)");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_tilt = function (sprite, script) {  
  return Entry.hw.getAnalogPortValue("tilt");
};


Blockly.Blocks.cobl_get_port_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['1',"1"],
          ['2',"2"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(' ');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.cobl_get_port_number = function (sprite, script) {
    return script.getStringField("PORT");
};

//  ["r", "온도센서 읽기@포트%m.senNum", "temps", 1],
Blockly.Blocks.cobl_read_temps = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("온도센서 읽기@포트");
    this.appendValueInput("VALUE").setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_temps = function (sprite, script) {
//    console.log("-----temptest------")
    //var signal = script.getField("VALUE", script);
    var signal = script.getValue("VALUE", script);
    if (signal == 1)
    {
  //    console.log("-----temp1 selected ");
      return Entry.hw.getAnalogPortValue("temps1");
    }

    if (signal == 2)
    {
 //     console.log("-----temp2 selected ");
      return Entry.hw.getAnalogPortValue("temps2");
    }
      
};
//  ["r", "밝기센서 읽기@포트%m.senNum", "light", 1],
Blockly.Blocks.cobl_read_light = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("밝기센서 읽기@포트");
    this.appendValueInput("VALUE").setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.cobl_read_light = function (sprite, script) {

    var signal = script.getValue("VALUE", script);
    if (signal == 1)
    {
      return Entry.hw.getAnalogPortValue("light1");
    }

    if (signal == 2)
    {
      return Entry.hw.getAnalogPortValue("light2");
    }

};

//  ["b", "버튼센서 읽기@포트%m.senNum", "btn", 1],
Blockly.Blocks.cobl_read_btn = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("버튼센서 읽기@포트");
    this.appendValueInput("VALUE")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.cobl_read_btn = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    if (signal == 1)
    {
      return Entry.hw.getDigitalPortValue("btn1");
    }

    if (signal == 2)
    {
      return Entry.hw.getDigitalPortValue("btn2");
    }

};

// [" ", "Color LED %d.ledNum R%d.ledBright G%d.ledBright B%d.ledBright",LedControl",2,5,5,5]
Blockly.Blocks.cobl_led_control = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("Rainbow LED");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["1","1"],
          ["2","2"],
          ["3","3"]
          ]), "PORT");
    this.appendDummyInput().appendField(' ')
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["OFF","OFF"],
          ["Red","Red"],
          ["Orange","Orange"],
          ["Yellow","Yellow"],
          ["Green","Green"],
          ["Blue","Blue"],
          ["Dark Blue","Dark Blue"],
          ["Purple","Purple"],
          ["White","White"]
          ]), "OPERATOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.cobl_led_control = function (sprite, script) {
    var port = script.getStringField("PORT");
    var value = script.getStringField("OPERATOR");
    Entry.hw.setDigitalPortValue("RainBowLED_IDX", port);
    Entry.hw.setDigitalPortValue("RainBowLED_COL", value);
    return script.callReturn();
};

//  [" ", "Servo %m.servoM Angle-%n (15~165)", "Servo", 1, 90],

Blockly.Blocks.cobl_text = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField(new Blockly.FieldTextInput("cobl"), "NAME");
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.cobl_text = function (sprite, script) {
    return script.getStringField("NAME");
};

Blockly.Blocks.cobl_servo_angle_control = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("Servo");
    this.appendValueInput("PORT").setCheck(["Number", "String"]);
    this.appendDummyInput().appendField("Angle-");
    this.appendValueInput("VALUE").setCheck(["Number", "String"]);
    this.appendDummyInput().appendField("(15~165)");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.cobl_servo_angle_control = function (sprite, script) {

  console.log("servo - test");
    var port = script.getNumberValue("PORT");
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 15);
    value = Math.min(value, 165);

    if(port == 1)
    {
      console.log("servo 1  degree "+value);
      Entry.hw.setDigitalPortValue("Servo1", value);
    }
    if(port == 2)
    {
      console.log("servo 2 degree "+value);
      Entry.hw.setDigitalPortValue("Servo2", value);
    }
    return script.callReturn();
};
//  ["w", "Tone%n 시간%n MS", "Tone", 340, 1000],

//  ["w", "Melody %m.melody", "Melody", "5-Do"],
Blockly.Blocks.cobl_melody = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("Melody");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["(Low)So","L_So"],
          ["(Low)So#","L_So#"],
          ["(Low)La","L_La"],
          ["(Low)La#","L_La#"],
          ["(Low)Ti","L_Ti"],
          ["Do","Do"],
          ["Do#","Do#"],
          ["Re","Re"],
          ["Re#","Re#"],
          ["Mi","Mi"],
          ["Fa","Fa"],
          ["Fa#","Fa#"],
          ["So","So"],
          ["So#","So#"],
          ["La","La"],
          ["La#","La#"],
          ["Ti","Ti"],
          ["(High)Do","H_Do"],
          ["(High)Do#","H_Do#"],
          ["(High)Re","H_Re"],
          ["(High)R2#","H_Re#"],
          ["(High)Mi","H_Mi"],
          ["(High)Fa","H_Fa"]
          ]), "MELODY");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.cobl_melody = function (sprite, script) {
      
    var melody = script.getStringField("MELODY");
    console.log("cobl_melody"+melody);  
    Entry.hw.setDigitalPortValue("Melody", melody);
    return script.callReturn();
};





//  [" ", "DC Motor %m.DcMotor %m.forwback Speed%m.motSpeed", "DC", 1, "1.Clockwise", 3],
Blockly.Blocks.cobl_dcmotor= {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("DcMotor");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["1","1"],
          ["2","2"]
          ]), "MOTOR");
    this.appendDummyInput().appendField(" ");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["1.Clockwise","1"],
          ["2.Counter Clockwise","2"],
          ["3.Stop","3"]
          ]), "DIRECTION");
    this.appendDummyInput().appendField(" Speed");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["1","1"],
          ["2","2"],
          ["3","3"],
          ["4","4"],
          ["5","5"]
          ]), "SPEED");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.cobl_dcmotor = function (sprite, script) {
    var motor = script.getStringField("MOTOR");
    var direction = script.getStringField("DIRECTION");
    var speed = script.getStringField("SPEED");
    
    console.log("MOTOR"+motor+"  Direction"+direction+ "  speed"+speed);
    if (motor == 1) {
         Entry.hw.setDigitalPortValue("DC1_DIR", direction);
         Entry.hw.setDigitalPortValue("DC1_SPEED", speed); 
    }
    if (motor == 2) {
         Entry.hw.setDigitalPortValue("DC2_DIR", direction);
         Entry.hw.setDigitalPortValue("DC2_SPEED", speed);
    }
         return script.callReturn();
};

//  [" ", "Extention Port %m.DcMotor Level%d.motSpeed", "EXUSB", 1, 3],
Blockly.Blocks.cobl_extention_port= {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("Extention Port");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["1","1"],
          ["2","2"]
          ]), "PORT");
    this.appendDummyInput().appendField(" Level");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
          ["1","1"],
          ["2","2"],
          ["3","3"],
          ["4","4"],
          ["5","5"]
          ]), "LEVEL");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.cobl_extention_port = function (sprite, script) {
    var port = script.getStringField("PORT");
    var level = script.getStringField("LEVEL");
 
    if(port == 1)
      Entry.hw.setDigitalPortValue("EXUSB1", level);
    if(port == 2)
      Entry.hw.setDigitalPortValue("EXUSB2", level);

    return script.callReturn();
};
//  [" ", "External LED %n (1~64) R%d.ledBright G%d.ledBright B%d.ledBright", "ELED", 1, 5, 5, 5],  
Blockly.Blocks.cobl_external_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("External LED ");
    this.appendValueInput("LED").setCheck(["Number", "String"]);
    this.appendDummyInput().appendField(" (1~64)");
    this.appendDummyInput().appendField(" R ");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
      ["1","1"],
      ["2","2"],
      ["3","3"],
      ["4","4"],
      ["5","5"],
      ["6","6"],
      ["7","7"],
      ["8","8"],
      ["9","9"],
      ["10","10"]
      ]), "RED");
    this.appendDummyInput().appendField(" G ");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
      ["1","1"],
      ["2","2"],
      ["3","3"],
      ["4","4"],
      ["5","5"],
      ["6","6"],
      ["7","7"],
      ["8","8"],
      ["9","9"],
      ["10","10"]
      ]), "GREEN");
    this.appendDummyInput().appendField(" B ");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
      ["1","1"],
      ["2","2"],
      ["3","3"],
      ["4","4"],
      ["5","5"],
      ["6","6"],
      ["7","7"],
      ["8","8"],
      ["9","9"],
      ["10","10"]
      ]), "BLUE");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }

};

Entry.block.cobl_external_led = function (sprite, script) {

    var led = script.getNumberValue("LED");
    var r = script.getStringField("RED");
    var g = script.getStringField("GREEN");
    var b = script.getStringField("BLUE");

    Entry.hw.setDigitalPortValue("ELED_IDX", led);
    Entry.hw.setDigitalPortValue("ELED_R", r);
    Entry.hw.setDigitalPortValue("ELED_G", g);
    Entry.hw.setDigitalPortValue("ELED_B", b);

    return script.callReturn();
};

//  [" ", "7 Segment%n (0~9999)", "SSEG", 7777],
Blockly.Blocks.cobl_7_segment = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput().appendField("7 Segment");
    this.appendValueInput("VALUE").setCheck(["Number", "String"]);
    this.appendDummyInput().appendField("(0~9999)");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.cobl_7_segment = function (sprite, script) {
    var value = script.getNumberValue("VALUE");
      Entry.hw.setDigitalPortValue("7SEG", value);
    return script.callReturn();
};
