"use strict";

// X 좌표값
Blockly.Blocks.number = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
    .appendField(new Blockly.FieldTextInput(""), "NUM")
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.number = function (sprite, script) {
    return script.fields['NUM'];
};

Blockly.Blocks.angle = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
    .appendField(new Blockly.FieldAngle("90"), "ANGLE");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.angle = function (sprite, script) {
    return script.getNumberField("ANGLE");
};

Blockly.Blocks.get_x_coordinate = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_x_coordinate, "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.get_x_coordinate = function (sprite, script) {
    return sprite.getX();
};

// Y 좌표값
Blockly.Blocks.get_y_coordinate = {
  // Numeric value.
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_y_coordinate, "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.get_y_coordinate = function (sprite, script) {
    return sprite.getY();
};

// 방향 각도
Blockly.Blocks.get_angle = {
  // Numeric value.
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_angle, "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.get_angle = function (sprite, script) {
    return parseFloat(sprite.getRotation().toFixed(1));
};

Blockly.Blocks.get_rotation_direction = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_rotation_value,"ROTATION"],
          [Lang.Blocks.CALC_direction_value,"DIRECTION"]
          ]), "OPERATOR");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.get_rotation_direction = function (sprite, script) {
    var o = script.getField("OPERATOR", script);
    if (o.toUpperCase() == 'DIRECTION')
        return parseFloat(sprite.getDirection().toFixed(1));
    else
        return parseFloat(sprite.getRotation().toFixed(1));
};

// (▼) 까지의 거리
Blockly.Blocks.distance_something = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_distance_something_1, "#3D3D3D")
        .appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE")
        .appendField(Lang.Blocks.CALC_distance_something_2, "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.distance_something = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var targetEntity = Entry.container.getEntity(targetId);
    return Math.sqrt(
            Math.pow(sprite.getX() - targetEntity.getX(), 2) +
            Math.pow(sprite.getY() - targetEntity.getY(), 2)
        );
};

//마우스 (xy▼) 좌표
Blockly.Blocks.coordinate_mouse = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_coordinate_mouse_1, "#3D3D3D")
    .appendField(new Blockly.FieldDropdown([["x","x"],["y", "y"]]), "VALUE")
    .appendField(Lang.Blocks.CALC_coordinate_mouse_2, "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.coordinate_mouse = function (sprite, script) {
    var targetCoordinate = script.getField("VALUE", script);
    if (targetCoordinate === 'x') {
        return Number(Entry.stage.mouseCoordinate.x);
    } else {
        return Number(Entry.stage.mouseCoordinate.y);
    }
};

// (오브젝트▼)의 (xy▼) 좌표
Blockly.Blocks.coordinate_object = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_coordinate_object_1, "#3D3D3D")
        .appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE")
        .appendField(Lang.Blocks.CALC_coordinate_object_2, "#3D3D3D")
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.CALC_coordinate_x_value,"x"],
            [Lang.Blocks.CALC_coordinate_y_value, "y"],
            [Lang.Blocks.CALC_coordinate_rotation_value, "rotation"],
            [Lang.Blocks.CALC_coordinate_direction_value, "direction"],
            [Lang.Blocks.CALC_picture_index, "picture_index"],
            [Lang.Blocks.CALC_picture_name, "picture_name"]
            ]), "COORDINATE")
        .appendField(Lang.Blocks.CALC_coordinate_object_3, "#3D3D3D")
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.coordinate_object = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var targetCoordinate = script.getField("COORDINATE", script);
    var targetEntity = Entry.container.getEntity(targetId);
    switch(targetCoordinate) {
        case 'x':
            return targetEntity.getX();
        case 'y':
            return targetEntity.getY();
        case 'rotation':
            return targetEntity.getRotation();
        case 'direction':
            return targetEntity.getDirection();
        case 'picture_index':
            var object = targetEntity.parent;
            var pictures = object.pictures;
            return pictures.indexOf(targetEntity.picture) + 1;
        case 'picture_name':
            var object = targetEntity.parent;
            var pictures = object.pictures;
            var picture = pictures[pictures.indexOf(targetEntity.picture)];
            return picture.name;
    }
};

