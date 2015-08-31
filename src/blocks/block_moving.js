"use strict";

// 바라보는 방향으로 ()픽셀 만큼 움직이기
Blockly.Blocks.move_direction = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_direction_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_direction_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.move_direction = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setX(sprite.getX() + value * Math.cos((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));
    sprite.setY(sprite.getY() - value * Math.sin((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

// x좌표를 () 만큼 움직이기
Blockly.Blocks.move_x = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_x_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_x_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.move_x = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setX(sprite.getX() + value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

// y좌표를  () 만큼 움직이기
Blockly.Blocks.move_y = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_y_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_y_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.move_y = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setY(sprite.getY() + value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

Blockly.Blocks.locate_xy_time = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_time_1);
    this.appendValueInput("VALUE1")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_time_2);
    this.appendValueInput("VALUE2")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_time_3);
    this.appendValueInput("VALUE3")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_time_4)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.locate_xy_time = function (sprite, script) {
    if (!script.isStart) {
        var timeValue;
        timeValue = script.getNumberValue("VALUE1", script);
        var xValue = script.getNumberValue("VALUE2", script) - sprite.getX();
        var yValue = script.getNumberValue("VALUE3", script) - sprite.getY();
        script.isStart = true;
        script.frameCount = Math.floor(timeValue * Entry.FPS)
        script.dX = xValue/script.frameCount;
        script.dY = yValue/script.frameCount;
    }
    if (script.frameCount != 0) {
        sprite.setX(sprite.getX() + script.dX);
        sprite.setY(sprite.getY() + script.dY);
        script.frameCount--;
        if (sprite.brush && !sprite.brush.stop) {
            sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
        }
        return script;
    } else {
        delete script.isStart;
        delete script.frameCount;
        return script.callReturn();
    }
};

// ()도 만큼 전하기
Blockly.Blocks.rotate_by_angle = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_by_angle = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setRotation(sprite.getRotation() + value);
    return script.callReturn();
};

Blockly.Blocks.rotate_by_angle_dropdown = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["45","45"],
            ["90","90"],
            ["135","135"],
            ["180","180"]]), "VALUE")
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_by_angle_dropdown = function (sprite, script) {
    var value = script.getField("VALUE", script);
    sprite.setRotation(sprite.getRotation() + Number(value));
    return script.callReturn();
};

// ()도 방향 보기
Blockly.Blocks.see_angle = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.see_angle = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setDirection(value);
    return script.callReturn();
};

// ~쪽 방향보기 **popup
Blockly.Blocks.see_direction = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_direction_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_direction_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.see_direction = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var targetEntity = Entry.container.getEntity(targetId);//fuck
    var deltaX = targetEntity.getX() - sprite.getX();
    var deltaY = targetEntity.getY() - sprite.getY();
    if (deltaX>=0) {
        sprite.setRotation(Math.atan(deltaY / deltaX) / Math.PI * 180 + 90);
    } else {
        sprite.setRotation(Math.atan(deltaY / deltaX) / Math.PI * 180 + 270);
    }
    return script.callReturn();
};

// X, Y 위치로 가기
Blockly.Blocks.locate_xy = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_1);
    this.appendValueInput("VALUE1")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_2);
    this.appendValueInput("VALUE2")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_xy_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.locate_xy = function (sprite, script) {
    var value1 = script.getNumberValue("VALUE1", script);
    sprite.setX(value1);
    var value2 = script.getNumberValue("VALUE2", script);
    sprite.setY(value2);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

// X:() 위치로 가기
Blockly.Blocks.locate_x = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_x_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_x_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.locate_x = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setX(value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

// Y:() 위치로 가기
Blockly.Blocks.locate_y = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_y_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_y_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.locate_y = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    //sprite.y = 340 - value;
    sprite.setY(value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

// ~위치로 가기 **popup
Blockly.Blocks.locate = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.locate = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var x,y;
    if (targetId == 'mouse') {
        x = Entry.stage.mouseCoordinate.x;
        y = Entry.stage.mouseCoordinate.y;
    } else {
        var targetEntity = Entry.container.getEntity(targetId);
        x = targetEntity.getX();
        y = targetEntity.getY();
    }
    sprite.setX(Number(x));
    sprite.setY(Number(y));
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(x, y*-1);
    }
    return script.callReturn();
};

Blockly.Blocks.move_xy_time = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_xy_time_1);
    this.appendValueInput("VALUE1")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_xy_time_2);
    this.appendValueInput("VALUE2")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_xy_time_3);
    this.appendValueInput("VALUE3")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_xy_time_4)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.move_xy_time = function (sprite, script) {
    if (!script.isStart) {
        var timeValue;
        timeValue = script.getNumberValue("VALUE1", script);
        var xValue = script.getNumberValue("VALUE2", script);
        var yValue = script.getNumberValue("VALUE3", script);
        script.isStart = true;
        script.frameCount = Math.floor(timeValue * Entry.FPS)
        script.dX = xValue/script.frameCount;
        script.dY = yValue/script.frameCount;
    }
    if (script.frameCount != 0) {
        sprite.setX(sprite.getX() + script.dX);
        sprite.setY(sprite.getY() + script.dY);
        script.frameCount--;
        if (sprite.brush && !sprite.brush.stop) {
            sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
        }
        return script;
    } else {
        delete script.isStart;
        delete script.frameCount;
        return script.callReturn();
    }
};


