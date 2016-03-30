"use strict";

// ()초 기다리기
Blockly.Blocks.wait_second = {
  init: function() {
    this.setColour("#498deb");
    this.appendDummyInput()
        .appendField(Lang.Blocks.FLOW_wait_second_1);
    this.appendValueInput("SECOND")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.FLOW_wait_second_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  syntax: {js: [], py: ["self.sleep_seconds(%1)\n"]}

};

Entry.block.wait_second = function (sprite, script) {
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("SECOND", script);
        var fps = Entry.FPS || 60;
        timeValue = 60/fps*timeValue*1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
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

// ()번 반복하기
Blockly.Blocks.repeat_basic = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_repeat_basic_1);
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_repeat_basic_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.appendStatementInput('DO');
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["for i in range(%1):\n$1\n"]}
};

Entry.block.repeat_basic = function (sprite, script) {
    var iterNumber;
    if (!script.isLooped) {
        script.isLooped = true;
        var iterNumber = script.getNumberValue("VALUE", script);
        if(iterNumber < 0) throw new Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);
        script.iterCount = Math.floor(iterNumber);
    }
    if (script.iterCount != 0 && !(script.iterCount < 0)) {
        script.iterCount--;
        return script.getStatement("DO", script);
    } else {
        delete script.isLooped;
        delete script.iterCount;
        return script.callReturn();
    }
};

// 무한 반복하기
Blockly.Blocks.repeat_inf = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_repeat_inf)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.appendStatementInput('DO');
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["while True:\n$1\n"]}
};

Entry.block.repeat_inf = function (sprite, script) {
    //return script.getStatement("DO", script);
    script.isLooped = true;
    return script.getStatement('DO');
};

// 반복 중단하기
Blockly.Blocks.stop_repeat = {
  init: function() {
    this.setColour("#498deb");
    this.appendDummyInput()
        .appendField(Lang.Blocks.FLOW_stop_repeat)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  syntax: {js: [], py: ["break\n"]}
};

Entry.block.stop_repeat = function (sprite, script) {
    var parentScript = script;
    while (parentScript.type.substr(0, 6).toUpperCase() != "REPEAT" &&
        parentScript.parentScript) {
        parentScript = parentScript.parentScript;
        delete parentScript.isLooped;
        delete parentScript.iterCount;
    }
    var nextScript = parentScript.callReturn();
    if (parentScript.statements && nextScript) {
        return nextScript;
    }
    else if (parentScript)
        return null;
    else
        return script.callReturn();
};

// wait until condtion is true
Blockly.Blocks.wait_until_true = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_wait_until_true_1);
        this.appendValueInput("BOOL")
        .setCheck("Boolean");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_wait_until_true_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["while !%1:\n"]}
};

Entry.block.wait_until_true = function (sprite, script) {
    var value = script.getBooleanValue("BOOL", script);
    if (value) {
        return script.callReturn();
    } else {
        return script;
    }
}

// 만약 <>라면
Blockly.Blocks._if = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW__if_1);
        this.appendValueInput("BOOL")
            .setCheck("Boolean");
        this.appendDummyInput()     
            .appendField(Lang.Blocks.FLOW__if_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.appendStatementInput("STACK");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["if %1:\n$1\n\n"]}
};

Entry.block._if = function (sprite, script) {
    if (script.isLooped) {
        delete script.isLooped;
        return script.callReturn();
    }
    var value = script.getBooleanValue("BOOL", script);
    if (value) {
        script.isLooped = true;
        return script.getStatement("STACK", script);
    } else {
        return script.callReturn();
    }
};
// 만약 <>라면, 아니
Blockly.Blocks.if_else = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_if_else_1);
        this.appendValueInput("BOOL")
            .setCheck("Boolean");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_if_else_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.appendStatementInput("STACK_IF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_if_else_3);
        this.appendStatementInput("STACK_ELSE");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["if %1:\n $1\nelse:\n$2\n"]}
};

Entry.block.if_else = function (sprite, script) {
    if (script.isLooped) {
        delete script.isLooped;
        return script.callReturn();
    }
    var value = script.getBooleanValue("BOOL", script);
    script.isLooped = true;
    if (value)
        return script.getStatement("STACK_IF", script);
    else
        return script.getStatement("STACK_ELSE", script);
};

Blockly.Blocks.create_clone = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_create_clone_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdownDynamic("clone"), "VALUE");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_create_clone_2)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["Entry.create_clone(%1)\n"]}
};

Entry.block.create_clone = function (sprite, script) {
    var targetSpriteId = script.getField("VALUE", script);
    var returnBlock = script.callReturn();
    if (targetSpriteId == "self")
        sprite.parent.addCloneEntity(sprite.parent, sprite, null);
    else {
        var object = Entry.container.getObject(targetSpriteId);
        object.addCloneEntity(sprite.parent, null, null);
    }
    return returnBlock;
};

