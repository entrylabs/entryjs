"use strict";

Blockly.Blocks.when_scene_start = {
    init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_scene_1_2.png', '*', "start"))
        .appendField(Lang.Blocks.SCENE_when_scene_start);
    this.setInputsInline(true);
    this.setNextStatement(true);
  },
  syntax: {js: [], py: ["self.on_start_scene()\n"]}
};

Entry.block.when_scene_start = function (sprite, script) {
    return script.callReturn();
};

Blockly.Blocks.start_scene = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SCENE_start_scene_1)
        .appendField(new Blockly.FieldDropdownDynamic("scenes"), "VALUE")
        .appendField(Lang.Blocks.SCENE_start_scene_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_03.png', '*'));
    this.setInputsInline(true);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
  },
  syntax: {js: [], py: ["Entry.on_start_scene(%1)\n"]}
};

Entry.block.start_scene = function (sprite, script) {
    var value = script.getField("VALUE", script);
    var scene = Entry.scene.getSceneById(value);
    if (scene) {
        Entry.scene.selectScene(scene);
        Entry.engine.fireEvent('when_scene_start');
    }
    return null;
};


Blockly.Blocks.start_neighbor_scene = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(Lang.Blocks.SCENE_start_neighbor_scene_1)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.SCENE_start_scene_next,"next"],
          [Lang.Blocks.SCENE_start_scene_pre,"pre"]
          ]), "OPERATOR")
        .appendField(Lang.Blocks.SCENE_start_neighbor_scene_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_03.png', '*'));
    this.setInputsInline(true);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
  },
  syntax: {js: [], py: ["self.start_neighbor_scene(\"%1\")\n"]}
};

Entry.block.start_neighbor_scene = function (sprite, script) {
    var currentScene = Entry.scene.selectedScene;
    var scenes = Entry.scene.getScenes();
    var index = scenes.indexOf(currentScene);
    var o = script.getField("OPERATOR", script);
    if (o == 'next') {
        if (index + 1 < scenes.length) {
            var nextScene = Entry.scene.getSceneById(scenes[index + 1].id);
            if (nextScene) {
                Entry.scene.selectScene(nextScene);
                Entry.engine.fireEvent('when_scene_start');
            }
        }
    } else {
        if (index > 0) {
            var nextScene = Entry.scene.getSceneById(scenes[index - 1].id);
            if (nextScene) {
                Entry.scene.selectScene(nextScene);
                Entry.engine.fireEvent('when_scene_start');
            }
        }
    }
    return null;
}
