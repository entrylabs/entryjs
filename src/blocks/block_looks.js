"use strict";

// 보이기
Blockly.Blocks.show = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_show)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.show = function (sprite, script) {
    sprite.setVisible(true);
    return script.callReturn();
};

// 숨기기
Blockly.Blocks.hide = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_hide)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.hide = function (sprite, script) {
    sprite.setVisible(false);
    return script.callReturn();
};

// [] 를 () 초 동안 (말하기▼)  **popup
Blockly.Blocks.dialog_time = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_time_1);
    this.appendValueInput("VALUE")
        .setCheck(['String','Number', null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_time_2);
    this.appendValueInput("SECOND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_time_3);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.speak, "speak"]
        ]), "OPTION");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_time_4)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dialog_time = function (sprite, script) {
    if (!script.isStart) {
        var timeValue = script.getNumberValue("SECOND", script);
        var message = script.getStringValue("VALUE", script);
        var mode = script.getField("OPTION", script);
        script.isStart = true;
        script.timeFlag = 1;
        if (!message && typeof message != 'number')
            message = '    ';
        message = Entry.convertToRoundedDecimals(message, 3);
        new Entry.Dialog(sprite, message, mode);
        sprite.syncDialogVisible(sprite.getVisible());
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue * 1000);
    }
    if (script.timeFlag == 0) {
        delete script.timeFlag;
        delete script.isStart;
        if(sprite.dialog)   sprite.dialog.remove();
        return script.callReturn();
    } else
        return script;
};

Blockly.Blocks.dialog = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_1);
    this.appendValueInput("VALUE")
        .setCheck(['String','Number', null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.speak, "speak"]
        ]), "OPTION");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_dialog_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dialog = function (sprite, script) {
    var message = script.getStringValue("VALUE", script);
    if (!message && typeof message != 'number') {
        message = '    ';
    }
    var mode = script.getField("OPTION", script);
    message = Entry.convertToRoundedDecimals(message, 3);
    new Entry.Dialog(sprite, message, mode);
    sprite.syncDialogVisible(sprite.getVisible());
    return script.callReturn();
};

Blockly.Blocks.remove_dialog = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_remove_dialog)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.remove_dialog = function (sprite, script) {
    if(sprite.dialog)   sprite.dialog.remove();
    return script.callReturn();
}

// (▼)번째 모양으로 바꾸기 **popup
Blockly.Blocks.change_to_nth_shape = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_to_nth_shape_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("pictures"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_to_nth_shape = function (sprite, script) {
    var imageId = script.getField("VALUE", script);
    var picture = sprite.parent.getPicture(imageId);
    sprite.setImage(picture);
    return script.callReturn();
};

// 다음 모양으로 바꾸기
Blockly.Blocks.change_to_next_shape = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_to_next_shape)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_to_next_shape = function (sprite, script) {
    var picture = sprite.parent.getNextPicture(sprite.picture.id);
    sprite.setImage(picture);
    return script.callReturn();
};

// (▼) 효과를 () 만큼 주기
Blockly.Blocks.set_effect_volume = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
        [Lang.Blocks.color, "color"],
        [Lang.Blocks.brightness, "brightness"],
        [Lang.Blocks.opacity, "opacity"]
        ]), "EFFECT");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_effect_volume_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.set_effect_volume = function (sprite, script) {
    var effect = script.getField("EFFECT", script);
    var effectValue = script.getNumberValue("VALUE", script);
    if (effect == "color") {
        sprite.effect.hue = effectValue + sprite.effect.hue;
    } else if (effect == "lens") {
    } else if (effect == "swriling") {
    } else if (effect == "pixel") {
    } else if (effect == "mosaic") {
    } else if (effect == "brightness") {
        sprite.effect.brightness = effectValue + sprite.effect.brightness;
    } else if (effect == "blur") {
    } else if (effect == "opacity") {
        sprite.effect.alpha = (sprite.effect.alpha + effectValue / 100) ;
    }
    sprite.applyFilter();
    return script.callReturn();
};


