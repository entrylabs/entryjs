Entry.Neobot = {
    name: 'neobot',
    setZero: function () {
        for (var port = 1; port < 5; port++) {
          Entry.hw.sendQueue[port] = 0;
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
            ['1',"1"],
            ['2',"2"],
            ['3',"3"],
            ['4',"4"]
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