//() 초 동안 ~ 위치로 가기 **popup
Blockly.Blocks.locate_time = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_time_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_time_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_time_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

//Entry.block.locate_time = function (sprite, script) {
    //return script.callReturn();
//};

//() 초 동안 () 만큼 회전하기
Blockly.Blocks.rotate_by_angle_time = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_time_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_time_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldAngle("90"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_by_angle_time_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_by_angle_time = function (sprite, script) {
    if (!script.isStart) {
        var timeValue;
        timeValue = script.getNumberValue("VALUE", script);
        var angleValue = script.getNumberField("VALUE", script);
        script.isStart = true;
        script.frameCount = Math.floor(timeValue * Entry.FPS)
        script.dAngle = angleValue/script.frameCount;
    }
    if (script.frameCount != 0) {
        sprite.setRotation(sprite.getRotation() + script.dAngle);
        script.frameCount--;
        return script;
    } else {
        delete script.isStart;
        delete script.frameCount;
        return script.callReturn();
    }
};

// (▼) 에 닿으면 튕기기 **popup
Blockly.Blocks.bounce_when = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_bounce_when_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("bounce"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_bounce_when_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setPreviousStatement(true);
    this.setInputsInline(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.bounce_wall = {
  init: function() {
    this.setColour('#A751E3');
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_bounce_wall)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.bounce_wall = function(sprite, script) {
    var method = sprite.parent.getRotateMethod();
    var bound = sprite.object.getTransformedBounds();
    if (method == 'free')
        var angle = (sprite.getRotation() + sprite.getDirection()).mod(360);
    else
        var angle = sprite.getDirection();
    if ((angle < 90 && angle >= 0) || (angle < 360 && angle >= 270)) {
        if (ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,0,true)) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
            else
                sprite.setDirection(- sprite.getDirection() + 180);
        }
    }
    else if (angle < 270 && angle >= 90) {
        if (ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,0,true)) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
            else
                sprite.setDirection(- sprite.getDirection() + 180);
        }
    }
    if (angle < 360 && angle >= 180) {
        if (ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,0,true)) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
            else
                sprite.setDirection(- sprite.getDirection() + 360);
        }
    }
    else if (angle < 180 && angle >= 0) {
        if (ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,0,true)) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
            else
                sprite.setDirection(- sprite.getDirection() + 360);
        }
    }
    return script.callReturn();
};

//화살표 방향 좌우 뒤집기
Blockly.Blocks.flip_arrow_horizontal = {
  init: function(){
    this.setColour('#A751E3');
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_flip_arrow_horizontal)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.flip_arrow_horizontal = function (sprite, script) {
    sprite.setDirection(sprite.getDirection() + 180);
    return script.callReturn();
};

//화살표 방향 좌우 뒤집기
Blockly.Blocks.flip_arrow_vertical = {
  init: function() {
    this.setColour('#A751E3');
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_flip_arrow_vertical)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.flip_arrow_vertical = function (sprite, script) {
    sprite.setDirection(sprite.getDirection() + 180);
    return script.callReturn();
};

Blockly.Blocks.see_angle_object = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_object_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "VALUE");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_object_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.see_angle_object = function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var spriteX = sprite.getX();
    var spriteY = sprite.getY();
    var deltaX, deltaY;

    if (sprite.parent.id == targetId)
        return script.callReturn();

    if ( targetId == 'mouse' ) {
        var mX = Entry.stage.mouseCoordinate.x;
        var mY = Entry.stage.mouseCoordinate.y;

        deltaX = mX - spriteX;
        deltaY = mY - spriteY;
    } else {
        var targetEntity = Entry.container.getEntity(targetId);
        deltaX = targetEntity.getX() - spriteX;
        deltaY = targetEntity.getY() - spriteY;
    }

    if ( deltaX >= 0 ) {
        var value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;
    } else {
        var value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;
    }
    var nativeDirection = sprite.getDirection() + sprite.getRotation();
    sprite.setRotation(sprite.getRotation() + value - nativeDirection);
    return script.callReturn();
};

