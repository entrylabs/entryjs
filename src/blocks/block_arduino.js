"use strict";

Entry.Arduino = {
    name: 'arduino',
    setZero: function() {
        for (var port = 0; port < 14; port++) {
          Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update();
    }
};


Blockly.Blocks.arduino_text = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Arduino"), "NAME");
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_text = function (sprite, script) {
    return script.getStringField("NAME");
};

Blockly.Blocks.arduino_send = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_send_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_send_2);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.arduino_send = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
    xmlHttp.send(String(signal));
    Entry.assert(xmlHttp.status == 200, "arduino is not connected");
    return script.callReturn();
};


Blockly.Blocks.arduino_get_string = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_string_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_string_2);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_number = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
    xmlHttp.send(String(signal));
    Entry.assert(xmlHttp.status == 200, "arduino is not connected");
    var data = xmlHttp.responseText;
    return Number(data);
};

Blockly.Blocks.arduino_get_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_number_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_number_2);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_string = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
    xmlHttp.send(String(signal));
    Entry.assert(xmlHttp.status == 200, "arduino is not connected");
    var data = xmlHttp.responseText;
    return data;
};

//new blocks here
Blockly.Blocks.arduino_get_sensor_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_2,"A2"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_3,"A3"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_4,"A4"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_sensor_number = function (sprite, script) {
    return script.getStringField("PORT");
}

Blockly.Blocks.arduino_get_port_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['0',"0"],
          ['1',"1"],
          ['2',"2"],
          ['3',"3"],
          ['4',"4"],
          ['5',"5"],
          ['6',"6"],
          ['7',"7"],
          ['8',"8"],
          ['9',"9"],
          ['10',"10"],
          ['11',"11"],
          ['12',"12"],
          ['13',"13"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(' ');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_port_number = function (sprite, script) {
    return script.getStringField("PORT");
}


Blockly.Blocks.arduino_get_pwm_port_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['3',"3"],
          ['5',"5"],
          ['6',"6"],
          ['9',"9"],
          ['10',"10"],
          ['11',"11"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_pwm_port_number = function (sprite, script) {
    return script.getStringField("PORT");
}

Blockly.Blocks.arduino_get_number_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        //.appendField('번 센서값');
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_2);
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.arduino_get_number_sensor_value = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    return Entry.hw.getAnalogPortValue(signal[1]);
};

Blockly.Blocks.arduino_get_digital_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_get_digital_value_1);
    this.appendValueInput("VALUE")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_2);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.arduino_get_digital_value = function (sprite, script) {
    var signal = script.getNumberValue("VALUE", script);
    return Entry.hw.getDigitalPortValue(signal);
};

Blockly.Blocks.arduino_toggle_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_pin_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        //.appendField('번 LED');
        .appendField(Lang.Blocks.ARDUINO_num_pin_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_on,"on"],
          [Lang.Blocks.ARDUINO_off,"off"]
          ]), "OPERATOR")
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino_v1.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.arduino_toggle_led = function (sprite, script) {
    var port = script.getNumberValue("VALUE");
    var operator = script.getField("OPERATOR");
    var value = operator == "on" ? 255 : 0;
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.arduino_toggle_pwm = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_toggle_pwm_1);
    this.appendValueInput("PORT")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_toggle_pwm_2);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_toggle_pwm_3);
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino_v1.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.arduino_toggle_pwm = function (sprite, script) {
    var port = script.getNumberValue("PORT");
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 255);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.arduino_convert_scale = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_1);
    this.appendValueInput("VALUE1")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_2);
    this.appendValueInput("VALUE2")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_3);
    this.appendValueInput("VALUE3")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_4);
    this.appendValueInput("VALUE4")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_5);
    this.appendValueInput("VALUE5")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_6);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_convert_scale = function (sprite, script) {
    var value1 = script.getNumberValue("VALUE1", script);
    var value2 = script.getNumberValue("VALUE2", script);
    var value3 = script.getNumberValue("VALUE3", script);
    var value4 = script.getNumberValue("VALUE4", script);
    var value5 = script.getNumberValue("VALUE5", script);
    var result = value1;
    if (value2 > value3) {
        var swap = value2;
        value2 = value3;
        value3 = swap;
    }
    if (value4 > value5) {
        var swap = value4;
        value4 = value5;
        value5 = swap;
    }
    result -= value2;
    result = result * ((value5 - value4) / (value3 - value2));
    result += value4;
    result = Math.min(value5, result);
    result = Math.max(value4, result);
    return Math.round(result);
};

