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
        note: 0
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
    .appendField('앞으로 이동하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_forward = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sendQueue.leftWheel = 50;
        sendQueue.rightWheel = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sendQueue.leftWheel = 0;
        sendQueue.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_move_backward = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('뒤로 이동하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_backward = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = 1 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sendQueue.leftWheel = -50;
        sendQueue.rightWheel = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sendQueue.leftWheel = 0;
        sendQueue.rightWheel = 0;
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
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_turn_around = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
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
        sendQueue.leftWheel = script.leftValue;
        sendQueue.rightWheel = script.rightValue;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.leftValue;
        delete script.rightValue;
        Entry.engine.isContinue = false;
        sendQueue.leftWheel = 0;
        sendQueue.rightWheel = 0;
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
      ['양쪽',"FRONT"]
      ]), "DIRECTION")
    .appendField(" LED를")
    .appendField(new Blockly.FieldDropdown([
      ['빨간색',"4"],
      ['노란색',"6"],
      ['초록색',"2"],
      ['하늘색',"3"],
      ['파란색',"1"],
      ['보라색',"5"],
      ['하얀색',"7"]
      ]), "COLOR")
    .appendField(" 으로 하기")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_led_to = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    var color = Number(script.getField("COLOR", script));
    if (direction == 'FRONT') {
        sendQueue.leftLed = color;
        sendQueue.rightLed = color;
    } else if (direction == 'LEFT')
        sendQueue.leftLed = color;
    else
        sendQueue.rightLed = color;

    return script.callReturn();
};

Blockly.Blocks.hamster_clear_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"],
      ['양쪽',"FRONT"]
      ]), "DIRECTION")
    .appendField(" LED 끄기")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_clear_led = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    if (direction == 'FRONT') {
        sendQueue.leftLed = 0;
        sendQueue.rightLed = 0;
    } else if (direction == 'LEFT') sendQueue.leftLed = 0;
    else sendQueue.rightLed = 0;

    return script.callReturn();
};

Blockly.Blocks.hamster_beep = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('삐 소리내기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_beep = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        delete sendQueue.note;
        sendQueue.buzzer = 440;
        var timeValue = 0.2 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sendQueue.buzzer = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_hand_found = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("손 찾음?")
    this.setOutput(true, 'Boolean');
    this.setInputsInline(true);
  }
};

Entry.block.hamster_hand_found = function (sprite, script) {
    var portData = Entry.hw.portData;
    return portData.leftProximity > 40 || portData.rightProximity > 40;
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
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_forward_for_secs = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sendQueue.leftWheel = 50;
        sendQueue.rightWheel = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sendQueue.leftWheel = 0;
        sendQueue.rightWheel = 0;
        return script.callReturn();
    }
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
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_move_backward_for_secs = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sendQueue.leftWheel = -50;
        sendQueue.rightWheel = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sendQueue.leftWheel = 0;
        sendQueue.rightWheel = 0;
        return script.callReturn();
    }
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
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_turn_for_secs = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
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
        sendQueue.leftWheel = script.leftValue;
        sendQueue.rightWheel = script.rightValue;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.leftValue;
        delete script.rightValue;
        Entry.engine.isContinue = false;
        sendQueue.leftWheel = 0;
        sendQueue.rightWheel = 0;
        return script.callReturn();
    }
};