Blockly.Blocks.see_angle_direction = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_direction_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_direction_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.see_angle_direction = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    var nativeDirection = sprite.getDirection() + sprite.getRotation();
    sprite.setRotation(sprite.getRotation() + value - nativeDirection);
    return script.callReturn();
};


Blockly.Blocks.rotate_direction = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_direction_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_direction_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_direction = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setDirection(value + sprite.getDirection());
    return script.callReturn();
};

Blockly.Blocks.locate_object_time = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_object_time_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_object_time_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "TARGET");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_locate_object_time_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.locate_object_time = function (sprite, script) {
    if (!script.isStart) {
        var timeValue, xValue, yValue;
        var targetId = script.getField("TARGET", script);
        timeValue = script.getNumberValue("VALUE", script);
        var frameCount = Math.floor(timeValue * Entry.FPS);
        var mouseCoordi = Entry.stage.mouseCoordinate;

        if (frameCount != 0) {
            if (targetId == 'mouse') {
                xValue = mouseCoordi.x - sprite.getX();
                yValue = mouseCoordi.y - sprite.getY();
            } else {
                var targetEntity = Entry.container.getEntity(targetId);
                xValue = targetEntity.getX() - sprite.getX();
                yValue = targetEntity.getY() - sprite.getY();
            }
            script.isStart = true;
            script.frameCount = frameCount;
            script.dX = xValue/script.frameCount;
            script.dY = yValue/script.frameCount;
        } else {
            //frame count is zero so execute immediately
            if (targetId == 'mouse') {
                xValue = Number(mouseCoordi.x);
                yValue = Number(mouseCoordi.y);
            } else {
                var targetEntity = Entry.container.getEntity(targetId);
                xValue = targetEntity.getX();
                yValue = targetEntity.getY();
            }
            sprite.setX(xValue);
            sprite.setY(yValue);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    }
    if (script.frameCount != 0) {
        sprite.setX(sprite.getX() + script.dX);
        sprite.setY(sprite.getY() + script.dY);
        script.frameCount--;
        if (sprite.brush && !sprite.brush.stop)
            sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
        return script;
    } else {
        delete script.isStart;
        delete script.frameCount;
        return script.callReturn();
    }
};

Blockly.Blocks.rotate_absolute = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_set_direction_by_angle_1)
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_set_direction_by_angle_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_absolute = function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setRotation(value);
    return script.callReturn();
};

Blockly.Blocks.rotate_relative = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_add_direction_by_angle_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_add_direction_by_angle_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_relative = function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setRotation(value + entity.getRotation());
    return script.callReturn();
};

Blockly.Blocks.direction_absolute = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_see_angle_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.direction_absolute = function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setDirection(value);
    return script.callReturn();
};

Blockly.Blocks.direction_relative = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_direction_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_rotate_direction_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.direction_relative = function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setDirection(value + entity.getDirection());
    return script.callReturn();
};

Blockly.Blocks.move_to_angle = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_direction_angle_1)
    this.appendValueInput("ANGLE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_direction_angle_2)
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_move_direction_angle_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.move_to_angle = function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    var angle = script.getNumberValue("ANGLE", script);
    sprite.setX(sprite.getX() + value * Math.cos((angle - 90) / 180 * Math.PI));
    sprite.setY(sprite.getY() - value * Math.sin((angle - 90) / 180 * Math.PI));
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

Blockly.Blocks.rotate_by_time = {
  init: function() {
    this.setColour("#A751E3");
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_2);
    this.appendValueInput("ANGLE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_3)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/moving_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.rotate_by_time = function (sprite, script) {
    if (!script.isStart) {
        var timeValue;
        timeValue = script.getNumberValue("VALUE", script);
        var angleValue = script.getNumberValue("ANGLE", script);
        script.isStart = true;
        script.frameCount = Math.floor(timeValue * Entry.FPS)
        script.dAngle = angleValue/script.frameCount;
    }
    if (script.frameCount != 0) {
        sprite.setRotation(sprite.getRotation() + script.dAngle);
        script.frameCount--;
        return script;
    } else {
        delete script.isStart;
        delete script.frameCount;
        return script.callReturn();
    }
};