// (▼) 효과를 () 로 정하기
Blockly.Blocks.set_effect = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_effect_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
        [Lang.Blocks.color, "color"],
        [Lang.Blocks.brightness, "brightness"],
        [Lang.Blocks.opacity, "opacity"]
        ]), "EFFECT");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_effect_2);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_effect_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.set_effect = function (sprite, script) {
    var effect = script.getField("EFFECT", script);
    var effectValue = script.getNumberValue("VALUE", script);
    if (effect == "color") {
        sprite.effect.hue = effectValue;
    } else if (effect == "lens") {
    } else if (effect == "swriling") {
    } else if (effect == "pixel") {
    } else if (effect == "mosaic") {
    } else if (effect == "brightness") {
        sprite.effect.brightness = effectValue;
    } else if (effect == "blur") {
    } else if (effect == "opacity") {
        sprite.effect.alpha = effectValue / 100;
    }
    sprite.applyFilter();
    return script.callReturn();
};

// 효과 모두 지우기
Blockly.Blocks.erase_all_effects = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_erase_all_effects)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.erase_all_effects = function (sprite, script) {
    sprite.resetFilter();
    return script.callReturn();
};

// 크기를 () % 만큼 바꾸기
Blockly.Blocks.change_scale_percent = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_scale_percent_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_scale_percent_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_scale_percent = function (sprite, script) {
    var scaleValue = (script.getNumberValue("VALUE", script) + 100) / 100;
    sprite.setScaleX(sprite.getScaleX() * scaleValue);
    sprite.setScaleY(sprite.getScaleY() * scaleValue);
    return script.callReturn();
};

// 크기를 () % 로 정하기
Blockly.Blocks.set_scale_percent = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_scale_percent_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_scale_percent_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.set_scale_percent = function (sprite, script) {
    var scaleValue = script.getNumberValue("VALUE", script) / 100;
    var snapshot = sprite.snapshot_;
    sprite.setScaleX(scaleValue * snapshot.scaleX);
    sprite.setScaleY(scaleValue * snapshot.scaleY);
    return script.callReturn();
};

// 크기를 ()  만큼 바꾸기
Blockly.Blocks.change_scale_size = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_scale_percent_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_scale_percent_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_scale_size = function (sprite, script) {
    var sizeValue = script.getNumberValue("VALUE", script);
    sprite.setSize(sprite.getSize() + sizeValue);
    return script.callReturn();
};

// 크기를 () 로 정하기
Blockly.Blocks.set_scale_size = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_scale_percent_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_scale_percent_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.set_scale_size = function (sprite, script) {
    var sizeValue = script.getNumberValue("VALUE", script);
    sprite.setSize(sizeValue);
    return script.callReturn();
};


//y축 플
Blockly.Blocks.flip_y = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_flip_y)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.flip_y = function(sprite, script) {
    sprite.setScaleX((-1)*sprite.getScaleX());
    return script.callReturn();
}

Blockly.Blocks.flip_x = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_flip_x)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.flip_x = function(sprite, script) {
    sprite.setScaleY((-1)*sprite.getScaleY());
    return script.callReturn();
}

Blockly.Blocks.set_object_order = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_object_order_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("objectSequence"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_set_object_order_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.set_object_order = function(sprite, script) {
    var targetIndex = script.getField("VALUE", script);
    //var currentIndex = Entry.container.getBelongedObjectsToScene().indexOf(sprite.parent);
    var currentIndex = Entry.container.getCurrentObjects().indexOf(sprite.parent);

    if (currentIndex > -1) {
        Entry.container.moveElementByBlock(currentIndex, targetIndex);
        return script.callReturn();
    } else
        throw new Error('object is not available');
};

Blockly.Blocks.get_pictures = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField('');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("pictures"), "VALUE")
    this.appendDummyInput()
        .appendField(' ');
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.get_pictures = function (sprite, script) {
    return script.getStringField("VALUE");
};

Blockly.Blocks.change_to_some_shape = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_to_nth_shape_1);
    this.appendValueInput("VALUE")
        .setCheck(["String", "Number"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_to_some_shape = function (sprite, script) {
    var imageId = script.getStringValue("VALUE");
    var value = Entry.parseNumber(imageId);
    var picture = sprite.parent.getPicture(imageId);

    sprite.setImage(picture);
    return script.callReturn();
};

// (▼) 효과를 () 만큼 주기
Blockly.Blocks.add_effect_amount = {
    init: function() {
        this.setColour("#EC4466");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Lang.Blocks.color, "color"],
                [Lang.Blocks.brightness, "brightness"],
                [Lang.Blocks.transparency, "transparency"]
            ]), "EFFECT");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
        this.appendValueInput("VALUE")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_volume_3)
            .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.add_effect_amount = function (sprite, script) {
    var effect = script.getField("EFFECT", script);
    var effectValue = script.getNumberValue("VALUE", script);
    if (effect == "color") {
        sprite.effect.hue = effectValue + sprite.effect.hue;
    } else if (effect == "brightness") {
        sprite.effect.brightness = effectValue + sprite.effect.brightness;
    } else if (effect == "transparency") {
        sprite.effect.alpha = (sprite.effect.alpha - effectValue / 100) ;
    }
    sprite.applyFilter();
    return script.callReturn();
};

