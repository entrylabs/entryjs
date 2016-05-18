"use strict";

var colour = '#FFCA36';

Blockly.Blocks.text = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(Lang.Blocks.TEXT_text), "NAME");
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.text = function (sprite, script) {
    return script.getField('NAME', script);
};

Blockly.Blocks.text_write = {
  init: function() {
    this.setColour(colour);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_write_1);
    this.appendValueInput("VALUE")
        .setCheck(['String', 'Number']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_write_2);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.text_write = function (sprite, script) {
    var text = script.getStringValue("VALUE", script);
    text = Entry.convertToRoundedDecimals(text, 3);
    sprite.setText(text);
    return script.callReturn();
};


Blockly.Blocks.text_append = {
  init: function() {
    this.setColour(colour);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_append_1);
    this.appendValueInput("VALUE")
        .setCheck(['String', 'Number']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_append_2);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.text_append = function (sprite, script) {
    var text = script.getStringValue("VALUE", script);
    sprite.setText(Entry.convertToRoundedDecimals(sprite.getText(),3) +
                  Entry.convertToRoundedDecimals(text, 3));
    return script.callReturn();
};

Blockly.Blocks.text_prepend = {
  init: function() {
    this.setColour(colour);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_prepend_1);
    this.appendValueInput("VALUE")
        .setCheck(['String', 'Number']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_prepend_2);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.text_prepend = function (sprite, script) {
    var text = script.getStringValue("VALUE", script);
    sprite.setText(Entry.convertToRoundedDecimals(text, 3) +
                  Entry.convertToRoundedDecimals(sprite.getText(), 3));
    return script.callReturn();
};

Blockly.Blocks.text_flush = {
  init: function() {
    this.setColour(colour);
    this.appendDummyInput()
        .appendField(Lang.Blocks.TEXT_text_flush);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.text_flush = function (sprite, script) {
    sprite.setText('');
    return script.callReturn();
};
