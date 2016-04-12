"use strict";

Entry.Arduino = {
    name: 'arduino',
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        } 
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: "hw/arduino.png",
        width: 268,
        height: 270,
        listPorts: {
            "0":{name: "0번 포트", type: "input", pos: {x : 0, y: 0}},
            "1":{name: "1번 포트", type: "input", pos: {x: 0, y: 0}},
            "2":{name: "2번 포트", type: "input", pos: {x : 0, y: 0}},
            "3":{name: "3번 포트", type: "input", pos: {x: 0, y: 0}},
            "4":{name: "4번 포트", type: "input", pos: {x: 0, y: 0}},
            "5":{name: "5번 포트", type: "input", pos: {x: 0, y: 0}},
            "6":{name: "6번 포트", type: "input", pos: {x: 0, y: 0}},
            "7":{name: "7번 포트", type: "input", pos: {x: 0, y: 0}},
            "8":{name: "8번 포트", type: "input", pos: {x: 0, y: 0}},
            "9":{name: "9번 포트", type: "input", pos: {x: 0, y: 0}},
            "10":{name: "10번 포트", type: "input", pos: {x: 0, y: 0}},
            "11":{name: "11번 포트", type: "input", pos: {x: 0, y: 0}},
            "12":{name: "12번 포트", type: "input", pos: {x: 0, y: 0}},
            "13":{name: "13번 포트", type: "input", pos: {x: 0, y: 0}},
            "a0":{name: "A0번 포트", type: "input", pos: {x: 0, y: 0}},
            "a1":{name: "A1번 포트", type: "input", pos: {x: 0, y: 0}},
            "a2":{name: "A2번 포트", type: "input", pos: {x: 0, y: 0}},
            "a3":{name: "A3번 포트", type: "input", pos: {x: 0, y: 0}},
            "a4":{name: "A4번 포트", type: "input", pos: {x: 0, y: 0}},
            "a5":{name: "A5번 포트", type: "input", pos: {x: 0, y: 0}}
        },
        mode : 'list'

    }
};

Entry.SensorBoard = {
    name: 'sensorBoard',
    setZero: Entry.Arduino.setZero,
    monitorTemplate: {
        imgPath: "hw/sensorBoard.png",
        width: 268,
        height: 270,
        listPorts: {
            "0":{name: "0번 포트", type: "input", pos: {x : 0, y: 0}},
            "2":{name: "2번 포트", type: "input", pos: {x : 0, y: 0}},
            "3":{name: "3번 포트", type: "input", pos: {x: 0, y: 0}},
            "4":{name: "4번 포트", type: "input", pos: {x: 0, y: 0}},
            "5":{name: "5번 포트", type: "input", pos: {x: 0, y: 0}},
            "a3":{name: "3번 포트", type: "input", pos: {x : 0, y: 0}},
            "a4":{name: "4번 포트", type: "input", pos: {x: 0, y: 0}},
            "a5":{name: "5번 포트", type: "input", pos: {x : 0, y: 0}},
            "6":{name: "6번 포트", type: "input", pos: {x: 0, y: 0}},
            "7":{name: "7번 포트", type: "input", pos: {x: 0, y: 0}},
            "12":{name: "12번 포트", type: "input", pos: {x: 0, y: 0}},
            "13":{name: "13번 포트", type: "input", pos: {x: 0, y: 0}}
        },
        ports : {
            "a0":{name: "마이크", type: "input",pos: {x : 130, y: 245}},
            "a1":{name: "빛 센서1", type: "input",pos: {x : 80, y: 216}},
            "a2":{name: "슬라이드", type: "input",pos: {x : 139, y: 22}},
            "0":{name: "빛 센서2", type: "input",pos: {x : 190, y: 215}},
            "1":{name: "온도", type: "input",pos: {x : 207, y: 251}},
            "8":{name: "스위치 R", type: "input",pos: {x : 180, y: 120}},
            "9":{name: "스위치 L", type: "input",pos: {x : 90, y: 143}},
            "10":{name: "스위치 U", type: "input",pos: {x : 130, y: 73}},            
            "11":{name: "스위치 D", type: "input",pos: {x : 120, y: 185}}
      },
      mode : 'both'
    }
};

Entry.CODEino = {
    name: 'CODEino',
    setZero: Entry.Arduino.setZero,
    monitorTemplate: Entry.Arduino.monitorTemplate

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
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_2)
        .appendField(" ");
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
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_2)
        .appendField(" ");
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
        .appendField(Lang.Blocks.ARDUINO_num_pin_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_on,"on"],
          [Lang.Blocks.ARDUINO_off,"off"]
          ]), "OPERATOR")
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
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
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
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
    this.appendDummyInput().appendField(" ");
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

Blockly.Blocks.sensorBoard_get_named_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldDropdown([
          ['소리',"0"],
          ['빛 감지',"1"],
          ['슬라이더',"2"],
          ['온도',"3"]
          ]), "PORT")
        .appendField(' 센서값');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.sensorBoard_get_named_sensor_value = function (sprite, script) {
    return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
};

Blockly.Blocks.sensorBoard_is_button_pressed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldDropdown([
          ['빨간',"8"],
          ['파란',"9"],
          ['노란',"10"],
          ['초록',"11"]
          ]), "PORT")
    this.appendDummyInput()
        .appendField(' 버튼을 눌렀는가?');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.sensorBoard_is_button_pressed = function (sprite, script) {
    return Entry.hw.getDigitalPortValue(script.getNumberField("PORT", script));
};

