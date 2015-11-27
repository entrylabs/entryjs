"use strict";

Entry.Hamster = {
    PORT_MAP: {
        leftWheel: 0,
        rightWheel: 0,
        buzzer: 0,
        outputA: 0,
        outputB: 0,
        leftLed: 0,
        rightLed: 0,
        note: 0,
        ioModeA: 0,
        ioModeB: 0
	},
    setZero: function() {
        var portMap = Entry.Hamster.PORT_MAP;
        for (var port in portMap) {
          Entry.hw.sendQueue[port] = portMap[port];
        }
        Entry.hw.update();
        Entry.Hamster.tempo = 60;
    },
    tempo: 60,
    name: 'hamster'
};

//novice
Blockly.Blocks.hamster_move_forward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_forward)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_forward = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = 50;
        sq.rightWheel = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_move_backward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_backward)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_backward = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = -50;
        sq.rightWheel = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_turn_around = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_turn_around_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_turn_around_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_turn_around = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
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
        sq.leftWheel = script.leftValue;
        sq.rightWheel = script.rightValue;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.leftValue;
        delete script.rightValue;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_set_led_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_led_to_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_set_led_to_2)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.red,"4"],
      [Lang.General.yellow,"6"],
      [Lang.General.green,"2"],
      [Lang.General.skyblue,"3"],
      [Lang.General.blue,"1"],
      [Lang.General.purple,"5"],
      [Lang.General.white,"7"]
      ]), "COLOR")
    .appendField(Lang.Blocks.HAMSTER_set_led_to_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_led_to = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    var color = Number(script.getField("COLOR", script));
    if (direction == 'FRONT') {
        sq.leftLed = color;
        sq.rightLed = color;
    } else if (direction == 'LEFT')
        sq.leftLed = color;
    else
        sq.rightLed = color;

    return script.callReturn();
};

Blockly.Blocks.hamster_clear_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_clear_led_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_clear_led_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_clear_led = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    if (direction == 'FRONT') {
        sq.leftLed = 0;
        sq.rightLed = 0;
    } else if (direction == 'LEFT') sq.leftLed = 0;
    else sq.rightLed = 0;

    return script.callReturn();
};

Blockly.Blocks.hamster_beep = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_beep)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_beep = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        delete sq.note;
        sq.buzzer = 440;
        var timeValue = 0.2 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.buzzer = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_hand_found = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_hand_found);
    this.setOutput(true, 'Boolean');
    this.setInputsInline(true);
  }
};

Entry.block.hamster_hand_found = function (sprite, script) {
    var pd = Entry.hw.portData;
    return pd.leftProximity > 40 ||
        pd.rightProximity > 40;
};

//intermediate
Blockly.Blocks.hamster_move_forward_for_secs = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_forward_for_secs_1);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_forward_for_secs_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_forward_for_secs = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = 50;
        sq.rightWheel = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_move_backward_for_secs = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_backward_for_secs_1);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_move_backward_for_secs_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_backward_for_secs = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = -50;
        sq.rightWheel = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_turn_for_secs = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_turn_for_secs_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_turn_for_secs_2)
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_turn_for_secs_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_turn_for_secs = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var direction = script.getField("DIRECTION", script);
        var isLeft = direction == 'LEFT';
        script.leftValue = isLeft ? -50 : 50;
        script.rightValue = isLeft ? 50 : -50;
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = script.leftValue;
        sq.rightWheel = script.rightValue;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.leftValue;
        delete script.rightValue;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_play_note_for = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_play_note_for_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.note_c + '',"4"],
      [Lang.General.note_c + '#',"5"],
      [Lang.General.note_d + '',"6"],
      [Lang.General.note_e + 'b',"7"],
      [Lang.General.note_e + '',"8"],
      [Lang.General.note_f + '',"9"],
      [Lang.General.note_f + '#',"10"],
      [Lang.General.note_g + '',"11"],
      [Lang.General.note_g + '#',"12"],
      [Lang.General.note_a + '',"13"],
      [Lang.General.note_b + 'b',"14"],
      [Lang.General.note_b + '',"15"]
      ]), "NOTE")
    .appendField(Lang.Blocks.HAMSTER_play_note_for_2)
    .appendField(new Blockly.FieldDropdown([
      ['1',"1"],
      ['2',"2"],
      ['3',"3"],
      ['4',"4"],
      ['5',"5"],
      ['6',"6"],
      ['7',"7"]
      ]), "OCTAVE")
    .appendField(Lang.Blocks.HAMSTER_play_note_for_3)
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_play_note_for_4)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_play_note_for = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var note = script.getNumberField("NOTE", script);
        var octave = script.getNumberField("OCTAVE", script);
        var beat = script.getNumberValue("VALUE", script);
        var tempo = Entry.Hamster.tempo;
        note += (octave-1)*12;
        var timeValue = beat*60*1000/tempo;
        script.note = note;

        script.isStart = true;
        script.timeFlag = 1;
        if (timeValue > 100) {
            setTimeout(function() {
                sq.note = 0;
            }, timeValue-100);
        }
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.note = script.note;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.note;
        Entry.engine.isContinue = false;
        sq.note = 0;
        return script.callReturn();
    }

};

