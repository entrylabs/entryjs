"use strict";

Entry.block.variableAddButton = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "변수 추가",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                Entry.variableContainer.openVariableAddPanel('variable');
            }
        ]
    }
};

Entry.block.listAddButton = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "리스트 추가",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                Entry.variableContainer.openVariableAddPanel('list');
            }
        ]
    }
};

// (변수▼) 를 () 만큼 바꾸기
Blockly.Blocks.change_variable = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_variable_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_variable_2);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_variable_3)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_variable = function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var value = script.getNumberValue("VALUE", script);
    var fixed = 0;

    value = Entry.parseNumber(value);
    if ((value == false && typeof value == 'boolean'))
        throw new Error('Type is not correct');
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    fixed = Entry.getMaxFloatPoint([value, variable.getValue()]);
    variable.setValue((value + variable.getValue()).toFixed(fixed));
    return script.callReturn();
};

// (변수▼) 를 () 만큼 정하기
Blockly.Blocks.set_variable = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_set_variable_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_set_variable_2);
    this.appendValueInput("VALUE")
        .setCheck(["Number","String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_set_variable_3)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.set_variable = function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var value = script.getValue("VALUE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    variable.setValue(value);
    return script.callReturn();
};


// (변수▼) 보이기
Blockly.Blocks.show_variable = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_show_variable_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE")
        .appendField(Lang.Blocks.VARIABLE_show_variable_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.show_variable = function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    variable.setVisible(true);
    variable.updateView();
    return script.callReturn();
};


// (변수▼) 숨기기
Blockly.Blocks.hide_variable = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_hide_variable_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE")
        .appendField(Lang.Blocks.VARIABLE_hide_variable_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hide_variable = function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    variable.setVisible(false);
    return script.callReturn();
};

Blockly.Blocks.get_y = {
  // Numeric value.
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_get_y)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setOutput(true, 'Number');
  }
};

// 변수값
Blockly.Blocks.get_variable = {
    init: function () {
        this.setColour("#E457DC");
        this.appendDummyInput()
            .appendField(Lang.Blocks.VARIABLE_get_variable_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE")
            .appendField(Lang.Blocks.VARIABLE_get_variable_2)
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Entry.block.get_variable = function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    return variable.getValue();
};


// Ask and wait until a response provided
Blockly.Blocks.ask_and_wait = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_ask_and_wait_1);
    this.appendValueInput("VALUE")
        .setCheck(['String','Number', null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_ask_and_wait_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  whenAdd: function () {
    Entry.container.showProjectAnswer();
  },
  whenRemove: function (removeBlock) {
    Entry.container.hideProjectAnswer(removeBlock);
  }
};

// Ask and wait until a response provided
Entry.block.ask_and_wait = function (sprite, script) {
    var inputModel = Entry.container.inputValue,
        inputView = Entry.stage.inputField,
        message = script.getValue("VALUE", script);

    if (!message)
        throw new Error('message can not be empty');

    if (inputModel.sprite == sprite &&
        inputView && !inputView._isHidden) {
        return script;
    } else if (inputModel.sprite != sprite && script.isInit) {
        if(sprite.dialog)
            sprite.dialog.remove();
        delete script.isInit;
        return script.callReturn();
    } else if (inputModel.complete &&
               inputModel.sprite == sprite &&
               inputView._isHidden && script.isInit) {
        if(sprite.dialog)
            sprite.dialog.remove();
        delete inputModel.complete;
        delete script.isInit;
        return script.callReturn();
    } else {
        message = Entry.convertToRoundedDecimals(message, 3);
        new Entry.Dialog(sprite, message, 'speak');
        Entry.stage.showInputField();
        inputModel.script = script;
        inputModel.sprite = sprite;
        script.isInit = true;
        return script;
    }
}

// get asked answer from canvas input
Blockly.Blocks.get_canvas_input_value = {
    init: function () {
        this.setColour("#E457DC");
        this.appendDummyInput()
            .appendField(Lang.Blocks.VARIABLE_get_canvas_input_value);
        this.appendDummyInput()
            .appendField(" ");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    },
    whenAdd: function () {
      Entry.container.showProjectAnswer();
    },
    whenRemove: function (removeBlock) {
      Entry.container.hideProjectAnswer(removeBlock);
    }
};

Entry.block.get_canvas_input_value = function (sprite, script) {
    return Entry.container.getInputValue();
}


Blockly.Blocks.add_value_to_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_add_value_to_list_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number","String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_add_value_to_list_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_add_value_to_list_3)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.add_value_to_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var value = script.getValue("VALUE", script);
    var list = Entry.variableContainer.getList(listId, sprite);

    if (!list.array_)
        list.array_ = [];
    list.array_.push({'data' : value});
    list.updateView();
    return script.callReturn();
};