Blockly.Blocks.delete_clone = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_delete_clone)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    syntax: {js: [], py: ["self.delete_clone()\n"]}
};

Entry.block.delete_clone = function (sprite, script) {
    if (!sprite.isClone)
        return script.callReturn();
    sprite.removeClone();
    return;
};

Blockly.Blocks.when_clone_start = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/start_icon_clone.png', '*', "start"))
            .appendField(Lang.Blocks.FLOW_when_clone_start);
        this.setInputsInline(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["Entry.isClonedFirst()\n"]}
};

Entry.block.when_clone_start = function (sprite, script) {
    return script.callReturn();
};

Blockly.Blocks.stop_run = {
  init: function() {
    this.setColour("#498deb");
    this.appendDummyInput()
        .appendField(Lang.Blocks.FLOW_stop_run)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);

  }
};

Entry.block.stop_run = function (sprite, script) {
    return Entry.engine.toggleStop();
};


Blockly.Blocks.repeat_while_true = {
    init: function() {
        this.setColour("#498deb");
        if (Lang.type == 'ko') {
            this.appendDummyInput()
                .appendField(Lang.Blocks.FLOW_repeat_while_true_1);
            this.appendValueInput("BOOL")
            .setCheck("Boolean");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    [Lang.Blocks.FLOW_repeat_while_true_until,"until"],
                    [Lang.Blocks.FLOW_repeat_while_true_while,"while"]
                    ]), "OPTION")
                    .appendField(Lang.Blocks.FLOW_repeat_while_true_2)
                    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
            this.appendStatementInput('DO');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        } else {
            this.appendDummyInput()
                .appendField(Lang.Blocks.FLOW_repeat_while_true_1);
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    [Lang.Blocks.FLOW_repeat_while_true_until,"until"],
                    [Lang.Blocks.FLOW_repeat_while_true_while,"while"]
                    ]), "OPTION");
            this.appendValueInput("BOOL")
                .setCheck("Boolean");
            this.appendDummyInput()
                    .appendField(Lang.Blocks.FLOW_repeat_while_true_2)
                    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
            this.appendStatementInput('DO');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }
    },
    syntax: {js: [], py: ["Entry.repeat(%1, \"%2\")\n"]}
};

Entry.block.repeat_while_true = function (sprite, script) {
    var value = script.getBooleanValue("BOOL", script);

    if (script.getField("OPTION", script) == 'until')
        value = !value;
    script.isLooped = value;

    return value ? script.getStatement("DO", script) :
        script.callReturn();
};

Blockly.Blocks.stop_object = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_stop_object_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Lang.Blocks.FLOW_stop_object_all,"all"],
                [Lang.Blocks.FLOW_stop_object_this_object,"thisOnly"],
                [Lang.Blocks.FLOW_stop_object_this_thread,"thisThread"],
                [Lang.Blocks.FLOW_stop_object_other_thread, "otherThread"]
                ]), "TARGET");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_stop_object_2)
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["Entry.stop(%1)\n"]}
};

Entry.block.stop_object = function (sprite, script) {
    var target = script.getField("TARGET", script);
    var container = Entry.container;

    switch(target) {
        case 'all':
            container.mapEntityIncludeCloneOnScene(function (entity){
                entity.clearScript();
            });
            break;
        case 'thisObject':
            sprite.clearScript();
            var clonedEntities = sprite.parent.clonedEntities;
            clonedEntities.map(function (entity) {
                entity.clearScript();
            });
            break;
        case 'thisOnly':
            sprite.clearScript();
            break;
        case 'thisThread':
            break;
        case 'otherThread':
            sprite.clearScript();
            var clonedEntities = sprite.parent.clonedEntities;
            clonedEntities.map(function (entity) {
                entity.clearScript();
            });
            return script.callReturn();
    }
    return null;
};

Blockly.Blocks.restart_project = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_restart)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    syntax: {js: [], py: ["Entry.restart()\n"]}
};

Entry.block.restart_project = function (sprite, script) {
    Entry.engine.toggleStop();
    Entry.engine.toggleRun();
};

Blockly.Blocks.remove_all_clones = {
    init: function() {
        this.setColour("#498deb");
        this.appendDummyInput()
            .appendField(Lang.Blocks.FLOW_delete_clone_all)
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/flow_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    syntax: {js: [], py: ["Entry.remove_all_clones()\n"]}
};

Entry.block.remove_all_clones = function (sprite, script) {
    var clonedEntities = sprite.parent.getClonedEntities();
    clonedEntities.map(function (entity) {
        entity.removeClone();
    });
    clonedEntities = null;

    return script.callReturn();
};