Blockly.Blocks.hamster_rest_for = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_rest_for_1)
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_rest_for_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_rest_for = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue('VALUE');
        timeValue = timeValue*60*1000/Entry.Hamster.tempo;
        sq.note = 0;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.isStart;
        delete script.timeFlag;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_change_tempo_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_tempo_by_1);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_tempo_by_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_tempo_by = function (sprite, script) {
    Entry.Hamster.tempo += script.getNumberValue('VALUE');
    return script.callReturn();
};

Blockly.Blocks.hamster_set_tempo_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_tempo_to_1);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_tempo_to_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_tempo_to = function (sprite, script) {
    Entry.Hamster.tempo = script.getNumberValue('VALUE');
    return script.callReturn();
};

Blockly.Blocks.hamster_change_both_wheels_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_1);
    this.appendValueInput("LEFT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_2)
    this.appendValueInput("RIGHT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_both_wheels_by = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var pd = Entry.hw.portData;
    var left = sq.leftWheel != undefined ?
        sq.leftWheel : pd.leftWheel;
    var right = sq.rightWheel != undefined ?
        sq.rightWheel : pd.rightWheel;

    left += script.getNumberValue('LEFT');
    right += script.getNumberValue('RIGHT');

    sq.leftWheel = left;
    sq.rightWheel = right;

    return script.callReturn();
};

Blockly.Blocks.hamster_set_both_wheels_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_1);
    this.appendValueInput("LEFT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_2);
    this.appendValueInput("RIGHT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_both_wheels_to = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    sq.leftWheel = script.getNumberValue('LEFT');
    sq.rightWheel = script.getNumberValue('RIGHT');
    return script.callReturn();
};

Blockly.Blocks.hamster_change_wheels_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_wheels_by_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_change_wheels_by_2);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_wheels_by_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_wheels_by = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var pd = Entry.hw.portData;
    var direction = script.getField('DIRECTION');
    var value = script.getNumberValue('VALUE');

    if (direction == 'LEFT') {
        sq.leftWheel = sq.leftWheel != undefined ?
            sq.leftWheel + value : pd.leftWheel + value;
    } else if (direction == 'RIGHT')
        sq.rightWheel = sq.rightWheel != undefined ?
            sq.rightWheel + value : pd.rightWheel + value;
    else {
        sq.leftWheel = sq.leftWheel != undefined ?
            sq.leftWheel + value : pd.leftWheel + value;
        sq.rightWheel = sq.rightWheel != undefined ?
            sq.rightWheel + value : pd.rightWheel + value;
    }

    return script.callReturn();
};

Blockly.Blocks.hamster_set_wheels_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_wheels_to_1)
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.left,"LEFT"],
      [Lang.General.right,"RIGHT"],
      [Lang.General.both,"FRONT"]
      ]), "DIRECTION")
    .appendField(Lang.Blocks.HAMSTER_set_wheels_to_2);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_wheels_to_3)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_wheels_to = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField('DIRECTION');
    var value = script.getNumberValue('VALUE');

    if (direction == 'LEFT') sq.leftWheel = value;
    else if (direction == 'RIGHT') sq.rightWheel = value;
    else {
        sq.leftWheel = value;
        sq.rightWheel = value;
    }

    return script.callReturn();
};

