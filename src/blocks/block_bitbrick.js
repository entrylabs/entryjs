"use strict";

Blockly.Blocks.bitbrick_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("")
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT")
        .appendField(" 값");
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_sensor_value = function (sprite, script) {
};

Blockly.Blocks.bitbrick_is_touch_pressed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("터치센서")
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT")
        .appendField(" 가 눌렸는가?");
    this.setOutput(true, 'Boolean');
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_is_touch_pressed = function (sprite, script) {
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
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT")
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
};

Blockly.Blocks.bitbrick_dc_direction_speed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("DC 모터")
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT")
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
};

Blockly.Blocks.bitbrick_servomotor_angle = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("서보 모터")
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT")
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
};