Blockly.Blocks.remove_value_from_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_remove_value_from_list_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_remove_value_from_list_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_remove_value_from_list_3)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.remove_value_from_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var value = script.getValue("VALUE", script);
    var list = Entry.variableContainer.getList(listId, sprite);

    if (!list.array_ || isNaN(value) || value > list.array_.length)
        throw new Error('can not remove value from array');

    list.array_.splice(value-1,1);

    list.updateView();
    return script.callReturn();
};

Blockly.Blocks.insert_value_to_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_insert_value_to_list_1);
    this.appendValueInput("DATA")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_insert_value_to_list_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_insert_value_to_list_3);
    this.appendValueInput("INDEX")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_insert_value_to_list_4)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.insert_value_to_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var data = script.getValue("DATA", script);
    var index = script.getValue("INDEX", script);
    var list = Entry.variableContainer.getList(listId, sprite);

    if (!list.array_ || isNaN(index) || index == 0 || index > list.array_.length +1)
        throw new Error('can not insert value to array');

    list.array_.splice(index-1, 0, {'data': data});
    list.updateView();
    return script.callReturn();
};

Blockly.Blocks.change_value_list_index = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_value_list_index_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_value_list_index_2);
    this.appendValueInput("INDEX")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_value_list_index_3);
    this.appendValueInput("DATA")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_change_value_list_index_4)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_value_list_index = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var data = script.getValue("DATA", script);
    var index = script.getValue("INDEX", script);
    var list = Entry.variableContainer.getList(listId, sprite);

    if (!list.array_ || isNaN(index) || index > list.array_.length)
        throw new Error('can not insert value to array');

    list.array_[index-1].data = data;
    list.updateView();
    return script.callReturn();
};

Blockly.Blocks.value_of_index_from_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_value_of_index_from_list_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_value_of_index_from_list_2);
    this.appendValueInput("INDEX")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_value_of_index_from_list_3);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.value_of_index_from_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var index = script.getValue("INDEX", script);
    var list = Entry.variableContainer.getList(listId, sprite);
    index = Entry.getListRealIndex(index, list);

    if (!list.array_ || isNaN(index) || index > list.array_.length)
        throw new Error('can not insert value to array');

    return list.array_[index-1].data
};

Blockly.Blocks.length_of_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_length_of_list_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_length_of_list_2);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.length_of_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var list = Entry.variableContainer.getList(listId);

    return list.array_.length;
};

Blockly.Blocks.show_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_show_list_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST")
        .appendField(Lang.Blocks.VARIABLE_show_list_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.show_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var list = Entry.variableContainer.getList(listId);

    list.setVisible(true);
    return script.callReturn();
};


Blockly.Blocks.hide_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_hide_list_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST")
        .appendField(Lang.Blocks.VARIABLE_hide_list_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hide_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var list = Entry.variableContainer.getList(listId);

    list.setVisible(false);
    return script.callReturn();
};

Blockly.Blocks.options_for_list = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField('');
    this.appendDummyInput("VALUE")
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.VARIABLE_list_option_first,"FIRST"],
          [Lang.Blocks.VARIABLE_list_option_last,"LAST"],
          [Lang.Blocks.VARIABLE_list_option_random,"RANDOM"]
          ]), "OPERATOR");
    this.appendDummyInput()
        .appendField(' ');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.options_for_list = function (sprite, script) {
    return script.getField("OPERATOR", script);
};

Blockly.Blocks.set_visible_answer = {
  init: function() {
    this.setColour("#E457DC");
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_get_canvas_input_value);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_timer_visible_show,"SHOW"],
          [Lang.Blocks.CALC_timer_visible_hide,"HIDE"]
          ]), "BOOL");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/variable_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  whenAdd: function () {
    Entry.container.showProjectAnswer();
  },
  whenRemove: function (removeBlock) {
    Entry.container.hideProjectAnswer(removeBlock);
  }
};

Entry.block.set_visible_answer = function (sprite, script) {
    var bool = script.getField("BOOL", script);
    if (bool == 'HIDE')
        Entry.container.inputValue.setVisible(false);
    else
        Entry.container.inputValue.setVisible(true);
    return script.callReturn();
};

Blockly.Blocks.is_included_in_list = {
    init: function() {
        this.setColour("#E457DC");
        this.appendDummyInput()
            .appendField(Lang.Blocks.VARIABLE_is_included_in_list_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
        this.appendDummyInput()
            .appendField(Lang.Blocks.VARIABLE_is_included_in_list_2);
        this.appendValueInput("DATA")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.VARIABLE_is_included_in_list_3);
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.is_included_in_list = function (sprite, script) {
    var listId = script.getField("LIST", script);
    var data = script.getStringValue("DATA", script);
    var list = Entry.variableContainer.getList(listId);
    if (!list)
        return false;
    var arr = list.array_;

    for (var i=0, len=arr.length; i<len; i++) {
        if (arr[i].data.toString() == data.toString())
            return true;
    }
    return false;
};

