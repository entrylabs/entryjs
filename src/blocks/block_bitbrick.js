"use strict";

Entry.Bitbrick = {
    SENSOR_MAP : {
        1: "light",
        2: "IR",
        3: "touch",
        4: "potentiometer",
        5: "MIC",
        11: "USER INPUT",
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
    for (var i = 1; i < 5; i++) {
        var data = portData[i];
        if (data && data.value)
            list.push([i + ' - ' + data.type, i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  touchList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 1; i < 5; i++) {
        var data = portData[i];
      if (data && data.type === "touch")
        list.push([i + ' - ' + data.type, i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  servoList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 5; i < 9; i++) {
        var data = portData[i];
        if (data && data.type === "SERVO")
            list.push(["ABCD"[i-5], i.toString()]);
    }
    if (list.length == 0)
        return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  dcList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 5; i < 9; i++) {
        var data = portData[i];
        if (data && data.type === "DC")
            list.push(["ABCD"[i-5], i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  setZero: function() {
      var sq = Entry.hw.sendQueue;
      for (var port in Entry.Bitbrick.PORT_MAP)
          sq[port] = 0;
      Entry.hw.update();
  },
  name: 'bitbrick',
  servoMaxValue: 181,
  servoMinValue: 1,
  dcMaxValue: 100,
  dcMinValue: -100
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
  console.log(port);
  console.log(Entry.hw.portData[port]);
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
  return Entry.hw.portData[script.getStringField("PORT")].value === 0;
};

Blockly.Blocks.bitbrick_turn_off_color_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('컬러 LED 끄기')
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
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
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_on_color_led_by_rgb = function (sprite, script) {
    var red = script.getNumberValue("rValue"),
        green = script.getNumberValue("gValue"),
        blue = script.getNumberValue("bValue"),
        min = 0,
        max = 255,
        adjustor = Entry.adjustValueWithMaxMin,
        sq = Entry.hw.sendQueue;

    sq["LEDR"] = adjustor(red, min, max);
    sq["LEDG"] = adjustor(green, min, max);
    sq["LEDB"] = adjustor(blue, min, max);
    return script.callReturn();
};

Blockly.Blocks.bitbrick_turn_on_color_led_by_picker = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('컬러 LED 색 ')
    .appendField(new Blockly.FieldColour('#ff0000'),'VALUE')
    .appendField('로 정하기')
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
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
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_on_color_led_by_value = function (sprite, script) {
    var value = script.getNumberValue("VALUE");
    var red, green, blue;
    value = value % 200;
    if ( value < 67 ) {
        red = 200 - (value * 3);
        green = value * 3;
        blue = 0;
    } else if ( value < 134 ) {
        value = value - 67;
        red = 0;
        green = 200 - (value * 3);
        blue = value * 3;
    } else if ( value < 201 ) {
        value = value - 134;
        red = value * 3;
        green = 0;
        blue = 200 - (value * 3);
    }
    Entry.hw.sendQueue["LEDR"] = red;
    Entry.hw.sendQueue["LEDG"] = green;
    Entry.hw.sendQueue["LEDB"] = blue;
    return script.callReturn();
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
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_buzzer = function (sprite, script) {
    if (!script.isStart) {
        var value = script.getNumberValue("VALUE");
        Entry.hw.sendQueue["buzzer"] = value;
        script.isStart = true;
        return script;
    } else {
        Entry.hw.sendQueue["buzzer"] = 0;
        delete script.isStart;
        return script.callReturn();
    }
};

Blockly.Blocks.bitbrick_turn_off_all_motors = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('모든 모터 끄기')
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bitbrick_turn_off_all_motors = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var bitbrick = Entry.Bitbrick;
    bitbrick.servoList().map(function(servo){
        sq[servo[1]] = 0;
    });
    bitbrick.dcList().map(function(dc){
        sq[dc[1]] = 128;
    });
    return script.callReturn();
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
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_dc_speed = function (sprite, script) {
    var value = script.getNumberValue("VALUE");
    value = Math.min(value, Entry.Bitbrick.dcMaxValue);
    value = Math.max(value, Entry.Bitbrick.dcMinValue);

    Entry.hw.sendQueue[script.getStringField("PORT")] =
        value + 128;
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
    .appendField(" 속력");
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_dc_direction_speed = function (sprite, script) {
    var isFront = script.getStringField("DIRECTION") === "CW";
    var value = script.getNumberValue("VALUE");
    value = Math.min(value, Entry.Bitbrick.dcMaxValue);
    value = Math.max(value, 0);

    Entry.hw.sendQueue[script.getStringField("PORT")] =
        isFront ? value + 128 : 128 - value;
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
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  }
};

Entry.block.bitbrick_servomotor_angle = function (sprite, script) {
    var value = script.getNumberValue("VALUE") + 1;
    value = Math.min(value, Entry.Bitbrick.servoMaxValue);
    value = Math.max(value, Entry.Bitbrick.servoMinValue);
    Entry.hw.sendQueue[script.getStringField("PORT")] = value;
    return script.callReturn();
};
