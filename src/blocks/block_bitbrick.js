"use strict";

Entry.Bitbrick = {
  SENSOR_MAP : {
    1: "light",
    2: "IR",
    3: "touch",
    4: "potentiometer",
    20: "LED",
    19: "SERVO",
    18: "DC"
  },
  PORT_MAP : {
      "buzzer": 2,
      "5": 4,
      "6": 6,
      "7": 8,
      "8": 10,
      "LEDR": 12,
      "LEDG": 14,
      "LEDB": 16
  },
  sensorList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 0; i < 4; i++) {
      if (portData[i])
        list.push([i + ' - ' + portData[i].type, i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  touchList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 0; i < 4; i++) {
      if (portData[i] && portData[i].type === "touch")
        list.push([i + ' - ' + portData[i].type, i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  servoList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 4; i < 9; i++) {
      if (portData[i] && portData[i].type === "SERVO")
        list.push(["ABCD"[i-5], i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  dcList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 4; i < 9; i++) {
      if (portData[i] && portData[i].type === "DC")
        list.push(["ABCD"[i-5], i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  setZero: function() {
    for (var port in Entry.Bitbrick.PORT_MAP) {
      Entry.hw.sendQueue[port] = 0;
    }
    Entry.hw.update();
  }
};


Blockly.Blocks.bitbrick_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.sensorList), "PORT")
    .appendField(" 값");
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_sensor_value = function (sprite, script) {
  var port = script.getStringField("PORT");
  return Entry.hw.portData[port].value;
};

Blockly.Blocks.bitbrick_is_touch_pressed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("터치센서")
    .appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.touchList), "PORT")
    .appendField(" 가 눌렸는가?");
    this.setOutput(true, 'Boolean');
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_is_touch_pressed = function (sprite, script) {
  var port = script.getStringField("PORT");
  return Entry.hw.portData[port].value > 0;
};

Blockly.Blocks.bitbrick_turn_off_color_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('컬러 LED 끄기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_off_color_led = function (sprite, script) {
  Entry.hw.sendQueue["LEDR"] = 0;
  Entry.hw.sendQueue["LEDG"] = 0;
  Entry.hw.sendQueue["LEDB"] = 0;
  return script.callReturn();
};

Blockly.Blocks.bitbrick_turn_on_color_led_by_rgb = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('컬러 LED 켜기 R');
    this.appendValueInput("rValue")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('G');
    this.appendValueInput("gValue")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('B');
    this.appendValueInput("bValue")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_on_color_led_by_rgb = function (sprite, script) {
  var red = script.getNumberValue("rValue"),
      green = script.getNumberValue("gValue"),
      blue = script.getNumberValue("bValue");
  Entry.hw.sendQueue["LEDR"] = red;
  Entry.hw.sendQueue["LEDG"] = green;
  Entry.hw.sendQueue["LEDB"] = blue;
  return script.callReturn();
};

Blockly.Blocks.bitbrick_turn_on_color_led_by_picker = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('컬러 LED 색 ')
    .appendField(new Blockly.FieldColour('#ff0000'),'VALUE')
    .appendField('로 정하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_on_color_led_by_picker = function (sprite, script) {
  var port = script.getStringField("VALUE");
  Entry.hw.sendQueue["LEDR"] = parseInt(port.substr(1,2), 16);
  Entry.hw.sendQueue["LEDG"] = parseInt(port.substr(3,2), 16);
  Entry.hw.sendQueue["LEDB"] = parseInt(port.substr(5,2), 16);
  return script.callReturn();
};

Blockly.Blocks.bitbrick_turn_on_color_led_by_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('컬러 LED 켜기 색');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('로 정하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_on_color_led_by_value = function (sprite, script) {
};

Blockly.Blocks.bitbrick_buzzer = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('부저음 ');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('내기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_buzzer = function (sprite, script) {
  var value = script.getNumberValue("VALUE");
  Entry.hw.sendQueue["buzzer"] = value;
  return script.callReturn();
};

Blockly.Blocks.bitbrick_turn_off_all_motors = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('모든 모터 끄기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_off_all_motors = function (sprite, script) {
};

Blockly.Blocks.bitbrick_dc_speed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("DC 모터")
    .appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.dcList), "PORT")
    .appendField(" 속도");
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_dc_speed = function (sprite, script) {
  var value = script.getNumberValue("VALUE");
  var port = script.getStringField("PORT");
  Entry.hw.sendQueue[port] = value + 128;
  return script.callReturn();
};

Blockly.Blocks.bitbrick_dc_direction_speed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("DC 모터")
    .appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.dcList), "PORT")
    .appendField(" 방향")
    .appendField(new Blockly.FieldDropdown([
      ['CCW',"CCW"],
      ['CW',"CW"]
      ]), "DIRECTION")
    .appendField(" 속도");
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_dc_direction_speed = function (sprite, script) {
  var value = script.getNumberValue("VALUE");
  var isFront = script.getStringField("DIRECTION") === "CW";
  var port = script.getStringField("PORT");
  Entry.hw.sendQueue[port] = isFront ? value + 128 : 128 - value;
  return script.callReturn();
};

Blockly.Blocks.bitbrick_servomotor_angle = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("서보 모터")
    .appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.servoList), "PORT")
    .appendField(" 각도");
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_servomotor_angle = function (sprite, script) {
  var value = script.getNumberValue("VALUE");
  var port = script.getStringField("PORT");
  Entry.hw.sendQueue[port] = value;
  return script.callReturn();
};
