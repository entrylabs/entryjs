"use strict";

var calcArrowColor = '#e8b349';
var calcBlockColor = '#FFD974';
var calcFontColor = '#3D3D3D';

// X 좌표값
Blockly.Blocks.number = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(new Blockly.FieldTextInput(""), "NUM")
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.number = function (sprite, script) {
    return script.fields['NUM'];
};

Blockly.Blocks.angle = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(new Blockly.FieldAngle("90"), "ANGLE");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.angle = function (sprite, script) {
    return script.getNumberField("ANGLE");
};

Blockly.Blocks.get_x_coordinate = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_x_coordinate, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.get_x_coordinate = function (sprite, script) {
    return sprite.getX();
};

// Y 좌표값
Blockly.Blocks.get_y_coordinate = {
  // Numeric value.
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_y_coordinate, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.get_y_coordinate = function (sprite, script) {
    return sprite.getY();
};

// 방향 각도
Blockly.Blocks.get_angle = {
  // Numeric value.
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_angle, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.get_angle = function (sprite, script) {
    return parseFloat(sprite.getRotation().toFixed(1));
};

Blockly.Blocks.get_rotation_direction = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_rotation_value,"ROTATION"],
          [Lang.Blocks.CALC_direction_value,"DIRECTION"]
          ], null, true, calcArrowColor), "OPERATOR");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_distance_something_1, calcFontColor)
        .appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse", null, true, calcArrowColor), "VALUE")
        .appendField(Lang.Blocks.CALC_distance_something_2, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.distance_something = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    if (targetId == 'mouse') {
        var mousePos = Entry.stage.mouseCoordinate;
        return Math.sqrt(
                Math.pow(sprite.getX() - mousePos.x, 2) +
                Math.pow(sprite.getY() - mousePos.y, 2)
            );
    } else {
        var targetEntity = Entry.container.getEntity(targetId);
        return Math.sqrt(
                Math.pow(sprite.getX() - targetEntity.getX(), 2) +
                Math.pow(sprite.getY() - targetEntity.getY(), 2)
            );
    }
};

//마우스 (xy▼) 좌표
Blockly.Blocks.coordinate_mouse = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_coordinate_mouse_1, calcFontColor)
    .appendField(new Blockly.FieldDropdown([["x","x"],["y", "y"]], null, true, calcArrowColor), "VALUE")
    .appendField(Lang.Blocks.CALC_coordinate_mouse_2, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_coordinate_object_1, calcFontColor)
        .appendField(new Blockly.FieldDropdownDynamic("spritesWithSelf", null, true, calcArrowColor), "VALUE")
        .appendField(Lang.Blocks.CALC_coordinate_object_2, calcFontColor)
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.CALC_coordinate_x_value,"x"],
            [Lang.Blocks.CALC_coordinate_y_value, "y"],
            [Lang.Blocks.CALC_coordinate_rotation_value, "rotation"],
            [Lang.Blocks.CALC_coordinate_direction_value, "direction"],
            [Lang.Blocks.CALC_coordinate_size_value, "size"],
            [Lang.Blocks.CALC_picture_index, "picture_index"],
            [Lang.Blocks.CALC_picture_name, "picture_name"]
            ], null, true, calcArrowColor), "COORDINATE")
        .appendField(Lang.Blocks.CALC_coordinate_object_3, calcFontColor)
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.coordinate_object = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var targetEntity;
    if (targetId == 'self')
        targetEntity = sprite;
    else
        targetEntity = Entry.container.getEntity(targetId);

    var targetCoordinate = script.getField("COORDINATE", script);
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
        case 'size':
            return Number(targetEntity.getSize().toFixed(1));
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
    this.setColour(calcBlockColor);
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
    this.setColour(calcBlockColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("+", calcFontColor);
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.calc_plus = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue + rightValue;
};

Blockly.Blocks.calc_minus = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("-", calcFontColor);
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.calc_minus = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue - rightValue;
};

Blockly.Blocks.calc_times = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("x", calcFontColor);
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.calc_times = function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue * rightValue;
};

