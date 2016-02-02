"use strict";

// ▶ 버튼을 클릭했을 때
Blockly.Blocks.when_run_button_click = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_play.png', '*', "start"))
        .appendField(Lang.Blocks.START_when_run_button_click);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Entry.block.when_run_button_click = function (sprite, script) {
    return script.callReturn();
};

// (▼) 키를 눌렀는가?
Blockly.Blocks.press_some_key = {
    init: function() {
        this.setColour("#3BBD70");
        this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_keyboard.png', '*', "start"))
        .appendField(Lang.Blocks.START_press_some_key_1)
        .appendField(new Blockly.FieldDropdown([
            ["q","81"],
            ["w","87"],
            ["e","69"],
            ["r","82"],
            ["a","65"],
            ["s","83"],
            ["d","68"],
            [Lang.Blocks.START_press_some_key_up,"38"],
            [Lang.Blocks.START_press_some_key_down,"40"],
            [Lang.Blocks.START_press_some_key_left,"37"],
            [Lang.Blocks.START_press_some_key_right,"39"],
            [Lang.Blocks.START_press_some_key_enter, "13"],
            [Lang.Blocks.START_press_some_key_space, "32"]
            ]), "VALUE")
        .appendField(Lang.Blocks.START_press_some_key_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_03.png', '*'));
        this.setInputsInline(true);
        this.setNextStatement(true);
    }
};

Entry.block.press_some_key = function (sprite, script) {
    return script.callReturn();
};

Blockly.Blocks.when_some_key_pressed = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_keyboard.png', '*', "start"))
        .appendField(Lang.Blocks.START_press_some_key_1)
        .appendField(new Blockly.FieldKeydownInput('81'), "VALUE")
        .appendField(Lang.Blocks.START_press_some_key_2);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Entry.block.when_some_key_pressed = function (sprite, script) {
    return script.callReturn();
};

// 마우스를 클릭했는가?
Blockly.Blocks["mouse_clicked"] = {
    init: function() {
        this.setColour("#3BBD70");
        this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_mouse.png', '*', "start"))
        .appendField(Lang.Blocks.START_mouse_clicked);
        this.setInputsInline(true);
        this.setNextStatement(true);
    }
};

Entry.block.mouse_clicked = function (sprite, script) {
    return script.callReturn();
};

// 마우스를 클릭 해제했는가?
Blockly.Blocks.mouse_click_cancled = {
    init: function() {
        this.setColour("#3BBD70");
        this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_mouse.png', '*', "start"))
        .appendField(Lang.Blocks.START_mouse_click_cancled);
        this.setInputsInline(true);
        this.setNextStatement(true);
    }
};

Entry.block.mouse_click_cancled = function (sprite, script) {
    return script.callReturn();
};


// //장면이 시작했을 때
// Blockly.Blocks.when_scene_start = {
//   init: function() {
//       this.setColour("#3BBD70");
//     this.appendDummyInput()
//         .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_start.png', '*', "start"))
//         .appendField(Lang.Blocks.START_when_scene_start);
//     this.setInputsInline(true);
//     this.setNextStatement(true);
//   }
// };

// Entry.block.when_scene_start = function (sprite, script) {
//     return script.callReturn();
// };

//오브젝트를 클릭 했을 때
Blockly.Blocks.when_object_click = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_mouse.png', '*', "start"))
        .appendField(Lang.Blocks.START_when_object_click);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Entry.block.when_object_click = function (sprite, script) {
    return script.callReturn();
};

//오브젝트 클릭해제했을 때
Blockly.Blocks.when_object_click_canceled = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_mouse.png', '*', "start"))
        .appendField(Lang.Blocks.START_when_object_click_canceled);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Entry.block.when_object_click_canceled = function (sprite, script) {
    return script.callReturn();
};

//(▼) 키를 눌렀을 때 **popup
Blockly.Blocks.when_some_key_click = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_keyboard.png', '*', "start"))
        .appendField(Lang.Blocks.START_when_some_key_click);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Entry.block.when_some_key_click = function (sprite, script) {
    return script.callReturn();
};

//(메시지1▼) 이 방송되었을 때 **popup
Blockly.Blocks.when_message_cast = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_signal.png', '*', "start"))
        .appendField(Lang.Blocks.START_when_message_cast_1)
        .appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE")
        .appendField(Lang.Blocks.START_when_message_cast_2);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Entry.block.when_message_cast = function (sprite, script) {
    return script.callReturn();
};


Blockly.Blocks.message_cast = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(Lang.Blocks.START_message_cast_1)
        .appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE")
        .appendField(Lang.Blocks.START_message_cast_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_03.png', '*'));
    this.setInputsInline(true);
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
  }
};

Entry.block.message_cast = function (sprite, script) {
    var value = script.getField("VALUE", script);

    var arr = Entry.variableContainer.messages_;
    var isExist = Entry.isExist(value, 'id', arr);

    if (value == 'null' || !isExist)
        throw new Error('value can not be null or undefined');
    Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent,
                              ["when_message_cast", value]);
    return script.callReturn();
};

Blockly.Blocks.message_cast_wait = {
  init: function() {
    this.setColour("#3BBD70");
    this.appendDummyInput()
        .appendField(Lang.Blocks.START_message_send_wait_1)
        .appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE")
        .appendField(Lang.Blocks.START_message_send_wait_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_03.png', '*'));
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
  }
};

Entry.block.message_cast_wait = function (sprite, script) {
    if (script.runningScript) {
        if (script.runningScript.length) {
            Entry.engine.computeFunction(script);
            return script;
        } else {
            delete script.runningScript;
            return script.callReturn();
        }
    } else {
        var value = script.getField("VALUE", script);
        var arr = Entry.variableContainer.messages_;
        var isExist = Entry.isExist(value, 'id', arr);
        if (value == 'null' || !isExist)
            throw new Error('value can not be null or undefined');
        var runningScript = []

        Entry.container.mapEntityIncludeCloneOnScene(function(entity, param) {
            var eventName = param[0];
            var keyCode = param[1];
            var blocks = entity.parent.script.childNodes;
            //handle clone entity
            for (var i=0; i<blocks.length; i++) {
                var block = blocks[i];
                var value = Entry.Xml.getField("VALUE", block);
                if (Entry.Xml.isTypeOf(eventName, block) &&
                   (value == keyCode)) {
                    var script = new Entry.Script(entity);
                    script.init(block);
                    runningScript.push(script);
                }
            };
        }, ["when_message_cast", value]);

        script.runningScript = runningScript;
        return script;
    }
};