// () + ()
Blockly.Blocks.calc_basic = {
  init: function() {
    this.setColour("#FFD974");
    this.appendValueInput("LEFTHAND")
        .setCheck(['String', 'Number']);
    this.appendDummyInput("VALUE")
    .appendField(new Blockly.FieldDropdown([
      ["+","PLUS"],
      ["-","MINUS"],
      ["x","MULTI"],
      ["/","DIVIDE"]
      ], null, false), "OPERATOR");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_basic = function (sprite, script) {
    var operator = script.getField("OPERATOR", script);
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    if (operator == "PLUS")
        return leftValue + rightValue;
    else if (operator == "MINUS")
        return leftValue - rightValue;
    else if (operator == "MULTI")
        return leftValue * rightValue;
    else
        return leftValue / rightValue;
};

Blockly.Blocks.calc_plus = {
  init: function() {
    this.setColour("#FFD974");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("+", "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_plus = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue + rightValue;
};

Blockly.Blocks.calc_minus = {
  init: function() {
    this.setColour("#FFD974");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("-", "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_minus = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue - rightValue;
};

Blockly.Blocks.calc_times = {
  init: function() {
    this.setColour("#FFD974");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("x", "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_times = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue * rightValue;
};

Blockly.Blocks.calc_divide = {
  init: function() {
    this.setColour("#FFD974");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("/", "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_divide = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue / rightValue;
};

// () / () 의 나머지
Blockly.Blocks.calc_mod = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_calc_mod_1, "#3D3D3D");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_mod_2, "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_mod_3, "#3D3D3D");
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_mod = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue % rightValue;
};

// () / () 의 몫
Blockly.Blocks.calc_share = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_calc_share_1, "#3D3D3D");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_calc_share_2, "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
    .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_share_3, "#3D3D3D");
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_share = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return Math.floor(leftValue/rightValue);
};

//
Blockly.Blocks.calc_operation = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_operation_of_1, "#3D3D3D");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_operation_of_2, "#3D3D3D");
    this.appendDummyInput("VALUE")
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.CALC_calc_operation_square,"square"],
            [Lang.Blocks.CALC_calc_operation_root, "root"],
            [Lang.Blocks.CALC_calc_operation_sin, "sin"],
            [Lang.Blocks.CALC_calc_operation_cos,"cos"],
            [Lang.Blocks.CALC_calc_operation_tan,"tan"],
            [Lang.Blocks.CALC_calc_operation_asin, "asin"],
            [Lang.Blocks.CALC_calc_operation_acos,"acos"],
            [Lang.Blocks.CALC_calc_operation_atan,"atan"],
            [Lang.Blocks.CALC_calc_operation_log,"log"],
            [Lang.Blocks.CALC_calc_operation_ln,"ln"],
            [Lang.Blocks.CALC_calc_operation_unnatural,"unnatural"],
            [Lang.Blocks.CALC_calc_operation_floor,"floor"],
            [Lang.Blocks.CALC_calc_operation_ceil,"ceil"],
            [Lang.Blocks.CALC_calc_operation_round,"round"],
            [Lang.Blocks.CALC_calc_operation_factorial,"factorial"],
            [Lang.Blocks.CALC_calc_operation_abs,"abs"]
    ]), "VALUE")
    this.setOutput(true, 'Number');
    this.appendDummyInput()
    .appendField(" ");
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_operation = function (sprite, script) {
    var value = script.getNumberValue("LEFTHAND", script);
    var operator = script.getField("VALUE", script);
    var returnVal = 0;
    switch(operator){
        case "square":
            returnVal = value * value;
            break;
        case "factorial":
            returnVal = Entry.factorial(value);
            break;
        case "root":
            returnVal = Math.sqrt(value);
            break;
        case "sin":
            returnVal = Math.sin(Entry.toRadian(value));
            break;
        case "cos":
            returnVal = Math.cos(Entry.toRadian(value));
            break;
        case "tan":
            returnVal = Math.tan(Entry.toRadian(value));
            break;
        case "log":
            returnVal = Math.log(value) / Math.LN10;
            break;
        case "ln":
            returnVal = Math.log(value);
            break;
        case "unnatural":
            returnVal = value - Math.floor(value);
            if (value < 0)
                returnVal = 1 - returnVal;
            break;
        default:
            returnVal = Math[operator](value);
    }
    return Math.round(returnVal*1000)/1000;
};