Blockly.Blocks.hamster_stop = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_stop)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_stop = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    sq.leftWheel = 0;
    sq.rightWheel = 0;

    return script.callReturn();
};

Blockly.Blocks.hamster_change_buzzer_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_buzzer_by_1);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_change_buzzer_by_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_buzzer_by = function (sprite, script) {
    var hw = Entry.hw,
        sq = hw.sendQueue,
        pd = hw.portData;
        value = script.getNumberValue('VALUE');
    delete sq.note;
    sq.buzzer = sq.buzzer == undefined ?
        value : sq.buzzer + value;
    return script.callReturn();
};

Blockly.Blocks.hamster_set_buzzer_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_buzzer_to_1);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_set_buzzer_to_2)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_buzzer_to = function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    delete sq.note;
    sq.buzzer = script.getNumberValue('VALUE');
    return script.callReturn();
};

Blockly.Blocks.hamster_clear_buzzer = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_clear_buzzer)
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_clear_buzzer = function (sprite, script) {
    Entry.hw.sendQueue.buzzer = 0;
    return script.callReturn();
};

Blockly.Blocks.hamster_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('')
    .appendField(new Blockly.FieldDropdown([
      [Lang.Blocks.HAMSTER_sensor_leftProximity ,"leftProximity"],
      [Lang.Blocks.HAMSTER_sensor_rightProximity,"rightProximity"],
      [Lang.Blocks.HAMSTER_sensor_leftFloor     ,"leftFloor"],
      [Lang.Blocks.HAMSTER_sensor_rightFloor    ,"rightFloor"],
      [Lang.Blocks.HAMSTER_sensor_accelerationX ,"accelerationX"],
      [Lang.Blocks.HAMSTER_sensor_accelerationY ,"accelerationY"],
      [Lang.Blocks.HAMSTER_sensor_accelerationZ ,"accelerationZ"],
      [Lang.Blocks.HAMSTER_sensor_light         ,"light"],
      [Lang.Blocks.HAMSTER_sensor_temperature   ,"temperature"],
      [Lang.Blocks.HAMSTER_sensor_signalStrength,"signalStrength"],
      [Lang.Blocks.HAMSTER_sensor_inputA        ,"inputA"],
      [Lang.Blocks.HAMSTER_sensor_inputB        ,"inputB"]
      ]), "PORT");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.hamster_value = function (sprite, script) {
    var hw = Entry.hw,
        sq = hw.sendQueue,
        pd = hw.portData,
        port = script.getField('PORT');

    return sq[port] != undefined ?
        sq[port] : pd[port]
};

/*
Blockly.Blocks.hamster_set_port_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_)
    .appendField(new Blockly.FieldDropdown([
      ['A',"LEFT"],
      ['B',"RIGHT"],
      ['A와B',"LEFT"]
      ]), "PORT")
    .appendField(Lang.Blocks.HAMSTER_)
    .appendField(new Blockly.FieldDropdown([
      ['아날로그 입력',"LEFT"],
      ['디지털 입력',"RIGHT"],
      ['서보 출력',"LEFT"],
      ['PWM 출력',"LEFT"],
      ['디지털 출력',"LEFT"]
      ]), "METHOD")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_port_to = function (sprite, script) {
    var port = script.getField('PORT');
    var method = script.getField('METHOD');
};

Blockly.Blocks.hamster_change_output_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_)
    .appendField(new Blockly.FieldDropdown([
      ['A',"LEFT"],
      ['B',"RIGHT"],
      ['A와B',"LEFT"]
      ]), "PORT")
    .appendField(Lang.Blocks.HAMSTER_);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_)
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_output_by = function (sprite, script) {
};

Blockly.Blocks.hamster_set_output_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_)
    .appendField(new Blockly.FieldDropdown([
      ['A',"LEFT"],
      ['B',"RIGHT"],
      ['A와B',"LEFT"]
      ]), "PORT")
    .appendField(Lang.Blocks.HAMSTER_);
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField(Lang.Blocks.HAMSTER_)
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_output_to = function (sprite, script) {
};
*/
