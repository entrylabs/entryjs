// (▼) 소리 내기
Blockly.Blocks['sound_something'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something = function (sprite, script) {
    var soundId = script.getField("VALUE", script);
    var sounds = sprite.parent.sounds;
    var isExist = Entry.isExist(soundId, 'id', sounds);
    if (isExist)
        createjs.Sound.play(soundId);
    return script.callReturn();
};

Blockly.Blocks['sound_something_second'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_2);
    this.appendValueInput("SECOND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_second = function (sprite, script) {
    var soundId = script.getField("VALUE", script);
    var timeValue = script.getNumberValue("SECOND", script);
    var sounds = sprite.parent.sounds;
    var isExist = Entry.isExist(soundId, 'id', sounds);
    if (isExist) {
        //var instance = createjs.Sound.play(soundId, {startTime: 0, duration: timeValue * 1000});
        var instance = createjs.Sound.play(soundId);
        setTimeout(function() {
            instance.stop();
        }, timeValue * 1000);
    }
    return script.callReturn();
};

Blockly.Blocks['sound_something_wait'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_wait_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_wait_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_wait = function (sprite, script) {
    if (!script.isPlay) {
        script.isPlay = true;
        script.playState = 1;
        var soundId = script.getField("VALUE", script);
        var sound = sprite.parent.getSound(soundId);
        var sounds = sprite.parent.sounds;
        var isExist = Entry.isExist(soundId, 'id', sounds);
        if (isExist) {
            var instance = createjs.Sound.play(soundId);
            setTimeout(function() {
                script.playState = 0;
            }, sound.duration * 1000)
        }
        return script;
    } else if (script.playState == 1) {
        return script;
    } else {
        delete script.playState;
        delete script.isPlay;
        return script.callReturn();
    }
};

Blockly.Blocks['sound_something_second_wait'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_wait_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_wait_2);
    this.appendValueInput("SECOND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_wait_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_second_wait = function (sprite, script) {
    if (!script.isPlay) {
        script.isPlay = true;
        script.playState = 1;
        var soundId = script.getField("VALUE", script);
        var sounds = sprite.parent.sounds;
        var isExist = Entry.isExist(soundId, 'id', sounds);
        if (isExist) {
            var instance = createjs.Sound.play(soundId);
            var timeValue = script.getNumberValue("SECOND", script);
            setTimeout(function() {
                instance.stop();
                script.playState = 0;
            }, timeValue * 1000)
            instance.addEventListener('complete', function(e) {
            });
        }
        return script;
    } else if (script.playState == 1) {
        return script;
    } else {
        delete script.isPlay;
        delete script.playState;
        return script.callReturn();
    }
};

// 소리 크기를 ()% 만큼 바꾸기
Blockly.Blocks['sound_volume_change'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_volume_change_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_volume_change_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_volume_change = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script) / 100;
    value = value + createjs.Sound.getVolume();
    if (value>1)
        value = 1;
    if (value<0)
        value = 0;
    createjs.Sound.setVolume(value);
    return script.callReturn();
};

// 소리 크기를 ()% 로 정하기
Blockly.Blocks['sound_volume_set'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_volume_set_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_volume_set_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_volume_set = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script) / 100;
    if (value>1)
        value = 1;
    if (value<0)
        value = 0;
    createjs.Sound.setVolume(value);
    return script.callReturn();
};

// 모든 소리 재생 중단
Blockly.Blocks['sound_silent_all'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_silent_all)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_silent_all = function (sprite, script) {
    createjs.Sound.stop();
    return script.callReturn();
};

Blockly.Blocks['get_sounds'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField('');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE")
    this.appendDummyInput()
        .appendField(' ');
    this.setOutput(true, 'String');
    this.setInputsInline(true);
    this.setTooltip('');
  }
};

Entry.block.get_sounds = function (sprite, script) {
    return script.getStringField("VALUE");
};

Blockly.Blocks['sound_something_with_block'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_1);
    this.appendValueInput("VALUE")
        .setCheck(["String", "Number"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_with_block = function (sprite, script) {
    var soundId = script.getStringValue("VALUE", script);
    var sound = sprite.parent.getSound(soundId);

    if (sound)
        createjs.Sound.play(sound.id);

    return script.callReturn();
};

Blockly.Blocks['sound_something_second_with_block'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_1);
    this.appendValueInput("VALUE")
        .setCheck(["String", "Number"]);
    this.appendDummyInput()
        .appendField(' ')
        .appendField(Lang.Blocks.SOUND_sound_something_second_2);
    this.appendValueInput("SECOND")
        .setCheck(["String", "Number"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_second_with_block = function (sprite, script) {
    var soundId = script.getStringValue("VALUE", script);
    var timeValue = script.getNumberValue("SECOND", script);
    var sound = sprite.parent.getSound(soundId);

    if (sound) {
        var instance = createjs.Sound.play(sound.id, {startTime: 0, duration: timeValue * 1000});
        /*
        var instance = createjs.Sound.play(sound.id);
        setTimeout(function() {
            instance.stop();
        }, timeValue * 1000);
        */
    }
    return script.callReturn();
};

Blockly.Blocks['sound_something_wait_with_block'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_wait_1);
    this.appendValueInput("VALUE")
        .setCheck(["String", "Number"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_wait_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_wait_with_block = function (sprite, script) {
    if (!script.isPlay) {
        script.isPlay = true;
        script.playState = 1;
        var soundId = script.getStringValue("VALUE", script);
        var sound = sprite.parent.getSound(soundId);
        if (sound) {
            var instance = createjs.Sound.play(sound.id);
            setTimeout(function() {
                script.playState = 0;
            }, sound.duration * 1000)
        }
        return script;
    } else if (script.playState == 1) {
        return script;
    } else {
        delete script.playState;
        delete script.isPlay;
        return script.callReturn();
    }
};

Blockly.Blocks['sound_something_second_wait_with_block'] = {
  init: function() {
    this.setColour("#A4D01D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_wait_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_wait_2)
        .appendField(' ');
    this.appendValueInput("SECOND")
        .setCheck(["String", "Number"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.SOUND_sound_something_second_wait_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_sound.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Entry.block.sound_something_second_wait_with_block = function (sprite, script) {
    if (!script.isPlay) {
        script.isPlay = true;
        script.playState = 1;
        var soundId = script.getStringValue("VALUE", script);
        var sound = sprite.parent.getSound(soundId);
        if (sound) {
            var instance = createjs.Sound.play(sound.id);
            var timeValue = script.getNumberValue("SECOND", script);
            setTimeout(function() {
                instance.stop();
                script.playState = 0;
            }, timeValue * 1000)
            instance.addEventListener('complete', function(e) {
            });
        }
        return script;
    } else if (script.playState == 1) {
        return script;
    } else {
        delete script.isPlay;
        delete script.playState;
        return script.callReturn();
    }
};