Blockly.Blocks.sensorBoard_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldDropdown([
          ['빨간',"2"],
          ['초록',"3"],
          ['파란',"4"],
          ['흰색',"5"]
          ]), "PORT")
        .appendField(' LED')
        .appendField(new Blockly.FieldDropdown([
          ['켜기',"255"],
          ['끄기',"0"]
          ]), "OPERATOR")
        .appendField(' ')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.sensorBoard_led = function (sprite, script) {
    Entry.hw.setDigitalPortValue(script.getField("PORT"),
                                 script.getNumberField("OPERATOR"));
    return script.callReturn();
};


Blockly.Blocks.CODEino_get_sensor_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_get_sensor_number_0,"A0"],
          [Lang.Blocks.CODEino_get_sensor_number_1,"A1"],
          [Lang.Blocks.CODEino_get_sensor_number_2,"A2"],
          [Lang.Blocks.CODEino_get_sensor_number_3,"A3"],
          [Lang.Blocks.CODEino_get_sensor_number_4,"A4"],
          [Lang.Blocks.CODEino_get_sensor_number_5,"A5"],
          [Lang.Blocks.CODEino_get_sensor_number_6,"A6"],
          ]), "PORT");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.CODEino_get_sensor_number = function (sprite, script) {
    return script.getStringField("PORT");
}

Blockly.Blocks.CODEino_get_named_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(' ')
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_sensor_name_0,"0"],
          [Lang.Blocks.CODEino_sensor_name_1,"1"],
          [Lang.Blocks.CODEino_sensor_name_2,"2"],
          [Lang.Blocks.CODEino_sensor_name_3,"3"],
          [Lang.Blocks.CODEino_sensor_name_4,"4"],
          [Lang.Blocks.CODEino_sensor_name_5,"5"],
          [Lang.Blocks.CODEino_sensor_name_6,"6"]
          ]), "PORT")
        .appendField(Lang.Blocks.CODEino_string_1);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.CODEino_get_named_sensor_value = function (sprite, script) {
    return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
};

Blockly.Blocks.CODEino_get_sound_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_10)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_11,"GREAT"],
          [Lang.Blocks.CODEino_string_12,"SMALL"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_get_sound_status = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 0;
    if (value1 == "GREAT") return Entry.hw.getAnalogPortValue(value2) > 600 ? 1 : 0;
    else return Entry.hw.getAnalogPortValue(value2) < 600 ? 1 : 0;
};

Blockly.Blocks.CODEino_get_light_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_13)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_14,"BRIGHT"],
          [Lang.Blocks.CODEino_string_15,"DARK"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_get_light_status = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 1;
    if (value1 == "DARK") return Entry.hw.getAnalogPortValue(value2) > 800 ? 1 : 0;
    else return Entry.hw.getAnalogPortValue(value2) < 800 ? 1 : 0;
};

Blockly.Blocks.CODEino_is_button_pressed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_2)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_3,"4"],
          [Lang.Blocks.CODEino_string_4,"17"],
          [Lang.Blocks.CODEino_string_5,"18"],
          [Lang.Blocks.CODEino_string_6,"19"],
          [Lang.Blocks.CODEino_string_7,"20"]
          ]), "PORT")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_is_button_pressed = function (sprite, script) {
    var value = script.getNumberField("PORT", script);
    if (value > 14) {
        value = value - 14;
        return !Entry.hw.getAnalogPortValue(value);
    } else return !Entry.hw.getDigitalPortValue(value);
};

Blockly.Blocks.CODEino_get_accelerometer_direction = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_8)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_16, "LEFT"],
          [Lang.Blocks.CODEino_string_17, "RIGHT"],
          [Lang.Blocks.CODEino_string_18, "FRONT"],
          [Lang.Blocks.CODEino_string_19, "REAR"],
          [Lang.Blocks.CODEino_string_20, "REVERSE"]
          ]), "DIRECTION")
    this.appendDummyInput()
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_get_accelerometer_direction = function (sprite, script) {
    var value1 = script.getField("DIRECTION", script);
    var value2 = 0;
    if (value1 == "LEFT" || value1 =="RIGHT") value2 = 3;
    else if (value1 == "FRONT" || value1 =="REAR") value2 = 4;
    else if (value1 == "REVERSE") value2 = 5;
    var value3 = Entry.hw.getAnalogPortValue(value2);
    var value4 = 265;
    var value5 = 402;
    var value6 = -90;
    var value7 = 90;
    var result = value3;
    result -= value4;
    result = result * ((value7 - value6) / (value5 - value4));
    result += value6;
    result = Math.min(value7, result);
    result = Math.max(value6, result);
    result = Math.round(result);
    if (value1 == "LEFT" || value1 == "REAR") return result < -30 ? 1 : 0;
    else if (value1 == "RIGHT" || value1 == "FRONT") return result > 30 ? 1 : 0;
    else if (value1 == "REVERSE") return result < -50 ? 1 : 0;
};

Blockly.Blocks.CODEino_get_accelerometer_value = {
  init:function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_8)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_accelerometer_X, "3"],
          [Lang.Blocks.CODEino_accelerometer_Y, "4"],
          [Lang.Blocks.CODEino_accelerometer_Z, "5"]
          ]), "PORT")
      .appendField(Lang.Blocks.CODEino_string_9);
    this.setOutput(!0, "Number");
    this.setInputsInline(!0);
  }
};

Entry.block.CODEino_get_accelerometer_value = function (sprite, script) {
    var value1 = Entry.hw.getAnalogPortValue(script.getField("PORT", script));
    var value2 = 265;
    var value3 = 402;
    var value4 = -90;
    var value5 = 90;
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