Blockly.Blocks.hamster_play_note_for = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['도',"4"],
      ['도#',"5"],
      ['레',"6"],
      ['미b',"7"],
      ['미',"8"],
      ['파',"9"],
      ['파#',"10"],
      ['솔',"11"],
      ['솔#',"12"],
      ['라',"13"],
      ['시b',"14"],
      ['시',"15"]
      ]), "NOTE")
    .appendField(" ")
    .appendField(new Blockly.FieldDropdown([
      ['1',"1"],
      ['2',"2"],
      ['3',"3"],
      ['4',"4"],
      ['5',"5"],
      ['6',"6"],
      ['7',"7"]
      ]), "OCTAVE")
    .appendField(' 음을')
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('박자 연주하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_play_note_for = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
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
                sendQueue.note = 0;
            }, timeValue-100);
        }
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sendQueue.note = script.note;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.note;
        Entry.engine.isContinue = false;
        sendQueue.note = 0;
        return script.callReturn();
    }

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
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_rest_for = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue('VALUE');
        timeValue = timeValue*60*1000/Entry.Hamster.tempo;
        sendQueue.note = 0;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
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
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
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
    .appendField('연주 속도를');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('BPM으로 하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
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
    .appendField('왼쪽 바퀴');
    this.appendValueInput("LEFT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('오른쪽 바퀴');
    this.appendValueInput("RIGHT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('만큼 바꾸기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_both_wheels_by = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    var portData = Entry.hw.portData;
    var left = portData.leftWheel;
    var right = portData.rightWheel;

    left += script.getNumberValue('LEFT');
    right += script.getNumberValue('RIGHT');

    sendQueue.leftWheel = left;
    sendQueue.rightWheel = right;

    return script.callReturn();
};

Blockly.Blocks.hamster_set_both_wheels_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('왼쪽 바퀴');
    this.appendValueInput("LEFT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('오른쪽 바퀴');
    this.appendValueInput("RIGHT")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('(으)로 하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_both_wheels_to = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    sendQueue.leftWheel = script.getNumberValue('LEFT');
    sendQueue.rightWheel = script.getNumberValue('RIGHT');
    return script.callReturn();
};

Blockly.Blocks.hamster_change_wheels_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('')
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"],
      ['양쪽',"FRONT"]
      ]), "DIRECTION")
    .appendField('바퀴');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('만큼 바꾸기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_wheels_by = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    var direction = script.getField('DIRECTION');
    var value = script.getNumberValue('VALUE');
    var portData = Entry.hw.portData;

    if (direction == 'LEFT')
        sendQueue.leftWheel = portData.leftWheel + value;
    else if (direction == 'RIGHT')
        sendQueue.rightWheel = portData.rightWheel + value;
    else {
        sendQueue.leftWheel = portData.leftWheel + value;
        sendQueue.rightWheel = portData.rightWheel + value;
    }

    return script.callReturn();
};

Blockly.Blocks.hamster_set_wheels_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('')
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"],
      ['양쪽',"FRONT"]
      ]), "DIRECTION")
    .appendField('바퀴');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('(으)로 하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_wheels_to = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    var direction = script.getField('DIRECTION');
    var value = script.getNumberValue('VALUE');

    if (direction == 'LEFT') sendQueue.leftWheel = value;
    else if (direction == 'RIGHT') sendQueue.rightWheel = value;
    else {
        sendQueue.leftWheel = value;
        sendQueue.rightWheel = value;
    }

    return script.callReturn();
};

Blockly.Blocks.hamster_stop = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('정지하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_stop = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    sendQueue.leftWheel = 0;
    sendQueue.rightWheel = 0;

    return script.callReturn();
};

Blockly.Blocks.hamster_change_buzzer_by = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('버저 음을');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('만큼 바꾸기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_change_buzzer_by = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    delete sendQueue.note;
    sendQueue.buzzer = Entry.hw.portData.buzzer +
        script.getNumberValue('VALUE');
    return script.callReturn();
};

Blockly.Blocks.hamster_set_buzzer_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('버저 음을');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('(으)로 하기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_buzzer_to = function (sprite, script) {
    var sendQueue = Entry.hw.sendQueue;
    delete sendQueue.note;
    sendQueue.buzzer = script.getNumberValue('VALUE');
    return script.callReturn();
};

Blockly.Blocks.hamster_clear_buzzer = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('버저 끄기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
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
      ['왼쪽 근접 센서',"leftProximity"],
      ['오른쪽 근접 센서',"rightProximity"],
      ['왼쪽 바닥 센서',"leftFloor"],
      ['오른쪽 바닥 센서',"rightFloor"],
      ['x축 가속도',"accelerationX"],
      ['y축 가속도',"accelerationY"],
      ['z축 가속도',"accelerationZ"],
      ['밝기',"light"],
      ['온도',"temperature"],
      ['신호세기',"signalStrength"],
      ['입력 A',"inputA"],
      ['입력 B',"inputB"]
      ]), "PORT")
    .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.hamster_value = function (sprite, script) {
    return Entry.hw.portData[script.getField('PORT')];
};

/*
Blockly.Blocks.hamster_set_port_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('포트')
    .appendField(new Blockly.FieldDropdown([
      ['A',"LEFT"],
      ['B',"RIGHT"],
      ['A와B',"LEFT"]
      ]), "PORT")
    .appendField('를')
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
    .appendField('출력')
    .appendField(new Blockly.FieldDropdown([
      ['A',"LEFT"],
      ['B',"RIGHT"],
      ['A와B',"LEFT"]
      ]), "PORT")
    .appendField('를');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('(으)로 하기')
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
    .appendField('출력')
    .appendField(new Blockly.FieldDropdown([
      ['A',"LEFT"],
      ['B',"RIGHT"],
      ['A와B',"LEFT"]
      ]), "PORT")
    .appendField('를');
    this.appendValueInput("VALUE")
    .setCheck(["Number", "String"]);
    this.appendDummyInput()
    .appendField('만큼 바꾸기')
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_output_to = function (sprite, script) {
};
*/