// () 부터 () 사이의 무작위수
Blockly.Blocks.calc_rand = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_calc_rand_1, "#3D3D3D");
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_calc_rand_2, "#3D3D3D");
    this.appendValueInput("RIGHTHAND")
    .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_calc_rand_3, "#3D3D3D");
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.calc_rand = function (sprite, script) {
    var leftValue = script.getStringValue("LEFTHAND", script);
    var rightValue = script.getStringValue("RIGHTHAND", script);
    var left = Math.min(leftValue, rightValue);
    var right = Math.max(leftValue, rightValue);
    var isLeftFloat = Entry.isFloat(leftValue);
    var isRightFloat = Entry.isFloat(rightValue);
    if (isRightFloat || isLeftFloat)
        return  (Math.random() * (right - left) + left).toFixed(2);
    else
        return  Math.floor((Math.random() * (right - left +1) + left));
};

// 현재 연도
Blockly.Blocks.get_date = {
  // Numeric value.
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_date_1, "#3D3D3D")
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_get_date_year,"YEAR"],
          [Lang.Blocks.CALC_get_date_month,"MONTH"],
          [Lang.Blocks.CALC_get_date_day,"DAY"],
          [Lang.Blocks.CALC_get_date_hour,"HOUR"],
          [Lang.Blocks.CALC_get_date_minute,"MINUTE"],
          [Lang.Blocks.CALC_get_date_second,"SECOND"]
          ]), "VALUE");
    this.appendDummyInput()
        .appendField(" ")
        .appendField(Lang.Blocks.CALC_get_date_2, "#3D3D3D")
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Entry.block.get_date = function (sprite, script) {
    var operator = script.getField("VALUE", script);
    var dateTime = new Date();
    if (operator == "YEAR")
        return dateTime.getFullYear();
    else if (operator == "MONTH")
        return dateTime.getMonth()+1;
    else if (operator == "DAY")
        return dateTime.getDate();
    else if (operator == "HOUR")
        return dateTime.getHours();
    else if (operator == "MINUTE")
        return dateTime.getMinutes();
    else
        return dateTime.getSeconds();
};

// ~의 소리 길이
Blockly.Blocks.get_sound_duration = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_sound_duration_1, "#3D3D3D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_sound_duration_2, "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip('');
  }
};

Entry.block.get_sound_duration = function (sprite, script) {
    var soundId = script.getField("VALUE", script);
    var soundsArr = sprite.parent.sounds;

    for (var i = 0; i < soundsArr.length; i++) {
        if (soundsArr[i].id == soundId)
            return soundsArr[i].duration;
    }
}

Blockly.Blocks.reset_project_timer = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_timer_reset, "#3D3D3D");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  },
  whenAdd: function () {
      Entry.engine.showProjectTimer();
  },
  whenRemove: function (removeBlock) {
      Entry.engine.hideProjectTimer(removeBlock);
  }
};

Entry.block.reset_project_timer = function (sprite, script) {
    Entry.engine.updateProjectTimer(0);
    return script.callReturn();
};

Blockly.Blocks.set_visible_project_timer = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_timer_visible_1, "#3D3D3D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_timer_visible_show,"SHOW"],
          [Lang.Blocks.CALC_timer_visible_hide,"HIDE"]
          ]), "ACTION");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_timer_visible_2, "#3D3D3D");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  },
  whenAdd: function () {
      Entry.engine.showProjectTimer();
  },
  whenRemove: function (removeBlock) {
      Entry.engine.hideProjectTimer(removeBlock);
  }
};

Entry.block.set_visible_project_timer = function (sprite, script) {
    var action = script.getField("ACTION", script);
    var timer = Entry.engine.projectTimer;
    if (action == 'SHOW')
        timer.setVisible(true);
    else
        timer.setVisible(false);

    return script.callReturn();
};

Blockly.Blocks.get_project_timer_value = {
  init: function() {
    this.setColour("#FFD974");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_timer_value, "#3D3D3D")
        .appendField(' ', "#3D3D3D");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  },
  whenAdd: function () {
      Entry.engine.showProjectTimer();
  },
  whenRemove: function (removeBlock) {
      Entry.engine.hideProjectTimer(removeBlock);
  }
};

Entry.block.get_project_timer_value = function (sprite, script) {
    return Entry.engine.projectTimer.getValue();
};