Blockly.Blocks.calc_divide = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField("/", calcFontColor);
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_calc_mod_1, calcFontColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_mod_2, calcFontColor);
    this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_mod_3, calcFontColor);
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_calc_share_1, calcFontColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_calc_share_2, calcFontColor);
    this.appendValueInput("RIGHTHAND")
    .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_share_3, calcFontColor);
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_operation_of_1, calcFontColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
        .appendField(Lang.Blocks.CALC_calc_operation_of_2, calcFontColor);
    this.appendDummyInput("VALUE")
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.CALC_calc_operation_square,"square"],
            [Lang.Blocks.CALC_calc_operation_root, "root"],
            [Lang.Blocks.CALC_calc_operation_sin, "sin"],
            [Lang.Blocks.CALC_calc_operation_cos,"cos"],
            [Lang.Blocks.CALC_calc_operation_tan,"tan"],
            [Lang.Blocks.CALC_calc_operation_asin, "asin_radian"],
            [Lang.Blocks.CALC_calc_operation_acos,"acos_radian"],
            [Lang.Blocks.CALC_calc_operation_atan,"atan_radian"],
            [Lang.Blocks.CALC_calc_operation_log,"log"],
            [Lang.Blocks.CALC_calc_operation_ln,"ln"],
            [Lang.Blocks.CALC_calc_operation_unnatural,"unnatural"],
            [Lang.Blocks.CALC_calc_operation_floor,"floor"],
            [Lang.Blocks.CALC_calc_operation_ceil,"ceil"],
            [Lang.Blocks.CALC_calc_operation_round,"round"],
            [Lang.Blocks.CALC_calc_operation_factorial,"factorial"],
            [Lang.Blocks.CALC_calc_operation_abs,"abs"]
    ], null, true, calcArrowColor), "VALUE")
    this.setOutput(true, 'Number');
    this.appendDummyInput()
    .appendField(" ");
    this.setInputsInline(true);
  }
};

Entry.block.calc_operation = function (sprite, script) {
    var value = script.getNumberValue("LEFTHAND", script);
    var operator = script.getField("VALUE", script);
    var xRangeCheckList = ['asin_radian', 'acos_radian'];
    if ((xRangeCheckList.indexOf(operator) > -1) &&
           (value > 1 || value < -1))
            throw new Error('x range exceeded');

    var needToConvertList = ['sin', 'cos', 'tan'];
    if (operator.indexOf('_'))
        operator = operator.split('_')[0];

    if (needToConvertList.indexOf(operator) > -1)
        value = Entry.toRadian(value);

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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_calc_rand_1, calcFontColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_calc_rand_2, calcFontColor);
    this.appendValueInput("RIGHTHAND")
    .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_calc_rand_3, calcFontColor);
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_date_1, calcFontColor)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_get_date_year,"YEAR"],
          [Lang.Blocks.CALC_get_date_month,"MONTH"],
          [Lang.Blocks.CALC_get_date_day,"DAY"],
          [Lang.Blocks.CALC_get_date_hour,"HOUR"],
          [Lang.Blocks.CALC_get_date_minute,"MINUTE"],
          [Lang.Blocks.CALC_get_date_second,"SECOND"]
          ], null, true, calcArrowColor), "VALUE");
    this.appendDummyInput()
        .appendField(" ")
        .appendField(Lang.Blocks.CALC_get_date_2, calcFontColor)
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_sound_duration_1, calcFontColor);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sounds", null, true, calcArrowColor), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_sound_duration_2, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_timer_reset, calcFontColor);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
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
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_timer_visible_1, calcFontColor);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_timer_visible_show,"SHOW"],
          [Lang.Blocks.CALC_timer_visible_hide,"HIDE"]
          ], null, true, calcArrowColor), "ACTION");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_timer_visible_2, calcFontColor)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/calc_01.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
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

Blockly.Blocks.timer_variable = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_timer_value, calcFontColor)
        .appendField(' ', calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.timer_variable = function (sprite, script) {
    return Entry.container.inputValue.getValue();
};



Blockly.Blocks.get_project_timer_value = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_timer_value, calcFontColor)
        .appendField(' ', calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
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

Blockly.Blocks.char_at = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_char_at_1, calcFontColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_char_at_2, calcFontColor);
    this.appendValueInput("RIGHTHAND")
    .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_char_at_3, calcFontColor);
    this.setInputsInline(true);
  }
};

