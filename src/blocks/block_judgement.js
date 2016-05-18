"use strict";

Blockly.Blocks.is_clicked = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_is_clicked, "#3D3D3D");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.is_clicked = function (sprite, script) {
    return Entry.stage.isClick;
};

Blockly.Blocks.is_press_some_key = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_is_press_some_key_1, "#3D3D3D");
        this.appendDummyInput()
            .appendField(new Blockly.FieldKeydownInput('81'), "VALUE")
            .appendField(Lang.Blocks.JUDGEMENT_is_press_some_key_2, "#3D3D3D");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.is_press_some_key = function (sprite, script) {
    var keycode = Number(script.getField("VALUE", script));
    return Entry.pressedKeys.indexOf(keycode) >= 0;
};

// (▼) 에 닿았는가?
Blockly.Blocks.reach_something = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_reach_something_1, "#3D3D3D");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdownDynamic("collision"), "VALUE");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_reach_something_2, "#3D3D3D");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.reach_something = function (sprite, script) {
    if (!sprite.getVisible())
        return false;
    var targetSpriteId = script.getField("VALUE", script);
    var reg = /wall/;
    var ath = 0.2;
    var object = sprite.object
    var isWall = reg.test(targetSpriteId);
    var collision = ndgmr.checkPixelCollision;
    if (isWall) {
        var wall = Entry.stage.wall;
        switch(targetSpriteId) {
            case 'wall':
                if (collision(object,wall.up,ath,true) ||
                    collision(object,wall.down,ath,true) ||
                    collision(object,wall.left,ath,true) ||
                    collision(object,wall.right,ath,true))
                    return true;
                else
                    return false;
            case 'wall_up':
                if (collision(object,wall.up,ath,true))
                    return true;
                else
                    return false;
            case 'wall_down':
                if (collision(object,wall.down,ath,true))
                    return true;
                else
                    return false;
            case 'wall_right':
                if (collision(object,wall.right,ath,true))
                    return true;
                else
                    return false;
            case 'wall_left':
                if (collision(object,wall.left,ath,true))
                    return true;
                else
                    return false;
        }
    } else if (targetSpriteId == 'mouse') {
        var stage = Entry.stage.canvas;
        var pt = object.globalToLocal(stage.mouseX, stage.mouseY);
        return object.hitTest(pt.x, pt.y);
    } else {
        var targetSprite = Entry.container.getEntity(targetSpriteId);
        if (targetSprite.type == "textBox" || sprite.type == 'textBox') {
            var targetBound = targetSprite.object.getTransformedBounds();
            var bound = object.getTransformedBounds();
            if (Entry.checkCollisionRect(bound, targetBound))
                return true;
            var clonedEntities = targetSprite.parent.clonedEntities;
            for (var i=0, len=clonedEntities.length; i<len; i++) {
                var entity = clonedEntities[i];
                if(entity.isStamp)
                    continue;
                if (!entity.getVisible())
                    continue;
                if (Entry.checkCollisionRect(bound, entity.object.getTransformedBounds()))
                    return true;
            }
        } else {
            if (targetSprite.getVisible() &&
                collision(object,targetSprite.object,ath,true))
                return true;
            var clonedEntities = targetSprite.parent.clonedEntities;
            for (var i=0, len=clonedEntities.length; i<len; i++) {
                var entity = clonedEntities[i];
                if(entity.isStamp)
                    continue;
                if (!entity.getVisible())
                    continue;
                if (collision(object,entity.object,ath,true))
                    return true;
            }
        }
    }
    return false;
};



Blockly.Blocks.boolean_comparison = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
            .setCheck(['String', 'Number']);
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["=","EQUAL"],
            ["<","SMALLER"],
            [">","BIGGER"]
            ]), "OPERATOR");
        this.appendValueInput("RIGHTHAND")
            .setCheck(['String', 'Number']);
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_comparison = function (sprite, script) {
    var operator = script.getField("OPERATOR", script);
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    if (operator == "EQUAL")
        return leftValue == rightValue;
    else if (operator == "BIGGER")
        return leftValue > rightValue;
    else
        return leftValue < rightValue;
};

Blockly.Blocks.boolean_equal = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
            .setCheck(['String', 'Number']);
        this.appendDummyInput()
            .appendField("=", "#3D3D3D");
        this.appendValueInput("RIGHTHAND")
            .setCheck(['String', 'Number']);
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_equal = function (sprite, script) {
    var leftValue = script.getStringValue("LEFTHAND", script);
    var rightValue = script.getStringValue("RIGHTHAND", script);
    return leftValue == rightValue;
};

