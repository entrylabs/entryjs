"use strict";

Entry.Hamster = {
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
};

Blockly.Blocks.hamster_set_led_to = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
    .appendField("")
    .appendField(new Blockly.FieldDropdown([
      ['왼쪽',"LEFT"],
      ['오른쪽',"RIGHT"]
      ]), "DIRECTION")
    .appendField(" LED를")
    .appendField(new Blockly.FieldDropdown([
      ['빨간색',"RED"],
      ['노란색',"YELLOW"],
      ['녹색',"GREEN"],
      ['하늘색',"SKYBLUE"],
      ['파란색',"BLUE"],
      ['보라색',"PURPLE"],
      ['하얀색',"WHITE"]
      ]), "COLOR")
    .appendField(" 으로 하기")
    .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_arduino.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hamster_set_led_to = function (sprite, script) {
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