Entry.block.char_at = function (sprite, script) {
    var str = script.getStringValue("LEFTHAND", script);
    var index = script.getNumberValue("RIGHTHAND", script)-1;
    if (index <0 || index >str.length-1)
        throw new Error();
    else
        return str[index];
};

Blockly.Blocks.length_of_string = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_length_of_string_1, calcFontColor);
    this.appendValueInput("STRING")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_length_of_string_2, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.length_of_string = function (sprite, script) {
    return script.getStringValue("STRING", script).length;
};

Blockly.Blocks.substring = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_substring_1, calcFontColor);
    this.appendValueInput("STRING")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_substring_2, calcFontColor);
    this.appendValueInput("START")
    .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_substring_3, calcFontColor);
    this.appendValueInput("END")
    .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_substring_4, calcFontColor);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.substring = function (sprite, script) {
    var str = script.getStringValue("STRING", script);
    var start = script.getNumberValue("START", script)-1;
    var end = script.getNumberValue("END", script)-1;
    var strLen = str.length-1;
    if (start <0 || end<0 || start>strLen || end>strLen)
        throw new Error();
    else
        return str.substring(Math.min(start, end), Math.max(start, end)+1);
};

Blockly.Blocks.replace_string = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_replace_string_1, calcFontColor);
    this.appendValueInput("STRING")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_replace_string_2, calcFontColor);
    this.appendValueInput("OLD_WORD")
    .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_replace_string_3, calcFontColor);
    this.appendValueInput("NEW_WORD")
    .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_replace_string_4, calcFontColor);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.replace_string = function (sprite, script) {
    return script.getStringValue("STRING", script).replace(
        script.getStringValue("OLD_WORD", script),
        script.getStringValue("NEW_WORD", script));
};

Blockly.Blocks.change_string_case = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_change_string_case_1, calcFontColor);
    this.appendValueInput("STRING")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_change_string_case_2, calcFontColor);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_change_string_case_sub_1,"toUpperCase"],
          [Lang.Blocks.CALC_change_string_case_sub_2,"toLowerCase"]
          ], null, true, calcArrowColor), "CASE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_change_string_case_3, calcFontColor);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.change_string_case = function (sprite, script) {
    return script.getStringValue("STRING", script)[script.getField("CASE", script)]();
};

Blockly.Blocks.index_of_string = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
    .appendField(Lang.Blocks.CALC_index_of_string_1, calcFontColor);
    this.appendValueInput("LEFTHAND")
        .setCheck(["Number", "String"]);
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_index_of_string_2, calcFontColor);
    this.appendValueInput("RIGHTHAND")
    .setCheck(["Number", "String"]);
    this.setOutput(true, 'Number');
    this.appendDummyInput("VALUE")
    .appendField(Lang.Blocks.CALC_index_of_string_3, calcFontColor);
    this.setInputsInline(true);
  }
};

Entry.block.index_of_string = function (sprite, script) {
    var str = script.getStringValue("LEFTHAND", script);
    var target = script.getStringValue("RIGHTHAND", script);
    var index = str.indexOf(target);
    return index > -1?index+1:0;
};
//
// combine some text || number to string
Blockly.Blocks.combine_something = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_combine_something_1, calcFontColor);
    this.appendValueInput("VALUE1")
        .setCheck(['String','Number', null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_combine_something_2, calcFontColor);
    this.appendValueInput("VALUE2")
        .setCheck(['String','Number', null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.VARIABLE_combine_something_3, calcFontColor);
    this.setInputsInline(true);
    this.setOutput(true, 'String');
  }
};

Entry.block.combine_something = function (sprite, script) {
    var leftValue = script.getStringValue("VALUE1", script);
    var rightValue = script.getStringValue("VALUE2", script);

    if (!isNaN(leftValue))
        leftValue = Entry.convertToRoundedDecimals(leftValue, 3);
    if (!isNaN(rightValue))
        rightValue = Entry.convertToRoundedDecimals(rightValue, 3);
    return leftValue + rightValue;
}

