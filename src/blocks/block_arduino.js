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
        width: 605,
        height: 434,
        listPorts: {
            "2":{name: Lang.Hw.port_en + " 2 " + Lang.Hw.port_ko, type: "input", pos: {x : 0, y: 0}},
            "3":{name: Lang.Hw.port_en + " 3 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "4":{name: Lang.Hw.port_en + " 4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "5":{name: Lang.Hw.port_en + " 5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "6":{name: Lang.Hw.port_en + " 6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "7":{name: Lang.Hw.port_en + " 7 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "8":{name: Lang.Hw.port_en + " 8 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "9":{name: Lang.Hw.port_en + " 9 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "10":{name: Lang.Hw.port_en + " 10 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "11":{name: Lang.Hw.port_en + " 11 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "12":{name: Lang.Hw.port_en + " 12 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "13":{name: Lang.Hw.port_en + " 13 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a0":{name: Lang.Hw.port_en + " A0 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a1":{name: Lang.Hw.port_en + " A1 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a2":{name: Lang.Hw.port_en + " A2 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a3":{name: Lang.Hw.port_en + " A3 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a4":{name: Lang.Hw.port_en + " A4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a5":{name: Lang.Hw.port_en + " A5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}}
        },
        mode : 'both'

    }
};

Entry.SensorBoard = {
    name: 'sensorBoard',
    setZero: Entry.Arduino.setZero
};

Entry.dplay = {
    name: 'dplay',
    vel_value : 255,
    setZero: Entry.Arduino.setZero,
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
    }
};

Entry.nemoino = {
    name: 'nemoino',
    setZero: Entry.Arduino.setZero
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

Entry.block.arduino_download_connector = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "연결 프로그램 다운로드",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download connector');
            }
        ]
    }
};

Entry.block.arduino_download_source = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "엔트리 아두이노 소스",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download source');
            }
        ]
    }
};

Entry.block.arduino_connected = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "연결 됨",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download source');
            }
        ]
    }
};


Entry.block.arduino_reconnect = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "다시 연결하기",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download source');
            }
        ]
    }
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

Blockly.Blocks.dplay_select_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_pin_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['7',"7"],
          ['8',"8"],
          ['9',"9"],
          ['10',"10"]
          ]), "PORT")
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_1);
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

Entry.block.dplay_select_led = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port = 7;
    if (port1 == "7") port = 7;
    else if (port1 == "8") port = 8;
    else if (port1 == "9") port = 9;
    else if (port1 == "10") port = 10;
    var operator = script.getField("OPERATOR");
    var value = operator == "on" ? 255 : 0;
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.dplay_get_switch_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("디지털 ");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['2',"2"],
          ['4',"4"]
          ]), "PORT")
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_2)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.dplay_string_5,"ON"],
          [Lang.Blocks.dplay_string_6,"OFF"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.dplay_get_switch_status = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port = 2;
    if (port1 == "2") port = 2;
    else if (port1 == "4") port = 4;
    var value1 = script.getField("STATUS");
    if (value1 == "OFF") return Entry.hw.getDigitalPortValue(port) == 1 ? 1 : 0;
    else return Entry.hw.getDigitalPortValue(port) == 0 ? 1 : 0;
};

Blockly.Blocks.dplay_get_light_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_light)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.dplay_string_3,"BRIGHT"],
          [Lang.Blocks.dplay_string_4,"DARK"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.dplay_get_light_status = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 1;
    if (value1 == "DARK") return Entry.hw.getAnalogPortValue(value2) > 800 ? 1 : 0;
    else return Entry.hw.getAnalogPortValue(value2) < 800 ? 1 : 0;
};

Blockly.Blocks.dplay_get_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_3);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField("번 ");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['가변저항',"ADJU"],
          ['빛센서',"LIGHT"],
          ['온도센서',"TEMP"],
          ['조이스틱 X',"JOYS"],
          ['조이스틱 Y',"JOYS"],
          ['적외선',"INFR"]
          ]), "OPERATOR")
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_5)
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.dplay_get_value = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    return Entry.hw.getAnalogPortValue(signal[1]);
};

Blockly.Blocks.dplay_get_tilt = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_tilt)
        .appendField(new Blockly.FieldDropdown([
          ['왼쪽 기울임',"LEFT"],
          ['오른쪽 기울임',"LIGHT"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.dplay_get_tilt = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 12;
    if (value1 == "LIGHT") return Entry.hw.getDigitalPortValue(value2) == 1 ? 1 : 0;
    else return Entry.hw.getDigitalPortValue(value2) == 0 ? 1 : 0;
};

Blockly.Blocks.dplay_DCmotor = {
    init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['왼쪽',"3"],
          ['오른쪽',"6"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(' DC모터 상태를');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['정방향',"FRONT"],
          ['역방향',"REAR"],
          ['정지',"OFF"]
          ]), "OPERATOR")
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_DCmotor = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port2 = 0;
    if (port1 == "3") port2 = 5;
    else if (port1 == "6") port2 = 11;
    var operator = script.getField("OPERATOR");
    var value1 = 0;
    var value2 = 0;
    if (operator == "FRONT") {
        value1 = 255;
        value2 = 0;
    }
    else if (operator == "REAR") {
        value1 = 0;
        value2 = 255;
    }
    else if (operator == "OFF") {
        value1 = 0;
        value2 = 0;
    }
    Entry.hw.setDigitalPortValue(port1, value1);
    Entry.hw.setDigitalPortValue(port2, value2);
    return script.callReturn();
};

Blockly.Blocks.dplay_buzzer = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('부저를 ');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['도',"1"],
          ['레',"2"],
          ['미',"3"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField('로');
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField('박자로 연주하기');
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_buzzer = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port = 2;
    if (port1 == "1") port = 2;
    else if (port1 == "2") port = 4;
    else if (port1 == "3") port = 7;
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 100);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.dplay_servo = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('서보모터 각도를');
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField('로 이동');
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_servo = function (sprite, script) {
    var port = 9;
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 180);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};