// (▼) 효과를 () 로 정하기
Blockly.Blocks.change_effect_amount = {
    init: function() {
        this.setColour("#EC4466");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Lang.Blocks.color, "color"],
                [Lang.Blocks.brightness, "brightness"],
                [Lang.Blocks.transparency, "transparency"]
            ]), "EFFECT");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_2);
        this.appendValueInput("VALUE")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_3)
            .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.change_effect_amount = function (sprite, script) {
    var effect = script.getField("EFFECT", script);
    var effectValue = script.getNumberValue("VALUE", script);
    if (effect == "color") {
        sprite.effect.hue = effectValue;
    } else if (effect == "brightness") {
        sprite.effect.brightness = effectValue;
    } else if (effect == "transparency") {
        sprite.effect.alpha = 1 - (effectValue / 100);
    }
    sprite.applyFilter();
    return script.callReturn();
};


// (▼) 효과를 () 만큼 주기
Blockly.Blocks.set_effect_amount = {
    init: function() {
        this.setColour("#EC4466");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Lang.Blocks.color, "color"],
                [Lang.Blocks.brightness, "brightness"],
                [Lang.Blocks.transparency, "transparency"]
            ]), "EFFECT");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
        this.appendValueInput("VALUE")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_volume_3)
            .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.set_effect_amount = function (sprite, script) {
    var effect = script.getField("EFFECT", script);
    var effectValue = script.getNumberValue("VALUE", script);
    if (effect == "color") {
        sprite.effect.hue = effectValue + sprite.effect.hue;
    } else if (effect == "brightness") {
        sprite.effect.brightness = effectValue + sprite.effect.brightness;
    } else if (effect == "transparency") {
        sprite.effect.alpha = (sprite.effect.alpha - effectValue / 100) ;
    }
    sprite.applyFilter();
    return script.callReturn();
};

// (▼) 효과를 () 로 정하기
Blockly.Blocks.set_entity_effect = {
    init: function() {
        this.setColour("#EC4466");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_1);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Lang.Blocks.color, "color"],
                [Lang.Blocks.brightness, "brightness"],
                [Lang.Blocks.transparency, "transparency"]
            ]), "EFFECT");
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_2);
        this.appendValueInput("VALUE")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.LOOKS_set_effect_3)
            .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.set_entity_effect = function (sprite, script) {
    var effect = script.getField("EFFECT", script);
    var effectValue = script.getNumberValue("VALUE", script);
    if (effect == "color") {
        sprite.effect.hue = effectValue;
    } else if (effect == "brightness") {
        sprite.effect.brightness = effectValue;
    } else if (effect == "transparency") {
        sprite.effect.alpha = 1 - (effectValue / 100);
    }
    sprite.applyFilter();
    return script.callReturn();
};

Blockly.Blocks.change_object_index = {
  init: function() {
    this.setColour("#EC4466");
    this.appendDummyInput()
        .appendField(Lang.Blocks.LOOKS_change_object_index_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.LOOKS_change_object_index_sub_1, "FRONT"],
            [Lang.Blocks.LOOKS_change_object_index_sub_2, "FORWARD"],
            [Lang.Blocks.LOOKS_change_object_index_sub_3, "BACKWARD"],
            [Lang.Blocks.LOOKS_change_object_index_sub_4, "BACK"]
        ]), "LOCATION")
        .appendField(Lang.Blocks.LOOKS_change_object_index_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/looks_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.change_object_index = function(sprite, script) {
    var targetIndex;
    var location = script.getField("LOCATION", script);
    var objects = Entry.container.getCurrentObjects();
    var currentIndex = objects.indexOf(sprite.parent);
    var max = objects.length-1

    if (currentIndex < 0)
        throw new Error('object is not available for current scene');

    switch (location) {
        case 'FRONT':
            targetIndex = 0;
            break;
        case 'FORWARD':
            targetIndex = Math.max(0, currentIndex-1);
            break;
        case 'BACKWARD':
            targetIndex = Math.min(max, currentIndex+1);
            break;
        case 'BACK':
            targetIndex = max;
            break;

    }

    Entry.container.moveElementByBlock(currentIndex, targetIndex);
    return script.callReturn();
};