Blockly.Blocks.get_sound_volume = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_get_sound_volume, calcFontColor)
        .appendField(' ', calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.get_sound_volume = function (sprite, script) {
    return createjs.Sound.getVolume() * 100;
};

Blockly.Blocks.quotient_and_mod = {
  init: function() {
      this.setColour(calcBlockColor);
      if (Lang.type == 'ko') {
        this.appendDummyInput()
            .appendField(Lang.Blocks.CALC_quotient_and_mod_1, calcFontColor);
        this.appendValueInput("LEFTHAND")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.CALC_quotient_and_mod_2, calcFontColor);
        this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.CALC_quotient_and_mod_3, calcFontColor)
            .appendField(new Blockly.FieldDropdown([
              [Lang.Blocks.CALC_quotient_and_mod_sub_1,"QUOTIENT"],
              [Lang.Blocks.CALC_quotient_and_mod_sub_2,"MOD"]
              ], null, true, calcArrowColor), "OPERATOR");
      } else if (Lang.type == 'en') {
        this.appendDummyInput()
            .appendField(Lang.Blocks.CALC_quotient_and_mod_1, calcFontColor)
            .appendField(new Blockly.FieldDropdown([
              [Lang.Blocks.CALC_quotient_and_mod_sub_1,"QUOTIENT"],
              [Lang.Blocks.CALC_quotient_and_mod_sub_2,"MOD"]
              ], null, true, calcArrowColor), "OPERATOR");
        this.appendDummyInput()
            .appendField(Lang.Blocks.CALC_quotient_and_mod_2, calcFontColor);
        this.appendValueInput("LEFTHAND")
            .setCheck(["Number", "String"]);
        this.appendDummyInput()
            .appendField(Lang.Blocks.CALC_quotient_and_mod_3, calcFontColor);
        this.appendValueInput("RIGHTHAND")
        .setCheck(["Number", "String"]);
      }
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_quotient_and_mod_4, calcFontColor);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.quotient_and_mod = function (sprite, script) {
    var left = script.getNumberValue("LEFTHAND", script);
    var right = script.getNumberValue("RIGHTHAND", script);
    if (isNaN(left) || isNaN(right))
        throw new Error();
    var operator = script.getField("OPERATOR", script);
    if (operator == 'QUOTIENT')
        return Math.floor(left/right);
    else
        return left % right;
};

Blockly.Blocks.choose_project_timer_action = {
  init: function() {
    this.setColour(calcBlockColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.CALC_choose_project_timer_action_1, calcFontColor)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CALC_choose_project_timer_action_sub_1,"START"],
          [Lang.Blocks.CALC_choose_project_timer_action_sub_2,"STOP"],
          [Lang.Blocks.CALC_choose_project_timer_action_sub_3,"RESET"]
          ], null, true, calcArrowColor), "ACTION")
        .appendField(Lang.Blocks.CALC_choose_project_timer_action_2, calcFontColor)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/calc_01.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  whenAdd: function () {
      Entry.engine.showProjectTimer();
  },
  whenRemove: function (removeBlock) {
      Entry.engine.hideProjectTimer(removeBlock);
  }
};

Entry.block.choose_project_timer_action = function (sprite, script) {
    var action = script.getField('ACTION');
    var engine = Entry.engine;
    var timer = engine.projectTimer;

    if (action == 'START') {
        if (!timer.isInit) {
            engine.startProjectTimer();
        }
        else if (timer.isInit && timer.isPaused) {
            if (timer.pauseStart)
                timer.pausedTime += (new Date()).getTime() - timer.pauseStart;
            delete timer.pauseStart;
            timer.isPaused = false;
        }
    } else if (action == 'STOP') {
        if (timer.isInit && !timer.isPaused) {
            timer.isPaused = true;
            timer.pauseStart = (new Date()).getTime();
        }
    } else if (action == 'RESET') {
        if (timer.isInit) {
            timer.setValue(0);
            timer.start = (new Date()).getTime();
            timer.pausedTime = 0;
            delete timer.pauseStart;
        }

    }
    return script.callReturn();
};