Blockly.Blocks.boolean_bigger = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(">", "#3D3D3D");
        this.appendValueInput("RIGHTHAND")
            .setCheck(["Number", "String"]);
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_bigger = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue > rightValue;
};

Blockly.Blocks.boolean_smaller = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField("<", "#3D3D3D");
        this.appendValueInput("RIGHTHAND")
            .setCheck(["Number", "String"]);
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_smaller = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue < rightValue;
};

//그리고 또는
Blockly.Blocks.boolean_and_or = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
        .setCheck("Boolean");
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.JUDGEMENT_boolean_and,"AND"],
            [Lang.Blocks.JUDGEMENT_boolean_or,"OR"]
            ]), "OPERATOR");
        this.appendValueInput("RIGHTHAND")
        .setCheck("Boolean");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_and_or = function (sprite, script) {
    var operator = script.getField("OPERATOR", script);
    var leftValue = script.getBooleanValue("LEFTHAND", script);
    var rightValue = script.getBooleanValue("RIGHTHAND", script);
    if (operator == "AND")
        return leftValue && rightValue;
    else
        return leftValue || rightValue;
};

Blockly.Blocks.boolean_and = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
            .setCheck("Boolean");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_boolean_and, "#3D3D3D");
        this.appendValueInput("RIGHTHAND")
            .setCheck("Boolean");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_and = function (sprite, script) {
    var leftValue = script.getBooleanValue("LEFTHAND", script);
    var rightValue = script.getBooleanValue("RIGHTHAND", script);
    return leftValue && rightValue;
};

Blockly.Blocks.boolean_or = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendValueInput("LEFTHAND")
            .setCheck("Boolean");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_boolean_or, "#3D3D3D");
        this.appendValueInput("RIGHTHAND")
            .setCheck("Boolean");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_or = function (sprite, script) {
    var leftValue = script.getBooleanValue("LEFTHAND", script);
    var rightValue = script.getBooleanValue("RIGHTHAND", script);
    return leftValue || rightValue;
};


Blockly.Blocks.boolean_not = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_boolean_not_1, "#3D3D3D");
        this.appendValueInput("VALUE")
            .setCheck("Boolean");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_boolean_not_2, "#3D3D3D");
        this.appendDummyInput()
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.boolean_not = function (sprite, script) {
    return !script.getBooleanValue("VALUE");
};


Blockly.Blocks.true_or_false = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
        [Lang.Blocks.JUDGEMENT_true,"true"],
        [Lang.Blocks.JUDGEMENT_false, "false"]
        ]), "VALUE");
        this.appendDummyInput()
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.true_or_false = function (sprite, script) {
    var value = script.children[0].textContent;
    return value == "true";
};

Blockly.Blocks.True = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_true, "#3D3D3D")
            .appendField(" ");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.True = function (sprite, script) {
    return true;
};

Blockly.Blocks.False = {
    init: function() {
        this.setColour("#AEB8FF");
        this.appendDummyInput()
            .appendField(Lang.Blocks.JUDGEMENT_false, "#3D3D3D")
            .appendField(" ");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Entry.block.False = function (sprite, script) {
    return false;
};

Blockly.Blocks.boolean_basic_operator = {
  init: function() {
    this.setColour("#AEB8FF");
    this.appendValueInput("LEFTHAND")
        .setCheck(['String', 'Number']);
    this.appendDummyInput("VALUE")
    .appendField(new Blockly.FieldDropdown([
      ["=","EQUAL"],
      [">","GREATER"],
      ["<","LESS"],
      ["≥","GREATER_OR_EQUAL"],
      ["≤","LESS_OR_EQUAL"]
      ], null, false), "OPERATOR");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Boolean');
    this.setInputsInline(true);
  }
};

Entry.block.boolean_basic_operator = function (sprite, script) {
    var operator = script.getField("OPERATOR", script);
    var leftValue = script.getStringValue("LEFTHAND", script);
    var rightValue = script.getStringValue("RIGHTHAND", script);

    switch(operator) {
        case 'EQUAL':
            return leftValue == rightValue;
        case 'GREATER':
            return Number(leftValue) > Number(rightValue);
        case 'LESS':
            return Number(leftValue) < Number(rightValue);
        case 'GREATER_OR_EQUAL':
            return Number(leftValue) >= Number(rightValue);
        case 'LESS_OR_EQUAL':
            return Number(leftValue) <= Number(rightValue);
    }
};
