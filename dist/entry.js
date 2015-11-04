var Entry = {block:{}, DRAG_MODE_NONE:0, DRAG_MODE_MOUSEDOWN:1, DRAG_MODE_DRAG:2};
window.Entry = Entry;
Blockly.Blocks.arduino_text = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput("Arduino"), "NAME");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.arduino_text = function(b, a) {
  return a.getStringField("NAME");
};
Blockly.Blocks.arduino_send = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_send_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_send_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.arduino_send = function(b, a) {
  var c = a.getValue("VALUE", a), d = new XMLHttpRequest;
  d.open("POST", "http://localhost:23518/arduino/", !1);
  d.send(String(c));
  Entry.assert(200 == d.status, "arduino is not connected");
  return a.callReturn();
};
Blockly.Blocks.arduino_get_string = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_get_string_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_get_string_2);
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.arduino_get_number = function(b, a) {
  var c = a.getValue("VALUE", a), d = new XMLHttpRequest;
  d.open("POST", "http://localhost:23518/arduino/", !1);
  d.send(String(c));
  Entry.assert(200 == d.status, "arduino is not connected");
  return Number(d.responseText);
};
Blockly.Blocks.arduino_get_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_get_number_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_get_number_2);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.arduino_get_string = function(b, a) {
  var c = a.getValue("VALUE", a), d = new XMLHttpRequest;
  d.open("POST", "http://localhost:23518/arduino/", !1);
  d.send(String(c));
  Entry.assert(200 == d.status, "arduino is not connected");
  return d.responseText;
};
Blockly.Blocks.arduino_get_sensor_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.ARDUINO_arduino_get_sensor_number_0, "A0"], [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1, "A1"], [Lang.Blocks.ARDUINO_arduino_get_sensor_number_2, "A2"], [Lang.Blocks.ARDUINO_arduino_get_sensor_number_3, "A3"], [Lang.Blocks.ARDUINO_arduino_get_sensor_number_4, "A4"], [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5, "A5"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.arduino_get_sensor_number = function(b, a) {
  return a.getStringField("PORT");
};
Blockly.Blocks.arduino_get_port_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.arduino_get_port_number = function(b, a) {
  return a.getStringField("PORT");
};
Blockly.Blocks.arduino_get_pwm_port_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.arduino_get_pwm_port_number = function(b, a) {
  return a.getStringField("PORT");
};
Blockly.Blocks.arduino_get_number_sensor_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_sensor_value_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_sensor_value_2);
  this.setInputsInline(!0);
  this.setOutput(!0, "Number");
  this.setTooltip("");
}};
Entry.block.arduino_get_number_sensor_value = function(b, a) {
  var c = a.getValue("VALUE", a);
  return Entry.hw.getAnalogPortValue(c[1]);
};
Blockly.Blocks.arduino_get_digital_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_get_digital_value_1);
  this.appendValueInput("VALUE").setCheck("Number");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_sensor_value_2);
  this.setInputsInline(!0);
  this.setOutput(!0, "Boolean");
  this.setTooltip("");
}};
Entry.block.arduino_get_digital_value = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  return Entry.hw.getDigitalPortValue(c);
};
Blockly.Blocks.arduino_toggle_led = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_pin_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_pin_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.ARDUINO_on, "on"], [Lang.Blocks.ARDUINO_off, "off"]]), "OPERATOR").appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_arduino.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.arduino_toggle_led = function(b, a) {
  var c = a.getNumberValue("VALUE"), d = "on" == a.getField("OPERATOR") ? 255 : 0;
  Entry.hw.setDigitalPortValue(c, d);
  return a.callReturn();
};
Blockly.Blocks.arduino_toggle_pwm = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_toggle_pwm_1);
  this.appendValueInput("PORT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_toggle_pwm_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_toggle_pwm_3);
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_arduino.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.arduino_toggle_pwm = function(b, a) {
  var c = a.getNumberValue("PORT"), d = a.getNumberValue("VALUE"), d = Math.round(d), d = Math.max(d, 0), d = Math.min(d, 255);
  Entry.hw.setDigitalPortValue(c, d);
  return a.callReturn();
};
Blockly.Blocks.arduino_convert_scale = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_1);
  this.appendValueInput("VALUE1").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_2);
  this.appendValueInput("VALUE2").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_3);
  this.appendValueInput("VALUE3").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_4);
  this.appendValueInput("VALUE4").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_5);
  this.appendValueInput("VALUE5").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_6);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.arduino_convert_scale = function(b, a) {
  var c = a.getNumberValue("VALUE1", a), d = a.getNumberValue("VALUE2", a), e = a.getNumberValue("VALUE3", a), f = a.getNumberValue("VALUE4", a), g = a.getNumberValue("VALUE5", a);
  if (d > e) {
    var h = d, d = e, e = h
  }
  f > g && (h = f, f = g, g = h);
  c -= d;
  c *= (g - f) / (e - d);
  c += f;
  c = Math.min(g, c);
  c = Math.max(f, c);
  return Math.round(c);
};
var categoryColor = "#FF9E20";
Blockly.Blocks.start_drawing = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_start_drawing).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.start_drawing = function(b, a) {
  b.brush ? b.brush.stop = !1 : Entry.setBasicBrush(b);
  Entry.stage.sortZorder();
  b.brush.moveTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.stop_drawing = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_stop_drawing).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.stop_drawing = function(b, a) {
  b.brush && b.shape && (b.brush.stop = !0);
  return a.callReturn();
};
Blockly.Blocks.set_color = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_color_1);
  this.appendDummyInput().appendField(new Blockly.FieldColour("#ff0000"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_color_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_color = function(b, a) {
  var c = a.getField("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  b.brush && (c = Entry.hex2rgb(c), b.brush.rgb = c, b.brush.endStroke(), b.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + b.brush.opacity / 100 + ")"), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.set_random_color = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_random_color).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_random_color = function(b, a) {
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  if (b.brush) {
    var c = Entry.generateRgb();
    b.brush.rgb = c;
    b.brush.endStroke();
    b.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + b.brush.opacity / 100 + ")");
    b.brush.moveTo(b.getX(), -1 * b.getY());
  }
  return a.callReturn();
};
Blockly.Blocks.change_thickness = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_thickness_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_thickness_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_thickness = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  b.brush && (b.brush.thickness += c, 1 > b.brush.thickness && (b.brush.thickness = 1), b.brush.setStrokeStyle(b.brush.thickness), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.set_thickness = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_thickness_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_thickness_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_thickness = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  b.brush && (b.brush.thickness = c, b.brush.setStrokeStyle(b.brush.thickness), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.change_opacity = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_opacity_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_opacity_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_opacity = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  c = Entry.adjustValueWithMaxMin(b.brush.opacity + c, 0, 100);
  b.brush && (b.brush.opacity = c, b.brush.endStroke(), c = b.brush.rgb, b.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + b.brush.opacity / 100 + ")"), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.set_opacity = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_opacity_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_opacity_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_opacity = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  b.brush && (b.brush.opacity = Entry.adjustValueWithMaxMin(c, 0, 100), b.brush.endStroke(), c = b.brush.rgb, b.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + b.brush.opacity / 100 + ")"), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.brush_erase_all = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_brush_erase_all).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.brush_erase_all = function(b, a) {
  var c = b.brush;
  if (c) {
    var d = c._stroke.style, e = c._strokeStyle.width;
    c.clear().setStrokeStyle(e).beginStroke(d);
    c.moveTo(b.getX(), -1 * b.getY());
  }
  c = b.parent.getStampEntities();
  c.map(function(a) {
    a.removeClone();
  });
  c = null;
  return a.callReturn();
};
Blockly.Blocks.brush_stamp = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_stamp).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.brush_stamp = function(b, a) {
  b.parent.addStampEntity(b);
  return a.callReturn();
};
Blockly.Blocks.change_brush_transparency = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_brush_transparency_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_brush_transparency_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_brush_transparency = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  c = Entry.adjustValueWithMaxMin(b.brush.opacity - c, 0, 100);
  b.brush && (b.brush.opacity = c, b.brush.endStroke(), c = b.brush.rgb, b.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + b.brush.opacity / 100 + ")"), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.set_brush_tranparency = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_brush_transparency_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_brush_transparency_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_brush_tranparency = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.brush || (Entry.setBasicBrush(b), b.brush.stop = !0);
  b.brush && (b.brush.opacity = Entry.adjustValueWithMaxMin(c, 0, 100), b.brush.endStroke(), c = b.brush.rgb, b.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + (1 - b.brush.opacity / 100) + ")"), b.brush.moveTo(b.getX(), -1 * b.getY()));
  return a.callReturn();
};
Blockly.Blocks.number = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(""), "NUM");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.number = function(b, a) {
  return a.fields.NUM;
};
Blockly.Blocks.angle = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldAngle("90"), "ANGLE");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.angle = function(b, a) {
  return a.getNumberField("ANGLE");
};
Blockly.Blocks.get_x_coordinate = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_x_coordinate, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.get_x_coordinate = function(b, a) {
  return b.getX();
};
Blockly.Blocks.get_y_coordinate = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_y_coordinate, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.get_y_coordinate = function(b, a) {
  return b.getY();
};
Blockly.Blocks.get_angle = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_angle, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.get_angle = function(b, a) {
  return parseFloat(b.getRotation().toFixed(1));
};
Blockly.Blocks.get_rotation_direction = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_rotation_value, "ROTATION"], [Lang.Blocks.CALC_direction_value, "DIRECTION"]]), "OPERATOR");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.get_rotation_direction = function(b, a) {
  return "DIRECTION" == a.getField("OPERATOR", a).toUpperCase() ? parseFloat(b.getDirection().toFixed(1)) : parseFloat(b.getRotation().toFixed(1));
};
Blockly.Blocks.distance_something = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_distance_something_1, "#3D3D3D").appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE").appendField(Lang.Blocks.CALC_distance_something_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.distance_something = function(b, a) {
  var c = a.getField("VALUE", a), c = Entry.container.getEntity(c);
  return Math.sqrt(Math.pow(b.getX() - c.getX(), 2) + Math.pow(b.getY() - c.getY(), 2));
};
Blockly.Blocks.coordinate_mouse = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_coordinate_mouse_1, "#3D3D3D").appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"]]), "VALUE").appendField(Lang.Blocks.CALC_coordinate_mouse_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.coordinate_mouse = function(b, a) {
  return "x" === a.getField("VALUE", a) ? Number(Entry.stage.mouseCoordinate.x) : Number(Entry.stage.mouseCoordinate.y);
};
Blockly.Blocks.coordinate_object = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_coordinate_object_1, "#3D3D3D").appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE").appendField(Lang.Blocks.CALC_coordinate_object_2, "#3D3D3D").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_coordinate_x_value, "x"], [Lang.Blocks.CALC_coordinate_y_value, "y"], [Lang.Blocks.CALC_coordinate_rotation_value, "rotation"], [Lang.Blocks.CALC_coordinate_direction_value, "direction"], [Lang.Blocks.CALC_picture_index, "picture_index"], 
  [Lang.Blocks.CALC_picture_name, "picture_name"]]), "COORDINATE").appendField(Lang.Blocks.CALC_coordinate_object_3, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.coordinate_object = function(b, a) {
  var c = a.getField("VALUE", a), d = a.getField("COORDINATE", a), c = Entry.container.getEntity(c);
  switch(d) {
    case "x":
      return c.getX();
    case "y":
      return c.getY();
    case "rotation":
      return c.getRotation();
    case "direction":
      return c.getDirection();
    case "picture_index":
      return d = c.parent, d = d.pictures, d.indexOf(c.picture) + 1;
    case "picture_name":
      return d = c.parent, d = d.pictures, d[d.indexOf(c.picture)].name;
  }
};
Blockly.Blocks.calc_basic = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["String", "Number"]);
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([["+", "PLUS"], ["-", "MINUS"], ["x", "MULTI"], ["/", "DIVIDE"]], null, !1), "OPERATOR");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_basic = function(b, a) {
  var c = a.getField("OPERATOR", a), d = a.getNumberValue("LEFTHAND", a), e = a.getNumberValue("RIGHTHAND", a);
  return "PLUS" == c ? d + e : "MINUS" == c ? d - e : "MULTI" == c ? d * e : d / e;
};
Blockly.Blocks.calc_plus = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("+", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_plus = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c + d;
};
Blockly.Blocks.calc_minus = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("-", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_minus = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c - d;
};
Blockly.Blocks.calc_times = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("x", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_times = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c * d;
};
Blockly.Blocks.calc_divide = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("/", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_divide = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c / d;
};
Blockly.Blocks.calc_mod = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_mod_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_mod_2, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_mod_3, "#3D3D3D");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_mod = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c % d;
};
Blockly.Blocks.calc_share = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_share_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_share_2, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_share_3, "#3D3D3D");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_share = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return Math.floor(c / d);
};
Blockly.Blocks.calc_operation = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_operation_of_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_operation_of_2, "#3D3D3D");
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_calc_operation_square, "square"], [Lang.Blocks.CALC_calc_operation_root, "root"], [Lang.Blocks.CALC_calc_operation_sin, "sin"], [Lang.Blocks.CALC_calc_operation_cos, "cos"], [Lang.Blocks.CALC_calc_operation_tan, "tan"], [Lang.Blocks.CALC_calc_operation_asin, "asin"], [Lang.Blocks.CALC_calc_operation_acos, "acos"], [Lang.Blocks.CALC_calc_operation_atan, "atan"], [Lang.Blocks.CALC_calc_operation_log, "log"], [Lang.Blocks.CALC_calc_operation_ln, 
  "ln"], [Lang.Blocks.CALC_calc_operation_unnatural, "unnatural"], [Lang.Blocks.CALC_calc_operation_floor, "floor"], [Lang.Blocks.CALC_calc_operation_ceil, "ceil"], [Lang.Blocks.CALC_calc_operation_round, "round"], [Lang.Blocks.CALC_calc_operation_factorial, "factorial"], [Lang.Blocks.CALC_calc_operation_abs, "abs"]]), "VALUE");
  this.setOutput(!0, "Number");
  this.appendDummyInput().appendField(" ");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_operation = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getField("VALUE", a), e = 0;
  switch(d) {
    case "square":
      e = c * c;
      break;
    case "factorial":
      e = Entry.factorial(c);
      break;
    case "root":
      e = Math.sqrt(c);
      break;
    case "sin":
      e = Math.sin(Entry.toRadian(c));
      break;
    case "cos":
      e = Math.cos(Entry.toRadian(c));
      break;
    case "tan":
      e = Math.tan(Entry.toRadian(c));
      break;
    case "log":
      e = Math.log(c) / Math.LN10;
      break;
    case "ln":
      e = Math.log(c);
      break;
    case "unnatural":
      e = c - Math.floor(c);
      0 > c && (e = 1 - e);
      break;
    default:
      e = Math[d](c);
  }
  return Math.round(1E3 * e) / 1E3;
};
Blockly.Blocks.calc_rand = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_rand_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_rand_2, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_rand_3, "#3D3D3D");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.calc_rand = function(b, a) {
  var c = a.getStringValue("LEFTHAND", a), d = a.getStringValue("RIGHTHAND", a), e = Math.min(c, d), f = Math.max(c, d), c = Entry.isFloat(c);
  return Entry.isFloat(d) || c ? (Math.random() * (f - e) + e).toFixed(2) : Math.floor(Math.random() * (f - e + 1) + e);
};
Blockly.Blocks.get_date = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_date_1, "#3D3D3D").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_get_date_year, "YEAR"], [Lang.Blocks.CALC_get_date_month, "MONTH"], [Lang.Blocks.CALC_get_date_day, "DAY"], [Lang.Blocks.CALC_get_date_hour, "HOUR"], [Lang.Blocks.CALC_get_date_minute, "MINUTE"], [Lang.Blocks.CALC_get_date_second, "SECOND"]]), "VALUE");
  this.appendDummyInput().appendField(" ").appendField(Lang.Blocks.CALC_get_date_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.get_date = function(b, a) {
  var c = a.getField("VALUE", a), d = new Date;
  return "YEAR" == c ? d.getFullYear() : "MONTH" == c ? d.getMonth() + 1 : "DAY" == c ? d.getDate() : "HOUR" == c ? d.getHours() : "MINUTE" == c ? d.getMinutes() : d.getSeconds();
};
Blockly.Blocks.get_sound_duration = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_duration_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_duration_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.get_sound_duration = function(b, a) {
  for (var c = a.getField("VALUE", a), d = b.parent.sounds, e = 0;e < d.length;e++) {
    if (d[e].id == c) {
      return d[e].duration;
    }
  }
};
Blockly.Blocks.reset_project_timer = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_reset, "#3D3D3D");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(b) {
  Entry.engine.hideProjectTimer(b);
}};
Entry.block.reset_project_timer = function(b, a) {
  Entry.engine.updateProjectTimer(0);
  return a.callReturn();
};
Blockly.Blocks.set_visible_project_timer = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_visible_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_timer_visible_show, "SHOW"], [Lang.Blocks.CALC_timer_visible_hide, "HIDE"]]), "ACTION");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_visible_2, "#3D3D3D");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(b) {
  Entry.engine.hideProjectTimer(b);
}};
Entry.block.set_visible_project_timer = function(b, a) {
  var c = a.getField("ACTION", a), d = Entry.engine.projectTimer;
  "SHOW" == c ? d.setVisible(!0) : d.setVisible(!1);
  return a.callReturn();
};
Blockly.Blocks.get_project_timer_value = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_timer_value, "#3D3D3D").appendField(" ", "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(b) {
  Entry.engine.hideProjectTimer(b);
}};
Entry.block.get_project_timer_value = function(b, a) {
  return Entry.engine.projectTimer.getValue();
};
Blockly.Blocks.wait_second = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_second_1);
  this.appendValueInput("SECOND").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_second_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.wait_second = function(b, a) {
  if (a.isStart) {
    if (1 == a.timeFlag) {
      return a;
    }
    delete a.timeFlag;
    delete a.isStart;
    Entry.engine.isContinue = !1;
    return a.callReturn();
  }
  a.isStart = !0;
  a.timeFlag = 1;
  var c = a.getNumberValue("SECOND", a);
  setTimeout(function() {
    a.timeFlag = 0;
  }, 1E3 * c);
  return a;
};
Blockly.Blocks.repeat_basic = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_basic_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_basic_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.appendStatementInput("DO");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.repeat_basic = function(b, a) {
  var c;
  if (!a.isLooped) {
    a.isLooped = !0;
    c = a.getNumberValue("VALUE", a);
    if (0 > c) {
      throw Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);
    }
    a.iterCount = Math.floor(c);
  }
  if (0 == a.iterCount || 0 > a.iterCount) {
    return delete a.isLooped, delete a.iterCount, a.callReturn();
  }
  a.iterCount--;
  return a.getStatement("DO", a);
};
Blockly.Blocks.repeat_inf = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_inf).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.appendStatementInput("DO");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.repeat_inf = function(b, a) {
  a.isLooped = !0;
  return a.getStatement("DO");
};
Blockly.Blocks.stop_repeat = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_repeat).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.stop_repeat = function(b, a) {
  for (var c = a;"REPEAT" != c.type.substr(0, 6).toUpperCase() && c.parentScript;) {
    c = c.parentScript, delete c.isLooped, delete c.iterCount;
  }
  var d = c.callReturn();
  return c.statements && d ? d : c ? null : a.callReturn();
};
Blockly.Blocks.wait_until_true = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_until_true_1);
  this.appendValueInput("BOOL").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_until_true_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.wait_until_true = function(b, a) {
  return a.getBooleanValue("BOOL", a) ? a.callReturn() : a;
};
Blockly.Blocks._if = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW__if_1);
  this.appendValueInput("BOOL").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW__if_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.appendStatementInput("STACK");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block._if = function(b, a) {
  return a.isLooped ? (delete a.isLooped, a.callReturn()) : a.getBooleanValue("BOOL", a) ? (a.isLooped = !0, a.getStatement("STACK", a)) : a.callReturn();
};
Blockly.Blocks.if_else = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_if_else_1);
  this.appendValueInput("BOOL").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_if_else_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.appendStatementInput("STACK_IF");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_if_else_3);
  this.appendStatementInput("STACK_ELSE");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.if_else = function(b, a) {
  if (a.isLooped) {
    return delete a.isLooped, a.callReturn();
  }
  var c = a.getBooleanValue("BOOL", a);
  a.isLooped = !0;
  return c ? a.getStatement("STACK_IF", a) : a.getStatement("STACK_ELSE", a);
};
Blockly.Blocks.create_clone = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_create_clone_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("clone"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_create_clone_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.create_clone = function(b, a) {
  var c = a.getField("VALUE", a), d = a.callReturn();
  "self" == c ? b.parent.addCloneEntity(b.parent, b, null) : Entry.container.getObject(c).addCloneEntity(b.parent, null, null);
  return d;
};
Blockly.Blocks.delete_clone = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_delete_clone).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.delete_clone = function(b, a) {
  if (!b.isClone) {
    return a.callReturn();
  }
  b.removeClone();
};
Blockly.Blocks.when_clone_start = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_clone.png", "*", "start")).appendField(Lang.Blocks.FLOW_when_clone_start);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_clone_start = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.stop_run = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_run).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setTooltip("");
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.stop_run = function(b, a) {
  return Entry.engine.toggleStop();
};
Blockly.Blocks.repeat_while_true = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_while_true_1);
  this.appendValueInput("BOOL").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_while_true_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.appendStatementInput("DO");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.repeat_while_true = function(b, a) {
  if (a.getBooleanValue("BOOL", a)) {
    return a.isLooped = !0, a.getStatement("DO", a);
  }
  a.isLooped = !1;
  return a.callReturn();
};
Blockly.Blocks.stop_object = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_object_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.FLOW_stop_object_all, "all"], [Lang.Blocks.FLOW_stop_object_this_object, "thisObject"], [Lang.Blocks.FLOW_stop_object_this_thread, "thisThread"], [Lang.Blocks.FLOW_stop_object_other_thread, "otherThread"]]), "TARGET");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_object_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.stop_object = function(b, a) {
  var c = a.getField("TARGET", a), d = Entry.container;
  switch(c) {
    case "all":
      d.mapEntityIncludeCloneOnScene(function(a) {
        a.clearScript();
      });
      break;
    case "thisObject":
      b.clearScript();
      c = b.parent.clonedEntities;
      c.map(function(a) {
        a.clearScript();
      });
      break;
    case "otherThread":
      return b.clearScript(), c = b.parent.clonedEntities, c.map(function(a) {
        a.clearScript();
      }), a.callReturn();
  }
  return null;
};
Blockly.Blocks.restart_project = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_restart).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.restart_project = function(b, a) {
  Entry.engine.toggleStop();
  Entry.engine.toggleRun();
};
Blockly.Blocks.remove_all_clones = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_delete_clone_all).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.remove_all_clones = function(b, a) {
  var c = b.parent.getClonedEntities();
  c.map(function(a) {
    a.removeClone();
  });
  c = null;
  return a.callReturn();
};
Blockly.Blocks.function_field_label = {init:function() {
  this.setColour("#f9c535");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.FUNCTION_explanation_1), "NAME");
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Blockly.Blocks.function_field_string = {init:function() {
  this.setColour("#ffec64");
  this.appendValueInput("PARAM").setCheck(["String"]);
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Blockly.Blocks.function_field_boolean = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("PARAM").setCheck(["Boolean"]);
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Blockly.Blocks.function_param_string = {init:function() {
  this.setEditable(!1);
  this.setColour("#ffec64");
  this.setOutput(!0, ["String", "Number"]);
  this.setInputsInline(!0);
  this.setTooltip("");
}, domToMutation:function(b) {
  b.getElementsByTagName("field");
  this.hashId = b.getAttribute("hashid");
  (b = Entry.Func.targetFunc.stringHash[this.hashId]) || (b = "");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.FUNCTION_character_variable + b), "");
}, mutationToDom:function() {
  var b = document.createElement("mutation");
  b.setAttribute("hashid", this.hashId);
  return b;
}};
Entry.block.function_param_string = function(b, a, c) {
  return a.register[a.hashId].run();
};
Blockly.Blocks.function_param_boolean = {init:function() {
  this.setEditable(!1);
  this.setColour("#2FC9F0");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}, domToMutation:function(b) {
  b.getElementsByTagName("field");
  this.hashId = b.getAttribute("hashid");
  (b = Entry.Func.targetFunc.booleanHash[this.hashId]) || (b = "");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.FUNCTION_logical_variable + b), "");
}, mutationToDom:function() {
  var b = document.createElement("mutation");
  b.setAttribute("hashid", this.hashId);
  return b;
}};
Entry.block.function_param_boolean = function(b, a, c) {
  return a.register[a.hashId].run();
};
Blockly.Blocks.function_create = {init:function() {
  this.appendDummyInput().appendField(Lang.Blocks.FUNCTION_define);
  this.setColour("#cc7337");
  this.appendValueInput("FIELD").setCheck(["Param"]);
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_function.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.function_create = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.function_general = {init:function() {
  this.setColour("#cc7337");
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}, domToMutation:function(b) {
  var a = b.getElementsByTagName("field");
  this.appendDummyInput().appendField("");
  a.length || this.appendDummyInput().appendField(Lang.Blocks.FUNCTION_function);
  for (var c = 0;c < a.length;c++) {
    var d = a[c], e = d.getAttribute("hashid");
    switch(d.getAttribute("type").toLowerCase()) {
      case "label":
        this.appendDummyInput().appendField(d.getAttribute("content"));
        break;
      case "string":
        this.appendValueInput(e).setCheck(["String", "Number"]);
        break;
      case "boolean":
        this.appendValueInput(e).setCheck(["Boolean"]);
    }
  }
  this.hashId = b.getAttribute("hashid");
}, mutationToDom:function() {
  for (var b = document.createElement("mutation"), a = 1;a < this.inputList.length;a++) {
    var c = this.inputList[a];
    if (c.fieldRow[0] && c.fieldRow[0] instanceof Blockly.FieldLabel) {
      var c = c.fieldRow[0], d = document.createElement("field");
      d.setAttribute("type", "label");
      d.setAttribute("content", c.text_);
    } else {
      c.connection && "String" == c.connection.check_[0] ? (d = document.createElement("field"), d.setAttribute("type", "string"), d.setAttribute("hashid", c.name)) : c.connection && "Boolean" == c.connection.check_[0] && (d = document.createElement("field"), d.setAttribute("type", "boolean"), d.setAttribute("hashid", c.name));
    }
    b.appendChild(d);
  }
  b.setAttribute("hashid", this.hashId);
  return b;
}};
Entry.block.function_general = function(b, a) {
  if (a.thread) {
    var c = Entry.Engine.computeThread(b, a.thread);
    if (c) {
      return a.thread = c, a;
    }
    delete a.thread;
    return a.callReturn();
  }
  c = Entry.variableContainer.getFunction(a.hashId);
  a.thread = new Entry.Script(b);
  a.thread.register = a.values;
  for (var d = 0;d < c.content.childNodes.length;d++) {
    "function_create" == c.content.childNodes[d].getAttribute("type") && a.thread.init(c.content.childNodes[d]);
  }
  return a;
};
Blockly.Blocks.is_clicked = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_is_clicked, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.is_clicked = function(b, a) {
  return Entry.stage.isClick;
};
Blockly.Blocks.is_press_some_key = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_is_press_some_key_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldKeydownInput("81"), "VALUE").appendField(Lang.Blocks.JUDGEMENT_is_press_some_key_2, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.is_press_some_key = function(b, a) {
  var c = Number(a.getField("VALUE", a));
  return 0 <= Entry.engine.pressedKeys.indexOf(c);
};
Blockly.Blocks.reach_something = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_reach_something_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("collision"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_reach_something_2, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.reach_something = function(b, a) {
  if (!b.getVisible()) {
    return !1;
  }
  var c = a.getField("VALUE", a), d = b.object, e = /wall/.test(c), f = ndgmr.checkPixelCollision;
  if (e) {
    switch(e = Entry.stage.wall, c) {
      case "wall":
        if (f(d, e.up, .2, !0) || f(d, e.down, .2, !0) || f(d, e.left, .2, !0) || f(d, e.right, .2, !0)) {
          return !0;
        }
        break;
      case "wall_up":
        if (f(d, e.up, .2, !0)) {
          return !0;
        }
        break;
      case "wall_down":
        if (f(d, e.down, .2, !0)) {
          return !0;
        }
        break;
      case "wall_right":
        if (f(d, e.right, .2, !0)) {
          return !0;
        }
        break;
      case "wall_left":
        if (f(d, e.left, .2, !0)) {
          return !0;
        }
      ;
    }
  } else {
    if (c = Entry.container.getEntity(c), "textBox" == c.type || "textBox" == b.type) {
      f = c.object.getTransformedBounds();
      d = d.getTransformedBounds();
      if (Entry.checkCollisionRect(d, f)) {
        return !0;
      }
      for (var c = c.parent.clonedEntities, e = 0, g = c.length;e < g;e++) {
        var h = c[e];
        if (h.getVisible() && !h.isStamp && Entry.checkCollisionRect(d, h.object.getTransformedBounds())) {
          return !0;
        }
      }
    } else {
      if (c.getVisible() && f(d, c.object, .2, !0)) {
        return !0;
      }
      c = c.parent.clonedEntities;
      e = 0;
      for (g = c.length;e < g;e++) {
        if (h = c[e], h.getVisible() && !h.isStamp && f(d, h.object, .2, !0)) {
          return !0;
        }
      }
    }
  }
  return !1;
};
Blockly.Blocks.boolean_comparison = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["=", "EQUAL"], ["<", "SMALLER"], [">", "BIGGER"]]), "OPERATOR");
  this.appendValueInput("RIGHTHAND").setCheck(["String", "Number"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_comparison = function(b, a) {
  var c = a.getField("OPERATOR", a), d = a.getNumberValue("LEFTHAND", a), e = a.getNumberValue("RIGHTHAND", a);
  return "EQUAL" == c ? d == e : "BIGGER" == c ? d > e : d < e;
};
Blockly.Blocks.boolean_equal = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField("=", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["String", "Number"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_equal = function(b, a) {
  var c = a.getStringValue("LEFTHAND", a), d = a.getStringValue("RIGHTHAND", a);
  return c == d;
};
Blockly.Blocks.boolean_bigger = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(">", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_bigger = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c > d;
};
Blockly.Blocks.boolean_smaller = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("<", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_smaller = function(b, a) {
  var c = a.getNumberValue("LEFTHAND", a), d = a.getNumberValue("RIGHTHAND", a);
  return c < d;
};
Blockly.Blocks.boolean_and_or = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck("Boolean");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.JUDGEMENT_boolean_and, "AND"], [Lang.Blocks.JUDGEMENT_boolean_or, "OR"]]), "OPERATOR");
  this.appendValueInput("RIGHTHAND").setCheck("Boolean");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_and_or = function(b, a) {
  var c = a.getField("OPERATOR", a), d = a.getBooleanValue("LEFTHAND", a), e = a.getBooleanValue("RIGHTHAND", a);
  return "AND" == c ? d && e : d || e;
};
Blockly.Blocks.boolean_and = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_boolean_and, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck("Boolean");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_and = function(b, a) {
  var c = a.getBooleanValue("LEFTHAND", a), d = a.getBooleanValue("RIGHTHAND", a);
  return c && d;
};
Blockly.Blocks.boolean_or = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_boolean_or, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck("Boolean");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_or = function(b, a) {
  var c = a.getBooleanValue("LEFTHAND", a), d = a.getBooleanValue("RIGHTHAND", a);
  return c || d;
};
Blockly.Blocks.boolean_not = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_boolean_not_1, "#3D3D3D");
  this.appendValueInput("VALUE").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_boolean_not_2, "#3D3D3D");
  this.appendDummyInput();
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.boolean_not = function(b, a) {
  return !a.getBooleanValue("VALUE");
};
Blockly.Blocks.true_or_false = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.JUDGEMENT_true, "true"], [Lang.Blocks.JUDGEMENT_false, "false"]]), "VALUE");
  this.appendDummyInput();
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.true_or_false = function(b, a) {
  return "true" == a.children[0].textContent;
};
Blockly.Blocks.True = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_true, "#3D3D3D").appendField(" ");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.True = function(b, a) {
  return !0;
};
Blockly.Blocks.False = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_false, "#3D3D3D").appendField(" ");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.False = function(b, a) {
  return !1;
};
Blockly.Blocks.is_included_in_list = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_is_included_in_list_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_is_included_in_list_2, "#3D3D3D");
  this.appendValueInput("DATA").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_is_included_in_list_3, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.is_included_in_list = function(b, a) {
  var c = a.getField("LIST", a), d = a.getStringValue("DATA", a), c = Entry.variableContainer.getList(c);
  if (!c) {
    return !1;
  }
  for (var c = c.array_, e = 0, f = c.length;e < f;e++) {
    if (c[e].data.toString() == d.toString()) {
      return !0;
    }
  }
  return !1;
};
Blockly.Blocks.boolean_basic_operator = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["String", "Number"]);
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([["=", "EQUAL"], [">", "GREATER"], ["<", "LESS"], [">=", "GREATER_OR_EQUAL"], ["<=", "LESS_OR_EQUAL"]], null, !1), "OPERATOR");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_basic_operator = function(b, a) {
  var c = a.getField("OPERATOR", a), d = a.getStringValue("LEFTHAND", a), e = a.getStringValue("RIGHTHAND", a);
  switch(c) {
    case "EQUAL":
      return d == e;
    case "GREATER":
      return Number(d) > Number(e);
    case "LESS":
      return Number(d) < Number(e);
    case "GREATER_OR_EQUAL":
      return Number(d) >= Number(e);
    case "LESS_OR_EQUAL":
      return Number(d) <= Number(e);
  }
};
Blockly.Blocks.show = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_show).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.show = function(b, a) {
  b.setVisible(!0);
  return a.callReturn();
};
Blockly.Blocks.hide = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_hide).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.hide = function(b, a) {
  b.setVisible(!1);
  return a.callReturn();
};
Blockly.Blocks.dialog_time = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_time_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_time_2);
  this.appendValueInput("SECOND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_time_3);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.speak, "speak"]]), "OPTION");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_time_4).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.dialog_time = function(b, a) {
  if (!a.isStart) {
    var c = a.getNumberValue("SECOND", a), d = a.getStringValue("VALUE", a), e = a.getField("OPTION", a);
    a.isStart = !0;
    a.timeFlag = 1;
    d || "number" == typeof d || (d = "    ");
    d = Entry.convertToRoundedDecimals(d, 3);
    new Entry.Dialog(b, d, e);
    b.syncDialogVisible(b.getVisible());
    setTimeout(function() {
      a.timeFlag = 0;
    }, 1E3 * c);
  }
  return 0 == a.timeFlag ? (delete a.timeFlag, delete a.isStart, b.dialog && b.dialog.remove(), a.callReturn()) : a;
};
Blockly.Blocks.dialog = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.speak, "speak"]]), "OPTION");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.dialog = function(b, a) {
  var c = a.getStringValue("VALUE", a);
  c || "number" == typeof c || (c = "    ");
  var d = a.getField("OPTION", a), c = Entry.convertToRoundedDecimals(c, 3);
  new Entry.Dialog(b, c, d);
  b.syncDialogVisible(b.getVisible());
  return a.callReturn();
};
Blockly.Blocks.remove_dialog = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_remove_dialog).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.remove_dialog = function(b, a) {
  b.dialog && b.dialog.remove();
  return a.callReturn();
};
Blockly.Blocks.change_to_nth_shape = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("pictures"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_to_nth_shape = function(b, a) {
  var c = a.getField("VALUE", a), c = b.parent.getPicture(c);
  b.setImage(c);
  return a.callReturn();
};
Blockly.Blocks.change_to_next_shape = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_next_shape).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_to_next_shape = function(b, a) {
  var c = b.parent.getNextPicture(b.picture.id);
  b.setImage(c);
  return a.callReturn();
};
Blockly.Blocks.set_effect_volume = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.opacity, "opacity"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_effect_volume = function(b, a) {
  var c = a.getField("EFFECT", a), d = a.getNumberValue("VALUE", a);
  "color" == c ? b.effect.hue = d + b.effect.hue : "lens" != c && "swriling" != c && "pixel" != c && "mosaic" != c && ("brightness" == c ? b.effect.brightness = d + b.effect.brightness : "blur" != c && "opacity" == c && (b.effect.alpha += d / 100));
  b.applyFilter();
  return a.callReturn();
};
Blockly.Blocks.set_effect = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.opacity, "opacity"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_effect = function(b, a) {
  var c = a.getField("EFFECT", a), d = a.getNumberValue("VALUE", a);
  "color" == c ? b.effect.hue = d : "lens" != c && "swriling" != c && "pixel" != c && "mosaic" != c && ("brightness" == c ? b.effect.brightness = d : "blur" != c && "opacity" == c && (b.effect.alpha = d / 100));
  b.applyFilter();
  return a.callReturn();
};
Blockly.Blocks.erase_all_effects = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_erase_all_effects).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.erase_all_effects = function(b, a) {
  b.resetFilter();
  return a.callReturn();
};
Blockly.Blocks.change_scale_percent = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_scale_percent = function(b, a) {
  var c = (a.getNumberValue("VALUE", a) + 100) / 100;
  b.setScaleX(b.getScaleX() * c);
  b.setScaleY(b.getScaleY() * c);
  return a.callReturn();
};
Blockly.Blocks.set_scale_percent = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_scale_percent = function(b, a) {
  var c = a.getNumberValue("VALUE", a) / 100, d = b.snapshot_;
  b.setScaleX(c * d.scaleX);
  b.setScaleY(c * d.scaleY);
  return a.callReturn();
};
Blockly.Blocks.flip_y = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_flip_y).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.flip_y = function(b, a) {
  b.setScaleX(-1 * b.getScaleX());
  return a.callReturn();
};
Blockly.Blocks.flip_x = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_flip_x).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.flip_x = function(b, a) {
  b.setScaleY(-1 * b.getScaleY());
  return a.callReturn();
};
Blockly.Blocks.set_object_order = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_object_order_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("objectSequence"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_object_order_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_object_order = function(b, a) {
  var c = a.getField("VALUE", a), d = Entry.container.getCurrentObjects().indexOf(b.parent);
  if (-1 < d) {
    return Entry.container.moveElementByBlock(d, c), a.callReturn();
  }
  throw Error("object is not available");
};
Blockly.Blocks.get_pictures = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField("");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("pictures"), "VALUE");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.get_pictures = function(b, a) {
  return a.getStringField("VALUE");
};
Blockly.Blocks.change_to_some_shape = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_to_some_shape = function(b, a) {
  var c = a.getStringValue("VALUE");
  Entry.parseNumber(c);
  c = b.parent.getPicture(c);
  b.setImage(c);
  return a.callReturn();
};
Blockly.Blocks.set_effect_amount = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.transparency, "transparency"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_effect_amount = function(b, a) {
  var c = a.getField("EFFECT", a), d = a.getNumberValue("VALUE", a);
  "color" == c ? b.effect.hue = d + b.effect.hue : "brightness" == c ? b.effect.brightness = d + b.effect.brightness : "transparency" == c && (b.effect.alpha -= d / 100);
  b.applyFilter();
  return a.callReturn();
};
Blockly.Blocks.set_entity_effect = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.transparency, "transparency"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_entity_effect = function(b, a) {
  var c = a.getField("EFFECT", a), d = a.getNumberValue("VALUE", a);
  "color" == c ? b.effect.hue = d : "brightness" == c ? b.effect.brightness = d : "transparency" == c && (b.effect.alpha = 1 - d / 100);
  b.applyFilter();
  return a.callReturn();
};
Blockly.Blocks.move_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.move_direction = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setX(b.getX() + c * Math.cos((b.getRotation() + b.getDirection() - 90) / 180 * Math.PI));
  b.setY(b.getY() - c * Math.sin((b.getRotation() + b.getDirection() - 90) / 180 * Math.PI));
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.move_x = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_x_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_x_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.move_x = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setX(b.getX() + c);
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.move_y = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_y_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_y_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.move_y = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setY(b.getY() + c);
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.locate_xy_time = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_time_1);
  this.appendValueInput("VALUE1").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_time_2);
  this.appendValueInput("VALUE2").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_time_3);
  this.appendValueInput("VALUE3").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_time_4).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.locate_xy_time = function(b, a) {
  if (!a.isStart) {
    var c;
    c = a.getNumberValue("VALUE1", a);
    var d = a.getNumberValue("VALUE2", a) - b.getX(), e = a.getNumberValue("VALUE3", a) - b.getY();
    a.isStart = !0;
    a.frameCount = Math.floor(c * Entry.FPS);
    a.dX = d / a.frameCount;
    a.dY = e / a.frameCount;
  }
  if (0 != a.frameCount) {
    return b.setX(b.getX() + a.dX), b.setY(b.getY() + a.dY), a.frameCount--, b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY()), a;
  }
  delete a.isStart;
  delete a.frameCount;
  return a.callReturn();
};
Blockly.Blocks.rotate_by_angle = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_by_angle = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setRotation(b.getRotation() + c);
  return a.callReturn();
};
Blockly.Blocks.rotate_by_angle_dropdown = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["45", "45"], ["90", "90"], ["135", "135"], ["180", "180"]]), "VALUE").appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_by_angle_dropdown = function(b, a) {
  var c = a.getField("VALUE", a);
  b.setRotation(b.getRotation() + Number(c));
  return a.callReturn();
};
Blockly.Blocks.see_angle = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.see_angle = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setDirection(c);
  return a.callReturn();
};
Blockly.Blocks.see_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_direction_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.see_direction = function(b, a) {
  var c = a.getField("VALUE", a), d = Entry.container.getEntity(c), c = d.getX() - b.getX(), d = d.getY() - b.getY();
  0 <= c ? b.setRotation(Math.atan(d / c) / Math.PI * 180 + 90) : b.setRotation(Math.atan(d / c) / Math.PI * 180 + 270);
  return a.callReturn();
};
Blockly.Blocks.locate_xy = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_1);
  this.appendValueInput("VALUE1").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_2);
  this.appendValueInput("VALUE2").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.locate_xy = function(b, a) {
  var c = a.getNumberValue("VALUE1", a);
  b.setX(c);
  c = a.getNumberValue("VALUE2", a);
  b.setY(c);
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.locate_x = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_x_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_x_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.locate_x = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setX(c);
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.locate_y = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_y_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_y_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.locate_y = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setY(c);
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.locate = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.locate = function(b, a) {
  var c = a.getField("VALUE", a), d;
  "mouse" == c ? (c = Entry.stage.mouseCoordinate.x, d = Entry.stage.mouseCoordinate.y) : (d = Entry.container.getEntity(c), c = d.getX(), d = d.getY());
  b.setX(Number(c));
  b.setY(Number(d));
  b.brush && !b.brush.stop && b.brush.lineTo(c, -1 * d);
  return a.callReturn();
};
Blockly.Blocks.move_xy_time = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_xy_time_1);
  this.appendValueInput("VALUE1").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_xy_time_2);
  this.appendValueInput("VALUE2").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_xy_time_3);
  this.appendValueInput("VALUE3").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_xy_time_4).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.move_xy_time = function(b, a) {
  if (!a.isStart) {
    var c;
    c = a.getNumberValue("VALUE1", a);
    var d = a.getNumberValue("VALUE2", a), e = a.getNumberValue("VALUE3", a);
    a.isStart = !0;
    a.frameCount = Math.floor(c * Entry.FPS);
    a.dX = d / a.frameCount;
    a.dY = e / a.frameCount;
  }
  if (0 != a.frameCount) {
    return b.setX(b.getX() + a.dX), b.setY(b.getY() + a.dY), a.frameCount--, b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY()), a;
  }
  delete a.isStart;
  delete a.frameCount;
  return a.callReturn();
};
Blockly.Blocks.locate_time = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_time_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_time_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_time_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Blockly.Blocks.rotate_by_angle_time = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_time_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_time_2);
  this.appendDummyInput().appendField(new Blockly.FieldAngle("90"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_time_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_by_angle_time = function(b, a) {
  if (!a.isStart) {
    var c;
    c = a.getNumberValue("VALUE", a);
    var d = a.getNumberField("VALUE", a);
    a.isStart = !0;
    a.frameCount = Math.floor(c * Entry.FPS);
    a.dAngle = d / a.frameCount;
  }
  if (0 != a.frameCount) {
    return b.setRotation(b.getRotation() + a.dAngle), a.frameCount--, a;
  }
  delete a.isStart;
  delete a.frameCount;
  return a.callReturn();
};
Blockly.Blocks.bounce_when = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_when_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("bounce"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_when_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setPreviousStatement(!0);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Blockly.Blocks.bounce_wall = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_wall).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.bounce_wall = function(b, a) {
  var c = b.parent.getRotateMethod();
  b.object.getTransformedBounds();
  var d = "free" == c ? (b.getRotation() + b.getDirection()).mod(360) : b.getDirection();
  90 > d && 0 <= d || 360 > d && 270 <= d ? ndgmr.checkPixelCollision(Entry.stage.wall.up, b.object, 0, !0) && ("free" == c ? b.setRotation(-b.getRotation() - 2 * b.getDirection() + 180) : b.setDirection(-b.getDirection() + 180)) : 270 > d && 90 <= d && ndgmr.checkPixelCollision(Entry.stage.wall.down, b.object, 0, !0) && ("free" == c ? b.setRotation(-b.getRotation() - 2 * b.getDirection() + 180) : b.setDirection(-b.getDirection() + 180));
  360 > d && 180 <= d ? ndgmr.checkPixelCollision(Entry.stage.wall.left, b.object, 0, !0) && ("free" == c ? b.setRotation(-b.getRotation() - 2 * b.getDirection()) : b.setDirection(-b.getDirection() + 360)) : 180 > d && 0 <= d && ndgmr.checkPixelCollision(Entry.stage.wall.right, b.object, 0, !0) && ("free" == c ? b.setRotation(-b.getRotation() - 2 * b.getDirection()) : b.setDirection(-b.getDirection() + 360));
  return a.callReturn();
};
Blockly.Blocks.flip_arrow_horizontal = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_flip_arrow_horizontal).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.flip_arrow_horizontal = function(b, a) {
  b.setDirection(b.getDirection() + 180);
  return a.callReturn();
};
Blockly.Blocks.flip_arrow_vertical = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_flip_arrow_vertical).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.flip_arrow_vertical = function(b, a) {
  b.setDirection(b.getDirection() + 180);
  return a.callReturn();
};
Blockly.Blocks.see_angle_object = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_object_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_object_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.see_angle_object = function(b, a) {
  var c = a.getField("VALUE", a), d = b.getX(), e = b.getY();
  if (b.parent.id == c) {
    return a.callReturn();
  }
  "mouse" == c ? (c = Entry.stage.mouseCoordinate.y, d = Entry.stage.mouseCoordinate.x - d, e = c - e) : (c = Entry.container.getEntity(c), d = c.getX() - d, e = c.getY() - e);
  e = 0 <= d ? -Math.atan(e / d) / Math.PI * 180 + 90 : -Math.atan(e / d) / Math.PI * 180 + 270;
  d = b.getDirection() + b.getRotation();
  b.setRotation(b.getRotation() + e - d);
  return a.callReturn();
};
Blockly.Blocks.see_angle_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.see_angle_direction = function(b, a) {
  var c = a.getNumberValue("VALUE", a), d = b.getDirection() + b.getRotation();
  b.setRotation(b.getRotation() + c - d);
  return a.callReturn();
};
Blockly.Blocks.rotate_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_direction = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setDirection(c + b.getDirection());
  return a.callReturn();
};
Blockly.Blocks.locate_object_time = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_object_time_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_object_time_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "TARGET");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_object_time_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.locate_object_time = function(b, a) {
  if (!a.isStart) {
    var c, d, e;
    d = a.getField("TARGET", a);
    c = a.getNumberValue("VALUE", a);
    c = Math.floor(c * Entry.FPS);
    e = Entry.stage.mouseCoordinate;
    if (0 != c) {
      "mouse" == d ? (d = e.x - b.getX(), e = e.y - b.getY()) : (e = Entry.container.getEntity(d), d = e.getX() - b.getX(), e = e.getY() - b.getY()), a.isStart = !0, a.frameCount = c, a.dX = d / a.frameCount, a.dY = e / a.frameCount;
    } else {
      return "mouse" == d ? (d = Number(e.x), e = Number(e.y)) : (e = Entry.container.getEntity(d), d = e.getX(), e = e.getY()), b.setX(d), b.setY(e), b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY()), a.callReturn();
    }
  }
  if (0 != a.frameCount) {
    return b.setX(b.getX() + a.dX), b.setY(b.getY() + a.dY), a.frameCount--, b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY()), a;
  }
  delete a.isStart;
  delete a.frameCount;
  return a.callReturn();
};
Blockly.Blocks.rotate_absolute = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_set_direction_by_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_set_direction_by_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_absolute = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setRotation(c);
  return a.callReturn();
};
Blockly.Blocks.rotate_relative = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_relative = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setRotation(c + b.getRotation());
  return a.callReturn();
};
Blockly.Blocks.direction_absolute = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.direction_absolute = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setDirection(c);
  return a.callReturn();
};
Blockly.Blocks.direction_relative = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.direction_relative = function(b, a) {
  var c = a.getNumberValue("VALUE", a);
  b.setDirection(c + b.getDirection());
  return a.callReturn();
};
Blockly.Blocks.move_to_angle = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_angle_1);
  this.appendValueInput("ANGLE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_angle_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_angle_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.move_to_angle = function(b, a) {
  var c = a.getNumberValue("VALUE", a), d = a.getNumberValue("ANGLE", a);
  b.setX(b.getX() + c * Math.cos((d - 90) / 180 * Math.PI));
  b.setY(b.getY() - c * Math.sin((d - 90) / 180 * Math.PI));
  b.brush && !b.brush.stop && b.brush.lineTo(b.getX(), -1 * b.getY());
  return a.callReturn();
};
Blockly.Blocks.rotate_by_time = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_2);
  this.appendValueInput("ANGLE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.rotate_by_time = function(b, a) {
  if (!a.isStart) {
    var c;
    c = a.getNumberValue("VALUE", a);
    var d = a.getNumberValue("ANGLE", a);
    a.isStart = !0;
    a.frameCount = Math.floor(c * Entry.FPS);
    a.dAngle = d / a.frameCount;
  }
  if (0 != a.frameCount) {
    return b.setRotation(b.getRotation() + a.dAngle), a.frameCount--, a;
  }
  delete a.isStart;
  delete a.frameCount;
  return a.callReturn();
};
Blockly.Blocks.when_scene_start = {init:function() {
  this.setColour("#189FC1");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_scene.png", "*", "start")).appendField(Lang.Blocks.SCENE_when_scene_start);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_scene_start = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.start_scene = {init:function() {
  this.setColour("#189FC1");
  this.appendDummyInput().appendField(Lang.Blocks.SCENE_start_scene_1).appendField(new Blockly.FieldDropdownDynamic("scenes"), "VALUE").appendField(Lang.Blocks.SCENE_start_scene_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_scene.png", "*"));
  this.setInputsInline(!0);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.start_scene = function(b, a) {
  var c = a.getField("VALUE", a);
  if (c = Entry.scene.getSceneById(c)) {
    Entry.scene.selectScene(c), Entry.engine.fireEvent("when_scene_start");
  }
  return null;
};
Blockly.Blocks.start_neighbor_scene = {init:function() {
  this.setColour("#189FC1");
  this.appendDummyInput().appendField(Lang.Blocks.SCENE_start_neighbor_scene_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.SCENE_start_scene_pre, "pre"], [Lang.Blocks.SCENE_start_scene_next, "next"]]), "OPERATOR").appendField(Lang.Blocks.SCENE_start_neighbor_scene_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_scene.png", "*"));
  this.setInputsInline(!0);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.start_neighbor_scene = function(b, a) {
  var c = Entry.scene.selectedScene, d = Entry.scene.getScenes(), c = d.indexOf(c);
  "next" == a.getField("OPERATOR", a) ? c + 1 < d.length && (d = Entry.scene.getSceneById(d[c + 1].id)) && (Entry.scene.selectScene(d), Entry.engine.fireEvent("when_scene_start")) : 0 < c && (d = Entry.scene.getSceneById(d[c - 1].id)) && (Entry.scene.selectScene(d), Entry.engine.fireEvent("when_scene_start"));
  return null;
};
Blockly.Blocks.sound_something = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something = function(b, a) {
  var c = a.getField("VALUE", a);
  Entry.isExist(c, "id", b.parent.sounds) && createjs.Sound.play(c);
  return a.callReturn();
};
Blockly.Blocks.sound_something_second = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_2);
  this.appendValueInput("SECOND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_second = function(b, a) {
  var c = a.getField("VALUE", a), d = a.getNumberValue("SECOND", a);
  if (Entry.isExist(c, "id", b.parent.sounds)) {
    var e = createjs.Sound.play(c);
    setTimeout(function() {
      e.stop();
    }, 1E3 * d);
  }
  return a.callReturn();
};
Blockly.Blocks.sound_something_wait = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_wait = function(b, a) {
  if (a.isPlay) {
    if (1 == a.playState) {
      return a;
    }
    delete a.playState;
    delete a.isPlay;
    return a.callReturn();
  }
  a.isPlay = !0;
  a.playState = 1;
  var c = a.getField("VALUE", a), d = b.parent.getSound(c);
  Entry.isExist(c, "id", b.parent.sounds) && (createjs.Sound.play(c), setTimeout(function() {
    a.playState = 0;
  }, 1E3 * d.duration));
  return a;
};
Blockly.Blocks.sound_something_second_wait = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_2);
  this.appendValueInput("SECOND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_second_wait = function(b, a) {
  if (a.isPlay) {
    if (1 == a.playState) {
      return a;
    }
    delete a.isPlay;
    delete a.playState;
    return a.callReturn();
  }
  a.isPlay = !0;
  a.playState = 1;
  var c = a.getField("VALUE", a);
  if (Entry.isExist(c, "id", b.parent.sounds)) {
    var d = createjs.Sound.play(c), c = a.getNumberValue("SECOND", a);
    setTimeout(function() {
      d.stop();
      a.playState = 0;
    }, 1E3 * c);
    d.addEventListener("complete", function(a) {
    });
  }
  return a;
};
Blockly.Blocks.sound_volume_change = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_change_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_change_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_volume_change = function(b, a) {
  var c = a.getNumberValue("VALUE", a) / 100, c = c + createjs.Sound.getVolume();
  1 < c && (c = 1);
  0 > c && (c = 0);
  createjs.Sound.setVolume(c);
  return a.callReturn();
};
Blockly.Blocks.sound_volume_set = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_set_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_set_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_volume_set = function(b, a) {
  var c = a.getNumberValue("VALUE", a) / 100;
  1 < c && (c = 1);
  0 > c && (c = 0);
  createjs.Sound.setVolume(c);
  return a.callReturn();
};
Blockly.Blocks.sound_silent_all = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_silent_all).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_silent_all = function(b, a) {
  createjs.Sound.stop();
  return a.callReturn();
};
Blockly.Blocks.get_sounds = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField("");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.get_sounds = function(b, a) {
  return a.getStringField("VALUE");
};
Blockly.Blocks.sound_something_with_block = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_with_block = function(b, a) {
  var c = a.getStringValue("VALUE", a);
  (c = b.parent.getSound(c)) && createjs.Sound.play(c.id);
  return a.callReturn();
};
Blockly.Blocks.sound_something_second_with_block = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(" ").appendField(Lang.Blocks.SOUND_sound_something_second_2);
  this.appendValueInput("SECOND").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_second_with_block = function(b, a) {
  var c = a.getStringValue("VALUE", a), d = a.getNumberValue("SECOND", a);
  (c = b.parent.getSound(c)) && createjs.Sound.play(c.id, {startTime:0, duration:1E3 * d});
  return a.callReturn();
};
Blockly.Blocks.sound_something_wait_with_block = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_wait_with_block = function(b, a) {
  if (a.isPlay) {
    if (1 == a.playState) {
      return a;
    }
    delete a.playState;
    delete a.isPlay;
    return a.callReturn();
  }
  a.isPlay = !0;
  a.playState = 1;
  var c = a.getStringValue("VALUE", a);
  if (c = b.parent.getSound(c)) {
    createjs.Sound.play(c.id), setTimeout(function() {
      a.playState = 0;
    }, 1E3 * c.duration);
  }
  return a;
};
Blockly.Blocks.sound_something_second_wait_with_block = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_2).appendField(" ");
  this.appendValueInput("SECOND").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.sound_something_second_wait_with_block = function(b, a) {
  if (a.isPlay) {
    if (1 == a.playState) {
      return a;
    }
    delete a.isPlay;
    delete a.playState;
    return a.callReturn();
  }
  a.isPlay = !0;
  a.playState = 1;
  var c = a.getStringValue("VALUE", a);
  if (c = b.parent.getSound(c)) {
    var d = createjs.Sound.play(c.id), c = a.getNumberValue("SECOND", a);
    setTimeout(function() {
      d.stop();
      a.playState = 0;
    }, 1E3 * c);
    d.addEventListener("complete", function(a) {
    });
  }
  return a;
};
Blockly.Blocks.when_run_button_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_play.png", "*", "start")).appendField(Lang.Blocks.START_when_run_button_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_run_button_click = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.press_some_key = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_press_some_key_1).appendField(new Blockly.FieldDropdown([["q", "81"], ["w", "87"], ["e", "69"], ["r", "82"], ["a", "65"], ["s", "83"], ["d", "68"], [Lang.Blocks.START_press_some_key_up, "38"], [Lang.Blocks.START_press_some_key_down, "40"], [Lang.Blocks.START_press_some_key_left, "37"], [Lang.Blocks.START_press_some_key_right, "39"], [Lang.Blocks.START_press_some_key_enter, 
  "13"], [Lang.Blocks.START_press_some_key_space, "32"]]), "VALUE").appendField(Lang.Blocks.START_press_some_key_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.press_some_key = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.when_some_key_pressed = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_press_some_key_1).appendField(new Blockly.FieldKeydownInput("81"), "VALUE").appendField(Lang.Blocks.START_press_some_key_2);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_some_key_pressed = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.mouse_clicked = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_mouse_clicked);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.mouse_clicked = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.mouse_click_cancled = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_mouse_click_cancled);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.mouse_click_cancled = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.when_object_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_when_object_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_object_click = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.when_object_click_canceled = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_when_object_click_canceled);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_object_click_canceled = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.when_some_key_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_when_some_key_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_some_key_click = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.when_message_cast = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_signal.png", "*", "start")).appendField(Lang.Blocks.START_when_message_cast_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_when_message_cast_2);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.when_message_cast = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.message_cast = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_message_cast_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_message_cast_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.message_cast = function(b, a) {
  var c = a.getField("VALUE", a), d = Entry.isExist(c, "id", Entry.variableContainer.messages_);
  if ("null" == c || !d) {
    throw Error("value can not be null or undefined");
  }
  Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, ["when_message_cast", c]);
  return a.callReturn();
};
Blockly.Blocks.add_message = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_add_message).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.add_massage = function(b, a) {
  return a.callReturn();
};
Blockly.Blocks.message_cast_wait = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_message_send_wait_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_message_send_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
  this.setTooltip("");
}};
Entry.block.message_cast_wait = function(b, a) {
  if (a.runningScript) {
    if (a.runningScript.length) {
      return Entry.engine.computeFunction(a), a;
    }
    delete a.runningScript;
    return a.callReturn();
  }
  var c = a.getField("VALUE", a), d = Entry.isExist(c, "id", Entry.variableContainer.messages_);
  if ("null" == c || !d) {
    throw Error("value can not be null or undefined");
  }
  var e = [];
  Entry.container.mapEntityIncludeCloneOnScene(function(a, b) {
    for (var c = b[0], d = b[1], p = a.parent.script.childNodes, m = 0;m < p.length;m++) {
      var n = p[m], l = Entry.Xml.getField("VALUE", n);
      Entry.Xml.isTypeOf(c, n) && l == d && (l = new Entry.Script(a), l.init(n), e.push(l));
    }
  }, ["when_message_cast", c]);
  a.runningScript = e;
  return a;
};
var colour = "#FFCA36";
Blockly.Blocks.text = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.TEXT_text), "NAME");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.text = function(b, a) {
  return a.getField("NAME");
};
Blockly.Blocks.text_write = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_write_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_write_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.text_write = function(b, a) {
  var c = a.getStringValue("VALUE", a), c = Entry.convertToRoundedDecimals(c, 3);
  b.setText(c);
  return a.callReturn();
};
Blockly.Blocks.text_append = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_append_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_append_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.text_append = function(b, a) {
  var c = a.getStringValue("VALUE", a);
  b.setText(Entry.convertToRoundedDecimals(b.getText(), 3) + Entry.convertToRoundedDecimals(c, 3));
  return a.callReturn();
};
Blockly.Blocks.text_prepend = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_prepend_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_prepend_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.text_prepend = function(b, a) {
  var c = a.getStringValue("VALUE", a);
  b.setText(Entry.convertToRoundedDecimals(c, 3) + Entry.convertToRoundedDecimals(b.getText(), 3));
  return a.callReturn();
};
Blockly.Blocks.text_flush = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_flush);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.text_flush = function(b, a) {
  b.setText("");
  return a.callReturn();
};
Blockly.Blocks.change_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_variable_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_variable_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_variable = function(b, a) {
  var c = a.getField("VARIABLE", a), d = a.getNumberValue("VALUE", a), e = 0, d = Entry.parseNumber(d);
  if (0 == d && "boolean" == typeof d) {
    throw Error("Type is not correct");
  }
  c = Entry.variableContainer.getVariable(c, b);
  e = Entry.getMaxFloatPoint([d, c.getValue()]);
  c.setValue((d + c.getValue()).toFixed(e));
  return a.callReturn();
};
Blockly.Blocks.set_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_set_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_set_variable_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_set_variable_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.set_variable = function(b, a) {
  var c = a.getField("VARIABLE", a), d = a.getValue("VALUE", a);
  Entry.variableContainer.getVariable(c, b).setValue(d);
  return a.callReturn();
};
Blockly.Blocks.show_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_show_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_show_variable_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.show_variable = function(b, a) {
  var c = a.getField("VARIABLE", a), c = Entry.variableContainer.getVariable(c, b);
  c.setVisible(!0);
  c.updateView();
  return a.callReturn();
};
Blockly.Blocks.hide_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_hide_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_hide_variable_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.hide_variable = function(b, a) {
  var c = a.getField("VARIABLE", a);
  Entry.variableContainer.getVariable(c, b).setVisible(!1);
  return a.callReturn();
};
Blockly.Blocks.get_y = {init:function() {
  this.setColour(230);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_y).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setOutput(!0, "Number");
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Blockly.Blocks.get_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_get_variable_2);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
}};
Entry.block.get_variable = function(b, a) {
  var c = a.getField("VARIABLE", a);
  return Entry.variableContainer.getVariable(c, b).getValue();
};
Blockly.Blocks.ask_and_wait = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_ask_and_wait_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_ask_and_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.ask_and_wait = function(b, a) {
  var c = Entry.container.inputValue, d = Entry.stage.inputField, e = a.getValue("VALUE", a);
  if (!e) {
    throw Error("message can not be empty");
  }
  if (c.sprite == b && d && !d._isHidden) {
    return a;
  }
  if (c.sprite != b && a.isInit || c.value && c.sprite == b && d._isHidden && a.isInit) {
    return b.dialog && b.dialog.remove(), delete a.isInit, a.callReturn();
  }
  e = Entry.convertToRoundedDecimals(e, 3);
  new Entry.Dialog(b, e, "speak");
  Entry.stage.showInputField();
  c.script = a;
  c.sprite = b;
  c.value = "";
  a.isInit = !0;
  return a;
};
Blockly.Blocks.get_canvas_input_value = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_canvas_input_value);
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_canvas_input_value = function(b, a) {
  return Entry.container.getInputValue();
};
Blockly.Blocks.combine_something = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_1);
  this.appendValueInput("VALUE1").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_2);
  this.appendValueInput("VALUE2").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_3);
  this.setInputsInline(!0);
  this.setOutput(!0, "String");
}};
Entry.block.combine_something = function(b, a) {
  var c = a.getStringValue("VALUE1", a), d = a.getStringValue("VALUE2", a);
  return c + d;
};
Blockly.Blocks.add_value_to_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_add_value_to_list_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_add_value_to_list_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_add_value_to_list_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.add_value_to_list = function(b, a) {
  var c = a.getField("LIST", a), d = a.getValue("VALUE", a), c = Entry.variableContainer.getList(c, b);
  c.array_ || (c.array_ = []);
  c.array_.push({data:d});
  c.updateView();
  return a.callReturn();
};
Blockly.Blocks.remove_value_from_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_remove_value_from_list_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_remove_value_from_list_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_remove_value_from_list_3).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.remove_value_from_list = function(b, a) {
  var c = a.getField("LIST", a), d = a.getValue("VALUE", a), c = Entry.variableContainer.getList(c, b);
  if (!c.array_ || isNaN(d) || d > c.array_.length) {
    throw Error("can not remove value from array");
  }
  c.array_.splice(d - 1, 1);
  c.updateView();
  return a.callReturn();
};
Blockly.Blocks.insert_value_to_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_insert_value_to_list_1);
  this.appendValueInput("DATA").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_insert_value_to_list_2);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_insert_value_to_list_3);
  this.appendValueInput("INDEX").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_insert_value_to_list_4).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.insert_value_to_list = function(b, a) {
  var c = a.getField("LIST", a), d = a.getValue("DATA", a), e = a.getValue("INDEX", a), c = Entry.variableContainer.getList(c, b);
  if (!c.array_ || isNaN(e) || 0 == e || e > c.array_.length + 1) {
    throw Error("can not insert value to array");
  }
  c.array_.splice(e - 1, 0, {data:d});
  c.updateView();
  return a.callReturn();
};
Blockly.Blocks.change_value_list_index = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_value_list_index_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_value_list_index_2);
  this.appendValueInput("INDEX").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_value_list_index_3);
  this.appendValueInput("DATA").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_value_list_index_4).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.change_value_list_index = function(b, a) {
  var c = a.getField("LIST", a), d = a.getValue("DATA", a), e = a.getValue("INDEX", a), c = Entry.variableContainer.getList(c, b);
  if (!c.array_ || isNaN(e) || e > c.array_.length) {
    throw Error("can not insert value to array");
  }
  c.array_[e - 1].data = d;
  c.updateView();
  return a.callReturn();
};
Blockly.Blocks.value_of_index_from_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_value_of_index_from_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_value_of_index_from_list_2);
  this.appendValueInput("INDEX").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_value_of_index_from_list_3);
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.value_of_index_from_list = function(b, a) {
  var c = a.getField("LIST", a), d = a.getValue("INDEX", a), c = Entry.variableContainer.getList(c, b), d = Entry.getListRealIndex(d, c);
  if (!c.array_ || isNaN(d) || d > c.array_.length) {
    throw Error("can not insert value to array");
  }
  return c.array_[d - 1].data;
};
Blockly.Blocks.length_of_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_length_of_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_length_of_list_2);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.length_of_list = function(b, a) {
  var c = a.getField("LIST", a);
  return Entry.variableContainer.getList(c).array_.length;
};
Blockly.Blocks.show_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_show_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST").appendField(Lang.Blocks.VARIABLE_show_list_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.show_list = function(b, a) {
  var c = a.getField("LIST", a);
  Entry.variableContainer.getList(c).setVisible(!0);
  return a.callReturn();
};
Blockly.Blocks.hide_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_hide_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST").appendField(Lang.Blocks.VARIABLE_hide_list_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setTooltip("");
}};
Entry.block.hide_list = function(b, a) {
  var c = a.getField("LIST", a);
  Entry.variableContainer.getList(c).setVisible(!1);
  return a.callReturn();
};
Blockly.Blocks.options_for_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField("");
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([[Lang.Blocks.VARIABLE_list_option_first, "FIRST"], [Lang.Blocks.VARIABLE_list_option_last, "LAST"], [Lang.Blocks.VARIABLE_list_option_random, "RANDOM"]]), "OPERATOR");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
  this.setTooltip("");
}};
Entry.block.options_for_list = function(b, a) {
  return a.getField("OPERATOR", a);
};
Entry.Collection = function(b) {
  this.length = 0;
  this._hashMap = {};
  this._observers = [];
  this.set(b);
};
(function(b, a) {
  b.set = function(b) {
    for (;this.length;) {
      a.pop.call(this);
    }
    var d = this._hashMap, e;
    for (e in d) {
      delete d[e];
    }
    if (void 0 !== b) {
      e = 0;
      for (var f = b.length;e < f;e++) {
        var g = b[e];
        d[g.id] = g;
        a.push.call(this, g);
      }
    }
  };
  b.push = function(b) {
    this._hashMap[b.id] = b;
    a.push.call(this, b);
  };
  b.unshift = function() {
    for (var b = Array.prototype.slice.call(arguments, 0), d = this._hashMap, e = b.length - 1;0 <= e;e--) {
      var f = b[e];
      a.unshift.call(this, f);
      d[f.id] = f;
    }
  };
  b.insert = function(b, d) {
    a.splice.call(this, d, 0, b);
    this._hashMap[b.id] = b;
  };
  b.has = function(a) {
    return !!this._hashMap[a];
  };
  b.get = function(a) {
    return this._hashMap[a];
  };
  b.at = function(a) {
    return this[a];
  };
  b.getAll = function() {
    for (var a = this.length, b = [], e = 0;e < a;e++) {
      b.push(this[e]);
    }
    return b;
  };
  b.indexOf = function(b) {
    return a.indexOf.call(this, b);
  };
  b.find = function(a) {
    for (var b = [], e, f = 0, g = this.length;f < g;f++) {
      e = !0;
      var h = this[f], k;
      for (k in a) {
        if (a[k] != h[k]) {
          e = !1;
          break;
        }
      }
      e && b.push(h);
    }
    return b;
  };
  b.pop = function() {
    var b = a.pop.call(this);
    delete this._hashMap[b.id];
    return b;
  };
  b.shift = function() {
    var b = a.shift.call(this);
    delete this._hashMap[b.id];
    return b;
  };
  b.slice = function(b, d) {
    var e = a.slice.call(this, b, d), f = this._hashMap, g;
    for (g in e) {
      delete f[e[g].id];
    }
    return e;
  };
  b.remove = function(a) {
    var b = this.indexOf(a);
    -1 < b && (delete this._hashMap[a.id], this.splice(b, 1));
  };
  b.splice = function(b, d) {
    var e = a.slice.call(arguments, 2), f = this._hashMap;
    d = void 0 === d ? this.length - b : d;
    for (var g = a.splice.call(this, b, d), h = 0, k = g.length;h < k;h++) {
      delete f[g[h].id];
    }
    h = 0;
    for (k = e.length;h < k;h++) {
      f = e[h], a.splice.call(this, b++, 0, f), this._hashMap[f.id] = f;
    }
    return g;
  };
  b.clear = function() {
    for (;this.length;) {
      a.pop.call(this);
    }
    this._hashMap = {};
  };
  b.map = function(a, b) {
    for (var e = 0, f = this.length;e < f;e++) {
      a(this[e], b);
    }
  };
  b.moveFromTo = function(b, d) {
    var e = this.length - 1;
    0 > b || 0 > d || b > e || d > e || a.splice.call(this, d, 0, a.splice.call(this, b, 1)[0]);
  };
  b.sort = function() {
  };
  b.fromJSON = function() {
  };
  b.toJSON = function() {
    for (var a = [], b = 0, e = this.length;b < e;b++) {
      a.push(this[b].toJSON());
    }
    return a;
  };
  b.observe = function() {
  };
  b.unobserve = function() {
  };
  b.notify = function() {
  };
  b.destroy = function() {
  };
})(Entry.Collection.prototype, Array.prototype);
Entry.Event = function(b) {
  this._sender = b;
  this._listeners = [];
};
(function(b) {
  b.attach = function(a, b) {
    var d = {obj:a, fn:b};
    this._listeners.push(d);
    return d;
  };
  b.detach = function(a) {
    var b = this._listeners;
    return b.splice(b.indexOf(a), 1);
  };
  b.clear = function() {
    for (var a = this._listeners;a.length;) {
      a.pop();
    }
  };
  b.notify = function(a) {
    var b = this._sender;
    this._listeners.forEach(function(d) {
      d.fn.call(d.obj, b, a);
    });
  };
})(Entry.Event.prototype);
Entry.Observer = function(b, a, c, d) {
  this.parent = b;
  this.object = a;
  this.funcName = c;
  this.attrs = d;
  b.push(this);
};
(function(b) {
  b.destroy = function() {
    var a = this.parent;
    a.splice(a.indexOf(this), 1);
    return this;
  };
})(Entry.Observer.prototype);
Entry.db = {data:{}, typeMap:{}};
(function(b) {
  b.add = function(a) {
    this.data[a.id] = a;
    var b = a.type;
    void 0 === this.typeMap[b] && (this.typeMap[b] = {});
    this.typeMap[b][a.id] = a;
  };
  b.has = function(a) {
    return this.data.hasOwnProperty(a);
  };
  b.remove = function(a) {
    this.has(a) && (delete this.typeMap[this.data[a].type][a], delete this.data[a]);
  };
  b.get = function(a) {
    return this.data[a];
  };
  b.find = function() {
  };
  b.clear = function() {
    this.data = {};
    this.typeMap = {};
  };
})(Entry.db);
Entry.Dom = function(b, a) {
  var c = /<(\w+)>/, d;
  d = b instanceof HTMLElement ? $(b) : b instanceof jQuery ? b : c.test(b) ? $(b) : $("<" + b + "></" + b + ">");
  if (void 0 === a) {
    return d;
  }
  a.id && d.attr("id", a.id);
  a.class && d.addClass(a.class);
  a.classes && a.classes.map(function(a) {
    d.addClass(a);
  });
  a.parent && a.parent.append(d);
  return d;
};
Entry.init = function() {
  Entry.windowReszied || (Entry.windowResized = new Entry.Event(window), $(window).on("resize", function() {
    Entry.windowResized.notify();
  }));
  Entry.documentMousedown || (Entry.documentMousedown = new Entry.Event(window), $(document).on("mousedown", function(b) {
    Entry.documentMousedown.notify(b);
  }));
};
Entry.loadProject = function(b) {
};
Entry.STATIC = {OBJECT:0, ENTITY:1, SPRITE:2, SOUND:3, VARIABLE:4, FUNCTION:5, SCENE:6, MESSAGE:7, BLOCK_MODEL:8, BLOCK_RENDER_MODEL:9, BOX_MODEL:10, THREAD_MODEL:11, DRAG_INSTANCE:12, BLOCK_STATIC:0, BLOCK_MOVE:1, BLOCK_FOLLOW:2, RETURN:0, CONTINUE:1};
Entry.Utils = {};
Entry.Utils.generateId = function() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4);
};
Entry.Utils.intersectArray = function(b, a) {
  for (var c = [], d = 0;d < b.length;d++) {
    for (var e = 0;e < a.length;e++) {
      if (b[d] == a[e]) {
        c.push(b[d]);
        break;
      }
    }
  }
  return c;
};
Entry.Utils.isPointInMatrix = function(b, a, c) {
  c = void 0 === c ? 0 : c;
  var d = b.offsetX ? b.x + b.offsetX : b.x, e = b.offsetY ? b.y + b.offsety : b.y;
  return d - c <= a.x && d + b.width + c >= a.x && e - c <= a.y && e + b.height + c >= a.y;
};
Entry.Utils.colorDarken = function(b, a) {
  var c, d, e;
  7 === b.length ? (c = parseInt(b.substr(1, 2), 16), d = parseInt(b.substr(3, 2), 16), e = parseInt(b.substr(5, 2), 16)) : (c = parseInt(b.substr(1, 2), 16), d = parseInt(b.substr(2, 2), 16), e = parseInt(b.substr(3, 2), 16));
  a = void 0 === a ? .7 : a;
  c = Math.floor(c * a).toString(16);
  d = Math.floor(d * a).toString(16);
  e = Math.floor(e * a).toString(16);
  return "#" + c + d + e;
};
Entry.Model = function(b, a) {
  var c = Entry.Model;
  c.generateSchema(b);
  c.generateSetter(b);
  c.generateObserve(b);
  (void 0 === a || a) && Object.seal(b);
  return b;
};
(function(b) {
  b.generateSchema = function(a) {
    var b = a.schema;
    if (void 0 !== b) {
      b = JSON.parse(JSON.stringify(b));
      a.data = {};
      for (var d in b) {
        (function(d) {
          a.data[d] = b[d];
          Object.defineProperty(a, d, {get:function() {
            return a.data[d];
          }});
        })(d);
      }
      a._toJSON = this._toJSON;
    }
  };
  b.generateSetter = function(a) {
    a.set = this.set;
  };
  b.set = function(a, b) {
    var d = {}, e;
    for (e in this.data) {
      void 0 !== a[e] && (d[e] = this.data[e], this.data[e] = a[e]);
    }
    b || this.notify(Object.keys(a), d);
  };
  b.generateObserve = function(a) {
    a.observers = [];
    a.observe = this.observe;
    a.unobserve = this.unobserve;
    a.notify = this.notify;
  };
  b.observe = function(a, b, d) {
    return new Entry.Observer(this.observers, a, b, d);
  };
  b.unobserve = function(a) {
    a.destroy();
  };
  b.notify = function(a, b) {
    "string" === typeof a && (a = [a]);
    var d = this;
    d.observers.map(function(e) {
      var f = a;
      void 0 !== e.attrs && (f = Entry.Utils.intersectArray(e.attrs, a));
      if (f.length) {
        e.object[e.funcName](f.map(function(a) {
          return {name:a, object:d, oldValue:b[a]};
        }));
      }
    });
  };
  b._toJSON = function() {
    var a = {}, b;
    for (b in this.data) {
      a[b] = this.data[b];
    }
    return a;
  };
})(Entry.Model);
Entry.BlockModel = function() {
  Entry.Model(this);
};
Entry.BlockModel.prototype.schema = {id:null, x:0, y:0, type:null, params:{}, statements:{}, prev:null, next:null, view:null};
Entry.BlockRenderModel = function() {
  Entry.Model(this);
};
Entry.BlockRenderModel.prototype.schema = {id:0, type:Entry.STATIC.BLOCK_RENDER_MODEL, x:0, y:0, width:0, height:0, magneting:!1};
Entry.BoxModel = function() {
  Entry.Model(this);
};
Entry.BoxModel.prototype.schema = {id:0, type:Entry.STATIC.BOX_MODEL, x:0, y:0, width:0, height:0};
Entry.DragInstance = function(b) {
  Entry.Model(this);
  this.set(b);
};
Entry.DragInstance.prototype.schema = {type:Entry.STATIC.DRAG_INSTANCE, startX:0, startY:0, offsetX:0, offsetY:0, mode:0};
Entry.Entity = function() {
  Entry.Model(this);
};
Entry.Entity.prototype.schema = {id:0, type:Entry.STATIC.ENTITY, rotation:0, direction:0, x:0, y:0, regX:0, regY:0, scaleX:0, scaleY:0, width:0, height:0, imageIndex:0, visible:0, colour:0, font:0, bgColor:0, textAlign:0, lineBreak:!1, underLine:!1, strike:!1};
Entry.Function = function() {
  Entry.Model(this);
};
Entry.Function.prototype.schema = {id:0, type:Entry.STATIC.FUNCTION, block:0, content:0, fieldNames:0};
Entry.Message = function() {
  Entry.Model(this);
};
Entry.Message.prototype.schema = {id:0, type:Entry.STATIC.MESSAGE, name:0};
Entry.Object = function() {
  Entry.Model(this);
};
Entry.Object.prototype.schema = {id:0, type:Entry.STATIC.OBJECT, objectType:0, name:0, order:0, scene:0, active:!0, lock:!1, rotateMethod:0, entity:0, script:0, sprite:0, selectedPicture:0};
Entry.Scene = function() {
  Entry.Model(this);
};
Entry.Scene.prototype.schema = {id:0, type:Entry.STATIC.SCENE, name:0};
Entry.Sound = function() {
  Entry.Model(this);
};
Entry.Sound.prototype.schema = {id:0, type:Entry.STATIC.SOUND, name:0, filename:0, ext:0, duration:0};
Entry.Sprite = function() {
  Entry.Model(this);
};
Entry.Sprite.prototype.schema = {id:0, type:Entry.STATIC.SPRITE, name:0, pictures:0, sounds:0};
Entry.ThreadModel = function() {
  Entry.Model(this);
};
Entry.ThreadModel.prototype.schema = {id:0, type:Entry.STATIC.THREAD_MODEL, x:0, y:0, width:0, minWidth:0, height:0};
Entry.Variable = function() {
  Entry.Model(this);
};
Entry.Variable.prototype.schema = {id:0, type:Entry.STATIC.VARIABLE, variableType:0, name:0, value:0, minValue:0, maxValue:0, visible:!0, x:0, y:0, width:0, height:0, isCloud:!1, object:null, array:0};
Entry.block.run = {skeleton:"basic", color:"#3BBD70", contents:["this is", "basic block"], func:function() {
}};
Entry.block.jr_start = {skeleton:"pebble_event", event:"start", color:"#3BBD70", contents:[{type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_play_image.png", highlightColor:"#3BBD70", size:22}], func:function() {
  var b = Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT), a;
  for (a in b) {
    this._unit = b[a];
  }
  Ntry.unitComp = Ntry.entityManager.getComponent(this._unit.id, Ntry.STATIC.UNIT);
}};
Entry.block.jr_repeat = {skeleton:"pebble_loop", color:"#127CDB", contents:[{type:"Dropdown", key:"REPEAT", options:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], value:9}, "\ubc18\ubcf5", {type:"Statement", key:"STATEMENT", accept:"pebble_basic"}], func:function() {
  if (void 0 === this.repeatCount) {
    return this.repeatCount = this.block.values.REPEAT, Entry.STATIC.CONTINUE;
  }
  if (0 < this.repeatCount) {
    return console.log(this.repeatCount), this.repeatCount--, this.executor.stepInto(this.block.values.STATEMENT), Entry.STATIC.CONTINUE;
  }
  delete this.repeatCount;
}};
Entry.block.jr_item = {skeleton:"pebble_basic", color:"#F46C6C", contents:["\uaf43 \ubaa8\uc73c\uae30", {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_item_image.png", highlightColor:"#FFF", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var b = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM, function() {
      Ntry.dispatchEvent("getItem");
      b.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_north = {skeleton:"pebble_basic", color:"#A751E3", contents:["   \uc704\ub85c", {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_up_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var b = this, a = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    };
    switch(Ntry.unitComp.direction) {
      case Ntry.STATIC.EAST:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, a);
        break;
      case Ntry.STATIC.SOUTH:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, a);
        break;
      case Ntry.STATIC.WEST:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, a);
        break;
      default:
        a();
    }
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_east = {skeleton:"pebble_basic", color:"#A751E3", contents:["\uc624\ub978\ucabd", {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_right_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var b = this, a = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    };
    switch(Ntry.unitComp.direction) {
      case Ntry.STATIC.SOUTH:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, a);
        break;
      case Ntry.STATIC.WEST:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, a);
        break;
      case Ntry.STATIC.NORTH:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, a);
        break;
      default:
        a();
    }
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_south = {skeleton:"pebble_basic", color:"#A751E3", contents:["\uc544\ub798\ucabd", {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_down_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var b = this, a = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    };
    switch(Ntry.unitComp.direction) {
      case Ntry.STATIC.EAST:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, a);
        break;
      case Ntry.STATIC.NORTH:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, a);
        break;
      case Ntry.STATIC.WEST:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, a);
        break;
      default:
        a();
    }
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_west = {skeleton:"pebble_basic", color:"#A751E3", contents:["   \uc67c\ucabd", {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_left_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var b = this, a = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    };
    switch(Ntry.unitComp.direction) {
      case Ntry.STATIC.SOUTH:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, a);
        break;
      case Ntry.STATIC.EAST:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, a);
        break;
      case Ntry.STATIC.NORTH:
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, a);
        break;
      default:
        a();
    }
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.BlockMenu = function(b) {
  Entry.Model(this, !1);
  b = "string" === typeof b ? $("#" + b) : $(b);
  if ("DIV" !== b.prop("tagName")) {
    return console.error("Dom is not div element");
  }
  if ("function" !== typeof window.Snap) {
    return console.error("Snap library is required");
  }
  this._svgDom = Entry.Dom($('<svg id="blockMenu" width="100%" height="100%"version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'), {parent:b});
  this.offset = this._svgDom.offset();
  this._svgWidth = this._svgDom.width();
  this.snap = Snap("#blockMenu");
  this.svgGroup = this.snap.group();
  this.svgThreadGroup = this.svgGroup.group();
  this.svgThreadGroup.board = this;
  this.svgBlockGroup = this.svgGroup.group();
  this.svgBlockGroup.board = this;
  this.observe(this, "generateDragBlockObserver", ["dragBlock"]);
};
(function(b) {
  b.schema = {code:null, dragBlock:null, closeBlock:null};
  b.changeCode = function(a) {
    if (!(a instanceof Entry.Code)) {
      return console.error("You must inject code instance");
    }
    this.set({code:a});
    a.createView(this);
    this.align();
  };
  b.bindCodeView = function(a) {
    this.svgBlockGroup.remove();
    this.svgThreadGroup.remove();
    this.svgBlockGroup = a.svgBlockGroup;
    this.svgThreadGroup = a.svgThreadGroup;
  };
  b.align = function() {
    for (var a = this.code.getThreads(), b = 10, d = this._svgDom.width() / 2, e = 0, f = a.length;e < f;e++) {
      var g = a[e].getFirstBlock(), h = g.view;
      g.set({x:d, y:b});
      h._moveTo(d, b, !1);
      b += h.height + 15;
    }
  };
  b.generateDragBlockObserver = function() {
    var a = this.dragBlock;
    a && !this.dragBlockObserver && (this.dragBlockObserver = a.observe(this, "cloneThread", ["x", "y"]));
  };
  b.removeDragBlockObserver = function() {
    var a = this.dragBlockObserver;
    null !== a && (a.destroy(), this.dragBlockObserver = null);
  };
  b.cloneThread = function() {
    if (null !== this.dragBlock) {
      this.dragBlockObserver && this.removeDragBlockObserver();
      var a = this._svgWidth, b = this.dragBlock, d = b.block, e = this.code, f = d.getThread();
      d && f && (b.observe(this, "moveBoardBlock", ["x", "y"]), e.cloneThread(f), d = this.workspace.getBoard(), this._boardBlockView = d.code.cloneThread(f).getFirstBlock().view, d.set({dragBlock:this._boardBlockView}), this._boardBlockView.dragMode = 1, this._boardBlockView._moveTo(-(a - b.x), b.y, !1));
    }
  };
  b.terminateDrag = function() {
    if (this._boardBlockView) {
      var a = this._boardBlockView;
      if (a) {
        var b = a.block, d = this.dragBlock, e = d.block, f = this.code, g = this.workspace, h = g.getBoard().code, k = !1;
        a.dragMode = 0;
        d.x < this._svgWidth ? (k = !0, h.destroyThread(b.getThread(), k)) : b.view.terminateDrag();
        g.getBoard().set({dragBlock:null});
        f.destroyThread(e.getThread(), k);
        this._boardBlockView = null;
      }
    }
  };
  b.dominate = function(a) {
    this.snap.append(a.svgGroup);
  };
  b.getCode = function(a) {
    return this._code;
  };
  b.moveBoardBlock = function() {
    var a = this.workspace.getBoard().offset, b = this.offset, d = a.left - b.left, a = a.top - b.top, e = this.dragBlock, b = this._boardBlockView;
    if (e && b) {
      var f = e.x, e = e.y;
      b.dragMode = 2;
      b._moveTo(f - d, e - a, !1);
    }
  };
})(Entry.BlockMenu.prototype);
Entry.BlockView = function(b, a) {
  Entry.Model(this, !1);
  this.block = b;
  this.set(b);
  this.svgGroup = a.svgBlockGroup.group();
  this.svgGroup.block = this.block;
  this._schema = Entry.block[b.type];
  this._skeleton = Entry.skeleton[this._schema.skeleton];
  this._contents = [];
  this.prevAnimatingObserver = this.prevObserver = null;
  this.block.observe(this, "_bindPrev", ["prev"]);
  this._bindPrev();
  this.dragMode = Entry.DRAG_MODE_NONE;
  this._startRender(b);
};
(function(b) {
  b.schema = {id:0, type:Entry.STATIC.BLOCK_RENDER_MODEL, x:0, y:0, width:0, height:0, contentWidth:0, contentHeight:0, magneting:!1, animating:!1};
  b._startRender = function(a) {
    this.svgGroup.attr({class:"block"});
    this.svgGroup.attr({transform:"t" + this.x + " " + this.y});
    a = this._skeleton.path(this);
    this._darkenPath = this.svgGroup.path(a);
    this._darkenPath.attr({transform:"t0 1.1", fill:Entry.Utils.colorDarken(this._schema.color)});
    this._path = this.svgGroup.path(a);
    this._path.attr({fill:this._schema.color});
    this._startContentRender();
    this._addControl();
  };
  b._startContentRender = function() {
    this.contentSvgGroup = this.svgGroup.group();
    var a = this._skeleton.contentPos();
    this.contentSvgGroup.transform("t" + a.x + " " + a.y);
    for (var a = this._schema.contents, b = 0;b < a.length;b++) {
      var d = a[b];
      "string" === typeof d ? this._contents.push(new Entry.FieldText(d, this)) : this._contents.push(new Entry["Field" + d.type](d, this));
    }
    this._alignContent(!1);
  };
  b.changeBoard = function(a) {
    this.svgGroup.remove();
    a.svgBlockGroup.append(this.svgGroup);
  };
  b._alignContent = function(a) {
    !0 !== a && (a = !1);
    for (var b = 0, d = 0, e = 0;e < this._contents.length;e++) {
      d = this._contents[e];
      d.align(b, 0, a);
      e !== this._contents.length - 1 && (b += 5);
      var f = d.box, d = Math.max(f.y + f.height), b = b + f.width;
    }
    this.set({contentWidth:b, contentHeight:d});
    this._render();
  };
  b._bindPrev = function() {
    this.prevObserver && this.prevObserver.destroy();
    this.prevAnimatingObserver && this.prevAnimatingObserver.destroy();
    if (this.block.prev) {
      var a = this.block.prev.view;
      this.prevAnimatingObserver = a.observe(this, "_inheritAnimate", ["animating"]);
      this.prevObserver = a.observe(this, "_align", ["x", "y", "height"]);
      !0 === a.animating && this.set({animating:!0});
      this._align();
    }
  };
  b._render = function() {
    var a = this._skeleton.path(this);
    this._darkenPath.attr({d:a}, 300, mina.easeinout);
    this._path.attr({d:a}, 300, mina.easeinout);
    this.set(this._skeleton.box(this));
  };
  b._align = function(a) {
    if (null !== this.block.prev) {
      var b = this.block.prev.view;
      !0 === a && this.set({animating:!0});
      this.set({x:b.x, y:b.y + b.height + 1});
      var d = this;
      !0 === a || this.animating ? this.svgGroup.animate({transform:"t" + this.x + " " + this.y}, 300, mina.easeinout, function() {
        d.set({animating:!1});
      }) : this.svgGroup.attr({transform:"t" + this.x + " " + this.y});
    }
  };
  b._moveTo = function(a, b, d) {
    var e = "t" + a + " " + b;
    void 0 === d || d ? this.svgGroup.animate({transform:e}, 300, mina.easeinout) : this.svgGroup.attr({transform:e});
    this.set({x:a, y:b});
  };
  b._moveBy = function(a, b, d) {
    return this._moveTo(this.x + a, this.y + b, d);
  };
  b._addControl = function() {
    var a = this;
    this.svgGroup.mousedown(function() {
      a.onMouseDown.apply(a, arguments);
    });
  };
  b.onMouseDown = function(a) {
    function b(a) {
      a.stopPropagation();
      a.preventDefault();
      a.originalEvent.touches && (a = a.originalEvent.touches[0]);
      var c = f.dragInstance;
      f._moveBy(a.clientX - c.offsetX, a.clientY - c.offsetY, !1);
      c.set({offsetX:a.clientX, offsetY:a.clientY});
      f.dragMode = Entry.DRAG_MODE_DRAG;
    }
    function d(a) {
      a = f.getBoard();
      f.terminateDrag();
      delete f.dragInstance;
      $(document).unbind(".block");
      a.set({dragBlock:null});
    }
    if (0 === a.button || a instanceof Touch) {
      var e = $(document);
      e.bind("mousemove.block", b);
      e.bind("mouseup.block", d);
      e.bind("touchmove.block", b);
      e.bind("touchend.block", d);
      this.getBoard().set({dragBlock:this});
      this.dragInstance = new Entry.DragInstance({startX:a.clientX, startY:a.clientY, offsetX:a.clientX, offsetY:a.clientY, mode:!0});
      this.dominate();
      this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
    }
    var f = this;
  };
  b.terminateDrag = function() {
    var a = this.getBoard(), b = this.dragMode, d = this.block;
    this.dragMode = Entry.DRAG_MODE_NONE;
    a instanceof Entry.BlockMenu ? a.terminateDrag() : (a = this._getCloseBlock(), d.prev || a ? 30 < Math.sqrt(Math.pow(this.x - d.x, 2) + Math.pow(this.y - d.y, 2)) ? a ? (this.set({animating:!0}), d.doInsert(a)) : d.doSeparate() : this._align(!0) : b == Entry.DRAG_MODE_DRAG && d.doMove());
  };
  b._getCloseBlock = function() {
    for (var a = Snap.getElementByPoint(this.x + 690, this.y + 130), b = a.block;!b && "svg" !== a.type && "BODY" !== a.type;) {
      a = a.parent(), b = a.block;
    }
    return b === this.block ? null : b;
  };
  b._inheritAnimate = function() {
    var a = this.block.prev.view;
    a && this.set({animating:a.animating});
  };
  b.dominate = function() {
    var a = this.block, b = this.svgGroup.parent();
    this.svgGroup.remove();
    b.append(this.svgGroup);
    (b = a.values.STATEMENT) && (b = b.getFirstBlock().next) && b.view.dominate();
    a.next && a.next.view.dominate();
  };
  b.getBoard = function() {
    return this.svgGroup.parent().board;
  };
  b.destroy = function(a) {
    var b = this.svgGroup;
    a ? b.animate({opacity:0}, 200, null, function() {
      this.remove();
    }) : b.remove();
  };
})(Entry.BlockView.prototype);
Entry.Code = function(b) {
  Entry.Model(this, !1);
  this._data = new Entry.Collection;
  this._eventMap = {};
  this.executors = [];
  this.executeEndEvent = new Entry.Event(this);
  this.load(b);
};
(function(b) {
  b.schema = {view:null};
  b.load = function(a) {
    if (!(a instanceof Array)) {
      return console.error("code must be array");
    }
    for (var b = 0;b < a.length;b++) {
      this._data.push(new Entry.Thread(a[b], this));
    }
  };
  b.createView = function(a) {
    null === this.view ? this.set({view:new Entry.CodeView(this, a)}) : a.bindCodeView(this.view);
  };
  b.registerEvent = function(a, b) {
    this._eventMap[b] || (this._eventMap[b] = []);
    this._eventMap[b].push(a);
  };
  b.raiseEvent = function(a) {
    a = this._eventMap[a];
    for (var b = 0;b < a.length;b++) {
      this.executors.push(new Entry.Executor(a[b]));
    }
  };
  b.map = function(a) {
    this._data.map(a);
  };
  b.tick = function() {
    for (var a = this.executors, b = 0;b < a.length;b++) {
      var d = a[b];
      d.execute();
      null === d.scope.block && (a.splice(b, 1), b--, 0 === a.length && this.executeEndEvent.notify());
    }
  };
  b.clearExecutors = function() {
    this.executors = [];
  };
  b.createThread = function(a) {
    if (!(a instanceof Array)) {
      return console.error("blocks must be array");
    }
    this._data.push(new Entry.Thread(a, this));
  };
  b.cloneThread = function(a) {
    a = a.clone(this);
    this._data.push(a);
    return a;
  };
  b.destroyThread = function(a, b) {
    var d = this._data, e = d.indexOf(a);
    d.splice(e, 1);
    a.destroy(b);
  };
  b.getThreads = function() {
    return this._data;
  };
})(Entry.Code.prototype);
Entry.CodeView = function(b, a) {
  Entry.Model(this, !1);
  this.code = b;
  this.set({board:a});
  this.observe(this, "changeBoard", ["board"]);
  this.svgThreadGroup = a.svgGroup.group();
  this.svgThreadGroup.board = a;
  this.svgBlockGroup = a.svgGroup.group();
  this.svgBlockGroup.board = a;
  a.bindCodeView(this);
  this.code.map(function(b) {
    b.createView(a);
  });
};
(function(b) {
  b.schema = {board:null, scrollX:0, scrollY:0};
})(Entry.CodeView.prototype);
Entry.Executor = function(b) {
  this.scope = {block:b, executor:this};
  this._callStack = [];
};
(function(b) {
  b.execute = function() {
    void 0 === this.scope.block._schema.func.call(this.scope) && (this.scope = {block:this.scope.block.next, executor:this});
    null === this.scope.block && this._callStack.length && (this.scope = this._callStack.pop());
  };
  b.stepInto = function(a) {
    a instanceof Entry.Thread || console.error("Must step in to thread");
    this._callStack.push(this.scope);
    a = a.getFirstBlock();
    a instanceof Entry.DummyBlock && (a = a.next);
    this.scope = {block:a, executor:this};
  };
})(Entry.Executor.prototype);
Entry.FieldDropdown = function(b, a) {
  this._block = a.block;
  this.box = new Entry.BoxModel;
  this.svgGroup = null;
  this._contents = b;
  this.renderStart(a);
};
(function(b) {
  b.renderStart = function(a) {
    var b = this;
    this.options = this._contents.options;
    this.key = this._contents.key;
    this.value = this._block.values[this.key];
    this.width = 39;
    this.height = 22;
    this.svgGroup = a.contentSvgGroup.group();
    this.svgGroup.attr({class:"entry-field-dropdown"});
    this.svgGroup.rect(0, -12, 39, 22, 3).attr({fill:"#80cbf8"});
    this.textElement = this.svgGroup.text(5, 3, this.value);
    this.svgGroup.polygon(28, -2, 34, -2, 31, 2).attr({fill:"#127cbd", stroke:"#127cbd"});
    this.svgGroup.mouseup(function(a) {
      b._block.view.dragMode == Entry.DRAG_MODE_MOUSEDOWN && b.renderOptions();
    });
    this.box.set({x:0, y:0, width:39, height:22});
  };
  b.renderOptions = function() {
    var a = this, b = this._block.view;
    this.px = b.x;
    this.py = b.y;
    var d = this.options;
    this.optionGroup && delete this.optionGroup;
    this.optionGroup = b.getBoard().svgGroup.group();
    this.optionGroup.attr({class:"entry-field-dropdown"});
    var e = Entry.documentMousedown.attach(this, function() {
      Entry.documentMousedown.detach(e);
      a.optionGroup.remove();
    }), f;
    for (f in d) {
      var b = this.optionGroup.group().attr({class:"rect"}), g = Number(f) + 1;
      b.rect(this.px - 46, this.py + 14 + 22 * g, 38, 23);
      b.text(this.px - 43, this.py + 29 + 22 * g, d[f]);
      (function(b, c) {
        b.mousedown(function() {
          a.applyValue(c);
        });
      })(b, d[f]);
    }
  };
  b.align = function(a, b, d) {
    var e = this.svgGroup;
    this._position && (a = this._position.x);
    var f = "t" + a + " " + b;
    void 0 === d || d ? e.animate({transform:f}, 300, mina.easeinout) : e.attr({transform:f});
    this.box.set({x:a, y:b});
  };
  b.applyValue = function(a) {
    this._block.values[this.key] = a;
    this.textElement.node.textContent = a;
  };
})(Entry.FieldDropdown.prototype);
Entry.FieldIndicator = function(b, a) {
  this._block = a;
  this.box = new Entry.BoxModel;
  this._size = b.size;
  this._imgUrl = b.img;
  this._highlightColor = b.highlightColor ? b.highlightColor : "#F59900";
  this._position = b.position;
  this._imgElement = this._path = this.svgGroup = null;
  this.renderStart();
};
(function(b) {
  b.renderStart = function() {
    this.svgGroup = this._block.contentSvgGroup.group();
    this._imgElement = this.svgGroup.image(this._imgUrl, -1 * this._size, -1 * this._size, 2 * this._size, 2 * this._size);
    var a = "m 0,-%s a %s,%s 0 1,1 -0.1,0 z".replace(/%s/gi, this._size);
    this._path = this.svgGroup.path(a);
    this._path.attr({stroke:"none", fill:"none"});
    this.box.set({x:this._size, y:0, width:2 * this._size, height:2 * this._size});
  };
  b.align = function(a, b, d) {
    var e = this.svgGroup;
    this._position && (a = this._position.x);
    var f = "t" + a + " " + b;
    void 0 === d || d ? e.animate({transform:f}, 300, mina.easeinout) : e.attr({transform:f});
    this.box.set({x:a, y:b});
  };
  b.enableHighlight = function() {
    var a = this._path.getTotalLength(), b = this._path;
    this._path.attr({stroke:this._highlightColor, strokeWidth:2, "stroke-linecap":"round", "stroke-dasharray":a + " " + a, "stroke-dashoffset":a});
    setInterval(function() {
      b.attr({"stroke-dashoffset":a}).animate({"stroke-dashoffset":0}, 300);
    }, 1400, mina.easeout);
    setTimeout(function() {
      setInterval(function() {
        b.animate({"stroke-dashoffset":-a}, 300);
      }, 1400, mina.easeout);
    }, 500);
  };
})(Entry.FieldIndicator.prototype);
Entry.FieldStatement = function(b, a) {
  this._blockView = a;
  this.key = b.key;
  this.box = new Entry.BoxModel;
  this.acceptType = b.accept;
  this.dummyBlock = this.svgGroup = null;
  this.box.observe(a, "_alignContent", ["height"]);
  this.renderStart(a.getBoard());
};
(function(b) {
  b.renderStart = function(a) {
    this.svgGroup = this._blockView.contentSvgGroup.group();
    this.box.set({x:46, y:0, width:20, height:20});
    this.dummyBlock = new Entry.DummyBlock(this, this._blockView);
    this._thread = this._blockView.block.values[this.key];
    this._thread.insertDummyBlock(this.dummyBlock);
    this._thread.createView(a);
    this._thread.changeEvent.attach(this, this.calcHeight);
  };
  b.insertAfter = function(a) {
    this._thread.insertByBlock(this.dummyBlock, a);
    this.calcHeight();
  };
  b.calcHeight = function() {
    for (var a = this.dummyBlock.next, b = 0;a;) {
      b += a.view.height + 1, a = a.next;
    }
    this.box.set({height:b});
  };
  b.align = function(a, b, d) {
    a = this.svgGroup;
    void 0 === d || d ? a.animate({transform:"t46 15"}, 300, mina.easeinout) : a.attr({transform:"t46 15"});
  };
})(Entry.FieldStatement.prototype);
Entry.DummyBlock = function(b, a) {
  Entry.Model(this, !1);
  this.view = this;
  this.originBlockView = a;
  this.svgGroup = b.svgGroup.group();
  this.svgGroup.block = b;
  var c = Entry.skeleton[b.acceptType].path(this);
  this.path = this.svgGroup.path(c);
  this.path.attr({transform:"t0 1.1", fill:"transparent"});
  this.prevObserver = a.observe(this, "_align", ["x", "y"]);
  this._align();
};
(function(b) {
  b.schema = {x:0, y:0, width:0, height:39};
  b._align = function(a) {
    this.set({x:this.originBlockView.x, y:this.originBlockView.y});
  };
  b.createView = function() {
  };
  b.setThread = function() {
  };
  b.setPrev = function() {
  };
  b.setNext = function(a) {
    this.next = a;
  };
})(Entry.DummyBlock.prototype);
Entry.FieldText = function(b, a) {
  this._block = a;
  this.box = new Entry.BoxModel;
  this._text = b;
  this.textElement = null;
  this.renderStart();
};
(function(b) {
  b.renderStart = function() {
    this.textElement = this._block.contentSvgGroup.text(0, 0, this._text);
    this.textElement.attr({style:"white-space: pre; font-size: 16px", "alignment-baseline":"central", "class":"dragNone", fill:"white"});
    var a = this.textElement.getBBox();
    this.box.set({x:0, y:0, width:a.width, height:a.height});
  };
  b.align = function(a, b) {
    this.textElement.animate({x:a, y:b}, 300, mina.easeinout);
    this.box.set({x:a, y:b});
  };
})(Entry.FieldText.prototype);
Entry.skeleton = function() {
};
Entry.skeleton.basic = {path:function(b) {
  return "m -4,0 l 8,8 8,-8 h %w a 15,15 0 0,1 0,30 h -%w l -8,8 -8,-8 v -30 z".replace(/%w/gi, b.contentWidth);
}, box:function(b) {
  return {offsetX:0, offsetY:0, width:b.contentWidth + 30, height:30, marginBottom:0};
}, magnets:{previous:{}, next:{x:0, y:31}}, contentPos:function(b) {
  return {x:20, y:15};
}};
Entry.skeleton.pebble_event = {path:function(b) {
  return "m 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z";
}, box:function(b) {
  return {offsetX:-25, offsetY:0, width:50, height:48.3, marginBottom:0};
}, magnets:function(b) {
  return {next:{x:0, y:49.3}};
}, contentPos:function() {
  return {x:0, y:25};
}};
Entry.skeleton.pebble_loop = {path:function(b) {
  b = Math.max(b.contentHeight, 50);
  return "M 0,9 a 9,9 0 0,0 9,-9 h %cw a 25,25 0 0,1 25,25 v %ch a 25,25 0 0,1 -25,25 h -%cw a 9,9 0 0,1 -18,0 h -%cw a 25,25 0 0,1 -25,-25 v -%ch a 25,25 0 0,1 25,-25 h %cw a 9,9 0 0,0 9,9 z M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v %cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z".replace(/%cw/gi, 41).replace(/%ch/gi, b + 4).replace(/%cih/gi, b + -50);
}, magnets:function() {
  return {previous:{x:0, y:0}, next:{x:0, y:105}};
}, box:function(b) {
  return {offsetX:-75, offsetY:0, width:150, height:Math.max(b.contentHeight, 50) + 54, marginBottom:0};
}, contentPos:function() {
  return {x:-46, y:25};
}};
Entry.skeleton.pebble_basic = {path:function(b) {
  return "m 0,9 a 9,9 0 0,0 9,-9 h 28 a 25,25 0 0,1 0,50 h -28 a 9,9 0 0,1 -18,0 h -28 a 25,25 0 0,1 0,-50 h 28 a 9,9 0 0,0 9,9 z";
}, magnets:function() {
  return {previous:{x:0, y:0}, next:{x:0, y:51}};
}, box:function() {
  return {offsetX:-62, offsetY:0, width:124, height:50, marginBottom:0};
}, contentPos:function() {
  return {x:-46, y:25};
}};
Entry.Block = function(b, a) {
  Entry.Model(this, !1);
  this._thread = a;
  this._schema = null;
  this.load(b);
};
Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = .4;
Entry.Block.HIDDEN = 0;
Entry.Block.SHOWN = 1;
Entry.Block.MOVE = 2;
Entry.Block.FOLLOW = 3;
(function(b) {
  b.schema = {id:null, x:0, y:0, type:null, values:{}, prev:null, next:null, view:null};
  b.load = function(a) {
    a.id || (a.id = Entry.Utils.generateId());
    this.set(a);
    this.getSchema();
  };
  b.getSchema = function() {
    this._schema = Entry.block[this.type];
    this._schema.event && this._thread.registerEvent(this, this._schema.event);
    for (var a = this._schema.contents, b = 0;b < a.length;b++) {
      var d = a[b];
      d.value && (this.values[d.key] = d.value);
      "Statement" == d.type && (this.values[d.key] = new Entry.Thread(this.values[d.key], this._thread._code));
    }
  };
  b.setThread = function(a) {
    this._thread = a;
  };
  b.getThread = function() {
    return this._thread;
  };
  b.setPrev = function(a) {
    this.set({prev:a});
  };
  b.setNext = function(a) {
    this.set({next:a});
  };
  b.next = function() {
    return this.next;
  };
  b.insertAfter = function(a) {
    this._thread.insertByBlock(this, a);
  };
  b._updatePos = function() {
    this.view && this.set({x:this.view.x, y:this.view.y});
    this.next && this.next._updatePos();
  };
  b.createView = function(a) {
    this.view || (this.set({view:new Entry.BlockView(this, a)}), this._updatePos());
  };
  b.clone = function(a) {
    return new Entry.Block(this.toJSON(!0), a);
  };
  b.toJSON = function(a) {
    var b = this._toJSON();
    delete b.prev;
    delete b.next;
    delete b.view;
    a && delete b.id;
    var d = {}, e;
    for (e in b.values) {
      d[e] = b.values[e];
    }
    b.values = d;
    d = this._schema.contents;
    for (e = 0;e < d.length;e++) {
      var f = d[e];
      "Statement" == f.type && (b.values[f.key] = this.values[f.key].toJSON(a));
    }
    return b;
  };
  b._destroy = function(a) {
    this.view && this.view.destroy(a);
  };
  b.doMove = function() {
    console.log("doMove", this.id, this.view.x - this.x, this.view.y - this.y);
    this._updatePos();
  };
  b.doSeparate = function() {
    console.log("separate", this.id, this.x, this.y);
    this._thread.separate(this);
    this._updatePos();
  };
  b.doInsert = function(a) {
    console.log("insert", this.id, a.id, this.x, this.y);
    var b = this._thread.cut(this);
    a.insertAfter(b);
    this._updatePos();
  };
  b.doDestroy = function(a) {
    console.log("destroy", this.id, this.x, this.y);
    this._destroy(a);
  };
})(Entry.Block.prototype);
Entry.Thread = function(b, a) {
  this._data = new Entry.Collection;
  this._code = a;
  this.load(b);
  this.changeEvent = new Entry.Event(this);
};
(function(b) {
  b.load = function(a) {
    void 0 === a && (a = []);
    if (!(a instanceof Array)) {
      return console.error("thread must be array");
    }
    for (var b = 0;b < a.length;b++) {
      var d = a[b];
      d instanceof Entry.Block || d instanceof Entry.DummyBlock ? (d.setThread(this), this._data.push(d)) : this._data.push(new Entry.Block(d, this));
    }
    this._setRelation();
    this._code.view && this.createView(this._code.view.board);
  };
  b._setRelation = function() {
    var a = this._data.getAll();
    if (0 !== a.length) {
      var b = a[0];
      b.setPrev(null);
      a[a.length - 1].setNext(null);
      for (var d = 1;d < a.length;d++) {
        var e = a[d];
        e.setPrev(b);
        b.setNext(e);
        b = e;
      }
    }
  };
  b.registerEvent = function(a, b) {
    this._code.registerEvent(a, b);
  };
  b.createView = function(a) {
    this.view || (this.view = new Entry.ThreadView(this, a));
    this._data.map(function(b) {
      b.createView(a);
    });
  };
  b.separate = function(a) {
    this._data.has(a.id) && a.prev && (a.prev.setNext(null), a.setPrev(null), a = this._data.splice(this._data.indexOf(a)), this._code.createThread(a), this.changeEvent.notify());
  };
  b.cut = function(a) {
    a = this._data.indexOf(a);
    var b = this._data.splice(a);
    this._data[a - 1] && this._data[a - 1].setNext(null);
    this.changeEvent.notify();
    return b;
  };
  b.insertDummyBlock = function(a) {
    this._data.unshift(a);
    this._data[1] && (this._data[1].setPrev(a), a.setNext(this._data[1]));
  };
  b.insertByBlock = function(a, b) {
    var d = this._data.indexOf(a);
    a.setNext(b[0]);
    b[0].setPrev(a);
    for (var e in b) {
      b[e].setThread(this);
    }
    this._data.splice.apply(this._data, [d + 1, 0].concat(b));
    this._setRelation();
    this.changeEvent.notify();
  };
  b.clone = function(a) {
    a = a || this._code;
    var b = [];
    a = new Entry.Thread([], a);
    for (var d = 0;d < this._data.length;d++) {
      b.push(this._data[d].clone(a));
    }
    a.load(b);
    return a;
  };
  b.toJSON = function(a) {
    for (var b = [], d = 0;d < this._data.length;d++) {
      this._data[d] instanceof Entry.Block && b.push(this._data[d].toJSON(a));
    }
    return b;
  };
  b.destroy = function(a) {
    var b = this._data;
    this.view && this.view.destroy(a);
    for (var d = 0;d < b.length;d++) {
      b[d].doDestroy(a);
    }
  };
  b.getFirstBlock = function() {
    return this._data[0];
  };
  b.getBlocks = function() {
    return this._data;
  };
})(Entry.Thread.prototype);
Entry.ThreadView = function(b, a) {
  Entry.Model(this, !1);
  this.svgGroup = a.svgThreadGroup.group();
};
(function(b) {
  b.schema = {scrollX:0, scrollY:0};
  b.destroy = function() {
    this.svgGroup.remove();
  };
})(Entry.ThreadView.prototype);
Entry.FieldTrashcan = function(b) {
  this.board = b;
  this.svgGroup = b.snap.group();
  this.renderStart();
  this.dragBlockObserver = this.dragBlock = null;
  this.isOver = !1;
  b.observe(this, "updateDragBlock", ["dragBlock"]);
  this.setPosition();
  Entry.windowResized && Entry.windowResized.attach(this, this.setPosition);
};
(function(b) {
  b.renderStart = function() {
    this.trashcanTop = this.svgGroup.image("/img/assets/delete_cover.png", 0, 0, 80, 20);
    this.trashcan = this.svgGroup.image("/img/assets/delete_body.png", 0, 20, 80, 80);
  };
  b.updateDragBlock = function() {
    var a = this.board.dragBlock;
    a ? this.dragBlockObserver = a.observe(this, "checkBlock", ["x", "y"]) : (this.dragBlockObserver && this.dragBlockObserver.destroy(), this.dragBlock && this.isOver && this.dragBlock.block.getThread().destroy(!0), this.tAnimation(!1));
    this.dragBlock = a;
  };
  b.checkBlock = function() {
    var a = this.board.offset, b = this.getPosition(), d = b.x + a.left, b = b.y + a.top, e, f = this.dragBlock, g = f.dragInstance;
    g ? (e = g.offsetX, a = g.offsetY) : (e = f.x + a.left, a = f.y + a.top);
    this.tAnimation(e >= d && a >= b);
  };
  b.align = function() {
    var a = this.getPosition();
    this.svgGroup.attr({transform:"t" + a.x + " " + a.y});
  };
  b.setPosition = function() {
    var a = this.board.svgDom;
    this._x = a.width() - 110;
    this._y = a.height() - 110;
    this.align();
  };
  b.getPosition = function() {
    return {x:this._x, y:this._y};
  };
  b.tAnimation = function(a) {
    if (a !== this.isOver) {
      a = void 0 === a ? !0 : a;
      var b = this.trashcanTop;
      a ? b.animate({transform:"t5 -20 r30"}, 50) : b.animate({transform:"r0"}, 50);
      this.isOver = a;
    }
  };
})(Entry.FieldTrashcan.prototype);
Entry.Board = function(b) {
  b = "string" === typeof b ? $("#" + b) : $(b);
  if ("DIV" !== b.prop("tagName")) {
    return console.error("Dom is not div element");
  }
  if ("function" !== typeof window.Snap) {
    return console.error("Snap library is required");
  }
  Entry.Model(this, !1);
  this.svgDom = Entry.Dom($('<svg id="play" width="100%" height="100%"version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'), {parent:b});
  this.offset = this.svgDom.offset();
  this.snap = Snap("#play");
  this._blockViews = [];
  this.trashcan = new Entry.FieldTrashcan(this);
  this.svgGroup = this.snap.group();
  this.svgThreadGroup = this.svgGroup.group();
  this.svgThreadGroup.board = this;
  this.svgBlockGroup = this.svgGroup.group();
  this.svgBlockGroup.board = this;
};
(function(b) {
  b.schema = {code:null, dragBlock:null, closeBlock:null};
  b.changeCode = function(a) {
    this.set({code:a});
    a.createView(this);
  };
  b.bindCodeView = function(a) {
    this.svgBlockGroup.remove();
    this.svgThreadGroup.remove();
    this.svgBlockGroup = a.svgBlockGroup;
    this.svgThreadGroup = a.svgThreadGroup;
  };
  b.updateCloseMagnet = function(a) {
    if (void 0 !== a.magnets.previous) {
      var b = Snap.getElementByPoint(a.x + this.offset.left, a.y + this.offset.top);
      for (a = b.block;!a;) {
        b = b.parent(), a = b.block;
      }
      if (a instanceof Entry.Block) {
        this.closeBlock !== a && (null !== this.closeBlock && (this.closeBlock.magneting = !1), this.closeBlock = a, this.closeBlock.magneting = !0, this.closeBlock.thread.align(!0));
      } else {
        if (a instanceof Entry.Thread) {
          a = a._blocks;
          for (var b = a[0].y, d = 0;d < a.length;d++) {
            var e = a[d];
            if (this.dragBlock !== e) {
              if (this.dragBlock.y > b && this.dragBlock.y < b + e.height && this.closeBlock !== e) {
                null !== this.closeBlock && (this.closeBlock.magneting = !1);
                this.closeBlock = e;
                this.closeBlock.magneting = !0;
                this.closeBlock.thread.align(!0);
                break;
              }
              b += e.height;
            }
          }
        } else {
          this.closeBlock && (this.closeBlock.magneting = !1, this.closeBlock.thread.align(!0), this.closeBlock = null);
        }
      }
    }
  };
  b.terminateDrag = function(a) {
    var b = a.dragInstance;
    if (this.closeBlock) {
      b = a.thread.cut(a);
      a = a.thread;
      var d = this.closeBlock.thread, e = d.indexOf(this.closeBlock) + 1;
      this.closeBlock.magneting = !1;
      for (var f = b.length - 1;0 <= f;f--) {
        b[f].thread = d, d._blocks.insert(b[f], e);
      }
      d.align();
      0 === a._blocks.length ? a.destroy() : a.align();
      this.closeBlock = null;
    } else {
      0 !== a.thread.indexOf(a) ? Math.sqrt(Math.pow(b.startX - b.offsetX, 2) + Math.pow(b.startY - b.offsetY, 2)) < Entry.Board.MAGNET_RANGE ? a.thread.align() : (b = a.thread.cut(a), this.code.createThread(b)) : a.thread.align();
    }
  };
  b.dominate = function(a) {
    this.snap.append(a.svgGroup);
  };
  b.getCode = function() {
    return this.code;
  };
})(Entry.Board.prototype);
Entry.Workspace = function(b, a) {
  this._blockMenu = b;
  this._board = a;
  b.workspace = this;
  a.workspace = this;
};
(function(b) {
  b.getBoard = function() {
    return this._board;
  };
  b.getBlockMenu = function() {
    return this._blockMenu;
  };
})(Entry.Workspace.prototype);

