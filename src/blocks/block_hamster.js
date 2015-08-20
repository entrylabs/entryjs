"use strict";

Entry.Hamster = {
	PORT_MAP: {
		leftWheel: 0,
		rightWheel: 0,
		buzzer: 0,
		outputA: 0,
		outputB: 0,
		topology: 0,
		leftLed: 0,
		rightLed: 0,
		note: 0,
		lineTracerMode: 0,
		lineTracerSpeed: 4,
		ioModeA: 0,
		ioModeB: 0,
		configProximity: 2,
		configGravity: 0,
		configBandWidth: 3
	},
    setZero: function() {
        for (var port in Entry.Hamster.PORT_MAP) {
          Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update();
        }
};

//novice
Blockly.Blocks.hamster_move_forward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('앞으로 이동하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_forward = function (sprite, script) {
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        Entry.hw.sendQueue['leftWheel'] = 50;
        Entry.hw.sendQueue['rightWheel'] = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        Entry.hw.sendQueue['leftWheel'] = 0;
        Entry.hw.sendQueue['rightWheel'] = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_move_backward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('뒤로 이동하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_backward = function (sprite, script) {
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        Entry.hw.sendQueue['leftWheel'] = -50;
        Entry.hw.sendQueue['rightWheel'] = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        Entry.hw.sendQueue['leftWheel'] = 0;
        Entry.hw.sendQueue['rightWheel'] = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_turn_around = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"]
      ]), "DIRECTION")
    .appendField(" 으로 돌기")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_turn_around = function (sprite, script) {
    if (!script.isStart) {
        var direction = script.getField("DIRECTION", script);
        var isLeft = direction == 'LEFT';
        script.leftValue = isLeft ? -50 : 50;
        script.rightValue = isLeft ? 50 : -50;
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        Entry.hw.sendQueue['leftWheel'] = script.leftValue;
        Entry.hw.sendQueue['rightWheel'] = script.rightValue;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.leftValue;
        delete script.rightValue;
        Entry.engine.isContinue = false;
        Entry.hw.sendQueue['leftWheel'] = 0;
        Entry.hw.sendQueue['rightWheel'] = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_set_led_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"],
      ['앞쪽',"FRONT"]
      ]), "DIRECTION")
    .appendField(" LED를")
    .appendField(new Blockly.FieldDropdown([
      ['빨간색',"4"],
      ['노란색',"6"],
      ['녹색',"2"],
      ['하늘색',"3"],
      ['파란색',"1"],
      ['보라색',"5"],
      ['하얀색',"7"]
      ]), "COLOR")
    .appendField(" 으로 하기")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_led_to = function (sprite, script) {
    var direction = script.getField("DIRECTION", script);
    var color = Number(script.getField("COLOR", script));
    if (direction == 'FRONT') {
        Entry.hw.sendQueue['leftLed'] = color;
        Entry.hw.sendQueue['rightLed'] = color;
    } else if (direction == 'LEFT')
        Entry.hw.sendQueue['leftLed'] = color;
    else
        Entry.hw.sendQueue['rightLed'] = color;

    return script.callReturn();
};

Blockly.Blocks.hamster_clear_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"]
      ]), "DIRECTION")
    .appendField(" LED 끄기")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_clear_led = function (sprite, script) {
    var direction = script.getField("DIRECTION", script);
    if (direction == 'FRONT') {
        Entry.hw.sendQueue['leftLed'] = 0;
        Entry.hw.sendQueue['rightLed'] = 0;
    } else if (direction == 'LEFT') {
        Entry.hw.sendQueue['leftLed'] = 0;
    } else {
        Entry.hw.sendQueue['rightLed'] = 0;
    }

    return script.callReturn();
};

Blockly.Blocks.hamster_beep = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('삐 소리내기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_beep = function (sprite, script) {
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 0.2 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        Entry.hw.sendQueue['buzzer'] = 440;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        Entry.hw.sendQueue['buzzer'] = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_hand_found = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("손 찾음")
    this.setOutput(true, 'Boolean');
    this.setInputsInline(true);
  }
};

Entry.block.hamster_hand_found = function (sprite, script) {
    var left = Entry.hw.portData['leftProximity'];
    var right = Entry.hw.portData['rightProximity'];

    return left > 40 || right > 40;
};

//intermediate
Blockly.Blocks.hamster_move_forward_for_secs = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('앞으로 ');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('초 이동하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_forward_for_secs = function (sprite, script) {
};

Blockly.Blocks.hamster_move_backward_for_secs = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('뒤로 ');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('초 이동하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_backward_for_secs = function (sprite, script) {
};

Blockly.Blocks.hamster_turn_for_secs = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"]
      ]), "DIRECTION")
    .appendField(' 으로')
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('초 돌기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_turn_for_secs = function (sprite, script) {
};

Blockly.Blocks.hamster_play_note_for = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['도',"0"],
      ['도#',"1"],
      ['레',"2"],
      ['미b',"3"],
      ['미',"4"],
      ['파',"5"],
      ['파#',"6"],
      ['솔',"7"],
      ['솔#',"8"],
      ['라',"9"],
      ['시b',"10"],
      ['시',"11"]
      ]), "NOTE")
    .appendField(" ")
    .appendField(new Blockly.FieldDropdown([
      ['1',"0"],
      ['2',"2"],
      ['3',"3"],
      ['4',"4"],
      ['5',"5"],
      ['6',"6"]
      ]), "DIRECTION")
    .appendField(' 음을')
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('박자 연주하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_play_note_for = function (sprite, script) {
};

Blockly.Blocks.hamster_rest_for = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('박자 쉬기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_rest_for = function (sprite, script) {
};

Blockly.Blocks.hamster_change_tempo_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('연주 속도를');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('만큼 바꾸기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_tempo_by = function (sprite, script) {
};

Blockly.Blocks.hamster_set_tempo_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('연주 속도를');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('BPM으로 하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_tempo_to = function (sprite, script) {
};

