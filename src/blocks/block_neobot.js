Entry.Neobot = {
    name: 'neobot',
    PORT_MAP : {
        "1": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
    },
    sensorList: function() {
        return [['1', '1'],['2', '2'],['3', '3'],['4', '4']]
    },
    setZero: function () {

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
  console.log(port);
  console.log(Entry.hw.portData[port]);
  return Entry.hw.portData[port];
};