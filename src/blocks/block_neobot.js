Entry.Neobot = {
    name: 'neobot',
    PORT_MAP : {
        "1":0,
        "2":0,
        "3":0,
        "SERVO1":0,
        "SERVO2":0,
        "SERVO1_SPEED":3,
        "SERVO2_SPEED":3,
        "LMOT":0,
        "RMOT":0,
        "note":0,
        "octave":0,
        "duration":0,
        "sound_check":0,
        "O_1":0,
        "O_2":0
    },
    setZero: function () {
        for(var port in Entry.Neobot.PORT_MAP) {
            Entry.hw.sendQueue[port] = Entry.Neobot.PORT_MAP[port];
        }
        Entry.hw.update();
    }
}

Blockly.Blocks.neobot_sensor_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
            .appendField("")
            .appendField(new Blockly.FieldDropdown([
                ['1번 포트',"1"],
                ['2번 포트',"2"],
                ['3번 포트',"3"],
                ['리모 컨',"4"]
                ]), "PORT")
            .appendField(" 값");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Entry.block.neobot_sensor_value = function (sprite, script) {
    var port = script.getStringField("PORT");
    return Entry.hw.portData[port];
};


Blockly.Blocks.neobot_turn_left = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
            .appendField('왼쪽모터를')
            .appendField(new Blockly.FieldDropdown([
                ['앞으로',"1"],
                ['뒤로',"-1"]
                ]), "DIRECTION")
            .appendField(new Blockly.FieldDropdown([
                ['느리게',"1"],
                ['보통',"2"],
                ['빠르게',"3"]
                ]), "VALUE")
            .appendField('회전')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_turn_left = function (sprite, script) {
    var port = script.getNumberField("VALUE");
    var direction = script.getNumberField("DIRECTION");
    Entry.hw.sendQueue["LMOT"] = port * direction;
    return script.callReturn();
};

Blockly.Blocks.neobot_stop_left = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
            .appendField('왼쪽모터 정지')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_stop_left = function (sprite, script) {
    Entry.hw.sendQueue["LMOT"] = 0;
    return script.callReturn();
};

Blockly.Blocks.neobot_turn_right = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('오른쪽모터를')
        .appendField(new Blockly.FieldDropdown([
            ['앞으로',"1"],
            ['뒤로',"-1"]
            ]), "DIRECTION")
        .appendField(new Blockly.FieldDropdown([
            ['느리게',"1"],
            ['보통',"2"],
            ['빠르게',"3"]
            ]), "VALUE")
        .appendField('회전')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_turn_right = function (sprite, script) {
    var port = script.getNumberField("VALUE");
    var direction = script.getNumberField("DIRECTION");
    Entry.hw.sendQueue["RMOT"] = port * direction;
    return script.callReturn();
};


Blockly.Blocks.neobot_stop_right = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
            .appendField('오른쪽모터 정지')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_stop_right = function (sprite, script) {
    Entry.hw.sendQueue["RMOT"] = 0;
    return script.callReturn();
};

Blockly.Blocks.neobot_servo_1 = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('SERVO1에 연결된 서보모터를')
        .appendField(new Blockly.FieldDropdown([
            ['빠른',"3"],
            ['보통',"2"],
            ['느린',"1"]
            ]), "SPEED")
        .appendField('속도로')
        .appendField(new Blockly.FieldDropdown([
            ['0도',"0"],
            ['10도',"1"],
            ['20도',"2"],
            ['30도',"3"],
            ['40도',"4"],
            ['50도',"5"],
            ['60도',"6"],
            ['70도',"7"],
            ['80도',"8"],
            ['90도',"9"],
            ['100도',"10"],
            ['110도',"11"],
            ['120도',"12"],
            ['130도',"13"],
            ['140도',"14"],
            ['150도',"15"],
            ['160도',"16"]
            ]), "VALUE")
        .appendField('로 이동')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_servo_1 = function (sprite, script) {
    var value = script.getNumberField("VALUE");
    var speed = script.getNumberField("SPEED");
    Entry.hw.sendQueue["SERVO1"] = value;
    Entry.hw.sendQueue["SERVO1_SPEED"] = speed;
    return script.callReturn();
};


Blockly.Blocks.neobot_servo_2 = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('SERVO2에 연결된 서보모터를')
        .appendField(new Blockly.FieldDropdown([
            ['빠른',"3"],
            ['보통',"2"],
            ['느린',"1"]
            ]), "SPEED")
        .appendField('속도로')
        .appendField(new Blockly.FieldDropdown([
            ['0도',"0"],
            ['10도',"1"],
            ['20도',"2"],
            ['30도',"3"],
            ['40도',"4"],
            ['50도',"5"],
            ['60도',"6"],
            ['70도',"7"],
            ['80도',"8"],
            ['90도',"9"],
            ['100도',"10"],
            ['110도',"11"],
            ['120도',"12"],
            ['130도',"13"],
            ['140도',"14"],
            ['150도',"15"],
            ['160도',"16"]
            ]), "VALUE")
        .appendField('로 이동')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_servo_2 = function (sprite, script) {
    var value = script.getNumberField("VALUE");
    var speed = script.getNumberField("SPEED");
    Entry.hw.sendQueue["SERVO2"] = value;
    Entry.hw.sendQueue["SERVO2_SPEED"] = speed;
    return script.callReturn();
};

Blockly.Blocks.neobot_play_note_for = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField('멜로디')
    .appendField(new Blockly.FieldDropdown([
      [Lang.General.note_c + '',"1"],
      [Lang.General.note_d + '',"2"],
      [Lang.General.note_e + '',"3"],
      [Lang.General.note_f + '',"4"],
      [Lang.General.note_g + '',"5"],
      [Lang.General.note_a + '',"6"],
      [Lang.General.note_b + '',"7"],
      [Lang.General.note_c + '',"8"]
      ]), "NOTE")
    .appendField('을(를)')
    .appendField(new Blockly.FieldDropdown([
      ['1',"0"],
      ['2',"1"],
      ['3',"2"]
      ]), "OCTAVE")
    .appendField('옥타브로')
    .appendField(new Blockly.FieldDropdown([
      ['2분음표',"2"],
      ['4분음표',"4"],
      ['8분음표',"8"]
      ]), "DURATION");
    this.appendDummyInput()
    .appendField('길이만큼 소리내기')
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.neobot_play_note_for = function (sprite, script) {
    var sq = Entry.hw.sendQueue;

    if (!script.isStart) {
        var note = script.getNumberField("NOTE", script);
        var octave = script.getNumberField("OCTAVE", script);
        var duration = script.getNumberField("DURATION", script);
        script.note = note;

        script.isStart = true;
        script.timeFlag = 1;
        sq.note = note;
        sq.octave = octave;
        sq.duration = duration;
        sq.sound_check = (Math.random() * 100000).toFixed(0);
        setTimeout(function() {
            script.timeFlag = 0;
        }, 1 / duration * 4000);
        return script;
    } else if (script.timeFlag == 1) {
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }

};

Blockly.Blocks.neobot_set_sensor_value = {
  init: function() {
    
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['1',"O_1"],
          ['2',"O_2"]
          ]), "PORT")
        .appendField('번 포트의 값을')
        .appendField(new Blockly.FieldDropdown([
          ['켜기',"1"],
          ['끄기',"0"]
          ]), "VALUE");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.neobot_set_sensor_value = function (sprite, script) {
    var sq = Entry.hw.sendQueue;

    var port = script.getStringField("PORT", script);
    var value = script.getNumberField("VALUE", script);
    sq[port] = value;
    return script.callReturn(); 
}