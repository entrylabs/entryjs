"use strict";

var categoryColor = '#FF9E20';
// 그리기 시작하기
Blockly.Blocks.start_drawing = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_start_drawing)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.start_drawing = function (sprite, script) {

    if (sprite.brush)
        sprite.brush.stop = false;
    else
        Entry.setBasicBrush(sprite);

    Entry.stage.sortZorder();
    sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);

    return script.callReturn();
};


// 그리기 멈추기
Blockly.Blocks.stop_drawing = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_stop_drawing)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.stop_drawing = function (sprite, script) {
    if (sprite.brush && sprite.shape)
        sprite.brush.stop = true;

    return script.callReturn();
};

// 색깔을 [★] 로 정하기
Blockly.Blocks.set_color = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_color_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldColour('#ff0000'),'VALUE');
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_color_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.set_color = function (sprite, script) {
    var colour = script.getField("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }

    if (sprite.brush) {
        var rgb = Entry.hex2rgb(colour);
        sprite.brush.rgb = rgb;
        sprite.brush.endStroke();
        sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");

        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();
};

// 랜덤 색갈 정하기
Blockly.Blocks.set_random_color = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_random_color)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.set_random_color = function (sprite, script) {
    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }

    if (sprite.brush) {
        var rgb = Entry.generateRgb();
        sprite.brush.rgb = rgb;
        sprite.brush.endStroke();
        sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");

        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
};

// 굵기를 () 만큼 바꾸기
Blockly.Blocks.change_thickness = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_change_thickness_1);
    this.appendValueInput("VALUE")
        .setCheck(['Number','Boolean']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_change_thickness_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.change_thickness = function (sprite, script) {
    var thickness = script.getNumberValue("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }

    if (sprite.brush) {
        sprite.brush.thickness += thickness;
        if (sprite.brush.thickness < 1)
            sprite.brush.thickness = 1;

        sprite.brush.setStrokeStyle(sprite.brush.thickness);

        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();
};

// 굵기를 () 로 정하기
Blockly.Blocks.set_thickness = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_thickness_1);
    this.appendValueInput("VALUE")
        .setCheck(['Number','Boolean']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_thickness_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.set_thickness = function (sprite, script) {
    var thickness = script.getNumberValue("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }

    if (sprite.brush) {
        sprite.brush.thickness = thickness;
        sprite.brush.setStrokeStyle(sprite.brush.thickness);

        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();
};

// 투명도를 () 로 바꾸기
Blockly.Blocks.change_opacity = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_change_opacity_1);
    this.appendValueInput("VALUE")
        .setCheck(['Number', 'Boolean']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_change_opacity_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.change_opacity = function (sprite, script) {
    var opacity = script.getNumberValue("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }
    opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity + opacity, 0, 100);

    if (sprite.brush) {
        sprite.brush.opacity = opacity;
        sprite.brush.endStroke();
        var rgb = sprite.brush.rgb;
        sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");
        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();
};


// 투명도를 () 로 정하기
Blockly.Blocks.set_opacity = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_opacity_1);
    this.appendValueInput("VALUE")
        .setCheck(['Number', 'Boolean']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_opacity_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.set_opacity = function (sprite, script) {
    var opacity = script.getNumberValue("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }

    if (sprite.brush) {
        sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);
        sprite.brush.endStroke();
        var rgb = sprite.brush.rgb;
        sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");
        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();

};

// 모두 지우기
Blockly.Blocks.brush_erase_all = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_brush_erase_all)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.brush_erase_all = function (sprite, script) {
    var brush = sprite.brush;
    if (brush) {
        var stroke = brush._stroke.style;
        var style = brush._strokeStyle.width;
        brush.clear().setStrokeStyle(style).beginStroke(stroke);
        brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    var stampEntities = sprite.parent.getStampEntities();
    stampEntities.map(function (entity) {
        entity.removeClone();
    });
    stampEntities = null;

    return script.callReturn();
}

Blockly.Blocks.brush_stamp = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_stamp)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.brush_stamp = function (sprite, script) {
    sprite.parent.addStampEntity(sprite);

    return script.callReturn();
}

Blockly.Blocks.change_brush_transparency = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_change_brush_transparency_1);
    this.appendValueInput("VALUE")
        .setCheck(['Number', 'Boolean']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_change_brush_transparency_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.change_brush_transparency = function (sprite, script) {
    var opacity = script.getNumberValue("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }
    opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity - opacity, 0, 100);

    if (sprite.brush) {
        sprite.brush.opacity = opacity;
        sprite.brush.endStroke();
        var rgb = sprite.brush.rgb;
        sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");
        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();
};

Blockly.Blocks.set_brush_tranparency = {
  init: function() {
    this.setColour(categoryColor);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_brush_transparency_1);
    this.appendValueInput("VALUE")
        .setCheck(['Number', 'Boolean']);
    this.appendDummyInput()
        .appendField(Lang.Blocks.BRUSH_set_brush_transparency_2)
        .appendField(new Blockly.FieldIcon('/img/assets/block_icon/entry_icon_brush.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Entry.block.set_brush_tranparency = function (sprite, script) {
    var opacity = script.getNumberValue("VALUE", script);

    if (!sprite.brush) {
        Entry.setBasicBrush(sprite);
        sprite.brush.stop = true;
    }

    if (sprite.brush) {
        sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);
        sprite.brush.endStroke();
        var rgb = sprite.brush.rgb;
        sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(1 - sprite.brush.opacity/100)+")");
        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
    }

    return script.callReturn();

};
