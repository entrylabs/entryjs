var Entry = {events_:{}, block:{}, TEXT_ALIGN_CENTER:0, TEXT_ALIGN_LEFT:1, TEXT_ALIGN_RIGHT:2, TEXT_ALIGNS:["center", "left", "right"], loadProject:function(a) {
  a && ("workspace" == this.type && Entry.stateManager.startIgnore(), Entry.projectId = a._id, Entry.variableContainer.setVariables(a.variables), Entry.variableContainer.setMessages(a.messages), Entry.variableContainer.setFunctions(a.functions), Entry.scene.addScenes(a.scenes), Entry.stage.initObjectContainers(), Entry.container.setObjects(a.objects), Entry.FPS = a.speed ? a.speed : 60, createjs.Ticker.setFPS(Entry.FPS), "workspace" == this.type && Entry.stateManager.endIgnore());
  Entry.engine.projectTimer || Entry.variableContainer.generateTimer();
  Entry.start();
}, setBlockByText:function(a, b) {
  for (var c = [], d = jQuery.parseXML(b).getElementsByTagName("category"), e = 0;e < d.length;e++) {
    for (var f = d[e], h = {category:f.getAttribute("id"), blocks:[]}, f = f.childNodes, g = 0;g < f.length;g++) {
      var k = f[g];
      !k.tagName || "BLOCK" != k.tagName.toUpperCase() && "BTN" != k.tagName.toUpperCase() || h.blocks.push(k.getAttribute("type"));
    }
    c.push(h);
  }
  Entry.playground.setBlockMenu(c);
}, setBlock:function(a, b) {
  Entry.playground.setMenuBlock(a, b);
}, enableArduino:function() {
}, initSound:function(a) {
  var b = "/uploads/" + a.filename.substring(0, 2) + "/" + a.filename.substring(2, 4) + "/" + a.filename + a.ext;
  Entry.soundQueue.loadFile({id:a.id, src:b, type:createjs.LoadQueue.SOUND});
}, beforeUnload:function(a) {
  Entry.hw.closeConnection();
  if ("workspace" == Entry.type && (localStorage && Entry.interfaceState && localStorage.setItem("workspace-interface", JSON.stringify(Entry.interfaceState)), !Entry.stateManager.isSaved())) {
    return "\ud504\ub85c\uc81d\ud2b8\ub97c \uc218\uc815\ud558\uc168\uc2b5\ub2c8\ub2e4.";
  }
}, loadInterfaceState:function() {
  if ("workspace" == Entry.type) {
    if (localStorage && localStorage.getItem("workspace-interface")) {
      var a = localStorage.getItem("workspace-interface");
      this.resizeElement(JSON.parse(a));
    } else {
      this.resizeElement({menuWidth:280, canvasWidth:480});
    }
  }
}, resizeElement:function(a) {
  if ("workspace" == Entry.type) {
    !a.canvasWidth && this.interfaceState.canvasWidth && (a.canvasWidth = this.interfaceState.canvasWidth);
    !a.menuWidth && this.interfaceState.menuWidth && Entry.engine.speedPanelOn && Entry.engine.toggleSpeedPanel();
    var b = a.canvasWidth;
    b ? 300 > b ? b = 300 : 720 < b && (b = 720) : b = 400;
    a.canvasWidth = b;
    var c = 9 * b / 16;
    Entry.engine.view_.style.width = b + "px";
    Entry.engine.view_.style.height = c + "px";
    Entry.engine.view_.style.top = "40px";
    Entry.stage.canvas.canvas.style.height = c + "px";
    Entry.stage.canvas.canvas.style.width = b + "px";
    Entry.container.view_.style.width = b + "px";
    Entry.container.view_.style.top = c + 35 + 40 + 48 - 22 + "px";
    400 <= b ? (Entry.engine.view_.removeClass("collapsed"), Entry.container.listView_.removeClass("collapsed")) : (Entry.engine.view_.addClass("collapsed"), Entry.container.listView_.addClass("collapsed"));
    Entry.playground.view_.style.left = b + .5 + "px";
    var d = Entry.engine.view_.getElementsByClassName("entryAddButtonWorkspace_w")[0];
    d && (Entry.objectAddable ? (d.style.top = c + 24 + "px", d.style.width = .7 * b + "px") : d.style.display = "none");
    if (d = Entry.engine.view_.getElementsByClassName("entryRunButtonWorkspace_w")[0]) {
      Entry.objectAddable ? (d.style.top = c + 24 + "px", d.style.left = .7 * b + "px", d.style.width = .3 * b + "px") : (d.style.left = "2px", d.style.top = c + 24 + "px", d.style.width = b - 4 + "px");
    }
    if (d = Entry.engine.view_.getElementsByClassName("entryStopButtonWorkspace_w")[0]) {
      Entry.objectAddable ? (d.style.top = c + 24 + "px", d.style.left = .7 * b + "px", d.style.width = .3 * b + "px") : (d.style.left = "2px", d.style.top = c + 24 + "px", d.style.width = b + "px");
    }
    (b = a.menuWidth) ? 244 > b ? b = 244 : 400 < b && (b = 400) : b = 264;
    a.menuWidth = b;
    Entry.playground.blockMenuView_.style.width = b - 64 + "px";
    $(".entryBlockMenuWorkspace>svg").css({width:b - 64 + "px"});
    $(".entryBlocklyWorkspace").css({left:b + "px"});
    Entry.playground.resizeHandle_.style.left = b + "px";
    Entry.playground.variableViewWrapper_.style.width = b + "px";
    this.interfaceState = a;
  }
  Blockly.fireUiEvent(window, "resize");
}, getUpTime:function() {
  return (new Date).getTime() - this.startTime;
}, addActivity:function(a) {
  Entry.stateManager && Entry.stateManager.addActivity(a);
}, startActivityLogging:function() {
  Entry.reporter && Entry.reporter.start(Entry.projectId, window.user._id, Entry.startTime);
}, getActivityLog:function() {
  var a = {};
  Entry.stateManager && (a.activityLog = Entry.stateManager.activityLog_);
  return a;
}};
window.Entry = Entry;
Blockly.Blocks.arduino_text = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput("Arduino"), "NAME");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.arduino_text = function(a, b) {
  return b.getStringField("NAME");
};
Blockly.Blocks.arduino_send = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_send_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_send_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.arduino_send = function(a, b) {
  var c = b.getValue("VALUE", b), d = new XMLHttpRequest;
  d.open("POST", "http://localhost:23518/arduino/", !1);
  d.send(String(c));
  Entry.assert(200 == d.status, "arduino is not connected");
  return b.callReturn();
};
Blockly.Blocks.arduino_get_string = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_get_string_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_arduino_get_string_2);
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.arduino_get_number = function(a, b) {
  var c = b.getValue("VALUE", b), d = new XMLHttpRequest;
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
Entry.block.arduino_get_string = function(a, b) {
  var c = b.getValue("VALUE", b), d = new XMLHttpRequest;
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
}};
Entry.block.arduino_get_sensor_number = function(a, b) {
  return b.getStringField("PORT");
};
Blockly.Blocks.arduino_get_port_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.arduino_get_port_number = function(a, b) {
  return b.getStringField("PORT");
};
Blockly.Blocks.arduino_get_pwm_port_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.arduino_get_pwm_port_number = function(a, b) {
  return b.getStringField("PORT");
};
Blockly.Blocks.arduino_get_number_sensor_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_sensor_value_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_sensor_value_2);
  this.setInputsInline(!0);
  this.setOutput(!0, "Number");
}};
Entry.block.arduino_get_number_sensor_value = function(a, b) {
  var c = b.getValue("VALUE", b);
  return Entry.hw.getAnalogPortValue(c[1]);
};
Blockly.Blocks.arduino_get_digital_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_get_digital_value_1);
  this.appendValueInput("VALUE").setCheck("Number");
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_num_sensor_value_2);
  this.setInputsInline(!0);
  this.setOutput(!0, "Boolean");
}};
Entry.block.arduino_get_digital_value = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
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
}};
Entry.block.arduino_toggle_led = function(a, b) {
  var c = b.getNumberValue("VALUE"), d = "on" == b.getField("OPERATOR") ? 255 : 0;
  Entry.hw.setDigitalPortValue(c, d);
  return b.callReturn();
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
}};
Entry.block.arduino_toggle_pwm = function(a, b) {
  var c = b.getNumberValue("PORT"), d = b.getNumberValue("VALUE"), d = Math.round(d), d = Math.max(d, 0), d = Math.min(d, 255);
  Entry.hw.setDigitalPortValue(c, d);
  return b.callReturn();
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
Entry.block.arduino_convert_scale = function(a, b) {
  var c = b.getNumberValue("VALUE1", b), d = b.getNumberValue("VALUE2", b), e = b.getNumberValue("VALUE3", b), f = b.getNumberValue("VALUE4", b), h = b.getNumberValue("VALUE5", b);
  if (d > e) {
    var g = d, d = e, e = g
  }
  f > h && (g = f, f = h, h = g);
  c -= d;
  c *= (h - f) / (e - d);
  c += f;
  c = Math.min(h, c);
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
}};
Entry.block.start_drawing = function(a, b) {
  a.brush ? a.brush.stop = !1 : Entry.setBasicBrush(a);
  Entry.stage.sortZorder();
  a.brush.moveTo(a.getX(), -1 * a.getY());
  return b.callReturn();
};
Blockly.Blocks.stop_drawing = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_stop_drawing).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.stop_drawing = function(a, b) {
  a.brush && a.shape && (a.brush.stop = !0);
  return b.callReturn();
};
Blockly.Blocks.set_color = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_color_1);
  this.appendDummyInput().appendField(new Blockly.FieldColour("#ff0000"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_color_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_color = function(a, b) {
  var c = b.getField("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  a.brush && (c = Entry.hex2rgb(c), a.brush.rgb = c, a.brush.endStroke(), a.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + a.brush.opacity / 100 + ")"), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.set_random_color = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_random_color).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_random_color = function(a, b) {
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  if (a.brush) {
    var c = Entry.generateRgb();
    a.brush.rgb = c;
    a.brush.endStroke();
    a.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + a.brush.opacity / 100 + ")");
    a.brush.moveTo(a.getX(), -1 * a.getY());
  }
  return b.callReturn();
};
Blockly.Blocks.change_thickness = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_thickness_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_thickness_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_thickness = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  a.brush && (a.brush.thickness += c, 1 > a.brush.thickness && (a.brush.thickness = 1), a.brush.setStrokeStyle(a.brush.thickness), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.set_thickness = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_thickness_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_thickness_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_thickness = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  a.brush && (a.brush.thickness = c, a.brush.setStrokeStyle(a.brush.thickness), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.change_opacity = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_opacity_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_opacity_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_opacity = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  c = Entry.adjustValueWithMaxMin(a.brush.opacity + c, 0, 100);
  a.brush && (a.brush.opacity = c, a.brush.endStroke(), c = a.brush.rgb, a.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + a.brush.opacity / 100 + ")"), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.set_opacity = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_opacity_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_opacity_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_opacity = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  a.brush && (a.brush.opacity = Entry.adjustValueWithMaxMin(c, 0, 100), a.brush.endStroke(), c = a.brush.rgb, a.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + a.brush.opacity / 100 + ")"), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.brush_erase_all = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_brush_erase_all).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.brush_erase_all = function(a, b) {
  var c = a.brush;
  if (c) {
    var d = c._stroke.style, e = c._strokeStyle.width;
    c.clear().setStrokeStyle(e).beginStroke(d);
    c.moveTo(a.getX(), -1 * a.getY());
  }
  c = a.parent.getStampEntities();
  c.map(function(a) {
    a.removeClone();
  });
  c = null;
  return b.callReturn();
};
Blockly.Blocks.brush_stamp = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_stamp).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.brush_stamp = function(a, b) {
  a.parent.addStampEntity(a);
  return b.callReturn();
};
Blockly.Blocks.change_brush_transparency = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_brush_transparency_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_brush_transparency_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_brush_transparency = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  c = Entry.adjustValueWithMaxMin(a.brush.opacity - c, 0, 100);
  a.brush && (a.brush.opacity = c, a.brush.endStroke(), c = a.brush.rgb, a.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + a.brush.opacity / 100 + ")"), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.set_brush_tranparency = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_brush_transparency_1);
  this.appendValueInput("VALUE").setCheck(["Number", "Boolean"]);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_brush_transparency_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_brush.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_brush_tranparency = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.brush || (Entry.setBasicBrush(a), a.brush.stop = !0);
  a.brush && (a.brush.opacity = Entry.adjustValueWithMaxMin(c, 0, 100), a.brush.endStroke(), c = a.brush.rgb, a.brush.beginStroke("rgba(" + c.r + "," + c.g + "," + c.b + "," + (1 - a.brush.opacity / 100) + ")"), a.brush.moveTo(a.getX(), -1 * a.getY()));
  return b.callReturn();
};
Blockly.Blocks.number = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(""), "NUM");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.number = function(a, b) {
  return b.fields.NUM;
};
Blockly.Blocks.angle = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldAngle("90"), "ANGLE");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.angle = function(a, b) {
  return b.getNumberField("ANGLE");
};
Blockly.Blocks.get_x_coordinate = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_x_coordinate, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_x_coordinate = function(a, b) {
  return a.getX();
};
Blockly.Blocks.get_y_coordinate = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_y_coordinate, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_y_coordinate = function(a, b) {
  return a.getY();
};
Blockly.Blocks.get_angle = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_angle, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_angle = function(a, b) {
  return parseFloat(a.getRotation().toFixed(1));
};
Blockly.Blocks.get_rotation_direction = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_rotation_value, "ROTATION"], [Lang.Blocks.CALC_direction_value, "DIRECTION"]]), "OPERATOR");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_rotation_direction = function(a, b) {
  return "DIRECTION" == b.getField("OPERATOR", b).toUpperCase() ? parseFloat(a.getDirection().toFixed(1)) : parseFloat(a.getRotation().toFixed(1));
};
Blockly.Blocks.distance_something = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_distance_something_1, "#3D3D3D").appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE").appendField(Lang.Blocks.CALC_distance_something_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.distance_something = function(a, b) {
  var c = b.getField("VALUE", b), c = Entry.container.getEntity(c);
  return Math.sqrt(Math.pow(a.getX() - c.getX(), 2) + Math.pow(a.getY() - c.getY(), 2));
};
Blockly.Blocks.coordinate_mouse = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_coordinate_mouse_1, "#3D3D3D").appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"]]), "VALUE").appendField(Lang.Blocks.CALC_coordinate_mouse_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.coordinate_mouse = function(a, b) {
  return "x" === b.getField("VALUE", b) ? Number(Entry.stage.mouseCoordinate.x) : Number(Entry.stage.mouseCoordinate.y);
};
Blockly.Blocks.coordinate_object = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_coordinate_object_1, "#3D3D3D").appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE").appendField(Lang.Blocks.CALC_coordinate_object_2, "#3D3D3D").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_coordinate_x_value, "x"], [Lang.Blocks.CALC_coordinate_y_value, "y"], [Lang.Blocks.CALC_coordinate_rotation_value, "rotation"], [Lang.Blocks.CALC_coordinate_direction_value, "direction"], [Lang.Blocks.CALC_picture_index, "picture_index"], 
  [Lang.Blocks.CALC_picture_name, "picture_name"]]), "COORDINATE").appendField(Lang.Blocks.CALC_coordinate_object_3, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.coordinate_object = function(a, b) {
  var c = b.getField("VALUE", b), d = b.getField("COORDINATE", b), c = Entry.container.getEntity(c);
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
}};
Entry.block.calc_basic = function(a, b) {
  var c = b.getField("OPERATOR", b), d = b.getNumberValue("LEFTHAND", b), e = b.getNumberValue("RIGHTHAND", b);
  return "PLUS" == c ? d + e : "MINUS" == c ? d - e : "MULTI" == c ? d * e : d / e;
};
Blockly.Blocks.calc_plus = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("+", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_plus = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c + d;
};
Blockly.Blocks.calc_minus = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("-", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_minus = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c - d;
};
Blockly.Blocks.calc_times = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("x", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_times = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c * d;
};
Blockly.Blocks.calc_divide = {init:function() {
  this.setColour("#FFD974");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("/", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_divide = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
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
}};
Entry.block.calc_mod = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
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
}};
Entry.block.calc_share = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return Math.floor(c / d);
};
Blockly.Blocks.calc_operation = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_operation_of_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_operation_of_2, "#3D3D3D");
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_calc_operation_square, "square"], [Lang.Blocks.CALC_calc_operation_root, "root"], [Lang.Blocks.CALC_calc_operation_sin, "sin"], [Lang.Blocks.CALC_calc_operation_cos, "cos"], [Lang.Blocks.CALC_calc_operation_tan, "tan"], [Lang.Blocks.CALC_calc_operation_asin, "asin_radian"], [Lang.Blocks.CALC_calc_operation_acos, "acos_radian"], [Lang.Blocks.CALC_calc_operation_atan, "atan_radian"], [Lang.Blocks.CALC_calc_operation_log, 
  "log"], [Lang.Blocks.CALC_calc_operation_ln, "ln"], [Lang.Blocks.CALC_calc_operation_unnatural, "unnatural"], [Lang.Blocks.CALC_calc_operation_floor, "floor"], [Lang.Blocks.CALC_calc_operation_ceil, "ceil"], [Lang.Blocks.CALC_calc_operation_round, "round"], [Lang.Blocks.CALC_calc_operation_factorial, "factorial"], [Lang.Blocks.CALC_calc_operation_abs, "abs"]]), "VALUE");
  this.setOutput(!0, "Number");
  this.appendDummyInput().appendField(" ");
  this.setInputsInline(!0);
}};
Entry.block.calc_operation = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getField("VALUE", b), e = 0;
  -1 < "sin cos tan asin_radian acos_radian atan_radian".split(" ").indexOf(d) && (c = Entry.toRadian(c), d = d.split("_")[0]);
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
}};
Entry.block.calc_rand = function(a, b) {
  var c = b.getStringValue("LEFTHAND", b), d = b.getStringValue("RIGHTHAND", b), e = Math.min(c, d), f = Math.max(c, d), c = Entry.isFloat(c);
  return Entry.isFloat(d) || c ? (Math.random() * (f - e) + e).toFixed(2) : Math.floor(Math.random() * (f - e + 1) + e);
};
Blockly.Blocks.get_date = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_date_1, "#3D3D3D").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_get_date_year, "YEAR"], [Lang.Blocks.CALC_get_date_month, "MONTH"], [Lang.Blocks.CALC_get_date_day, "DAY"], [Lang.Blocks.CALC_get_date_hour, "HOUR"], [Lang.Blocks.CALC_get_date_minute, "MINUTE"], [Lang.Blocks.CALC_get_date_second, "SECOND"]]), "VALUE");
  this.appendDummyInput().appendField(" ").appendField(Lang.Blocks.CALC_get_date_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_date = function(a, b) {
  var c = b.getField("VALUE", b), d = new Date;
  return "YEAR" == c ? d.getFullYear() : "MONTH" == c ? d.getMonth() + 1 : "DAY" == c ? d.getDate() : "HOUR" == c ? d.getHours() : "MINUTE" == c ? d.getMinutes() : d.getSeconds();
};
Blockly.Blocks.get_sound_duration = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_duration_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_duration_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_sound_duration = function(a, b) {
  for (var c = b.getField("VALUE", b), d = a.parent.sounds, e = 0;e < d.length;e++) {
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
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(a) {
  Entry.engine.hideProjectTimer(a);
}};
Entry.block.reset_project_timer = function(a, b) {
  Entry.engine.updateProjectTimer(0);
  return b.callReturn();
};
Blockly.Blocks.set_visible_project_timer = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_visible_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_timer_visible_show, "SHOW"], [Lang.Blocks.CALC_timer_visible_hide, "HIDE"]]), "ACTION");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_visible_2, "#3D3D3D");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(a) {
  Entry.engine.hideProjectTimer(a);
}};
Entry.block.set_visible_project_timer = function(a, b) {
  var c = b.getField("ACTION", b), d = Entry.engine.projectTimer;
  "SHOW" == c ? d.setVisible(!0) : d.setVisible(!1);
  return b.callReturn();
};
Blockly.Blocks.get_project_timer_value = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_timer_value, "#3D3D3D").appendField(" ", "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(a) {
  Entry.engine.hideProjectTimer(a);
}};
Entry.block.get_project_timer_value = function(a, b) {
  return Entry.engine.projectTimer.getValue();
};
Blockly.Blocks.char_at = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_char_at_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_char_at_2, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_char_at_3, "#3D3D3D");
  this.setInputsInline(!0);
}};
Entry.block.char_at = function(a, b) {
  var c = b.getStringValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b) - 1;
  if (0 > d || d > c.length - 1) {
    throw Error();
  }
  return c[d];
};
Blockly.Blocks.length_of_string = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_length_of_string_1, "#3D3D3D");
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_length_of_string_2, "#3D3D3D");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.length_of_string = function(a, b) {
  return b.getStringValue("STRING", b).length;
};
Blockly.Blocks.substring = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_substring_1, "#3D3D3D");
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_substring_2, "#3D3D3D");
  this.appendValueInput("START").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_substring_3, "#3D3D3D");
  this.appendValueInput("END").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_substring_4, "#3D3D3D");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.substring = function(a, b) {
  var c = b.getStringValue("STRING", b), d = b.getNumberValue("START", b) - 1, e = b.getNumberValue("END", b) - 1, f = c.length - 1;
  if (0 > d || 0 > e || d > f || e > f) {
    throw Error();
  }
  return c.substring(Math.min(d, e), Math.max(d, e) + 1);
};
Blockly.Blocks.replace_string = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_replace_string_1, "#3D3D3D");
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_replace_string_2, "#3D3D3D");
  this.appendValueInput("OLD_WORD").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_replace_string_3, "#3D3D3D");
  this.appendValueInput("NEW_WORD").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_replace_string_4, "#3D3D3D");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.replace_string = function(a, b) {
  return b.getStringValue("STRING", b).replace(b.getStringValue("OLD_WORD", b), b.getStringValue("NEW_WORD", b));
};
Blockly.Blocks.change_string_case = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_change_string_case_1, "#3D3D3D");
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_change_string_case_2, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_change_string_case_sub_1, "toUpperCase"], [Lang.Blocks.CALC_change_string_case_sub_2, "toLowerCase"]]), "CASE");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_change_string_case_3, "#3D3D3D");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.change_string_case = function(a, b) {
  return b.getStringValue("STRING", b)[b.getField("CASE", b)]();
};
Blockly.Blocks.index_of_string = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_index_of_string_1, "#3D3D3D");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_index_of_string_2, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_index_of_string_3, "#3D3D3D");
  this.setInputsInline(!0);
}};
Entry.block.index_of_string = function(a, b) {
  var c = b.getStringValue("LEFTHAND", b), d = b.getStringValue("RIGHTHAND", b), c = c.indexOf(d);
  return -1 < c ? c + 1 : 0;
};
Blockly.Blocks.combine_something = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_1, "#3D3D3D");
  this.appendValueInput("VALUE1").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_2, "#3D3D3D");
  this.appendValueInput("VALUE2").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_3, "#3D3D3D");
  this.setInputsInline(!0);
  this.setOutput(!0, "String");
}};
Entry.block.combine_something = function(a, b) {
  var c = b.getStringValue("VALUE1", b), d = b.getStringValue("VALUE2", b);
  isNaN(c) || (c = Entry.convertToRoundedDecimals(c, 3));
  isNaN(d) || (d = Entry.convertToRoundedDecimals(d, 3));
  return c + d;
};
Blockly.Blocks.wait_second = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_second_1);
  this.appendValueInput("SECOND").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_second_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.wait_second = function(a, b) {
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.timeFlag;
    delete b.isStart;
    Entry.engine.isContinue = !1;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  var c = b.getNumberValue("SECOND", b), c = 60 / (Entry.FPS || 60) * c * 1E3;
  setTimeout(function() {
    b.timeFlag = 0;
  }, c);
  return b;
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
}};
Entry.block.repeat_basic = function(a, b) {
  var c;
  if (!b.isLooped) {
    b.isLooped = !0;
    c = b.getNumberValue("VALUE", b);
    if (0 > c) {
      throw Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);
    }
    b.iterCount = Math.floor(c);
  }
  if (0 == b.iterCount || 0 > b.iterCount) {
    return delete b.isLooped, delete b.iterCount, b.callReturn();
  }
  b.iterCount--;
  return b.getStatement("DO", b);
};
Blockly.Blocks.repeat_inf = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_inf).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.appendStatementInput("DO");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.repeat_inf = function(a, b) {
  b.isLooped = !0;
  return b.getStatement("DO");
};
Blockly.Blocks.stop_repeat = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_repeat).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.stop_repeat = function(a, b) {
  for (var c = b;"REPEAT" != c.type.substr(0, 6).toUpperCase() && c.parentScript;) {
    c = c.parentScript, delete c.isLooped, delete c.iterCount;
  }
  var d = c.callReturn();
  return c.statements && d ? d : c ? null : b.callReturn();
};
Blockly.Blocks.wait_until_true = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_until_true_1);
  this.appendValueInput("BOOL").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_until_true_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.wait_until_true = function(a, b) {
  return b.getBooleanValue("BOOL", b) ? b.callReturn() : b;
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
}};
Entry.block._if = function(a, b) {
  return b.isLooped ? (delete b.isLooped, b.callReturn()) : b.getBooleanValue("BOOL", b) ? (b.isLooped = !0, b.getStatement("STACK", b)) : b.callReturn();
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
}};
Entry.block.if_else = function(a, b) {
  if (b.isLooped) {
    return delete b.isLooped, b.callReturn();
  }
  var c = b.getBooleanValue("BOOL", b);
  b.isLooped = !0;
  return c ? b.getStatement("STACK_IF", b) : b.getStatement("STACK_ELSE", b);
};
Blockly.Blocks.create_clone = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_create_clone_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("clone"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_create_clone_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.create_clone = function(a, b) {
  var c = b.getField("VALUE", b), d = b.callReturn();
  "self" == c ? a.parent.addCloneEntity(a.parent, a, null) : Entry.container.getObject(c).addCloneEntity(a.parent, null, null);
  return d;
};
Blockly.Blocks.delete_clone = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_delete_clone).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.delete_clone = function(a, b) {
  if (!a.isClone) {
    return b.callReturn();
  }
  a.removeClone();
};
Blockly.Blocks.when_clone_start = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_clone.png", "*", "start")).appendField(Lang.Blocks.FLOW_when_clone_start);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_clone_start = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.stop_run = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_run).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.stop_run = function(a, b) {
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
}};
Entry.block.repeat_while_true = function(a, b) {
  if (b.getBooleanValue("BOOL", b)) {
    return b.isLooped = !0, b.getStatement("DO", b);
  }
  b.isLooped = !1;
  return b.callReturn();
};
Blockly.Blocks.stop_object = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_object_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.FLOW_stop_object_all, "all"], [Lang.Blocks.FLOW_stop_object_this_object, "thisObject"], [Lang.Blocks.FLOW_stop_object_this_thread, "thisThread"], [Lang.Blocks.FLOW_stop_object_other_thread, "otherThread"]]), "TARGET");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_object_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.stop_object = function(a, b) {
  var c = b.getField("TARGET", b), d = Entry.container;
  switch(c) {
    case "all":
      d.mapEntityIncludeCloneOnScene(function(a) {
        a.clearScript();
      });
      break;
    case "thisObject":
      a.clearScript();
      c = a.parent.clonedEntities;
      c.map(function(a) {
        a.clearScript();
      });
      break;
    case "otherThread":
      return a.clearScript(), c = a.parent.clonedEntities, c.map(function(a) {
        a.clearScript();
      }), b.callReturn();
  }
  return null;
};
Blockly.Blocks.restart_project = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_restart).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.restart_project = function(a, b) {
  Entry.engine.toggleStop();
  Entry.engine.toggleRun();
};
Blockly.Blocks.remove_all_clones = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_delete_clone_all).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_flow.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.remove_all_clones = function(a, b) {
  var c = a.parent.getClonedEntities();
  c.map(function(a) {
    a.removeClone();
  });
  c = null;
  return b.callReturn();
};
Blockly.Blocks.function_field_label = {init:function() {
  this.setColour("#f9c535");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.FUNCTION_explanation_1), "NAME");
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
}};
Blockly.Blocks.function_field_string = {init:function() {
  this.setColour("#ffec64");
  this.appendValueInput("PARAM").setCheck(["String"]);
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
}};
Blockly.Blocks.function_field_boolean = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("PARAM").setCheck(["Boolean"]);
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
}};
Blockly.Blocks.function_param_string = {init:function() {
  this.setEditable(!1);
  this.setColour("#ffec64");
  this.setOutput(!0, ["String", "Number"]);
  this.setInputsInline(!0);
}, domToMutation:function(a) {
  a.getElementsByTagName("field");
  this.hashId = a.getAttribute("hashid");
  (a = Entry.Func.targetFunc.stringHash[this.hashId]) || (a = "");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.FUNCTION_character_variable + a), "");
}, mutationToDom:function() {
  var a = document.createElement("mutation");
  a.setAttribute("hashid", this.hashId);
  return a;
}};
Entry.block.function_param_string = function(a, b, c) {
  return b.register[b.hashId].run();
};
Blockly.Blocks.function_param_boolean = {init:function() {
  this.setEditable(!1);
  this.setColour("#2FC9F0");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}, domToMutation:function(a) {
  a.getElementsByTagName("field");
  this.hashId = a.getAttribute("hashid");
  (a = Entry.Func.targetFunc.booleanHash[this.hashId]) || (a = "");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.FUNCTION_logical_variable + a), "");
}, mutationToDom:function() {
  var a = document.createElement("mutation");
  a.setAttribute("hashid", this.hashId);
  return a;
}};
Entry.block.function_param_boolean = function(a, b, c) {
  return b.register[b.hashId].run();
};
Blockly.Blocks.function_create = {init:function() {
  this.appendDummyInput().appendField(Lang.Blocks.FUNCTION_define);
  this.setColour("#cc7337");
  this.appendValueInput("FIELD").setCheck(["Param"]);
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_function_v1.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.function_create = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.function_general = {init:function() {
  this.setColour("#cc7337");
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}, domToMutation:function(a) {
  var b = a.getElementsByTagName("field");
  this.appendDummyInput().appendField("");
  b.length || this.appendDummyInput().appendField(Lang.Blocks.FUNCTION_function);
  for (var c = 0;c < b.length;c++) {
    var d = b[c], e = d.getAttribute("hashid");
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
    this.hashId = a.getAttribute("hashid");
  }
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_function_v1.png", "*"));
}, mutationToDom:function() {
  for (var a = document.createElement("mutation"), b = 1;b < this.inputList.length;b++) {
    var c = this.inputList[b];
    if (c.fieldRow[0] && c.fieldRow[0] instanceof Blockly.FieldLabel) {
      var c = c.fieldRow[0], d = document.createElement("field");
      d.setAttribute("type", "label");
      d.setAttribute("content", c.text_);
    } else {
      c.connection && "String" == c.connection.check_[0] ? (d = document.createElement("field"), d.setAttribute("type", "string"), d.setAttribute("hashid", c.name)) : c.connection && "Boolean" == c.connection.check_[0] && (d = document.createElement("field"), d.setAttribute("type", "boolean"), d.setAttribute("hashid", c.name));
    }
    a.appendChild(d);
  }
  a.setAttribute("hashid", this.hashId);
  return a;
}};
Entry.block.function_general = function(a, b) {
  if (b.thread) {
    var c = Entry.Engine.computeThread(a, b.thread);
    if (c) {
      return b.thread = c, b;
    }
    delete b.thread;
    return b.callReturn();
  }
  c = Entry.variableContainer.getFunction(b.hashId);
  b.thread = new Entry.Script(a);
  b.thread.register = b.values;
  for (var d = 0;d < c.content.childNodes.length;d++) {
    "function_create" == c.content.childNodes[d].getAttribute("type") && b.thread.init(c.content.childNodes[d]);
  }
  return b;
};
Blockly.Blocks.is_clicked = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_is_clicked, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.is_clicked = function(a, b) {
  return Entry.stage.isClick;
};
Blockly.Blocks.is_press_some_key = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_is_press_some_key_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldKeydownInput("81"), "VALUE").appendField(Lang.Blocks.JUDGEMENT_is_press_some_key_2, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.is_press_some_key = function(a, b) {
  var c = Number(b.getField("VALUE", b));
  return 0 <= Entry.engine.pressedKeys.indexOf(c);
};
Blockly.Blocks.reach_something = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_reach_something_1, "#3D3D3D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("collision"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_reach_something_2, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.reach_something = function(a, b) {
  if (!a.getVisible()) {
    return !1;
  }
  var c = b.getField("VALUE", b), d = a.object, e = /wall/.test(c), f = ndgmr.checkPixelCollision;
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
    if (c = Entry.container.getEntity(c), "textBox" == c.type || "textBox" == a.type) {
      f = c.object.getTransformedBounds();
      d = d.getTransformedBounds();
      if (Entry.checkCollisionRect(d, f)) {
        return !0;
      }
      for (var c = c.parent.clonedEntities, e = 0, h = c.length;e < h;e++) {
        var g = c[e];
        if (g.getVisible() && !g.isStamp && Entry.checkCollisionRect(d, g.object.getTransformedBounds())) {
          return !0;
        }
      }
    } else {
      if (c.getVisible() && f(d, c.object, .2, !0)) {
        return !0;
      }
      c = c.parent.clonedEntities;
      e = 0;
      for (h = c.length;e < h;e++) {
        if (g = c[e], g.getVisible() && !g.isStamp && f(d, g.object, .2, !0)) {
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
}};
Entry.block.boolean_comparison = function(a, b) {
  var c = b.getField("OPERATOR", b), d = b.getNumberValue("LEFTHAND", b), e = b.getNumberValue("RIGHTHAND", b);
  return "EQUAL" == c ? d == e : "BIGGER" == c ? d > e : d < e;
};
Blockly.Blocks.boolean_equal = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField("=", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["String", "Number"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_equal = function(a, b) {
  var c = b.getStringValue("LEFTHAND", b), d = b.getStringValue("RIGHTHAND", b);
  return c == d;
};
Blockly.Blocks.boolean_bigger = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(">", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_bigger = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c > d;
};
Blockly.Blocks.boolean_smaller = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("<", "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_smaller = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c < d;
};
Blockly.Blocks.boolean_and_or = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck("Boolean");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.JUDGEMENT_boolean_and, "AND"], [Lang.Blocks.JUDGEMENT_boolean_or, "OR"]]), "OPERATOR");
  this.appendValueInput("RIGHTHAND").setCheck("Boolean");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_and_or = function(a, b) {
  var c = b.getField("OPERATOR", b), d = b.getBooleanValue("LEFTHAND", b), e = b.getBooleanValue("RIGHTHAND", b);
  return "AND" == c ? d && e : d || e;
};
Blockly.Blocks.boolean_and = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_boolean_and, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck("Boolean");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_and = function(a, b) {
  var c = b.getBooleanValue("LEFTHAND", b), d = b.getBooleanValue("RIGHTHAND", b);
  return c && d;
};
Blockly.Blocks.boolean_or = {init:function() {
  this.setColour("#2FC9F0");
  this.appendValueInput("LEFTHAND").setCheck("Boolean");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_boolean_or, "#3D3D3D");
  this.appendValueInput("RIGHTHAND").setCheck("Boolean");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.boolean_or = function(a, b) {
  var c = b.getBooleanValue("LEFTHAND", b), d = b.getBooleanValue("RIGHTHAND", b);
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
}};
Entry.block.boolean_not = function(a, b) {
  return !b.getBooleanValue("VALUE");
};
Blockly.Blocks.true_or_false = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.JUDGEMENT_true, "true"], [Lang.Blocks.JUDGEMENT_false, "false"]]), "VALUE");
  this.appendDummyInput();
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.true_or_false = function(a, b) {
  return "true" == b.children[0].textContent;
};
Blockly.Blocks.True = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_true, "#3D3D3D").appendField(" ");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.True = function(a, b) {
  return !0;
};
Blockly.Blocks.False = {init:function() {
  this.setColour("#2FC9F0");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_false, "#3D3D3D").appendField(" ");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.False = function(a, b) {
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
}};
Entry.block.is_included_in_list = function(a, b) {
  var c = b.getField("LIST", b), d = b.getStringValue("DATA", b), c = Entry.variableContainer.getList(c);
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
Entry.block.boolean_basic_operator = function(a, b) {
  var c = b.getField("OPERATOR", b), d = b.getStringValue("LEFTHAND", b), e = b.getStringValue("RIGHTHAND", b);
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
}};
Entry.block.show = function(a, b) {
  a.setVisible(!0);
  return b.callReturn();
};
Blockly.Blocks.hide = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_hide).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hide = function(a, b) {
  a.setVisible(!1);
  return b.callReturn();
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
}};
Entry.block.dialog_time = function(a, b) {
  if (!b.isStart) {
    var c = b.getNumberValue("SECOND", b), d = b.getStringValue("VALUE", b), e = b.getField("OPTION", b);
    b.isStart = !0;
    b.timeFlag = 1;
    d || "number" == typeof d || (d = "    ");
    d = Entry.convertToRoundedDecimals(d, 3);
    new Entry.Dialog(a, d, e);
    a.syncDialogVisible(a.getVisible());
    setTimeout(function() {
      b.timeFlag = 0;
    }, 1E3 * c);
  }
  return 0 == b.timeFlag ? (delete b.timeFlag, delete b.isStart, a.dialog && a.dialog.remove(), b.callReturn()) : b;
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
}};
Entry.block.dialog = function(a, b) {
  var c = b.getStringValue("VALUE", b);
  c || "number" == typeof c || (c = "    ");
  var d = b.getField("OPTION", b), c = Entry.convertToRoundedDecimals(c, 3);
  new Entry.Dialog(a, c, d);
  a.syncDialogVisible(a.getVisible());
  return b.callReturn();
};
Blockly.Blocks.remove_dialog = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_remove_dialog).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.remove_dialog = function(a, b) {
  a.dialog && a.dialog.remove();
  return b.callReturn();
};
Blockly.Blocks.change_to_nth_shape = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("pictures"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_to_nth_shape = function(a, b) {
  var c = b.getField("VALUE", b), c = a.parent.getPicture(c);
  a.setImage(c);
  return b.callReturn();
};
Blockly.Blocks.change_to_next_shape = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_next_shape).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_to_next_shape = function(a, b) {
  var c = a.parent.getNextPicture(a.picture.id);
  a.setImage(c);
  return b.callReturn();
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
}};
Entry.block.set_effect_volume = function(a, b) {
  var c = b.getField("EFFECT", b), d = b.getNumberValue("VALUE", b);
  "color" == c ? a.effect.hue = d + a.effect.hue : "lens" != c && "swriling" != c && "pixel" != c && "mosaic" != c && ("brightness" == c ? a.effect.brightness = d + a.effect.brightness : "blur" != c && "opacity" == c && (a.effect.alpha += d / 100));
  a.applyFilter();
  return b.callReturn();
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
}};
Entry.block.set_effect = function(a, b) {
  var c = b.getField("EFFECT", b), d = b.getNumberValue("VALUE", b);
  "color" == c ? a.effect.hue = d : "lens" != c && "swriling" != c && "pixel" != c && "mosaic" != c && ("brightness" == c ? a.effect.brightness = d : "blur" != c && "opacity" == c && (a.effect.alpha = d / 100));
  a.applyFilter();
  return b.callReturn();
};
Blockly.Blocks.erase_all_effects = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_erase_all_effects).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.erase_all_effects = function(a, b) {
  a.resetFilter();
  return b.callReturn();
};
Blockly.Blocks.change_scale_percent = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_scale_percent = function(a, b) {
  var c = (b.getNumberValue("VALUE", b) + 100) / 100;
  a.setScaleX(a.getScaleX() * c);
  a.setScaleY(a.getScaleY() * c);
  return b.callReturn();
};
Blockly.Blocks.set_scale_percent = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_scale_percent = function(a, b) {
  var c = b.getNumberValue("VALUE", b) / 100, d = a.snapshot_;
  a.setScaleX(c * d.scaleX);
  a.setScaleY(c * d.scaleY);
  return b.callReturn();
};
Blockly.Blocks.flip_y = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_flip_y).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.flip_y = function(a, b) {
  a.setScaleX(-1 * a.getScaleX());
  return b.callReturn();
};
Blockly.Blocks.flip_x = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_flip_x).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.flip_x = function(a, b) {
  a.setScaleY(-1 * a.getScaleY());
  return b.callReturn();
};
Blockly.Blocks.set_object_order = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_object_order_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("objectSequence"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_object_order_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_object_order = function(a, b) {
  var c = b.getField("VALUE", b), d = Entry.container.getCurrentObjects().indexOf(a.parent);
  if (-1 < d) {
    return Entry.container.moveElementByBlock(d, c), b.callReturn();
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
}};
Entry.block.get_pictures = function(a, b) {
  return b.getStringField("VALUE");
};
Blockly.Blocks.change_to_some_shape = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_looks.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_to_some_shape = function(a, b) {
  var c = b.getStringValue("VALUE");
  Entry.parseNumber(c);
  c = a.parent.getPicture(c);
  a.setImage(c);
  return b.callReturn();
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
}};
Entry.block.set_effect_amount = function(a, b) {
  var c = b.getField("EFFECT", b), d = b.getNumberValue("VALUE", b);
  "color" == c ? a.effect.hue = d + a.effect.hue : "brightness" == c ? a.effect.brightness = d + a.effect.brightness : "transparency" == c && (a.effect.alpha -= d / 100);
  a.applyFilter();
  return b.callReturn();
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
}};
Entry.block.set_entity_effect = function(a, b) {
  var c = b.getField("EFFECT", b), d = b.getNumberValue("VALUE", b);
  "color" == c ? a.effect.hue = d : "brightness" == c ? a.effect.brightness = d : "transparency" == c && (a.effect.alpha = 1 - d / 100);
  a.applyFilter();
  return b.callReturn();
};
Blockly.Blocks.move_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.move_direction = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setX(a.getX() + c * Math.cos((a.getRotation() + a.getDirection() - 90) / 180 * Math.PI));
  a.setY(a.getY() - c * Math.sin((a.getRotation() + a.getDirection() - 90) / 180 * Math.PI));
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
};
Blockly.Blocks.move_x = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_x_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_x_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.move_x = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setX(a.getX() + c);
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
};
Blockly.Blocks.move_y = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_y_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_y_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.move_y = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setY(a.getY() + c);
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
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
}};
Entry.block.locate_xy_time = function(a, b) {
  if (!b.isStart) {
    var c;
    c = b.getNumberValue("VALUE1", b);
    var d = b.getNumberValue("VALUE2", b) - a.getX(), e = b.getNumberValue("VALUE3", b) - a.getY();
    b.isStart = !0;
    b.frameCount = Math.floor(c * Entry.FPS);
    b.dX = d / b.frameCount;
    b.dY = e / b.frameCount;
  }
  if (0 != b.frameCount) {
    return a.setX(a.getX() + b.dX), a.setY(a.getY() + b.dY), b.frameCount--, a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY()), b;
  }
  delete b.isStart;
  delete b.frameCount;
  return b.callReturn();
};
Blockly.Blocks.rotate_by_angle = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.rotate_by_angle = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setRotation(a.getRotation() + c);
  return b.callReturn();
};
Blockly.Blocks.rotate_by_angle_dropdown = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["45", "45"], ["90", "90"], ["135", "135"], ["180", "180"]]), "VALUE").appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.rotate_by_angle_dropdown = function(a, b) {
  var c = b.getField("VALUE", b);
  a.setRotation(a.getRotation() + Number(c));
  return b.callReturn();
};
Blockly.Blocks.see_angle = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.see_angle = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setDirection(c);
  return b.callReturn();
};
Blockly.Blocks.see_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_direction_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sprites"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.see_direction = function(a, b) {
  var c = b.getField("VALUE", b), d = Entry.container.getEntity(c), c = d.getX() - a.getX(), d = d.getY() - a.getY();
  0 <= c ? a.setRotation(Math.atan(d / c) / Math.PI * 180 + 90) : a.setRotation(Math.atan(d / c) / Math.PI * 180 + 270);
  return b.callReturn();
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
}};
Entry.block.locate_xy = function(a, b) {
  var c = b.getNumberValue("VALUE1", b);
  a.setX(c);
  c = b.getNumberValue("VALUE2", b);
  a.setY(c);
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
};
Blockly.Blocks.locate_x = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_x_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_x_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.locate_x = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setX(c);
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
};
Blockly.Blocks.locate_y = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_y_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_y_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.locate_y = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setY(c);
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
};
Blockly.Blocks.locate = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.locate = function(a, b) {
  var c = b.getField("VALUE", b), d;
  "mouse" == c ? (c = Entry.stage.mouseCoordinate.x, d = Entry.stage.mouseCoordinate.y) : (d = Entry.container.getEntity(c), c = d.getX(), d = d.getY());
  a.setX(Number(c));
  a.setY(Number(d));
  a.brush && !a.brush.stop && a.brush.lineTo(c, -1 * d);
  return b.callReturn();
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
}};
Entry.block.move_xy_time = function(a, b) {
  if (!b.isStart) {
    var c;
    c = b.getNumberValue("VALUE1", b);
    var d = b.getNumberValue("VALUE2", b), e = b.getNumberValue("VALUE3", b);
    b.isStart = !0;
    b.frameCount = Math.floor(c * Entry.FPS);
    b.dX = d / b.frameCount;
    b.dY = e / b.frameCount;
  }
  if (0 != b.frameCount) {
    return a.setX(a.getX() + b.dX), a.setY(a.getY() + b.dY), b.frameCount--, a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY()), b;
  }
  delete b.isStart;
  delete b.frameCount;
  return b.callReturn();
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
}};
Entry.block.rotate_by_angle_time = function(a, b) {
  if (!b.isStart) {
    var c;
    c = b.getNumberValue("VALUE", b);
    var d = b.getNumberField("VALUE", b);
    b.isStart = !0;
    b.frameCount = Math.floor(c * Entry.FPS);
    b.dAngle = d / b.frameCount;
  }
  if (0 != b.frameCount) {
    return a.setRotation(a.getRotation() + b.dAngle), b.frameCount--, b;
  }
  delete b.isStart;
  delete b.frameCount;
  return b.callReturn();
};
Blockly.Blocks.bounce_when = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_when_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("bounce"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_when_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setPreviousStatement(!0);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Blockly.Blocks.bounce_wall = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_wall).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bounce_wall = function(a, b) {
  var c = a.parent.getRotateMethod();
  a.object.getTransformedBounds();
  var d = "free" == c ? (a.getRotation() + a.getDirection()).mod(360) : a.getDirection();
  90 > d && 0 <= d || 360 > d && 270 <= d ? ndgmr.checkPixelCollision(Entry.stage.wall.up, a.object, 0, !0) && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection() + 180) : a.setDirection(-a.getDirection() + 180)) : 270 > d && 90 <= d && ndgmr.checkPixelCollision(Entry.stage.wall.down, a.object, 0, !0) && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection() + 180) : a.setDirection(-a.getDirection() + 180));
  360 > d && 180 <= d ? ndgmr.checkPixelCollision(Entry.stage.wall.left, a.object, 0, !0) && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection()) : a.setDirection(-a.getDirection() + 360)) : 180 > d && 0 <= d && ndgmr.checkPixelCollision(Entry.stage.wall.right, a.object, 0, !0) && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection()) : a.setDirection(-a.getDirection() + 360));
  return b.callReturn();
};
Blockly.Blocks.flip_arrow_horizontal = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_flip_arrow_horizontal).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.flip_arrow_horizontal = function(a, b) {
  a.setDirection(a.getDirection() + 180);
  return b.callReturn();
};
Blockly.Blocks.flip_arrow_vertical = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_flip_arrow_vertical).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.flip_arrow_vertical = function(a, b) {
  a.setDirection(a.getDirection() + 180);
  return b.callReturn();
};
Blockly.Blocks.see_angle_object = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_object_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_object_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.see_angle_object = function(a, b) {
  var c = b.getField("VALUE", b), d = a.getX(), e = a.getY();
  if (a.parent.id == c) {
    return b.callReturn();
  }
  "mouse" == c ? (c = Entry.stage.mouseCoordinate.y, d = Entry.stage.mouseCoordinate.x - d, e = c - e) : (c = Entry.container.getEntity(c), d = c.getX() - d, e = c.getY() - e);
  e = 0 <= d ? -Math.atan(e / d) / Math.PI * 180 + 90 : -Math.atan(e / d) / Math.PI * 180 + 270;
  d = a.getDirection() + a.getRotation();
  a.setRotation(a.getRotation() + e - d);
  return b.callReturn();
};
Blockly.Blocks.see_angle_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.see_angle_direction = function(a, b) {
  var c = b.getNumberValue("VALUE", b), d = a.getDirection() + a.getRotation();
  a.setRotation(a.getRotation() + c - d);
  return b.callReturn();
};
Blockly.Blocks.rotate_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.rotate_direction = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setDirection(c + a.getDirection());
  return b.callReturn();
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
}};
Entry.block.locate_object_time = function(a, b) {
  if (!b.isStart) {
    var c, d, e;
    d = b.getField("TARGET", b);
    c = b.getNumberValue("VALUE", b);
    c = Math.floor(c * Entry.FPS);
    e = Entry.stage.mouseCoordinate;
    if (0 != c) {
      "mouse" == d ? (d = e.x - a.getX(), e = e.y - a.getY()) : (e = Entry.container.getEntity(d), d = e.getX() - a.getX(), e = e.getY() - a.getY()), b.isStart = !0, b.frameCount = c, b.dX = d / b.frameCount, b.dY = e / b.frameCount;
    } else {
      return "mouse" == d ? (d = Number(e.x), e = Number(e.y)) : (e = Entry.container.getEntity(d), d = e.getX(), e = e.getY()), a.setX(d), a.setY(e), a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY()), b.callReturn();
    }
  }
  if (0 != b.frameCount) {
    return a.setX(a.getX() + b.dX), a.setY(a.getY() + b.dY), b.frameCount--, a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY()), b;
  }
  delete b.isStart;
  delete b.frameCount;
  return b.callReturn();
};
Blockly.Blocks.rotate_absolute = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_set_direction_by_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_set_direction_by_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.rotate_absolute = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setRotation(c);
  return b.callReturn();
};
Blockly.Blocks.rotate_relative = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.rotate_relative = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setRotation(c + a.getRotation());
  return b.callReturn();
};
Blockly.Blocks.direction_absolute = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.direction_absolute = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setDirection(c);
  return b.callReturn();
};
Blockly.Blocks.direction_relative = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_moving.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.direction_relative = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setDirection(c + a.getDirection());
  return b.callReturn();
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
}};
Entry.block.move_to_angle = function(a, b) {
  var c = b.getNumberValue("VALUE", b), d = b.getNumberValue("ANGLE", b);
  a.setX(a.getX() + c * Math.cos((d - 90) / 180 * Math.PI));
  a.setY(a.getY() - c * Math.sin((d - 90) / 180 * Math.PI));
  a.brush && !a.brush.stop && a.brush.lineTo(a.getX(), -1 * a.getY());
  return b.callReturn();
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
}};
Entry.block.rotate_by_time = function(a, b) {
  if (!b.isStart) {
    var c;
    c = b.getNumberValue("VALUE", b);
    var d = b.getNumberValue("ANGLE", b);
    b.isStart = !0;
    b.frameCount = Math.floor(c * Entry.FPS);
    b.dAngle = d / b.frameCount;
  }
  if (0 != b.frameCount) {
    return a.setRotation(a.getRotation() + b.dAngle), b.frameCount--, b;
  }
  delete b.isStart;
  delete b.frameCount;
  return b.callReturn();
};
Blockly.Blocks.when_scene_start = {init:function() {
  this.setColour("#189FC1");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_scene.png", "*", "start")).appendField(Lang.Blocks.SCENE_when_scene_start);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_scene_start = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.start_scene = {init:function() {
  this.setColour("#189FC1");
  this.appendDummyInput().appendField(Lang.Blocks.SCENE_start_scene_1).appendField(new Blockly.FieldDropdownDynamic("scenes"), "VALUE").appendField(Lang.Blocks.SCENE_start_scene_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_scene.png", "*"));
  this.setInputsInline(!0);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.start_scene = function(a, b) {
  var c = b.getField("VALUE", b);
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
}};
Entry.block.start_neighbor_scene = function(a, b) {
  var c = Entry.scene.selectedScene, d = Entry.scene.getScenes(), c = d.indexOf(c);
  "next" == b.getField("OPERATOR", b) ? c + 1 < d.length && (d = Entry.scene.getSceneById(d[c + 1].id)) && (Entry.scene.selectScene(d), Entry.engine.fireEvent("when_scene_start")) : 0 < c && (d = Entry.scene.getSceneById(d[c - 1].id)) && (Entry.scene.selectScene(d), Entry.engine.fireEvent("when_scene_start"));
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
}};
Entry.block.sound_something = function(a, b) {
  var c = b.getField("VALUE", b);
  Entry.isExist(c, "id", a.parent.sounds) && createjs.Sound.play(c);
  return b.callReturn();
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
}};
Entry.block.sound_something_second = function(a, b) {
  var c = b.getField("VALUE", b), d = b.getNumberValue("SECOND", b);
  if (Entry.isExist(c, "id", a.parent.sounds)) {
    var e = createjs.Sound.play(c);
    setTimeout(function() {
      e.stop();
    }, 1E3 * d);
  }
  return b.callReturn();
};
Blockly.Blocks.sound_something_wait = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_something_wait = function(a, b) {
  if (b.isPlay) {
    if (1 == b.playState) {
      return b;
    }
    delete b.playState;
    delete b.isPlay;
    return b.callReturn();
  }
  b.isPlay = !0;
  b.playState = 1;
  var c = b.getField("VALUE", b), d = a.parent.getSound(c);
  Entry.isExist(c, "id", a.parent.sounds) && (createjs.Sound.play(c), setTimeout(function() {
    b.playState = 0;
  }, 1E3 * d.duration));
  return b;
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
}};
Entry.block.sound_something_second_wait = function(a, b) {
  if (b.isPlay) {
    if (1 == b.playState) {
      return b;
    }
    delete b.isPlay;
    delete b.playState;
    return b.callReturn();
  }
  b.isPlay = !0;
  b.playState = 1;
  var c = b.getField("VALUE", b);
  if (Entry.isExist(c, "id", a.parent.sounds)) {
    var d = createjs.Sound.play(c), c = b.getNumberValue("SECOND", b);
    setTimeout(function() {
      d.stop();
      b.playState = 0;
    }, 1E3 * c);
    d.addEventListener("complete", function(a) {
    });
  }
  return b;
};
Blockly.Blocks.sound_volume_change = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_change_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_change_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_volume_change = function(a, b) {
  var c = b.getNumberValue("VALUE", b) / 100, c = c + createjs.Sound.getVolume();
  1 < c && (c = 1);
  0 > c && (c = 0);
  createjs.Sound.setVolume(c);
  return b.callReturn();
};
Blockly.Blocks.sound_volume_set = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_set_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_set_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_volume_set = function(a, b) {
  var c = b.getNumberValue("VALUE", b) / 100;
  1 < c && (c = 1);
  0 > c && (c = 0);
  createjs.Sound.setVolume(c);
  return b.callReturn();
};
Blockly.Blocks.sound_silent_all = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_silent_all).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_silent_all = function(a, b) {
  createjs.Sound.stop();
  return b.callReturn();
};
Blockly.Blocks.get_sounds = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField("");
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds"), "VALUE");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.get_sounds = function(a, b) {
  return b.getStringField("VALUE");
};
Blockly.Blocks.sound_something_with_block = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_something_with_block = function(a, b) {
  var c = b.getStringValue("VALUE", b);
  (c = a.parent.getSound(c)) && createjs.Sound.play(c.id);
  return b.callReturn();
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
}};
Entry.block.sound_something_second_with_block = function(a, b) {
  var c = b.getStringValue("VALUE", b), d = b.getNumberValue("SECOND", b);
  (c = a.parent.getSound(c)) && createjs.Sound.play(c.id, {startTime:0, duration:1E3 * d});
  return b.callReturn();
};
Blockly.Blocks.sound_something_wait_with_block = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_sound.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_something_wait_with_block = function(a, b) {
  if (b.isPlay) {
    if (1 == b.playState) {
      return b;
    }
    delete b.playState;
    delete b.isPlay;
    return b.callReturn();
  }
  b.isPlay = !0;
  b.playState = 1;
  var c = b.getStringValue("VALUE", b);
  if (c = a.parent.getSound(c)) {
    createjs.Sound.play(c.id), setTimeout(function() {
      b.playState = 0;
    }, 1E3 * c.duration);
  }
  return b;
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
}};
Entry.block.sound_something_second_wait_with_block = function(a, b) {
  if (b.isPlay) {
    if (1 == b.playState) {
      return b;
    }
    delete b.isPlay;
    delete b.playState;
    return b.callReturn();
  }
  b.isPlay = !0;
  b.playState = 1;
  var c = b.getStringValue("VALUE", b);
  if (c = a.parent.getSound(c)) {
    var d = createjs.Sound.play(c.id), c = b.getNumberValue("SECOND", b);
    setTimeout(function() {
      d.stop();
      b.playState = 0;
    }, 1E3 * c);
    d.addEventListener("complete", function(a) {
    });
  }
  return b;
};
Blockly.Blocks.when_run_button_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_play.png", "*", "start")).appendField(Lang.Blocks.START_when_run_button_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_run_button_click = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.press_some_key = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_press_some_key_1).appendField(new Blockly.FieldDropdown([["q", "81"], ["w", "87"], ["e", "69"], ["r", "82"], ["a", "65"], ["s", "83"], ["d", "68"], [Lang.Blocks.START_press_some_key_up, "38"], [Lang.Blocks.START_press_some_key_down, "40"], [Lang.Blocks.START_press_some_key_left, "37"], [Lang.Blocks.START_press_some_key_right, "39"], [Lang.Blocks.START_press_some_key_enter, 
  "13"], [Lang.Blocks.START_press_some_key_space, "32"]]), "VALUE").appendField(Lang.Blocks.START_press_some_key_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.press_some_key = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_some_key_pressed = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_press_some_key_1).appendField(new Blockly.FieldKeydownInput("81"), "VALUE").appendField(Lang.Blocks.START_press_some_key_2);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_some_key_pressed = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.mouse_clicked = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_mouse_clicked);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.mouse_clicked = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.mouse_click_cancled = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_mouse_click_cancled);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.mouse_click_cancled = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_object_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_when_object_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_object_click = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_object_click_canceled = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_when_object_click_canceled);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_object_click_canceled = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_some_key_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_when_some_key_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_some_key_click = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_message_cast = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon("/img/assets/block_icon/start_icon_signal.png", "*", "start")).appendField(Lang.Blocks.START_when_message_cast_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_when_message_cast_2);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_message_cast = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.message_cast = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_message_cast_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_message_cast_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.message_cast = function(a, b) {
  var c = b.getField("VALUE", b), d = Entry.isExist(c, "id", Entry.variableContainer.messages_);
  if ("null" == c || !d) {
    throw Error("value can not be null or undefined");
  }
  Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, ["when_message_cast", c]);
  return b.callReturn();
};
Blockly.Blocks.add_message = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_add_message).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
}};
Entry.block.add_massage = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.message_cast_wait = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_message_send_wait_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_message_send_wait_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_start.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.message_cast_wait = function(a, b) {
  if (b.runningScript) {
    if (b.runningScript.length) {
      return Entry.engine.computeFunction(b), b;
    }
    delete b.runningScript;
    return b.callReturn();
  }
  var c = b.getField("VALUE", b), d = Entry.isExist(c, "id", Entry.variableContainer.messages_);
  if ("null" == c || !d) {
    throw Error("value can not be null or undefined");
  }
  var e = [];
  Entry.container.mapEntityIncludeCloneOnScene(function(a, b) {
    for (var c = b[0], d = b[1], m = a.parent.script.childNodes, n = 0;n < m.length;n++) {
      var l = m[n], q = Entry.Xml.getField("VALUE", l);
      Entry.Xml.isTypeOf(c, l) && q == d && (q = new Entry.Script(a), q.init(l), e.push(q));
    }
  }, ["when_message_cast", c]);
  b.runningScript = e;
  return b;
};
var colour = "#FFCA36";
Blockly.Blocks.text = {init:function() {
  this.setColour("#FFD974");
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(Lang.Blocks.TEXT_text), "NAME");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.text = function(a, b) {
  return b.getField("NAME");
};
Blockly.Blocks.text_write = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_write_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_write_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.text_write = function(a, b) {
  var c = b.getStringValue("VALUE", b), c = Entry.convertToRoundedDecimals(c, 3);
  a.setText(c);
  return b.callReturn();
};
Blockly.Blocks.text_append = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_append_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_append_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.text_append = function(a, b) {
  var c = b.getStringValue("VALUE", b);
  a.setText(Entry.convertToRoundedDecimals(a.getText(), 3) + Entry.convertToRoundedDecimals(c, 3));
  return b.callReturn();
};
Blockly.Blocks.text_prepend = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_prepend_1);
  this.appendValueInput("VALUE").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_prepend_2);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.text_prepend = function(a, b) {
  var c = b.getStringValue("VALUE", b);
  a.setText(Entry.convertToRoundedDecimals(c, 3) + Entry.convertToRoundedDecimals(a.getText(), 3));
  return b.callReturn();
};
Blockly.Blocks.text_flush = {init:function() {
  this.setColour(colour);
  this.appendDummyInput().appendField(Lang.Blocks.TEXT_text_flush);
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.text_flush = function(a, b) {
  a.setText("");
  return b.callReturn();
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
}};
Entry.block.change_variable = function(a, b) {
  var c = b.getField("VARIABLE", b), d = b.getNumberValue("VALUE", b), e = 0, d = Entry.parseNumber(d);
  if (0 == d && "boolean" == typeof d) {
    throw Error("Type is not correct");
  }
  c = Entry.variableContainer.getVariable(c, a);
  e = Entry.getMaxFloatPoint([d, c.getValue()]);
  c.setValue((d + c.getValue()).toFixed(e));
  return b.callReturn();
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
}};
Entry.block.set_variable = function(a, b) {
  var c = b.getField("VARIABLE", b), d = b.getValue("VALUE", b);
  Entry.variableContainer.getVariable(c, a).setValue(d);
  return b.callReturn();
};
Blockly.Blocks.show_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_show_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_show_variable_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.show_variable = function(a, b) {
  var c = b.getField("VARIABLE", b), c = Entry.variableContainer.getVariable(c, a);
  c.setVisible(!0);
  c.updateView();
  return b.callReturn();
};
Blockly.Blocks.hide_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_hide_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_hide_variable_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hide_variable = function(a, b) {
  var c = b.getField("VARIABLE", b);
  Entry.variableContainer.getVariable(c, a).setVisible(!1);
  return b.callReturn();
};
Blockly.Blocks.get_y = {init:function() {
  this.setColour(230);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_y).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setOutput(!0, "Number");
}};
Blockly.Blocks.get_variable = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_variable_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_get_variable_2);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_variable = function(a, b) {
  var c = b.getField("VARIABLE", b);
  return Entry.variableContainer.getVariable(c, a).getValue();
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
Entry.block.ask_and_wait = function(a, b) {
  var c = Entry.container.inputValue, d = Entry.stage.inputField, e = b.getValue("VALUE", b);
  if (!e) {
    throw Error("message can not be empty");
  }
  if (c.sprite == a && d && !d._isHidden) {
    return b;
  }
  if (c.sprite != a && b.isInit || c.value && c.sprite == a && d._isHidden && b.isInit) {
    return a.dialog && a.dialog.remove(), delete b.isInit, b.callReturn();
  }
  e = Entry.convertToRoundedDecimals(e, 3);
  new Entry.Dialog(a, e, "speak");
  Entry.stage.showInputField();
  c.script = b;
  c.sprite = a;
  c.value = "";
  b.isInit = !0;
  return b;
};
Blockly.Blocks.get_canvas_input_value = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_canvas_input_value);
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_canvas_input_value = function(a, b) {
  return Entry.container.getInputValue();
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
}};
Entry.block.add_value_to_list = function(a, b) {
  var c = b.getField("LIST", b), d = b.getValue("VALUE", b), c = Entry.variableContainer.getList(c, a);
  c.array_ || (c.array_ = []);
  c.array_.push({data:d});
  c.updateView();
  return b.callReturn();
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
}};
Entry.block.remove_value_from_list = function(a, b) {
  var c = b.getField("LIST", b), d = b.getValue("VALUE", b), c = Entry.variableContainer.getList(c, a);
  if (!c.array_ || isNaN(d) || d > c.array_.length) {
    throw Error("can not remove value from array");
  }
  c.array_.splice(d - 1, 1);
  c.updateView();
  return b.callReturn();
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
}};
Entry.block.insert_value_to_list = function(a, b) {
  var c = b.getField("LIST", b), d = b.getValue("DATA", b), e = b.getValue("INDEX", b), c = Entry.variableContainer.getList(c, a);
  if (!c.array_ || isNaN(e) || 0 == e || e > c.array_.length + 1) {
    throw Error("can not insert value to array");
  }
  c.array_.splice(e - 1, 0, {data:d});
  c.updateView();
  return b.callReturn();
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
}};
Entry.block.change_value_list_index = function(a, b) {
  var c = b.getField("LIST", b), d = b.getValue("DATA", b), e = b.getValue("INDEX", b), c = Entry.variableContainer.getList(c, a);
  if (!c.array_ || isNaN(e) || e > c.array_.length) {
    throw Error("can not insert value to array");
  }
  c.array_[e - 1].data = d;
  c.updateView();
  return b.callReturn();
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
}};
Entry.block.value_of_index_from_list = function(a, b) {
  var c = b.getField("LIST", b), d = b.getValue("INDEX", b), c = Entry.variableContainer.getList(c, a), d = Entry.getListRealIndex(d, c);
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
}};
Entry.block.length_of_list = function(a, b) {
  var c = b.getField("LIST", b);
  return Entry.variableContainer.getList(c).array_.length;
};
Blockly.Blocks.show_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_show_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST").appendField(Lang.Blocks.VARIABLE_show_list_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.show_list = function(a, b) {
  var c = b.getField("LIST", b);
  Entry.variableContainer.getList(c).setVisible(!0);
  return b.callReturn();
};
Blockly.Blocks.hide_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_hide_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST").appendField(Lang.Blocks.VARIABLE_hide_list_2).appendField(new Blockly.FieldIcon("/img/assets/block_icon/entry_icon_variable.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hide_list = function(a, b) {
  var c = b.getField("LIST", b);
  Entry.variableContainer.getList(c).setVisible(!1);
  return b.callReturn();
};
Blockly.Blocks.options_for_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField("");
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([[Lang.Blocks.VARIABLE_list_option_first, "FIRST"], [Lang.Blocks.VARIABLE_list_option_last, "LAST"], [Lang.Blocks.VARIABLE_list_option_random, "RANDOM"]]), "OPERATOR");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.options_for_list = function(a, b) {
  return b.getField("OPERATOR", b);
};
Entry.Model = function() {
  this.data = this.schema;
};
(function(a) {
  a.schema = {id:null};
  a.get = function(a) {
    return this.data[a];
  };
  a.set = function(a) {
    for (var c in a) {
      this.data[c] = a[c];
    }
  };
})(Entry.Model.prototype);
Entry.LoopModel = function() {
  Entry.Model.call(this);
  this._observers = [];
};
Entry.LoopModel.prototype = new Entry.Model;
(function(a) {
  a.base = Entry.Model;
  a.bind = function(a) {
    this._observers.push(a);
  };
  a.unbind = function(a) {
    for (var c in this._observers) {
      if (this._observers[c] === a) {
        return this._observers.splice(c, 1), !0;
      }
    }
    return !1;
  };
  a.notify = function() {
    var a = Array.prototype.slice.call(arguments, 0), c;
    for (c in this._observers) {
      this._observers[c].update.apply(null, a);
    }
  };
})(Entry.LoopModel.prototype);
Entry.ObserverModel = function() {
  Entry.Model.call(this);
  this._observers = [];
};
Entry.ObserverModel.prototype = new Entry.Model;
(function(a) {
  a.base = Entry.Model;
  a.set = function(a) {
    this.base.prototype.set.call(this, a);
    this.notify();
  };
  a.observe = function(a) {
    this._observers.push(a);
  };
  a.unobserve = function(a) {
    for (var c in this._observers) {
      if (this._observers[c] === a) {
        return this._observers.splice(c, 1), !0;
      }
    }
    return !1;
  };
  a.notify = function() {
    var a = Array.prototype.slice.call(arguments, 0), c;
    for (c in this._observers) {
      this._observers[c].update.apply(null, a);
    }
  };
})(Entry.ObserverModel.prototype);
Entry.Container = function() {
  this.objects_ = [];
  this.cachedPicture = {};
  this.variables_ = [];
  this.messages_ = [];
  this.inputValue = {};
  this.currentObjects_ = this.copiedObject = null;
};
Entry.Container.prototype.generateView = function(a, b) {
  this.view_ = a;
  this.view_.addClass("entryContainer");
  if (b && "workspace" != b) {
    "phone" == b && (this.view_.addClass("entryContainerPhone"), c = Entry.createElement("div"), c.addClass("entryAddObjectWorkspace"), c.innerHTML = Lang.Workspace.add_object, c.bindOnClick(function(a) {
      Entry.dispatchEvent("openSpriteManager");
    }), c = Entry.createElement("div"), c.addClass("entryContainerListPhoneWrapper"), this.view_.appendChild(c), e = Entry.createElement("ul"), e.addClass("entryContainerListPhone"), c.appendChild(e), this.listView_ = e);
  } else {
    this.view_.addClass("entryContainerWorkspace");
    var c = Entry.createElement("div");
    c.addClass("entryAddObjectWorkspace");
    c.innerHTML = Lang.Workspace.add_object;
    c.bindOnClick(function(a) {
      Entry.dispatchEvent("openSpriteManager");
    });
    c = Entry.createElement("div");
    c.addClass("entryContainerListWorkspaceWrapper");
    Entry.isForLecture && (this.generateTabView(), c.addClass("lecture"));
    if ($) {
      var d = this;
      context.attach(".entryContainerListWorkspaceWrapper", [{text:"\ubd99\uc5ec\ub123\uae30", href:"/", action:function(a) {
        a.preventDefault();
        d.copiedObject ? d.addCloneObject(d.copiedObject) : Entry.toast.alert("\uacbd\uace0", "\ubd99\uc5ec\ub123\uae30 \ud560 \uc624\ube0c\uc81d\ud2b8\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.");
      }}]);
    }
    this.view_.appendChild(c);
    var e = Entry.createElement("ul");
    e.addClass("entryContainerListWorkspace");
    c.appendChild(e);
    this.listView_ = e;
    this.enableSort();
  }
};
Entry.Container.prototype.enableSort = function() {
  $ && $(this.listView_).sortable({start:function(a, b) {
    b.item.data("start_pos", b.item.index());
  }, stop:function(a, b) {
    var c = b.item.data("start_pos"), d = b.item.index();
    Entry.container.moveElement(c, d);
  }, axis:"y"});
};
Entry.Container.prototype.disableSort = function() {
  $ && $(this.listView_).sortable("destroy");
};
Entry.Container.prototype.updateListView = function() {
  if (this.listView_) {
    for (var a = this.listView_;a.hasChildNodes();) {
      a.removeChild(a.lastChild);
    }
    var b = this.getCurrentObjects(), c;
    for (c in b) {
      a.appendChild(b[c].view_);
    }
    Entry.stage.sortZorder();
  }
};
Entry.Container.prototype.setObjects = function(a) {
  for (var b in a) {
    var c = new Entry.EntryObject(a[b]);
    this.objects_.push(c);
    c.generateView();
    c.pictures.map(function(a) {
      Entry.playground.generatePictureElement(a);
    });
    c.sounds.map(function(a) {
      Entry.playground.generateSoundElement(a);
    });
  }
  this.updateObjectsOrder();
  this.updateListView();
  Entry.stage.sortZorder();
  Entry.variableContainer.updateViews();
  a = Entry.type;
  ("workspace" == a || "phone" == a) && (a = this.getCurrentObjects()[0]) && this.selectObject(a.id);
};
Entry.Container.prototype.addObject = function(a, b) {
  var c = new Entry.EntryObject(a);
  c.name = Entry.getOrderedName(c.name, this.objects_);
  Entry.stateManager.addCommand("add object", this, this.removeObject, c);
  c.scene || (c.scene = Entry.scene.selectedScene);
  "number" == typeof b ? a.sprite.category && "\ubc30\uacbd" == a.sprite.category.main ? (c.setLock(!0), this.objects_.push(c)) : this.objects_.splice(b, 0, c) : a.sprite.category && "\ubc30\uacbd" == a.sprite.category.main ? this.objects_.push(c) : this.objects_.unshift(c);
  c.generateView();
  c.pictures.map(function(a) {
    a.id = Entry.generateHash();
    Entry.playground.generatePictureElement(a);
  });
  c.sounds.map(function(a) {
    Entry.playground.generateSoundElement(a);
  });
  this.setCurrentObjects();
  this.updateObjectsOrder();
  this.updateListView();
  this.selectObject(c.id);
  Entry.variableContainer.updateViews();
  return new Entry.State(this, this.removeObject, c);
};
Entry.Container.prototype.addCloneObject = function(a, b) {
  var c = a.toJSON(), d = Entry.generateHash();
  Entry.variableContainer.addCloneLocalVariables({objectId:c.id, newObjectId:d, json:c});
  c.id = d;
  c.scene = b || Entry.scene.selectedScene;
  this.addObject(c);
};
Entry.Container.prototype.removeObject = function(a) {
  var b = this.objects_.indexOf(a), c = a.toJSON();
  Entry.stateManager.addCommand("remove object", this, this.addObject, c, b);
  c = new Entry.State(this.addObject, c, b);
  a.destroy();
  this.objects_.splice(b, 1);
  this.setCurrentObjects();
  Entry.stage.sortZorder();
  this.objects_.length && 0 != b ? Entry.container.selectObject(this.objects_[b - 1].id) : this.objects_.length && 0 == b ? Entry.container.selectObject(this.getCurrentObjects()[0].id) : (Entry.container.selectObject(), Entry.playground.flushPlayground());
  Entry.toast.success(Lang.Workspace.remove_object, a.name + " " + Lang.Workspace.remove_object_msg);
  Entry.variableContainer.removeLocalVariables(a.id);
  Entry.playground.reloadPlayground();
  return c;
};
Entry.Container.prototype.selectObject = function(a, b) {
  var c = this.getObject(a);
  b && c && Entry.scene.selectScene(c.scene);
  this.mapObjectOnScene(function(a) {
    a.view_ && a.view_.removeClass("selectedObject");
    a.isSelected_ = !1;
  });
  c && (c.view_ && c.view_.addClass("selectedObject"), c.isSelected_ = !0);
  Entry.playground && Entry.playground.injectObject(c);
  "minimize" != Entry.type && Entry.engine.isState("stop") && Entry.stage.selectObject(c);
};
Entry.Container.prototype.getAllObjects = function() {
  return this.objects_;
};
Entry.Container.prototype.getObject = function(a) {
  for (var b = this.objects_.length, c = 0;c < b;c++) {
    var d = this.objects_[c];
    if (d.id == a) {
      return d;
    }
  }
};
Entry.Container.prototype.getEntity = function(a) {
  if (a = this.getObject(a)) {
    return a.entity;
  }
  Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.object_not_found, !0);
};
Entry.Container.prototype.getVariable = function(a) {
  for (var b = 0;b < this.variables_.length;b++) {
    var c = this.variables_[b];
    if (c.getId() == a || c.getName() == a) {
      return c;
    }
  }
};
Entry.Container.prototype.moveElement = function(a, b, c) {
  var d;
  d = this.getCurrentObjects();
  a = this.getAllObjects().indexOf(d[a]);
  b = this.getAllObjects().indexOf(d[b]);
  c || Entry.stateManager.addCommand("reorder object", Entry.container, Entry.container.moveElement, b, a, !0);
  this.objects_.splice(b, 0, this.objects_.splice(a, 1)[0]);
  this.setCurrentObjects();
  Entry.container.updateListView();
  return new Entry.State(Entry.container, Entry.container.moveElement, b, a, !0);
};
Entry.Container.prototype.moveElementByBlock = function(a, b) {
  var c = this.getCurrentObjects().splice(a, 1)[0];
  this.getCurrentObjects().splice(b, 0, c);
  Entry.stage.sortZorder();
  this.updateListView();
};
Entry.Container.prototype.createMessage = function() {
  var a = prompt(Lang.Workspace.enter_new_message);
  a ? Entry.isExist(a, "name", Entry.variableContainer.messages_) ? Entry.toast.alert(Lang.Workspace.message_add_fail, Lang.Workspace.message_add_fail_msg) : Entry.variableContainer.addMessage({name:a}) && Entry.toast.success(Lang.Workspace.message_add_ok, a + " " + Lang.Workspace.message_add_ok_msg) : Entry.toast.alert(Lang.Workspace.message_add_cancel, Lang.Workspace.message_add_cancel_msg);
};
Entry.Container.prototype.addMessage = function(a) {
  a.id || (a.id = Entry.generateHash());
  this.messages_.push(a);
  Entry.playground.reloadPlayground();
  return !0;
};
Entry.Container.prototype.deleteMessage = function() {
  0 == this.messages_.length ? Entry.toast.alert(Lang.Msgs.warn, Lang.Workspace.no_message_to_remove, "true") : Entry.dispatchEvent("deleteMessage");
};
Entry.Container.prototype.removeMessage = function(a) {
  for (var b = this.messages_, c = 0;c < b.length;c++) {
    if (b[c].id == a.id) {
      b.splice(c, 1);
      Entry.playground.reloadPlayground();
      break;
    }
  }
};
Entry.Container.prototype.createVariable = function() {
  var a = prompt(Lang.Workspace.enter_variable_name);
  a && 10 >= a.length ? Entry.isExist(a, "name_", Entry.variableContainer.variables_) ? Entry.toast.alert(Lang.Workspace.variable_add_fail, Lang.Workspace.variable_add_fail_msg1) : Entry.variableContainer.addVariable({name:a}) && Entry.toast.success(Lang.Workspace.variable_add_ok, a + " " + Lang.Workspace.variable_add_ok_msg) : a && 10 <= a.length ? Entry.toast.alert(Lang.Workspace.variable_add_fail, Lang.Workspace.variable_add_fail_msg2, !0) : Entry.toast.alert(Lang.Workspace.variable_add_calcel, 
  Lang.Workspace.variable_add_calcel_msg);
};
Entry.Container.prototype.removeVariable = function() {
  Entry.dispatchEvent("removeVariable");
};
Entry.Container.prototype.changeVariableName = function() {
  Entry.dispatchEvent("changeVariableName");
};
Entry.Container.prototype.changeEntryVariableName = function(a) {
  var b = this.variables_;
  if (Entry.isExist(a.newName, "name_", b)) {
    Entry.toast.alert(Lang.Workspace.variable_rename_failed, Lang.Workspace.variable_dup);
  } else {
    for (var c = 0;c < b.length;c++) {
      if (b[c].getId() == a.varId) {
        this.variables_[c].setName(a.newName);
        break;
      }
    }
    Entry.toast.success(Lang.Workspace.variable_rename, Lang.Workspace.variable_rename_ok);
    Entry.playground.reloadPlayground();
  }
};
Entry.Container.prototype.removeEntryVariable = function(a) {
  for (var b = this.variables_, c = 0;c < b.length;c++) {
    if (b[c].getId() == a) {
      b[c].remove();
      this.variables_.splice(c, 1);
      Entry.playground.reloadPlayground();
      break;
    }
  }
};
Entry.Container.prototype.getDropdownList = function(a) {
  var b = [];
  if ("sprites" == a) {
    var c = this.getCurrentObjects(), d = c.length;
    for (a = 0;a < d;a++) {
      var e = c[a];
      b.push([e.name, e.id]);
    }
  } else {
    if ("spritesWithMouse" == a) {
      for (c = this.getCurrentObjects(), d = c.length, b.push([Lang.Blocks.mouse_pointer, "mouse"]), a = 0;a < d;a++) {
        e = c[a], b.push([e.name, e.id]);
      }
    } else {
      if ("collision" == a) {
        c = this.getCurrentObjects();
        d = c.length;
        for (a = 0;a < d;a++) {
          e = c[a], b.push([e.name, e.id]);
        }
        b.push([Lang.Blocks.wall, "wall"]);
        b.push([Lang.Blocks.wall_up, "wall_up"]);
        b.push([Lang.Blocks.wall_down, "wall_down"]);
        b.push([Lang.Blocks.wall_right, "wall_right"]);
        b.push([Lang.Blocks.wall_left, "wall_left"]);
      } else {
        if ("pictures" == a) {
          for (c = Entry.playground.object.pictures, a = 0;a < c.length;a++) {
            d = c[a], b.push([d.name, d.id]);
          }
        } else {
          if ("messages" == a) {
            for (c = Entry.variableContainer.messages_, a = 0;a < c.length;a++) {
              d = c[a], b.push([d.name, d.id]);
            }
          } else {
            if ("variables" == a) {
              c = Entry.variableContainer.variables_;
              for (a = 0;a < c.length;a++) {
                d = c[a], d.object_ && d.object_ != Entry.playground.object.id || b.push([d.getName(), d.getId()]);
              }
              b && 0 != b.length || b.push([Lang.Blocks.VARIABLE_variable, "null"]);
            } else {
              if ("lists" == a) {
                c = Entry.variableContainer.lists_;
                for (a = 0;a < c.length;a++) {
                  d = c[a], b.push([d.getName(), d.getId()]);
                }
                b && 0 != b.length || b.push([Lang.Blocks.VARIABLE_list, "null"]);
              } else {
                if ("scenes" == a) {
                  for (c = Entry.scene.scenes_, a = 0;a < c.length;a++) {
                    d = c[a], b.push([d.name, d.id]);
                  }
                } else {
                  if ("sounds" == a) {
                    for (c = Entry.playground.object.sounds, a = 0;a < c.length;a++) {
                      d = c[a], b.push([d.name, d.id]);
                    }
                  } else {
                    if ("clone" == a) {
                      for (b.push([Lang.Blocks.oneself, "self"]), d = this.objects_.length, a = 0;a < d;a++) {
                        e = this.objects_[a], b.push([e.name, e.id]);
                      }
                    } else {
                      if ("objectSequence" == a) {
                        for (d = this.getCurrentObjects().length, a = 0;a < d;a++) {
                          b.push([(a + 1).toString(), a.toString()]);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  b.length || (b = [[Lang.Blocks.no_target, "null"]]);
  return b;
};
Entry.Container.prototype.clearRunningState = function() {
  this.mapObject(function(a) {
    a.entity.clearScript();
    for (var b = a.clonedEntities.length;0 < b;b--) {
      a.clonedEntities[b - 1].removeClone();
    }
    a.clonedEntities = [];
  });
};
Entry.Container.prototype.mapObject = function(a, b) {
  for (var c = this.objects_.length, d = 0;d < c;d++) {
    a(this.objects_[d], b);
  }
};
Entry.Container.prototype.mapObjectOnScene = function(a, b) {
  for (var c = this.getCurrentObjects(), d = c.length, e = 0;e < d;e++) {
    a(c[e], b);
  }
};
Entry.Container.prototype.clearRunningStateOnScene = function() {
  this.mapObjectOnScene(function(a) {
    a.entity.clearScript();
    for (var b = a.clonedEntities.length;0 < b;b--) {
      a.clonedEntities[b - 1].removeClone();
    }
    a.clonedEntities = [];
  });
};
Entry.Container.prototype.mapEntity = function(a, b) {
  for (var c = this.objects_.length, d = 0;d < c;d++) {
    a(this.objects_[d].entity, b);
  }
};
Entry.Container.prototype.mapEntityOnScene = function(a, b) {
  for (var c = this.getCurrentObjects(), d = c.length, e = 0;e < d;e++) {
    a(c[e].entity, b);
  }
};
Entry.Container.prototype.mapEntityIncludeClone = function(a, b) {
  for (var c = this.objects_, d = c.length, e = 0;e < d;e++) {
    var f = c[e], h = f.clonedEntities.length;
    a(f.entity, b);
    for (var g = 0;g < h;g++) {
      var k = f.clonedEntities[g];
      k && !k.isStamp && a(k, b);
    }
  }
};
Entry.Container.prototype.mapEntityIncludeCloneOnScene = function(a, b) {
  for (var c = this.getCurrentObjects(), d = c.length, e = 0;e < d;e++) {
    var f = c[e], h = f.clonedEntities.length;
    a(f.entity, b);
    for (var g = 0;g < h;g++) {
      var k = f.clonedEntities[g];
      k && !k.isStamp && a(k, b);
    }
  }
};
Entry.Container.prototype.getCachedPicture = function(a) {
  Entry.assert("string" == typeof a, "pictureId must be string");
  return this.cachedPicture[a];
};
Entry.Container.prototype.cachePicture = function(a, b) {
  this.cachedPicture[a] = b;
};
Entry.Container.prototype.toJSON = function() {
  for (var a = [], b = this.objects_.length, c = 0;c < b;c++) {
    a.push(this.objects_[c].toJSON());
  }
  return a;
};
Entry.Container.prototype.takeSequenceSnapshot = function() {
  for (var a = this.objects_.length, b = this.objects_, c = 0;c < a;c++) {
    b[c].index = c;
  }
};
Entry.Container.prototype.loadSequenceSnapshot = function() {
  for (var a = this.objects_.length, b = Array(a), c = 0;c < a;c++) {
    var d = this.objects_[c];
    b[d.index] = d;
    delete d.index;
  }
  this.objects_ = b;
  this.setCurrentObjects();
  Entry.stage.sortZorder();
  this.updateListView();
};
Entry.Container.prototype.getMessageJSON = function() {
  return this.messages_;
};
Entry.Container.prototype.getVariableJSON = function() {
  for (var a = [], b = 0;b < this.variables_.length;b++) {
    a.push(this.variables_[b].toJSON());
  }
  return a;
};
Entry.Container.prototype.getInputValue = function() {
  return this.inputValue.value;
};
Entry.Container.prototype.setInputValue = function(a) {
  this.inputValue.value = a ? a : "";
};
Entry.Container.prototype.resetSceneDuringRun = function() {
  this.mapEntityOnScene(function(a) {
    a.loadSnapshot();
    a.object.filters = [];
    a.resetFilter();
    a.dialog && a.dialog.remove();
    a.shape && a.removeBrush();
  });
  this.clearRunningStateOnScene();
};
Entry.Container.prototype.setCopiedObject = function(a) {
  this.copiedObject = a;
};
Entry.Container.prototype.updateObjectsOrder = function() {
  for (var a = Entry.scene.getScenes(), b = [], c = 0;c < a.length;c++) {
    for (var d = this.getSceneObjects(a[c]), e = 0;e < d.length;e++) {
      b.push(d[e]);
    }
  }
  this.objects_ = b;
};
Entry.Container.prototype.getSceneObjects = function(a) {
  a = a || Entry.scene.selectedScene;
  for (var b = [], c = this.getAllObjects(), d = 0;d < c.length;d++) {
    a.id == c[d].scene.id && b.push(c[d]);
  }
  return b;
};
Entry.Container.prototype.setCurrentObjects = function() {
  this.currentObjects_ = this.getSceneObjects();
};
Entry.Container.prototype.getCurrentObjects = function() {
  var a = this.currentObjects_;
  a && 0 != a.length || this.setCurrentObjects();
  return this.currentObjects_;
};
Entry.Container.prototype.getProjectWithJSON = function(a) {
  a.objects = Entry.container.toJSON();
  a.variables = Entry.variableContainer.getVariableJSON();
  a.messages = Entry.variableContainer.getMessageJSON();
  a.scenes = Entry.scene.toJSON();
  return a;
};
Entry.Container.prototype.generateTabView = function() {
  var a = this.view_, b = this;
  this.tabViews = [];
  var c = Entry.createElement("div");
  c.addClass("entryContainerTabViewWorkspace");
  a.appendChild(c);
  var d = Entry.createElement("span");
  d.addClass("entryContainerTabItemWorkspace");
  d.addClass("entryEllipsis");
  d.innerHTML = Lang.Menus.lecture_container_tab_object;
  d.bindOnClick(function() {
    b.changeTabView("object");
  });
  this.tabViews.push(d);
  c.appendChild(d);
  var e = Entry.createElement("span");
  e.addClass("entryContainerTabItemWorkspace", "entryRemove");
  e.addClass("entryEllipsis");
  e.innerHTML = Lang.Menus.lecture_container_tab_video;
  e.bindOnClick(function() {
    b.changeTabView("movie");
  });
  this.tabViews.push(e);
  c.appendChild(e);
  this.youtubeTab = e;
  e = Entry.createElement("span");
  e.addClass("entryContainerTabItemWorkspace", "entryRemove");
  e.addClass("entryEllipsis");
  e.innerHTML = Lang.Menus.lecture_container_tab_project;
  e.bindOnClick(function() {
    b.changeTabView("done");
  });
  this.tabViews.push(e);
  c.appendChild(e);
  this.iframeTab = e;
  e = Entry.createElement("span");
  e.addClass("entryContainerTabItemWorkspace");
  e.addClass("entryEllipsis");
  e.innerHTML = Lang.Menus.lecture_container_tab_help;
  e.bindOnClick(function() {
    b.changeTabView("helper");
  });
  this.tabViews.push(e);
  c.appendChild(e);
  c = Entry.createElement("div");
  c.addClass("entryContainerMovieWorkspace");
  c.addClass("entryHide");
  a.appendChild(c);
  this.movieContainer = c;
  c = Entry.createElement("div");
  c.addClass("entryContainerDoneWorkspace");
  c.addClass("entryHide");
  a.appendChild(c);
  this.doneContainer = c;
  c = Entry.createElement("div");
  c.addClass("entryContainerHelperWorkspace");
  c.addClass("entryHide");
  a.appendChild(c);
  this.helperContainer = c;
  Entry.helper.initBlockHelper(c);
  d.addClass("selected");
};
Entry.Container.prototype.changeTabView = function(a) {
  for (var b = this.tabViews, c = 0, d = b.length;c < d;c++) {
    b[c].removeClass("selected");
  }
  this.movieContainer.addClass("entryHide");
  this.doneContainer.addClass("entryHide");
  this.helperContainer.addClass("entryHide");
  "object" == a ? b[0].addClass("selected") : "movie" == a ? (a = this.view_, a = a.style.width.substring(0, a.style.width.length - 2), this.movieFrame.setAttribute("width", a), this.movieFrame.setAttribute("height", 9 * a / 16), this.movieContainer.removeClass("entryHide"), b[1].addClass("selected")) : "done" == a ? (c = $(this.doneContainer).height(), a = $(this.doneContainer).width(), 9 * a / 16 + 35 < c ? c = 9 * a / 16 + 35 : a = (c - 35) / 9 * 16, this.doneProjectFrame.setAttribute("width", 
  a), this.doneProjectFrame.setAttribute("height", c), this.doneContainer.removeClass("entryHide"), b[2].addClass("selected")) : "helper" == a && (Entry.helper.blockHelperOn(), this.helperContainer.removeClass("entryHide"), b[3].addClass("selected"));
};
Entry.Container.prototype.initYoutube = function(a) {
  this.youtubeHash = a;
  this.youtubeTab.removeClass("entryRemove");
  a = this.view_;
  a = a.style.width.substring(0, a.style.width.length - 2);
  var b = this.movieContainer, c = Entry.createElement("iframe");
  c.setAttribute("width", a);
  c.setAttribute("height", 9 * a / 16);
  c.setAttribute("allowfullscreen", "");
  c.setAttribute("frameborder", 0);
  c.setAttribute("src", "https://www.youtube.com/embed/" + this.youtubeHash);
  this.movieFrame = c;
  b.appendChild(c);
};
Entry.Container.prototype.initDoneProject = function(a) {
  this.doneProject = a;
  this.iframeTab.removeClass("entryRemove");
  a = this.view_;
  a = a.style.width.substring(0, a.style.width.length - 2);
  var b = Entry.createElement("iframe");
  b.setAttribute("width", a);
  b.setAttribute("height", 9 * a / 16 + 35);
  b.setAttribute("frameborder", 0);
  b.setAttribute("src", "/api/project/iframe/" + this.doneProject);
  this.doneProjectFrame = b;
  this.doneContainer.appendChild(b);
};
Entry.Container.prototype.blurAllInputs = function() {
  this.getSceneObjects().map(function(a) {
    a = a.view_.getElementsByTagName("input");
    for (var b = 0, c = a.length;b < c;b++) {
      a[b].blur();
    }
  });
};
Entry.Dialog = function(a, b, c, d) {
  a.dialog && a.dialog.remove();
  a.dialog = this;
  this.parent = a;
  this.padding = 10;
  this.border = 2;
  "number" == typeof b && (b = String(b));
  this.message_ = b = b.match(/.{1,15}/g).join("\n");
  this.mode_ = c;
  "speak" == c && this.generateSpeak();
  d || Entry.stage.loadDialog(this);
};
Entry.Dialog.prototype.generateSpeak = function() {
  this.object = new createjs.Container;
  var a = new createjs.Text;
  a.font = "15px NanumGothic";
  a.textBaseline = "top";
  a.textAlign = "left";
  a.text = this.message_;
  var b = a.getTransformedBounds(), c = b.height, b = 10 <= b.width ? b.width : 17, d = new createjs.Shape;
  d.graphics.f("#f5f5f5").ss(2, "round").s("#6FC0DD").rr(-this.padding, -this.padding, b + 2 * this.padding, c + 2 * this.padding, this.padding);
  this.object.addChild(d);
  this.object.regX = b / 2;
  this.object.regY = c / 2;
  this.width = b;
  this.height = c;
  this.notch = this.createSpeakNotch("ne");
  this.update();
  this.object.addChild(this.notch);
  this.object.addChild(a);
};
Entry.Dialog.prototype.update = function() {
  var a = this.parent.object.getTransformedBounds(), b = "";
  -135 < a.y - this.height - 20 - this.border ? (this.object.y = a.y - this.height / 2 - 20 - this.padding, b += "n") : (this.object.y = a.y + a.height + this.height / 2 + 20 + this.padding, b += "s");
  240 > a.x + a.width + this.width ? (this.object.x = a.x + a.width + this.width / 2, b += "e") : (this.object.x = a.x - this.width / 2, b += "w");
  this.notch.type != b && (this.object.removeChild(this.notch), this.notch = this.createSpeakNotch(b), this.object.addChild(this.notch));
};
Entry.Dialog.prototype.createSpeakNotch = function(a) {
  var b = new createjs.Shape;
  b.type = a;
  "ne" == a ? b.graphics.f("#f5f5f5").ss(2, "round").s("#6FC0DD").mt(0, this.height + this.padding - 1.5).lt(-10, this.height + this.padding + 20).lt(20, this.height + this.padding - 1.5) : "nw" == a ? b.graphics.f("#f5f5f5").ss(2, "round").s("#6FC0DD").mt(this.width, this.height + this.padding - 1.5).lt(this.width + 10, this.height + this.padding + 20).lt(this.width - 20, this.height + this.padding - 1.5) : "se" == a ? b.graphics.f("#f5f5f5").ss(2, "round").s("#6FC0DD").mt(0, -this.padding + 1.5).lt(-10, 
  -this.padding - 20).lt(20, -this.padding + 1.5) : "sw" == a && b.graphics.f("#f5f5f5").ss(2, "round").s("#6FC0DD").mt(this.width, -this.padding + 1.5).lt(this.width + 10, -this.padding - 20).lt(this.width - 20, -this.padding + 1.5);
  return b;
};
Entry.Dialog.prototype.remove = function() {
  Entry.stage.unloadDialog(this);
  this.parent.dialog = null;
};
Entry.Engine = function() {
  this.state = "stop";
  this.popup = null;
  this.isUpdating = !0;
  this.speeds = [1, 15, 30, 45, 60];
  this.pressedKeys = [];
  Entry.addEventListener("keyPressed", this.captureKeyEvent);
  Entry.addEventListener("keyUpped", this.captureKeyUpEvent);
  Entry.addEventListener("canvasClick", function(a) {
    Entry.engine.fireEvent("mouse_clicked");
  });
  Entry.addEventListener("canvasClickCanceled", function(a) {
    Entry.engine.fireEvent("mouse_click_cancled");
  });
  Entry.addEventListener("entityClick", function(a) {
    Entry.engine.fireEventOnEntity("when_object_click", a);
  });
  Entry.addEventListener("entityClickCanceled", function(a) {
    Entry.engine.fireEventOnEntity("when_object_click_canceled", a);
  });
  "phone" != Entry.type && (Entry.addEventListener("stageMouseMove", function(a) {
    Entry.engine.updateMouseView();
  }), Entry.addEventListener("stageMouseOut", function(a) {
    Entry.engine.hideMouseView();
  }));
};
Entry.Engine.prototype.generateView = function(a, b) {
  if (b && "workspace" != b) {
    "minimize" == b ? (this.view_ = a, this.view_.addClass("entryEngine"), this.view_.addClass("entryEngineMinimize"), this.maximizeButton = Entry.createElement("button"), this.maximizeButton.addClass("entryEngineButtonMinimize"), this.maximizeButton.addClass("entryMaximizeButtonMinimize"), this.view_.appendChild(this.maximizeButton), this.maximizeButton.bindOnClick(function(a) {
      Entry.engine.toggleFullscreen();
    }), this.coordinateButton = Entry.createElement("button"), this.coordinateButton.addClass("entryEngineButtonMinimize"), this.coordinateButton.addClass("entryCoordinateButtonMinimize"), this.view_.appendChild(this.coordinateButton), this.coordinateButton.bindOnClick(function(a) {
      this.hasClass("toggleOn") ? this.removeClass("toggleOn") : this.addClass("toggleOn");
      Entry.stage.toggleCoordinator();
    }), this.runButton = Entry.createElement("button"), this.runButton.addClass("entryEngineButtonMinimize"), this.runButton.addClass("entryRunButtonMinimize"), this.runButton.innerHTML = Lang.Blocks.START, this.view_.appendChild(this.runButton), this.runButton.bindOnClick(function(a) {
      Entry.engine.toggleRun();
    }), this.runButton2 = Entry.createElement("button"), this.runButton2.addClass("entryEngineBigButtonMinimize_popup"), this.runButton2.addClass("entryEngineBigButtonMinimize_popup_run"), this.view_.appendChild(this.runButton2), this.runButton2.bindOnClick(function(a) {
      Entry.engine.toggleRun();
    }), this.stopButton = Entry.createElement("button"), this.stopButton.addClass("entryEngineButtonMinimize"), this.stopButton.addClass("entryStopButtonMinimize"), this.stopButton.addClass("entryRemove"), this.stopButton.innerHTML = Lang.Workspace.stop, this.view_.appendChild(this.stopButton), this.stopButton.bindOnClick(function(a) {
      this.blur();
      Entry.engine.toggleStop();
    }), this.pauseButton = Entry.createElement("button"), this.pauseButton.innerHTML = Lang.Workspace.pause, this.pauseButton.addClass("entryEngineButtonMinimize"), this.pauseButton.addClass("entryPauseButtonMinimize"), this.pauseButton.addClass("entryRemove"), this.view_.appendChild(this.pauseButton), this.pauseButton.bindOnClick(function(a) {
      this.blur();
      Entry.engine.togglePause();
    }), this.mouseView = Entry.createElement("div"), this.mouseView.addClass("entryMouseViewMinimize"), this.mouseView.addClass("entryRemove"), this.view_.appendChild(this.mouseView)) : "phone" == b && (this.view_ = a, this.view_.addClass("entryEngine", "entryEnginePhone"), this.headerView_ = Entry.createElement("div", "entryEngineHeader"), this.headerView_.addClass("entryEngineHeaderPhone"), this.view_.appendChild(this.headerView_), this.maximizeButton = Entry.createElement("button"), this.maximizeButton.addClass("entryEngineButtonPhone", 
    "entryMaximizeButtonPhone"), this.headerView_.appendChild(this.maximizeButton), this.maximizeButton.bindOnClick(function(a) {
      Entry.engine.footerView_.addClass("entryRemove");
      Entry.engine.headerView_.addClass("entryRemove");
      Entry.launchFullScreen(Entry.engine.view_);
    }), document.addEventListener("fullscreenchange", function(a) {
      Entry.engine.exitFullScreen();
    }), document.addEventListener("webkitfullscreenchange", function(a) {
      Entry.engine.exitFullScreen();
    }), document.addEventListener("mozfullscreenchange", function(a) {
      Entry.engine.exitFullScreen();
    }), this.footerView_ = Entry.createElement("div", "entryEngineFooter"), this.footerView_.addClass("entryEngineFooterPhone"), this.view_.appendChild(this.footerView_), this.runButton = Entry.createElement("button"), this.runButton.addClass("entryEngineButtonPhone", "entryRunButtonPhone"), Entry.objectAddable && this.runButton.addClass("small"), this.runButton.innerHTML = Lang.Workspace.run, this.footerView_.appendChild(this.runButton), this.runButton.bindOnClick(function(a) {
      Entry.engine.toggleRun();
    }), this.stopButton = Entry.createElement("button"), this.stopButton.addClass("entryEngineButtonPhone", "entryStopButtonPhone", "entryRemove"), Entry.objectAddable && this.stopButton.addClass("small"), this.stopButton.innerHTML = Lang.Workspace.stop, this.footerView_.appendChild(this.stopButton), this.stopButton.bindOnClick(function(a) {
      Entry.engine.toggleStop();
    }));
  } else {
    this.view_ = a;
    this.view_.addClass("entryEngine_w");
    this.view_.addClass("entryEngineWorkspace_w");
    var c = Entry.createElement("button");
    this.speedButton = c;
    this.speedButton.addClass("entrySpeedButtonWorkspace", "entryEngineTopWorkspace", "entryEngineButtonWorkspace_w");
    this.view_.appendChild(this.speedButton);
    this.speedButton.bindOnClick(function(a) {
      Entry.engine.toggleSpeedPanel();
      c.blur();
    });
    this.maximizeButton = Entry.createElement("button");
    this.maximizeButton.addClass("entryEngineButtonWorkspace_w", "entryEngineTopWorkspace", "entryMaximizeButtonWorkspace_w");
    this.view_.appendChild(this.maximizeButton);
    this.maximizeButton.bindOnClick(function(a) {
      Entry.engine.toggleFullscreen();
    });
    var d = Entry.createElement("button");
    this.coordinateButton = d;
    this.coordinateButton.addClass("entryEngineButtonWorkspace_w", "entryEngineTopWorkspace", "entryCoordinateButtonWorkspace_w");
    this.view_.appendChild(this.coordinateButton);
    this.coordinateButton.bindOnClick(function(a) {
      this.hasClass("toggleOn") ? this.removeClass("toggleOn") : this.addClass("toggleOn");
      d.blur();
      Entry.stage.toggleCoordinator();
    });
    this.addButton = Entry.createElement("button");
    this.addButton.addClass("entryEngineButtonWorkspace_w");
    this.addButton.addClass("entryAddButtonWorkspace_w");
    this.addButton.innerHTML = Lang.Workspace.add_object;
    this.addButton.bindOnClick(function(a) {
      Entry.dispatchEvent("openSpriteManager");
    });
    this.view_.appendChild(this.addButton);
    this.runButton = Entry.createElement("button");
    this.runButton.addClass("entryEngineButtonWorkspace_w");
    this.runButton.addClass("entryRunButtonWorkspace_w");
    this.runButton.innerHTML = Lang.Workspace.run;
    this.view_.appendChild(this.runButton);
    this.runButton.bindOnClick(function(a) {
      Entry.engine.toggleRun();
    });
    this.runButton2 = Entry.createElement("button");
    this.runButton2.addClass("entryEngineButtonWorkspace_w");
    this.runButton2.addClass("entryRunButtonWorkspace_w2");
    this.view_.appendChild(this.runButton2);
    this.runButton2.bindOnClick(function(a) {
      Entry.engine.toggleRun();
    });
    this.stopButton = Entry.createElement("button");
    this.stopButton.addClass("entryEngineButtonWorkspace_w");
    this.stopButton.addClass("entryStopButtonWorkspace_w");
    this.stopButton.addClass("entryRemove");
    this.stopButton.innerHTML = Lang.Workspace.stop;
    this.view_.appendChild(this.stopButton);
    this.stopButton.bindOnClick(function(a) {
      Entry.engine.toggleStop();
    });
    this.stopButton2 = Entry.createElement("button");
    this.stopButton2.addClass("entryEngineButtonWorkspace_w");
    this.stopButton2.addClass("entryStopButtonWorkspace_w2");
    this.stopButton2.addClass("entryRemove");
    this.view_.appendChild(this.stopButton2);
    this.stopButton2.bindOnClick(function(a) {
      Entry.engine.toggleStop();
    });
    this.pauseButton = Entry.createElement("button");
    this.pauseButton.addClass("entryEngineButtonWorkspace_w");
    this.pauseButton.addClass("entryPauseButtonWorkspace_w");
    this.pauseButton.addClass("entryRemove");
    this.pauseButton.bindOnClick(function(a) {
      Entry.engine.togglePause();
    });
    this.mouseView = Entry.createElement("div");
    this.mouseView.addClass("entryMouseViewWorkspace_w");
    this.mouseView.addClass("entryRemove");
    this.view_.appendChild(this.mouseView);
  }
};
Entry.Engine.prototype.toggleSpeedPanel = function() {
  if (this.speedPanelOn) {
    this.speedPanelOn = !1, $(Entry.stage.canvas.canvas).animate({top:"24px"}), this.coordinateButton.removeClass("entryRemove"), this.maximizeButton.removeClass("entryRemove"), this.mouseView.removeClass("entryRemoveElement"), $(this.speedLabel_).remove(), delete this.speedLabel_, $(this.speedProgress_).fadeOut(null, function(a) {
      $(this).remove();
      delete this.speedProgress_;
    }), $(this.speedHandle_).remove(), delete this.speedHandle_;
  } else {
    this.speedPanelOn = !0;
    $(Entry.stage.canvas.canvas).animate({top:"41px"});
    this.coordinateButton.addClass("entryRemove");
    this.maximizeButton.addClass("entryRemove");
    this.mouseView.addClass("entryRemoveElement");
    this.speedLabel_ = Entry.createElement("div", "entrySpeedLabelWorkspace");
    this.speedLabel_.innerHTML = Lang.Workspace.speed;
    this.view_.insertBefore(this.speedLabel_, this.maximizeButton);
    this.speedProgress_ = Entry.createElement("table", "entrySpeedProgressWorkspace");
    for (var a = Entry.createElement("tr"), b = this.speeds, c = 0;5 > c;c++) {
      (function(c) {
        var e = Entry.createElement("td", "progressCell" + c);
        e.bindOnClick(function() {
          Entry.engine.setSpeedMeter(b[c]);
        });
        a.appendChild(e);
      })(c);
    }
    this.view_.insertBefore(this.speedProgress_, this.maximizeButton);
    this.speedProgress_.appendChild(a);
    this.speedHandle_ = Entry.createElement("div", "entrySpeedHandleWorkspace");
    c = (Entry.interfaceState.canvasWidth - 84) / 5;
    $(this.speedHandle_).draggable({axis:"x", grid:[c, c], containment:[80, 0, 4 * c + 80, 0], drag:function(a, b) {
      var c = (b.position.left - 80) / (Entry.interfaceState.canvasWidth - 84) * 5, c = Math.floor(c);
      0 > c || Entry.engine.setSpeedMeter(Entry.engine.speeds[c]);
    }});
    this.view_.insertBefore(this.speedHandle_, this.maximizeButton);
    this.setSpeedMeter(Entry.FPS);
  }
};
Entry.Engine.prototype.setSpeedMeter = function(a) {
  var b = this.speeds.indexOf(a);
  0 > b || (b = Math.min(4, b), b = Math.max(0, b), this.speedPanelOn && (this.speedHandle_.style.left = (Entry.interfaceState.canvasWidth - 80) / 10 * (2 * b + 1) + 80 - 9 + "px"), Entry.FPS != a && (clearInterval(this.ticker), this.ticker = setInterval(this.update, Math.floor(1E3 / a)), Entry.FPS = a));
};
Entry.Engine.prototype.start = function(a) {
  createjs.Ticker.setFPS(Entry.FPS);
  this.ticker = setInterval(this.update, Math.floor(1E3 / Entry.FPS));
};
Entry.Engine.prototype.stop = function() {
  clearInterval(this.ticker);
  this.ticker = null;
};
Entry.Engine.prototype.update = function() {
  Entry.engine.isState("run") && (Entry.engine.computeObjects(), Entry.hw.update());
};
Entry.Engine.prototype.computeObjects = function() {
  Entry.container.mapEntityIncludeCloneOnScene(this.computeFunction);
};
Entry.Engine.prototype.computeFunction = function(a) {
  a = a.runningScript;
  for (var b = 0;b < a.length;b++) {
    for (var c = a.shift(), d = !0, e = !1;c && d && !e;) {
      try {
        var d = !c.isLooped, f = c.run(), e = f && f.type == c.type, c = f;
      } catch (h) {
        throw Entry.engine.toggleStop(), Entry.engine.isUpdating = !1, "workspace" == Entry.type && (Entry.container.selectObject(), Entry.container.selectObject(c.entity.parent.id), Entry.playground.changeViewMode("code"), Blockly.mainWorkspace.activatePreviousBlock(c.id)), Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.check_runtime_error, !0), h;
      }
    }
    c && a.push(c);
  }
};
Entry.Engine.computeThread = function(a, b) {
  Entry.engine.isContinue = !0;
  for (var c = !1;b && Entry.engine.isContinue && !c;) {
    try {
      Entry.engine.isContinue = !b.isRepeat;
      var d = b.run(), c = d && d.type == b.type;
      b = d;
    } catch (e) {
      throw console.log(e.stack), Entry.engine.toggleStop(), Entry.engine.isUpdating = !1, "workspace" == Entry.type && (Entry.container.selectObject(), Entry.container.selectObject(a.parent.id), Entry.playground.changeViewMode("code"), Blockly.mainWorkspace.activatePreviousBlock(b.id)), Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.check_runtime_error, !0), e;
    }
  }
  return b;
};
Entry.Engine.prototype.isState = function(a) {
  return -1 < this.state.indexOf(a);
};
Entry.Engine.prototype.run = function() {
  this.isState("run") ? this.toggleStop() : (this.isState("stop") || this.isState("pause")) && this.toggleRun();
};
Entry.Engine.prototype.toggleRun = function() {
  Entry.addActivity("run");
  "stop" == this.state && (Entry.playground.syncObject(), Entry.container.mapEntity(function(a) {
    a.takeSnapshot();
  }), Entry.variableContainer.mapVariable(function(a) {
    a.takeSnapshot();
  }), Entry.variableContainer.mapList(function(a) {
    a.takeSnapshot();
  }), Entry.engine.projectTimer.takeSnapshot(), Entry.container.takeSequenceSnapshot(), Entry.scene.takeStartSceneSnapshot(), this.state = "run", this.fireEvent("when_run_button_click"));
  this.state = "run";
  "mobile" == Entry.type && this.view_.addClass("entryEngineBlueWorkspace");
  this.pauseButton.innerHTML = Lang.Workspace.pause;
  this.runButton.addClass("run");
  this.runButton.addClass("entryRemove");
  this.stopButton.removeClass("entryRemove");
  this.pauseButton && this.pauseButton.removeClass("entryRemove");
  this.runButton2 && this.runButton2.addClass("entryRemove");
  this.stopButton2 && this.stopButton2.removeClass("entryRemove");
  this.isUpdating || (Entry.engine.update(), Entry.engine.isUpdating = !0);
  Entry.stage.selectObject();
  Entry.dispatchEvent("run");
};
Entry.Engine.prototype.toggleStop = function() {
  Entry.addActivity("stop");
  Entry.container.mapEntity(function(a) {
    a.loadSnapshot();
    a.object.filters = [];
    a.resetFilter();
    a.dialog && a.dialog.remove();
    a.brush && a.removeBrush();
  });
  Entry.variableContainer.mapVariable(function(a) {
    a.loadSnapshot();
  });
  Entry.variableContainer.mapList(function(a) {
    a.loadSnapshot();
    a.updateView();
  });
  Entry.engine.projectTimer.loadSnapshot();
  Entry.container.clearRunningState();
  Entry.container.loadSequenceSnapshot();
  Entry.scene.loadStartSceneSnapshot();
  Entry.Func.clearThreads();
  createjs.Sound.setVolume(1);
  createjs.Sound.stop();
  this.view_.removeClass("entryEngineBlueWorkspace");
  this.runButton.removeClass("entryRemove");
  this.stopButton.addClass("entryRemove");
  this.pauseButton && this.pauseButton.addClass("entryRemove");
  this.runButton2 && this.runButton2.removeClass("entryRemove");
  this.stopButton2 && this.stopButton2.addClass("entryRemove");
  this.state = "stop";
  Entry.dispatchEvent("stop");
  Entry.stage.hideInputField();
};
Entry.Engine.prototype.togglePause = function() {
  "pause" == this.state ? (this.state = "run", this.pauseButton.innerHTML = Lang.Workspace.pause) : (this.state = "pause", this.pauseButton.innerHTML = Lang.Workspace.restart, this.runButton.removeClass("entryRemove"), this.stopButton.removeClass("entryRemove"));
};
Entry.Engine.prototype.fireEvent = function(a) {
  "run" == this.state && Entry.container.mapEntityIncludeCloneOnScene(this.raiseEvent, a);
};
Entry.Engine.prototype.raiseEvent = function(a, b) {
  for (var c = a.parent.script.childNodes, d = 0;d < c.length;d++) {
    var e = c[d];
    if (Entry.Xml.isTypeOf(b, e)) {
      var f = new Entry.Script(a);
      f.init(e);
      a.runningScript.push(f);
    }
  }
};
Entry.Engine.prototype.fireEventOnEntity = function(a, b) {
  "run" == this.state && Entry.container.mapEntityIncludeCloneOnScene(this.raiseEventOnEntity, [b, a]);
};
Entry.Engine.prototype.raiseEventOnEntity = function(a, b) {
  if (a === b[0]) {
    for (var c = b[1], d = a.parent.script.childNodes, e = 0;e < d.length;e++) {
      var f = d[e];
      if (Entry.Xml.isTypeOf(c, f)) {
        var h = new Entry.Script(a);
        h.init(f);
        a.runningScript.push(h);
      }
    }
  }
};
Entry.Engine.prototype.captureKeyEvent = function(a) {
  var b = a.keyCode, c = Entry.type;
  0 > Entry.engine.pressedKeys.indexOf(b) && Entry.engine.pressedKeys.push(b);
  a.ctrlKey && "workspace" == c ? (a.preventDefault(), 83 == b ? Entry.dispatchEvent("saveWorkspace") : 82 == b ? Entry.engine.run() : 90 == b ? Entry.dispatchEvent("undo") : 48 < b && 58 > b && Entry.playground.selectMenu(b - 49)) : Entry.engine.isState("run") && (Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, ["press_some_key", b]), Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, ["when_some_key_pressed", b]));
  Entry.engine.isState("stop") && "workspace" === c && 37 <= b && 40 >= b && Entry.stage.moveSprite(a);
};
Entry.Engine.prototype.captureKeyUpEvent = function(a) {
  a = a.keyCode;
  0 <= Entry.engine.pressedKeys.indexOf(a) && Entry.engine.pressedKeys.splice(Entry.engine.pressedKeys.indexOf(a), 1);
};
Entry.Engine.prototype.raiseKeyEvent = function(a, b) {
  for (var c = b[0], d = b[1], e = a.parent.script.childNodes, f = 0;f < e.length;f++) {
    var h = e[f], g = Entry.Xml.getField("VALUE", h);
    Entry.Xml.isTypeOf(c, h) && g == d && (g = new Entry.Script(a), g.init(h), a.runningScript.push(g));
  }
};
Entry.Engine.prototype.updateMouseView = function() {
  var a = Entry.stage.mouseCoordinate;
  this.mouseView.innerHTML = "X : " + a.x + ", Y : " + a.y;
  this.mouseView.removeClass("entryRemove");
};
Entry.Engine.prototype.hideMouseView = function() {
  this.mouseView.addClass("entryRemove");
};
Entry.Engine.prototype.toggleFullscreen = function() {
  if (this.popup) {
    this.popup.remove(), this.popup = null;
  } else {
    this.popup = new Entry.Popup;
    if ("workspace" != Entry.type) {
      var a = $(document);
      $(this.popup.body_).css("top", a.scrollTop());
      $("body").css("overflow", "hidden");
      popup.window_.appendChild(Entry.stage.canvas.canvas);
    }
    popup.window_.appendChild(Entry.engine.view_);
  }
};
Entry.Engine.prototype.exitFullScreen = function() {
  document.webkitIsFullScreen || document.mozIsFullScreen || document.isFullScreen || (Entry.engine.footerView_.removeClass("entryRemove"), Entry.engine.headerView_.removeClass("entryRemove"));
};
Entry.Engine.prototype.toggleProjectTimer = function() {
  var a = this.projectTimer;
  a && (this.isState("run") ? (a.start = (new Date).getTime(), a.tick = setInterval(function(a) {
    Entry.engine.updateProjectTimer();
  }, 1E3 / 60)) : (clearInterval(a.tick), this.updateProjectTimer(0)));
};
Entry.Engine.prototype.updateProjectTimer = function(a) {
  var b = Entry.engine.projectTimer;
  b && ("undefined" == typeof a ? (a = (new Date).getTime() - b.start, b.setValue(a / 1E3)) : (b.setValue(a), b.start = (new Date).getTime()));
};
Entry.Engine.prototype.showProjectTimer = function() {
  Entry.engine.projectTimer && this.projectTimer.setVisible(!0);
};
Entry.Engine.prototype.hideProjectTimer = function(a) {
  var b = this.projectTimer;
  if (b && b.isVisible() && !this.isState("run")) {
    for (var c = Entry.container.getAllObjects(), d = ["get_project_timer_value", "reset_project_timer", "set_visible_project_timer"], e = 0, f = c.length;e < f;e++) {
      for (var h = c[e].script.getElementsByTagName("block"), g = 0, k = h.length;g < k;g++) {
        if (-1 < d.indexOf(h[g].getAttribute("type")) && h[g].getAttribute("id") != a.getAttribute("id")) {
          return;
        }
      }
    }
    b.setVisible(!1);
  }
};
Entry.Engine.prototype.clearTimer = function() {
  clearInterval(this.ticker);
  clearInterval(this.projectTimer.tick);
};
Entry.EntityObject = function(a) {
  this.parent = a;
  this.type = a.objectType;
  this.runningScript = [];
  this.flip = !1;
  this.id = Entry.generateHash();
  "sprite" == this.type ? (this.object = new createjs.Bitmap, this.effect = {}, this.setInitialEffectValue()) : "textBox" == this.type && (this.object = new createjs.Container, this.textObject = new createjs.Text, this.textObject.font = "20px Nanum Gothic", this.textObject.textBaseline = "middle", this.textObject.textAlign = "center", this.bgObject = new createjs.Shape, this.bgObject.graphics.setStrokeStyle(1).beginStroke("#f00").drawRect(0, 0, 100, 100), this.object.addChild(this.bgObject), this.object.addChild(this.textObject), 
  this.fontType = "Nanum Gothic", this.fontSize = 20, this.strike = this.underLine = this.fontItalic = this.fontBold = !1);
  this.object.entity = this;
  this.object.cursor = "pointer";
  this.object.on("mousedown", function(a) {
    var c = this.entity.parent.id;
    Entry.dispatchEvent("entityClick", this.entity);
    Entry.stage.isObjectClick = !0;
    "minimize" != Entry.type && Entry.engine.isState("stop") && (this.offset = {x:-this.parent.x + this.entity.getX() - (.75 * a.stageX - 240), y:-this.parent.y - this.entity.getY() - (.75 * a.stageY - 135)}, this.cursor = "move", this.entity.initCommand(), Entry.container.selectObject(c));
  });
  this.object.on("pressup", function(a) {
    Entry.dispatchEvent("entityClickCanceled", this.entity);
    this.cursor = "pointer";
    this.entity.checkCommand();
  });
  this.object.on("pressmove", function(a) {
    "minimize" != Entry.type && Entry.engine.isState("stop") && !this.entity.parent.getLock() && (this.entity.doCommand(), this.entity.setX(.75 * a.stageX - 240 + this.offset.x), this.entity.setY(-(.75 * a.stageY - 135) - this.offset.y), Entry.stage.updateObject());
  });
};
Entry.EntityObject.prototype.injectModel = function(a, b) {
  "sprite" == this.type ? this.setImage(a) : "textBox" == this.type && (b.text || (b.text = this.parent.name), this.setFont(b.font), this.setBGColour(b.bgColor), this.setColour(b.colour), this.setUnderLine(b.underLine), this.setStrike(b.strike));
  b && this.syncModel_(b);
};
Entry.EntityObject.prototype.syncModel_ = function(a) {
  this.setX(a.x);
  this.setY(a.y);
  this.setRegX(a.regX);
  this.setRegY(a.regY);
  this.setScaleX(a.scaleX);
  this.setScaleY(a.scaleY);
  this.setRotation(a.rotation);
  this.setDirection(a.direction, !0);
  this.setLineBreak(a.lineBreak);
  this.setWidth(a.width);
  this.setHeight(a.height);
  this.setText(a.text);
  this.setTextAlign(a.textAlign);
  this.setFontSize(a.fontSize || this.getFontSize());
  this.setVisible(a.visible);
};
Entry.EntityObject.prototype.initCommand = function() {
  Entry.engine.isState("stop") && (this.isCommandValid = !1, Entry.stateManager.addCommand("edit entity", this, this.restoreEntity, this.toJSON()));
};
Entry.EntityObject.prototype.doCommand = function() {
  this.isCommandValid = !0;
};
Entry.EntityObject.prototype.checkCommand = function() {
  Entry.engine.isState("stop") && !this.isCommandValid && Entry.dispatchEvent("cancelLastCommand");
};
Entry.EntityObject.prototype.restoreEntity = function(a) {
  var b = this.toJSON();
  this.syncModel_(a);
  Entry.dispatchEvent("updateObject");
  return new Entry.State(this, this.restoreEntity, b);
};
Entry.EntityObject.prototype.clearScript = function(a) {
  for (;this.runningScript.length;) {
    this.runningScript.pop();
  }
};
Entry.EntityObject.prototype.setX = function(a) {
  "number" == typeof a && (this.x = a, this.object.x = this.x, this.isClone || this.parent.updateCoordinateView(), this.updateDialog());
};
Entry.EntityObject.prototype.getX = function() {
  return this.x;
};
Entry.EntityObject.prototype.setY = function(a) {
  "number" == typeof a && (this.y = a, this.object.y = -this.y, this.isClone || this.parent.updateCoordinateView(), this.updateDialog());
};
Entry.EntityObject.prototype.getY = function() {
  return this.y;
};
Entry.EntityObject.prototype.getDirection = function() {
  return this.direction;
};
Entry.EntityObject.prototype.setDirection = function(a, b) {
  a || (a = 0);
  "vertical" != this.parent.getRotateMethod() || b || (0 <= this.direction && 180 > this.direction) == (0 <= a && 180 > a) || (this.setScaleX(-this.getScaleX()), Entry.stage.updateObject(), this.flip = !this.flip);
  this.direction = a.mod(360);
  this.object.direction = this.direction;
  this.isClone || this.parent.updateRotationView();
  Entry.dispatchEvent("updateObject");
};
Entry.EntityObject.prototype.setRotation = function(a) {
  "free" != this.parent.getRotateMethod() && (a = 0);
  this.rotation = a.mod(360);
  this.object.rotation = this.rotation;
  this.updateDialog();
  this.isClone || this.parent.updateRotationView();
  Entry.dispatchEvent("updateObject");
};
Entry.EntityObject.prototype.getRotation = function() {
  return this.rotation;
};
Entry.EntityObject.prototype.setRegX = function(a) {
  "textBox" == this.type && (a = 0);
  this.regX = a;
  this.object.regX = this.regX;
};
Entry.EntityObject.prototype.getRegX = function() {
  return this.regX;
};
Entry.EntityObject.prototype.setRegY = function(a) {
  "textBox" == this.type && (a = 0);
  this.regY = a;
  this.object.regY = this.regY;
};
Entry.EntityObject.prototype.getRegY = function() {
  return this.regY;
};
Entry.EntityObject.prototype.setScaleX = function(a) {
  this.scaleX = a;
  this.object.scaleX = this.scaleX;
  this.parent.updateCoordinateView();
  this.updateDialog();
};
Entry.EntityObject.prototype.getScaleX = function() {
  return this.scaleX;
};
Entry.EntityObject.prototype.setScaleY = function(a) {
  this.scaleY = a;
  this.object.scaleY = this.scaleY;
  this.parent.updateCoordinateView();
  this.updateDialog();
};
Entry.EntityObject.prototype.getScaleY = function() {
  return this.scaleY;
};
Entry.EntityObject.prototype.setSize = function(a) {
  a /= this.getSize();
  this.setScaleX(this.getScaleX() * a);
  this.setScaleY(this.getScaleY() * a);
  this.isClone || this.parent.updateCoordinateView();
};
Entry.EntityObject.prototype.getSize = function() {
  return (this.getWidth() * this.getScaleX() + this.getHeight() * this.getScaleY()) / 2;
};
Entry.EntityObject.prototype.setWidth = function(a) {
  this.width = a;
  this.object.width = this.width;
  this.textObject && this.getLineBreak() && (this.textObject.lineWidth = this.width);
  this.updateDialog();
  this.updateBG();
};
Entry.EntityObject.prototype.getWidth = function() {
  return this.width;
};
Entry.EntityObject.prototype.setHeight = function(a) {
  this.height = a;
  this.textObject && (this.object.height = this.height, this.alignTextBox());
  this.updateDialog();
  this.updateBG();
};
Entry.EntityObject.prototype.getHeight = function() {
  return this.height;
};
Entry.EntityObject.prototype.setColour = function(a) {
  a || (a = "#000000");
  this.colour = a;
  this.textObject && (this.textObject.color = this.colour);
};
Entry.EntityObject.prototype.getColour = function() {
  return this.colour;
};
Entry.EntityObject.prototype.setBGColour = function(a) {
  a || (a = "transparent");
  this.bgColor = a;
  this.updateBG();
};
Entry.EntityObject.prototype.getBGColour = function() {
  return this.bgColor;
};
Entry.EntityObject.prototype.setUnderLine = function(a) {
  void 0 === a && (a = !1);
  this.underLine = a;
  this.textObject.underLine = a;
};
Entry.EntityObject.prototype.getUnderLine = function() {
  return this.underLine;
};
Entry.EntityObject.prototype.setStrike = function(a) {
  void 0 === a && (a = !1);
  this.strike = a;
  this.textObject.strike = a;
};
Entry.EntityObject.prototype.getStrike = function() {
  return this.strike;
};
Entry.EntityObject.prototype.getFont = function() {
  var a = [];
  this.fontBold && a.push("bold");
  this.fontItalic && a.push("italic");
  a.push(this.getFontSize() + "px");
  a.push(this.fontType);
  return a.join(" ");
};
Entry.EntityObject.prototype.setFont = function(a) {
  if ("textBox" == this.parent.objectType && this.font !== a) {
    a || (a = "20px Nanum Gothic");
    var b = a.split(" "), c = 0;
    if (c = -1 < b.indexOf("bold")) {
      b.splice(c - 1, 1), this.setFontBold(!0);
    }
    if (c = -1 < b.indexOf("italic")) {
      b.splice(c - 1, 1), this.setFontItalic(!0);
    }
    c = parseInt(b.shift());
    this.setFontSize(c);
    this.setFontType(b.join(" "));
    this.font = this.getFont();
    this.textObject.font = a;
    Entry.stage.update();
    this.setWidth(this.textObject.getMeasuredWidth());
    this.updateBG();
    Entry.stage.updateObject();
  }
};
Entry.EntityObject.prototype.syncFont = function() {
  this.textObject.font = this.getFont();
  Entry.stage.update();
  this.getLineBreak() || this.setWidth(this.textObject.getMeasuredWidth());
  Entry.stage.updateObject();
};
Entry.EntityObject.prototype.getFontType = function() {
  return this.fontType;
};
Entry.EntityObject.prototype.setFontType = function(a) {
  "textBox" == this.parent.objectType && (this.fontType = a ? a : "Nanum Gothic", this.syncFont());
};
Entry.EntityObject.prototype.getFontSize = function(a) {
  return this.fontSize;
};
Entry.EntityObject.prototype.setFontSize = function(a) {
  "textBox" == this.parent.objectType && this.fontSize != a && (this.fontSize = a ? a : 20, this.syncFont(), this.alignTextBox());
};
Entry.EntityObject.prototype.setFontBold = function(a) {
  this.fontBold = a;
};
Entry.EntityObject.prototype.toggleFontBold = function() {
  this.fontBold = !this.fontBold;
  this.syncFont();
  return this.fontBold;
};
Entry.EntityObject.prototype.setFontItalic = function(a) {
  this.fontItalic = a;
};
Entry.EntityObject.prototype.toggleFontItalic = function() {
  this.fontItalic = !this.fontItalic;
  this.syncFont();
  return this.fontItalic;
};
Entry.EntityObject.prototype.setFontName = function(a) {
  for (var b = this.font.split(" "), c = [], d = 0, e = b.length;d < e;d++) {
    ("bold" === b[d] || "italic" === b[d] || -1 < b[d].indexOf("px")) && c.push(b[d]);
  }
  this.setFont(c.join(" ") + " " + a);
};
Entry.EntityObject.prototype.getFontName = function() {
  if ("textBox" == this.type) {
    if (!this.font) {
      return "";
    }
    for (var a = this.font.split(" "), b = [], c = 0, d = a.length;c < d;c++) {
      "bold" !== a[c] && "italic" !== a[c] && -1 === a[c].indexOf("px") && b.push(a[c]);
    }
    return b.join(" ").trim();
  }
};
Entry.EntityObject.prototype.setText = function(a) {
  "textBox" == this.parent.objectType && (null == a && (a = ""), this.text = a, this.textObject.text = this.text, this.lineBreak || (this.setWidth(this.textObject.getMeasuredWidth()), this.parent.updateCoordinateView()), this.updateBG(), Entry.stage.updateObject());
};
Entry.EntityObject.prototype.getText = function() {
  return this.text;
};
Entry.EntityObject.prototype.setTextAlign = function(a) {
  "textBox" == this.parent.objectType && (null == a && (a = Entry.TEXT_ALIGN_CENTER), this.textAlign = a, this.textObject.textAlign = Entry.TEXT_ALIGNS[this.textAlign], this.alignTextBox(), this.updateBG(), Entry.stage.updateObject());
};
Entry.EntityObject.prototype.getTextAlign = function() {
  return this.textAlign;
};
Entry.EntityObject.prototype.setLineBreak = function(a) {
  if ("textBox" == this.parent.objectType) {
    null == a && (a = !1);
    var b = this.lineBreak;
    this.lineBreak = a;
    b && !this.lineBreak ? (this.textObject.lineWidth = null, this.setHeight(this.textObject.getMeasuredLineHeight()), this.setText(this.getText().replace(/\n/g, ""))) : !b && this.lineBreak && (this.setFontSize(this.getFontSize() * this.getScaleX()), this.setHeight(3 * this.textObject.getMeasuredLineHeight()), this.setWidth(this.getWidth() * this.getScaleX()), this.setScaleX(1), this.setScaleY(1), this.textObject.lineWidth = this.getWidth(), this.alignTextBox());
    Entry.stage.updateObject();
  }
};
Entry.EntityObject.prototype.getLineBreak = function() {
  return this.lineBreak;
};
Entry.EntityObject.prototype.setVisible = function(a) {
  null == a && (a = !0);
  this.visible = a;
  this.object.visible = this.visible;
  this.dialog && this.syncDialogVisible();
  return this.visible;
};
Entry.EntityObject.prototype.getVisible = function() {
  return this.visible;
};
Entry.EntityObject.prototype.setImage = function(a) {
  delete a._id;
  Entry.assert("sprite" == this.type, "Set image is only for sprite object");
  a.id || (a.id = Entry.generateHash());
  this.picture = a;
  var b = this.picture.dimension, c = this.getRegX() - this.getWidth() / 2, d = this.getRegY() - this.getHeight() / 2;
  this.setWidth(b.width);
  this.setHeight(b.height);
  b.scaleX || (b.scaleX = this.getScaleX(), b.scaleY = this.getScaleY());
  this.setScaleX(this.scaleX);
  this.setScaleY(this.scaleY);
  this.setRegX(this.width / 2 + c);
  this.setRegY(this.height / 2 + d);
  var e = Entry.container.getCachedPicture(a.id);
  if (e) {
    Entry.image = e, this.object.image = e, this.object.cache(0, 0, this.getWidth(), this.getHeight());
  } else {
    e = new Image;
    b = a.filename;
    e.src = "/uploads/" + b.substring(0, 2) + "/" + b.substring(2, 4) + "/image/" + b + ".png";
    var f = this;
    e.onload = function(b) {
      Entry.container.cachePicture(a.id, e);
      Entry.image = e;
      f.object.image = e;
      f.object.cache(0, 0, f.getWidth(), f.getHeight());
      f = null;
    };
  }
  Entry.dispatchEvent("updateObject");
};
Entry.EntityObject.prototype.applyFilter = function() {
  var a = this.object, b = this.effect, c = [], d = Entry.adjustValueWithMaxMin;
  b.hue = b.hue.mod(360);
  var e = new createjs.ColorMatrix;
  e.adjustColor(0, 0, 0, b.hue);
  e = new createjs.ColorMatrixFilter(e);
  c.push(e);
  b.brightness = b.brightness;
  e = new createjs.ColorMatrix;
  e.adjustColor(d(b.brightness, -100, 100), 0, 0, 0);
  e = new createjs.ColorMatrixFilter(e);
  c.push(e);
  a.alpha = b.alpha = d(b.alpha, 0, 1);
  a.filters = c;
  a.cache(0, 0, this.getWidth(), this.getHeight());
};
Entry.EntityObject.prototype.resetFilter = function() {
  "sprite" == this.parent.objectType && (this.object.filters = [], this.setInitialEffectValue(), this.object.alpha = this.effect.alpha, this.object.cache(0, 0, this.getWidth(), this.getHeight()));
};
Entry.EntityObject.prototype.updateDialog = function() {
  this.dialog && this.dialog.update();
};
Entry.EntityObject.prototype.takeSnapshot = function() {
  this.snapshot_ = this.toJSON();
};
Entry.EntityObject.prototype.loadSnapshot = function() {
  this.snapshot_ && this.syncModel_(this.snapshot_);
  "sprite" == this.parent.objectType && this.setImage(this.parent.getPicture());
};
Entry.EntityObject.prototype.removeClone = function() {
  if (this.isClone) {
    this.dialog && this.dialog.remove();
    this.brush && this.removeBrush();
    Entry.stage.unloadEntity(this);
    var a = this.parent.clonedEntities.indexOf(this);
    this.parent.clonedEntities.splice(a, 1);
  }
};
Entry.EntityObject.prototype.toJSON = function() {
  var a = {};
  a.x = Entry.cutDecimal(this.getX());
  a.y = Entry.cutDecimal(this.getY());
  a.regX = Entry.cutDecimal(this.getRegX());
  a.regY = Entry.cutDecimal(this.getRegY());
  a.scaleX = this.getScaleX();
  a.scaleY = this.getScaleY();
  a.rotation = Entry.cutDecimal(this.getRotation());
  a.direction = Entry.cutDecimal(this.getDirection());
  a.width = Entry.cutDecimal(this.getWidth());
  a.height = Entry.cutDecimal(this.getHeight());
  a.font = this.getFont();
  a.visible = this.getVisible();
  "textBox" == this.parent.objectType && (a.colour = this.getColour(), a.text = this.getText(), a.textAlign = this.getTextAlign(), a.lineBreak = this.getLineBreak(), a.bgColor = this.getBGColour(), a.underLine = this.getUnderLine(), a.strike = this.getStrike(), a.fontSize = this.getFontSize());
  return a;
};
Entry.EntityObject.prototype.setInitialEffectValue = function() {
  this.effect = {blur:0, hue:0, brightness:0, contrast:0, saturation:0, alpha:1};
};
Entry.EntityObject.prototype.removeBrush = function() {
  Entry.stage.selectedObjectContainer.removeChild(this.shape);
  this.shape = this.brush = null;
};
Entry.EntityObject.prototype.updateBG = function() {
  if (this.bgObject) {
    this.bgObject.graphics.clear();
    var a = this.getWidth(), b = this.getHeight();
    this.bgObject.graphics.setStrokeStyle(1).beginStroke().beginFill(this.getBGColour()).drawRect(-a / 2, -b / 2, a, b);
    if (this.getLineBreak()) {
      this.bgObject.x = 0;
    } else {
      switch(this.getTextAlign()) {
        case Entry.TEXT_ALIGN_LEFT:
          this.bgObject.x = a / 2;
          break;
        case Entry.TEXT_ALIGN_CENTER:
          this.bgObject.x = 0;
          break;
        case Entry.TEXT_ALIGN_RIGHT:
          this.bgObject.x = -a / 2;
      }
    }
  }
};
Entry.EntityObject.prototype.alignTextBox = function() {
  if ("textBox" == this.type) {
    var a = this.textObject;
    if (this.lineBreak) {
      var b = a.getMeasuredLineHeight();
      a.y = b / 2 - this.getHeight() / 2;
      switch(this.textAlign) {
        case Entry.TEXT_ALIGN_CENTER:
          a.x = 0;
          break;
        case Entry.TEXT_ALIGN_LEFT:
          a.x = -this.getWidth() / 2;
          break;
        case Entry.TEXT_ALIGN_RIGHT:
          a.x = this.getWidth() / 2;
      }
      a.maxHeight = this.getHeight();
    } else {
      a.x = 0, a.y = 0;
    }
  }
};
Entry.EntityObject.prototype.syncDialogVisible = function() {
  this.dialog && (this.dialog.object.visible = this.visible);
};
Entry.Helper = function() {
};
var p = Entry.Helper.prototype;
p.initBlockHelper = function(a) {
  this.parentView_ || (this.parentView_ = a);
};
p.blockHelperOn = function() {
  if (this.blockHelperView_) {
    return this.blockHelperOff();
  }
  var a = this;
  a.blockHelpData = EntryStatic.blockInfo;
  var b = Entry.createElement("div", "entryBlockHelperWorkspace");
  Entry.isForLecture && b.addClass("lecture");
  a.parentView_.appendChild(b);
  if (!Entry.isForLecture) {
    var c = Entry.createElement("div", "entryBlockHelperHeaderWorkspace");
    c.innerHTML = "\ube14\ub85d \uc124\uba85";
    var d = Entry.createElement("button", "entryBlockHelperDisposeWorkspace");
    d.addClass("entryBtn");
    d.bindOnClick(function() {
      a.blockHelperOff();
    });
    c.appendChild(d);
    b.appendChild(c);
  }
  c = Entry.createElement("div", "entryBlockHelperContentWorkspace");
  c.addClass("entryBlockHelperIntro");
  Entry.isForLecture && c.addClass("lecture");
  b.appendChild(c);
  a.blockHelperContent_ = c;
  a.blockHelperView_ = b;
  b = Entry.createElement("div", "entryBlockHelperBlockWorkspace");
  this.blockMenu_ = new Blockly.BlockMenu(b);
  this.blockMenu_.isViewOnly = !0;
  this.blockMenu_.isCenterAlign = !0;
  a.blockHelperContent_.appendChild(b);
  b = Entry.createElement("div", "entryBlockHelperDescriptionWorkspace");
  a.blockHelperContent_.appendChild(b);
  b.innerHTML = "\ube14\ub85d\uc744 \ud074\ub9ad\ud558\uba74 \ube14\ub85d\uc5d0 \ub300\ud55c \uc124\uba85\uc774 \ub098\ud0c0\ub0a9\ub2c8\ub2e4.";
  this.blockHelperDescription_ = b;
  this.blockChangeEvent = Blockly.bindEvent_(Blockly.mainWorkspace.getCanvas(), "blocklySelectChange", this, this.updateSelectedBlock);
  Entry.playground.blockMenu && (this.menuBlockChangeEvent = Blockly.bindEvent_(Entry.playground.blockMenu.workspace_.getCanvas(), "blocklySelectChange", this, this.updateSelectedBlock));
  this.first = !0;
};
p.blockHelperOff = function() {
  if (this.blockHelperView_ && !Entry.isForLecture) {
    var a = this;
    a.blockHelperView_.addClass("dispose");
    Blockly.unbindEvent_(this.blockChangeEvent);
    delete this.blockChangeEvent;
    Entry.playground.blockMenu && (Blockly.unbindEvent_(this.menuBlockChangeEvent), delete this.menuBlockChangeEvent);
    Entry.bindAnimationCallback(a.blockHelperView_, function(b) {
      a.parentView_.removeChild(a.blockHelperView_);
      delete a.blockHelperContent_;
      delete a.blockHelperView_;
    });
  }
};
p.updateSelectedBlock = function() {
  Blockly.selected && (this.first && (this.blockHelperContent_.removeClass("entryBlockHelperIntro"), this.first = !1), this.renderBlock(Blockly.selected.type));
};
p.renderBlock = function(a) {
  var b = this.blockHelpData[a];
  b && (b = jQuery.parseXML(b.xml), b = this.blockMenu_.show(b.childNodes), this.blockHelperDescription_.innerHTML = Lang.Helper[a], $(this.blockHelperDescription_).css({top:b + 40}));
};
Entry.HW = function() {
  this.connectTrial = 0;
  this.isFirstConnect = !0;
  if ("WebSocket" in window) {
    try {
      this.initSocket();
    } catch (a) {
      console.log("socket error:", a);
    }
  } else {
    console.log("socket not exist");
  }
  this.connected = !1;
  this.portData = {};
  this.sendQueue = {};
  this.settingQueue = {};
};
Entry.HW.TRIAL_LIMIT = 1;
p = Entry.HW.prototype;
p.initSocket = function() {
  if (this.connectTrial >= Entry.HW.TRIAL_LIMIT) {
    this.isFirstConnect || Entry.toast.alert("\uc544\ub450\uc774\ub178 \uc5f0\uacb0", "\uc544\ub450\uc774\ub178 \uc5f0\uacb0\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \uc5f0\uacb0\ud504\ub85c\uadf8\ub7a8\uc774 \ucf1c\uc838 \uc788\ub294\uc9c0, \uc5d4\ud2b8\ub9ac \uc0ac\uc774\ud2b8\uac00 \uc5ec\ub7ec\uac1c \uc5f4\ub824\uc788\uc9c0\ub294 \uc54a\uc740\uc9c0 \ud655\uc778\ud574 \uc8fc\uc138\uc694.", !1), this.isFirstConnect = !1;
  } else {
    var a = this, b = new WebSocket("ws://localhost:23518");
    this.socket = b;
    this.connected = !1;
    Entry.dispatchEvent("hwChanged");
    b.binaryType = "arraybuffer";
    this.connectTrial++;
    b.onopen = function() {
      a.initHardware();
    };
    b.onmessage = function(b) {
      a.updatePortData(b.data);
    };
    b.onclose = function() {
      a.initSocket();
    };
  }
};
p.retryConnect = function() {
  this.connectTrial = 0;
  this.initSocket();
};
p.initHardware = function() {
  this.connectTrial = 0;
  this.connected = !0;
  Entry.dispatchEvent("hwChanged");
  Entry.playground && Entry.playground.object && Entry.playground.setMenu(Entry.playground.object.objectType);
  Entry.toast.success("\uc544\ub450\uc774\ub178 \uc5f0\uacb0", "\uc544\ub450\uc774\ub178 \uc5f0\uacb0\uc5d0 \uc131\uacf5\ud558\uc600\uc2b5\ub2c8\ub2e4.", !1);
};
p.setDigitalPortValue = function(a, b) {
  this.sendQueue[a] = b;
};
p.getAnalogPortValue = function(a) {
  return this.connected ? this.portData["a" + a] : 0;
};
p.getDigitalPortValue = function(a) {
  if (!this.connected) {
    return 0;
  }
  this.setPortReadable(a);
  return this.portData.d ? Number(this.portData.d[a]) : 0;
};
p.setPortReadable = function(a) {
  this.settingQueue[a] = !0;
};
p.update = function() {
  if (this.socket && 1 == this.socket.readyState) {
    var a = [], b;
    for (b in this.settingQueue) {
      var c = this.settingQueue[b];
      c && (d = 160 + (b << 1), a.push(d));
    }
    this.settingQueue = {};
    for (b in this.sendQueue) {
      var c = this.sendQueue[b], d;
      255 == c || 0 == c ? d = 224 + (b << 1) + (255 == c ? 1 : 0) : (d = 192 + (b << 1) + (127 < c ? 1 : 0), a.push(d), d = c & 127);
      a.push(d);
    }
    this.sendQueue = {};
    b = new Uint8Array(a.length);
    for (c = 0;c < a.length;c++) {
      b[c] = a[c];
    }
    this.socket.send(b);
  }
};
p.updatePortData = function(a) {
  this.portData = JSON.parse(a);
};
p.closeConnection = function() {
  this.socket && this.socket.close();
};
p.downloadConnector = function() {
  window.open("/lib/EntryArduino/EntryArduino.zip", "_blank").focus();
};
p.downloadSource = function() {
  window.open("/lib/EntryArduino/arduino/entry.ino", "_blank").focus();
};
Entry.init = function(a, b) {
  Entry.assert("object" === typeof b, "Init option is not object");
  this.events_ = {};
  this.interfaceState = {menuWidth:264};
  this.options = b;
  this.parseOptions(b);
  "workspace" == this.type && this.isPhone() && (this.type = "phone");
  this.initialize_();
  this.view_ = a;
  this.view_.setAttribute("class", "entry");
  Entry.initFonts();
  this.createDom(a, this.type);
  this.loadInterfaceState();
  this.overridePrototype();
  this.maxCloneLimit = 302;
  this.startTime = (new Date).getTime();
  document.onkeydown = function(a) {
    Entry.dispatchEvent("keyPressed", a);
  };
  document.onkeyup = function(a) {
    Entry.dispatchEvent("keyUpped", a);
  };
  window.onresize = function(a) {
    Entry.dispatchEvent("windowResized", a);
  };
  window.onbeforeunload = this.beforeUnload;
  Entry.addEventListener("saveWorkspace", function(a) {
    Entry.addActivity("save");
  });
  "IE" != Entry.getBrowserType().substr(0, 2) || window.flashaudio ? (createjs.Sound.registerPlugins([createjs.WebAudioPlugin]), Entry.soundQueue = new createjs.LoadQueue, Entry.soundQueue.installPlugin(createjs.Sound), Entry.loadAudio_(["/media/click.mp3", "/media/click.wav", "/media/click.ogg"], "click"), Entry.loadAudio_(["/media/delete.mp3", "/media/delete.ogg", "/media/delete.wav"], "delete")) : (createjs.FlashAudioPlugin.swfPath = "/media/", createjs.Sound.registerPlugins([createjs.FlashAudioPlugin]), 
  Entry.soundQueue = new createjs.LoadQueue, Entry.soundQueue.installPlugin(createjs.Sound), Entry.loadAudio_(["/media/click.mp3", "/media/click.wav", "/media/click.ogg"], "click"), Entry.loadAudio_(["/media/delete.mp3", "/media/delete.ogg", "/media/delete.wav"], "delete"), window.flashaudio = !0);
};
Entry.loadAudio_ = function(a, b) {
  if (window.Audio && a.length) {
    for (;0 < a.length;) {
      var c = a[0];
      c.match(/\/([^.]+)./);
      Entry.soundQueue.loadFile({id:b, src:c, type:createjs.LoadQueue.SOUND});
      break;
    }
  }
};
Entry.initialize_ = function() {
  this.stage = new Entry.Stage;
  Entry.engine && Entry.engine.clearTimer();
  this.engine = new Entry.Engine;
  this.container = new Entry.Container;
  this.helper = new Entry.Helper;
  this.variableContainer = new Entry.VariableContainer;
  if ("workspace" == this.type || "phone" == this.type) {
    this.stateManager = new Entry.StateManager;
  }
  this.scene = new Entry.Scene;
  this.playground = new Entry.Playground;
  this.toast = new Entry.Toast;
  this.hw && this.hw.closeConnection();
  this.hw = new Entry.HW;
  if ("workspace" == this.type || "phone" == this.type) {
    this.reporter = new Entry.Reporter;
  }
  this.initContextMenu();
};
Entry.createDom = function(a, b) {
  if (b && "workspace" != b) {
    "minimize" == b ? (c = Entry.createElement("canvas"), c.className = "entryCanvasWorkspace", c.id = "entryCanvas", c.width = 640, c.height = 360, d = Entry.createElement("div", "entryCanvasWrapper"), d.appendChild(c), a.appendChild(d), this.canvas_ = c, this.stage.initStage(this.canvas_), d = Entry.createElement("div"), a.appendChild(d), this.engineView = d, this.engine.generateView(this.engineView, b)) : "phone" == b && (this.stateManagerView = c = Entry.createElement("div"), this.stateManager.generateView(this.stateManagerView, 
    b), d = Entry.createElement("div"), a.appendChild(d), this.engineView = d, this.engine.generateView(this.engineView, b), c = Entry.createElement("canvas"), c.addClass("entryCanvasPhone"), c.id = "entryCanvas", c.width = 640, c.height = 360, d.insertBefore(c, this.engine.footerView_), this.canvas_ = c, this.stage.initStage(this.canvas_), c = Entry.createElement("div"), a.appendChild(c), this.containerView = c, this.container.generateView(this.containerView, b), c = Entry.createElement("div"), 
    a.appendChild(c), this.playgroundView = c, this.playground.generateView(this.playgroundView, b));
  } else {
    var c = Entry.createElement("div");
    a.appendChild(c);
    this.sceneView = c;
    this.scene.generateView(this.sceneView, b);
    c = Entry.createElement("div");
    this.sceneView.appendChild(c);
    this.stateManagerView = c;
    this.stateManager.generateView(this.stateManagerView, b);
    var d = Entry.createElement("div");
    a.appendChild(d);
    this.engineView = d;
    this.engine.generateView(this.engineView, b);
    c = Entry.createElement("canvas");
    c.addClass("entryCanvasWorkspace");
    c.id = "entryCanvas";
    c.width = 640;
    c.height = 360;
    d.insertBefore(c, this.engine.addButton);
    this.canvas_ = c;
    this.stage.initStage(this.canvas_);
    c = Entry.createElement("div");
    a.appendChild(c);
    this.containerView = c;
    this.container.generateView(this.containerView, b);
    this.helper.initBlockHelper(c);
    c = Entry.createElement("div");
    a.appendChild(c);
    this.playgroundView = c;
    this.playground.generateView(this.playgroundView, b);
  }
};
Entry.start = function(a) {
  this.FPS || (this.FPS = 60);
  Entry.assert("number" == typeof this.FPS, "FPS must be number");
  Entry.engine.start(this.FPS);
};
Entry.parseOptions = function(a) {
  this.type = a.type;
  this.projectSaveable = a.projectsaveable;
  void 0 === this.projectSaveable && (this.projectSaveable = !0);
  this.objectAddable = a.objectaddable;
  void 0 === this.objectAddable && (this.objectAddable = !0);
  this.objectEditable = a.objectEditable;
  void 0 === this.objectEditable && (this.objectEditable = !0);
  this.objectEditable || (this.objectAddable = !1);
  this.objectDeletable = a.objectdeletable;
  void 0 === this.objectDeletable && (this.objectDeletable = !0);
  this.soundEditable = a.soundeditable;
  void 0 === this.soundEditable && (this.soundEditable = !0);
  this.pictureEditable = a.pictureeditable;
  void 0 === this.pictureEditable && (this.pictureEditable = !0);
  this.sceneEditable = a.sceneEditable;
  void 0 === this.sceneEditable && (this.sceneEditable = !0);
  this.functionEnable = a.functionEnable;
  void 0 === this.functionEnable && (this.functionEnable = !0);
  this.messageEnable = a.messageEnable;
  void 0 === this.messageEnable && (this.messageEnable = !0);
  this.variableEnable = a.variableEnable;
  void 0 === this.variableEnable && (this.variableEnable = !0);
  this.listEnable = a.listEnable;
  void 0 === this.listEnable && (this.listEnable = !0);
  this.hasVariableManager = a.hasvariablemanager;
  this.variableEnable || this.messageEnable || this.listEnable || this.functionEnable ? void 0 === this.hasVariableManager && (this.hasVariableManager = !0) : this.hasVariableManager = !1;
  this.isForLecture = a.isForLecture;
};
Entry.initContextMenu = function() {
  context.init({fadeSpeed:100, filter:function(a) {
  }, above:"auto", preventDoubleContext:!0, compress:!0});
};
Entry.initFonts = function(a) {
  this.fonts = [];
  this.fonts.push({name:"\ubc14\ud0d5\uccb4", family:"KoPub Batang", url:"/css/kopubbatang.css"});
  this.fonts.push({name:"\uba85\uc870\uccb4", family:"Nanum Myeongjo", url:"/css/nanummyeongjo.css"});
  this.fonts.push({name:"\uace0\ub515\uccb4", family:"Nanum Gothic", url:"/css/nanumgothic.css"});
  this.fonts.push({name:"\ud544\uae30\uccb4", family:"Nanum Pen Script", url:"/css/nanumpenscript.css"});
  this.fonts.push({name:"\ud55c\ub77c\uc0b0\uccb4", family:"Jeju Hallasan", url:"/css/jejuhallasan.css"});
  this.fonts.push({name:"\ucf54\ub529\uace0\ub515\uccb4", family:"Nanum Gothic Coding", url:"/css/nanumgothiccoding.css"});
  var b = {custom:{families:[], urls:[]}};
  for (a = 0;a < this.fonts.length;a++) {
    var c = this.fonts[a];
    b.custom.families.push(c.family);
    b.custom.urls.push(c.url);
  }
  setTimeout(function() {
    WebFont.load(b);
  }, 1E3);
};
Entry.EntryObject = function(a) {
  if (a) {
    this.id = a.id;
    this.name = a.name ? a.name : a.sprite.name;
    this.objectType = a.objectType;
    this.objectType || (this.objectType = "sprite");
    this.script = a.script ? Blockly.Xml.textToDom(a.script) : Blockly.Xml.textToDom("<xml></xml>");
    this.pictures = a.sprite.pictures;
    this.sounds = [];
    this.sounds = a.sprite.sounds;
    for (var b = 0;b < this.sounds.length;b++) {
      this.sounds[b].id || (this.sounds[b].id = Entry.generateHash()), Entry.initSound(this.sounds[b]);
    }
    this.lock = a.lock ? a.lock : !1;
    "sprite" == this.objectType && (this.selectedPicture = a.selectedPictureId ? this.getPicture(a.selectedPictureId) : this.pictures[0]);
    this.scene = Entry.scene.getSceneById(a.scene) || Entry.scene.selectedScene;
    this.setRotateMethod(a.rotateMethod);
    this.entity = new Entry.EntityObject(this);
    this.entity.injectModel(this.selectedPicture ? this.selectedPicture : null, a.entity ? a.entity : this.initEntity(a));
    this.clonedEntities = [];
    Entry.stage.loadObject(this);
    for (b in this.pictures) {
      var c = this.pictures[b];
      c.id || (c.id = Entry.generateHash());
      var d = new Image;
      a = c.filename;
      d.src = "/uploads/" + a.substring(0, 2) + "/" + a.substring(2, 4) + "/image/" + a + ".png";
      d.onload = function(a) {
        Entry.container.cachePicture(c.id, d);
      };
    }
  }
};
Entry.EntryObject.prototype.generateView = function() {
  if ("workspace" == Entry.type) {
    var a = Entry.createElement("li", this.id);
    a.addClass("entryContainerListElementWorkspace");
    a.object = this;
    a.bindOnClick(function(a) {
      Entry.container.getObject(this.id) && Entry.container.selectObject(this.id);
      Entry.container.blurAllInputs();
    });
    if ($) {
      var b = this;
      context.attach("#" + this.id, [{text:Lang.Workspace.context_rename, href:"/", action:function(a) {
        var c = b;
        a.preventDefault();
        c.setLock(!1);
        c.editObjectValues(!0);
        c.nameView_.select();
      }}, {text:Lang.Workspace.context_duplicate, href:"/", action:function(a) {
        a.preventDefault();
        Entry.container.addCloneObject(b);
      }}, {text:Lang.Workspace.context_remove, href:"/", action:function(a) {
        a.preventDefault();
        Entry.container.removeObject(b);
      }}, {text:"\ubcf5\uc0ac\ud558\uae30", href:"/", action:function(a) {
        a.preventDefault();
        Entry.container.setCopiedObject(b);
      }}, {text:"\ubd99\uc5ec\ub123\uae30", href:"/", action:function(a) {
        a.preventDefault();
        Entry.container.copiedObject ? Entry.container.addCloneObject(Entry.container.copiedObject) : Entry.toast.alert("\uacbd\uace0", "\ubd99\uc5ec\ub123\uae30 \ud560 \uc624\ube0c\uc81d\ud2b8\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.");
      }}]);
    }
    this.view_ = a;
    var c = this, a = Entry.createElement("ul");
    a.addClass("objectInfoView");
    Entry.objectEditable || a.addClass("entryHide");
    var d = Entry.createElement("li");
    d.addClass("objectInfo_visible");
    this.entity.getVisible() || d.addClass("objectInfo_unvisible");
    d.bindOnClick(function(a) {
      Entry.engine.isState("run") || (a = c.entity, a.setVisible(!a.getVisible()) ? this.removeClass("objectInfo_unvisible") : this.addClass("objectInfo_unvisible"));
    });
    var e = Entry.createElement("li");
    e.addClass("objectInfo_unlock");
    this.getLock() && e.addClass("objectInfo_lock");
    e.bindOnClick(function(a) {
      Entry.engine.isState("run") || (a = c, a.setLock(!a.getLock()) ? this.addClass("objectInfo_lock") : this.removeClass("objectInfo_lock"), a.updateInputViews(a.getLock()));
    });
    a.appendChild(d);
    a.appendChild(e);
    this.view_.appendChild(a);
    a = Entry.createElement("div");
    a.addClass("entryObjectThumbnailWorkspace");
    this.view_.appendChild(a);
    this.thumbnailView_ = a;
    a = Entry.createElement("div");
    a.addClass("entryObjectWrapperWorkspace");
    this.view_.appendChild(a);
    d = Entry.createElement("input");
    d.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    d.addClass("entryObjectNameWorkspace");
    a.appendChild(d);
    this.nameView_ = d;
    this.nameView_.entryObject = this;
    d.setAttribute("disabled", "disabled");
    this.nameView_.onblur = function() {
      this.entryObject.name = this.value;
    };
    this.nameView_.onkeyup = function() {
      "textBox" == this.entryObject.objectType && this.entryObject.entity.setText(this.value);
    };
    this.nameView_.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    };
    this.nameView_.value = this.name;
    d = Entry.createElement("div");
    d.addClass("entryObjectEditWorkspace");
    d.object = this;
    this.editView_ = d;
    this.view_.appendChild(d);
    Entry.objectEditable ? (d.bindOnClick(function(a) {
      a.stopPropagation();
      Entry.engine.isState("run") || b.editObjectValues(tog);
    }), d.blur = function(a) {
      b.editObjectComplete();
    }) : d.addClass("entryRemove");
    Entry.objectEditable && Entry.objectDeletable && (d = Entry.createElement("div"), d.addClass("entryObjectDeleteWorkspace"), d.object = this, this.deleteView_ = d, this.view_.appendChild(d), d.bindOnClick(function(a) {
      Entry.engine.isState("run") || Entry.container.removeObject(this.object);
    }));
    d = Entry.createElement("div");
    d.addClass("entryObjectSelectedImgWorkspace");
    this.selectedImgView_ = d;
    this.view_.appendChild(d);
    this.initializeSplitter(d);
    this.splitter = d;
    d = Entry.createElement("div");
    d.addClass("entryObjectInformationWorkspace");
    d.object = this;
    this.isInformationToggle = !1;
    a.appendChild(d);
    this.informationView_ = d;
    a = Entry.createElement("div");
    a.addClass("entryObjectRotationWrapperWorkspace");
    a.object = this;
    this.view_.appendChild(a);
    d = Entry.createElement("span");
    d.addClass("entryObjectCoordinateWorkspace");
    a.appendChild(d);
    e = Entry.createElement("span");
    e.addClass("entryObjectCoordinateSpanWorkspace");
    e.innerHTML = "X:";
    var f = Entry.createElement("input");
    f.addClass("entryObjectCoordinateInputWorkspace");
    f.setAttribute("disabled", "disabled");
    f.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    var h = Entry.createElement("span");
    h.addClass("entryObjectCoordinateSpanWorkspace");
    h.innerHTML = "Y:";
    var g = Entry.createElement("input");
    g.addClass("entryObjectCoordinateInputWorkspace entryObjectCoordinateInputWorkspace_right");
    g.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    g.setAttribute("disabled", "disabled");
    var k = Entry.createElement("span");
    k.addClass("entryObjectCoordinateSizeWorkspace");
    k.innerHTML = "\ud06c\uae30 :";
    var m = Entry.createElement("input");
    m.addClass("entryObjectCoordinateInputWorkspace", "entryObjectCoordinateInputWorkspace_size");
    m.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    m.setAttribute("disabled", "disabled");
    d.appendChild(e);
    d.appendChild(f);
    d.appendChild(h);
    d.appendChild(g);
    d.appendChild(k);
    d.appendChild(m);
    d.xInput_ = f;
    d.yInput_ = g;
    d.sizeInput_ = m;
    this.coordinateView_ = d;
    c = this;
    f.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    };
    f.onblur = function(a) {
      isNaN(f.value) || c.entity.setX(Number(f.value));
      c.updateCoordinateView();
      Entry.stage.updateObject();
    };
    g.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    };
    g.onblur = function(a) {
      isNaN(g.value) || c.entity.setY(Number(g.value));
      c.updateCoordinateView();
      Entry.stage.updateObject();
    };
    m.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    };
    m.onblur = function(a) {
      isNaN(m.value) || c.entity.setSize(Number(m.value));
      c.updateCoordinateView();
      Entry.stage.updateObject();
    };
    d = Entry.createElement("div");
    d.addClass("entryObjectRotateLabelWrapperWorkspace");
    this.view_.appendChild(d);
    this.rotateLabelWrapperView_ = d;
    e = Entry.createElement("span");
    e.addClass("entryObjectRotateSpanWorkspace");
    e.innerHTML = Lang.Workspace.rotation + " : ";
    var n = Entry.createElement("input");
    n.addClass("entryObjectRotateInputWorkspace");
    n.setAttribute("disabled", "disabled");
    n.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    this.rotateSpan_ = e;
    this.rotateInput_ = n;
    h = Entry.createElement("span");
    h.addClass("entryObjectDirectionSpanWorkspace");
    h.innerHTML = Lang.Workspace.direction + " : ";
    var l = Entry.createElement("input");
    l.addClass("entryObjectDirectionInputWorkspace");
    l.setAttribute("disabled", "disabled");
    l.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    this.directionInput_ = l;
    d.appendChild(e);
    d.appendChild(n);
    d.appendChild(h);
    d.appendChild(l);
    d.rotateInput_ = n;
    d.directionInput_ = l;
    c = this;
    n.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    };
    n.onblur = function(a) {
      a = n.value;
      -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da")));
      isNaN(a) || c.entity.setRotation(Number(a));
      c.updateRotationView();
      Entry.stage.updateObject();
    };
    l.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    };
    l.onblur = function(a) {
      a = l.value;
      -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da")));
      isNaN(a) || c.entity.setDirection(Number(a));
      c.updateRotationView();
      Entry.stage.updateObject();
    };
    d = Entry.createElement("div");
    d.addClass("rotationMethodWrapper");
    a.appendChild(d);
    this.rotationMethodWrapper_ = d;
    a = Entry.createElement("span");
    a.addClass("entryObjectRotateMethodLabelWorkspace");
    d.appendChild(a);
    a.innerHTML = Lang.Workspace.rotate_method + " : ";
    a = Entry.createElement("div");
    a.addClass("entryObjectRotateModeWorkspace");
    a.addClass("entryObjectRotateModeAWorkspace");
    a.object = this;
    this.rotateModeAView_ = a;
    d.appendChild(a);
    a.bindOnClick(function(a) {
      Entry.engine.isState("run") || this.object.getLock() || this.object.setRotateMethod("free");
    });
    a = Entry.createElement("div");
    a.addClass("entryObjectRotateModeWorkspace");
    a.addClass("entryObjectRotateModeBWorkspace");
    a.object = this;
    this.rotateModeBView_ = a;
    d.appendChild(a);
    a.bindOnClick(function(a) {
      Entry.engine.isState("run") || this.object.getLock() || this.object.setRotateMethod("vertical");
    });
    a = Entry.createElement("div");
    a.addClass("entryObjectRotateModeWorkspace");
    a.addClass("entryObjectRotateModeCWorkspace");
    a.object = this;
    this.rotateModeCView_ = a;
    d.appendChild(a);
    a.bindOnClick(function(a) {
      Entry.engine.isState("run") || this.object.getLock() || this.object.setRotateMethod("none");
    });
    this.updateThumbnailView();
    this.updateCoordinateView();
    this.updateRotateMethodView();
    this.updateInputViews();
    this.updateCoordinateView(!0);
    this.updateRotationView(!0);
    return this.view_;
  }
  if ("phone" == Entry.type) {
    return a = Entry.createElement("li", this.id), a.addClass("entryContainerListElementWorkspace"), a.object = this, a.bindOnClick(function(a) {
      Entry.container.getObject(this.id) && Entry.container.selectObject(this.id);
    }), $ && (b = this, context.attach("#" + this.id, [{text:Lang.Workspace.context_rename, href:"/", action:function(a) {
      a.preventDefault();
    }}, {text:Lang.Workspace.context_duplicate, href:"/", action:function(a) {
      a.preventDefault();
      Entry.container.addCloneObject(b);
    }}, {text:Lang.Workspace.context_remove, href:"/", action:function(a) {
      a.preventDefault();
      Entry.container.removeObject(b);
    }}])), this.view_ = a, a = Entry.createElement("ul"), a.addClass("objectInfoView"), d = Entry.createElement("li"), d.addClass("objectInfo_visible"), e = Entry.createElement("li"), e.addClass("objectInfo_lock"), a.appendChild(d), a.appendChild(e), this.view_.appendChild(a), a = Entry.createElement("div"), a.addClass("entryObjectThumbnailWorkspace"), this.view_.appendChild(a), this.thumbnailView_ = a, a = Entry.createElement("div"), a.addClass("entryObjectWrapperWorkspace"), this.view_.appendChild(a), 
    d = Entry.createElement("input"), d.addClass("entryObjectNameWorkspace"), a.appendChild(d), this.nameView_ = d, this.nameView_.entryObject = this, this.nameView_.onblur = function() {
      this.entryObject.name = this.value;
    }, this.nameView_.onkeyup = function() {
      "textBox" == this.entryObject.objectType && this.entryObject.entity.setText(this.value);
    }, this.nameView_.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    }, this.nameView_.value = this.name, Entry.objectEditable && Entry.objectDeletable && (d = Entry.createElement("div"), d.addClass("entryObjectDeletePhone"), d.object = this, this.deleteView_ = d, this.view_.appendChild(d), d.bindOnClick(function(a) {
      Entry.engine.isState("run") || Entry.container.removeObject(this.object);
    })), d = Entry.createElement("button"), d.addClass("entryObjectEditPhone"), d.object = this, d.bindOnClick(function(a) {
      if (a = Entry.container.getObject(this.id)) {
        Entry.container.selectObject(a.id), Entry.playground.injectObject(a);
      }
    }), this.view_.appendChild(d), d = Entry.createElement("div"), d.addClass("entryObjectInformationWorkspace"), d.object = this, this.isInformationToggle = !1, a.appendChild(d), this.informationView_ = d, d = Entry.createElement("div"), d.addClass("entryObjectRotateLabelWrapperWorkspace"), this.view_.appendChild(d), this.rotateLabelWrapperView_ = d, e = Entry.createElement("span"), e.addClass("entryObjectRotateSpanWorkspace"), e.innerHTML = Lang.Workspace.rotation + " : ", n = Entry.createElement("input"), 
    n.addClass("entryObjectRotateInputWorkspace"), this.rotateSpan_ = e, this.rotateInput_ = n, h = Entry.createElement("span"), h.addClass("entryObjectDirectionSpanWorkspace"), h.innerHTML = Lang.Workspace.direction + " : ", l = Entry.createElement("input"), l.addClass("entryObjectDirectionInputWorkspace"), this.directionInput_ = l, d.appendChild(e), d.appendChild(n), d.appendChild(h), d.appendChild(l), d.rotateInput_ = n, d.directionInput_ = l, c = this, n.onkeypress = function(a) {
      13 == a.keyCode && (a = n.value, -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da"))), isNaN(a) || c.entity.setRotation(Number(a)), c.updateRotationView(), n.blur());
    }, n.onblur = function(a) {
      c.entity.setRotation(c.entity.getRotation());
      Entry.stage.updateObject();
    }, l.onkeypress = function(a) {
      13 == a.keyCode && (a = l.value, -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da"))), isNaN(a) || c.entity.setDirection(Number(a)), c.updateRotationView(), l.blur());
    }, l.onblur = function(a) {
      c.entity.setDirection(c.entity.getDirection());
      Entry.stage.updateObject();
    }, a = Entry.createElement("div"), a.addClass("entryObjectRotationWrapperWorkspace"), a.object = this, this.view_.appendChild(a), d = Entry.createElement("span"), d.addClass("entryObjectCoordinateWorkspace"), a.appendChild(d), e = Entry.createElement("span"), e.addClass("entryObjectCoordinateSpanWorkspace"), e.innerHTML = "X:", f = Entry.createElement("input"), f.addClass("entryObjectCoordinateInputWorkspace"), h = Entry.createElement("span"), h.addClass("entryObjectCoordinateSpanWorkspace"), 
    h.innerHTML = "Y:", g = Entry.createElement("input"), g.addClass("entryObjectCoordinateInputWorkspace entryObjectCoordinateInputWorkspace_right"), k = Entry.createElement("span"), k.addClass("entryObjectCoordinateSpanWorkspace"), k.innerHTML = "\ud06c\uae30:", m = Entry.createElement("input"), m.addClass("entryObjectCoordinateInputWorkspace", "entryObjectCoordinateInputWorkspace_size"), d.appendChild(e), d.appendChild(f), d.appendChild(h), d.appendChild(g), d.appendChild(k), d.appendChild(m), 
    d.xInput_ = f, d.yInput_ = g, d.sizeInput_ = m, this.coordinateView_ = d, c = this, f.onkeypress = function(a) {
      13 == a.keyCode && (isNaN(f.value) || c.entity.setX(Number(f.value)), c.updateCoordinateView(), f.blur());
    }, f.onblur = function(a) {
      c.entity.setX(c.entity.getX());
      Entry.stage.updateObject();
    }, g.onkeypress = function(a) {
      13 == a.keyCode && (isNaN(g.value) || c.entity.setY(Number(g.value)), c.updateCoordinateView(), g.blur());
    }, g.onblur = function(a) {
      c.entity.setY(c.entity.getY());
      Entry.stage.updateObject();
    }, d = Entry.createElement("div"), d.addClass("rotationMethodWrapper"), a.appendChild(d), this.rotationMethodWrapper_ = d, a = Entry.createElement("span"), a.addClass("entryObjectRotateMethodLabelWorkspace"), d.appendChild(a), a.innerHTML = Lang.Workspace.rotate_method + " : ", a = Entry.createElement("div"), a.addClass("entryObjectRotateModeWorkspace"), a.addClass("entryObjectRotateModeAWorkspace"), a.object = this, this.rotateModeAView_ = a, d.appendChild(a), a.bindOnClick(function(a) {
      Entry.engine.isState("run") || this.object.setRotateMethod("free");
    }), a = Entry.createElement("div"), a.addClass("entryObjectRotateModeWorkspace"), a.addClass("entryObjectRotateModeBWorkspace"), a.object = this, this.rotateModeBView_ = a, d.appendChild(a), a.bindOnClick(function(a) {
      Entry.engine.isState("run") || this.object.setRotateMethod("vertical");
    }), a = Entry.createElement("div"), a.addClass("entryObjectRotateModeWorkspace"), a.addClass("entryObjectRotateModeCWorkspace"), a.object = this, this.rotateModeCView_ = a, d.appendChild(a), a.bindOnClick(function(a) {
      Entry.engine.isState("run") || this.object.setRotateMethod("none");
    }), this.updateThumbnailView(), this.updateCoordinateView(), this.updateRotateMethodView(), this.updateInputViews(), this.view_;
  }
};
Entry.EntryObject.prototype.setName = function(a) {
  Entry.assert("string" == typeof a, "object name must be string");
  this.name = a;
  this.nameView_.value = a;
};
Entry.EntryObject.prototype.setScript = function(a) {
  this.script = a;
};
Entry.EntryObject.prototype.getScriptText = function(a) {
  a = Blockly.Xml.domToText(this.script);
  a = a.replace(/\sxmlns=\"(.*?)\"/, "");
  a = a.replace(/\sclass=\"(.*?)\"/g, "");
  a = a.replace(/\sid=\"(.*?)\"/g, "");
  return a = a.replace(/\sinline=\"(.*?)\"/g, "");
};
Entry.EntryObject.prototype.initEntity = function(a) {
  var b = {};
  b.x = b.y = 0;
  b.rotation = 0;
  b.direction = 90;
  if ("sprite" == this.objectType) {
    var c = a.sprite.pictures[0].dimension;
    b.regX = c.width / 2;
    b.regY = c.height / 2;
    a = "\ubc30\uacbd" == a.sprite.category.main ? Math.max(270 / c.height, 480 / c.width) : "new" == a.sprite.category.main ? 1 : 200 / (c.width + c.height);
    b.scaleX = b.scaleY = a;
    b.width = c.width;
    b.height = c.height;
  } else {
    if ("textBox" == this.objectType) {
      if (b.regX = 25, b.regY = 12, b.scaleX = b.scaleY = 1.5, b.width = 50, b.height = 24, b.text = a.name, a.options) {
        if (c = a.options, a = "", c.bold && (a += "bold "), c.italic && (a += "italic "), b.underline = c.underline, b.strike = c.strike, b.font = a + "20px " + c.font.family, b.colour = c.colour, b.bgColor = c.background, b.lineBreak = c.lineBreak) {
          c = b.text.split("\n");
          if (1 < c.length) {
            a = c[0].length;
            for (var d = 1, e = c.length;d < e;d++) {
              c[d].length > a && (a = c[d].length);
            }
            b.width = 25 * a;
            b.height = 24 * c.length;
          } else {
            b.width = 25 * b.text.length;
          }
          b.regX = b.width / 2;
          b.regY = b.height / 2;
        }
      } else {
        b.underline = !1, b.strike = !1, b.font = "20px Nanum Gothic", b.colour = "#000000", b.bgColor = "#ffffff";
      }
    }
  }
  return b;
};
Entry.EntryObject.prototype.updateThumbnailView = function() {
  if ("sprite" == this.objectType) {
    var a = this.entity.picture.filename;
    this.thumbnailView_.style.backgroundImage = 'url("/uploads/' + a.substring(0, 2) + "/" + a.substring(2, 4) + "/thumb/" + a + '.png")';
  } else {
    "textBox" == this.objectType && (this.thumbnailView_.style.backgroundImage = "url('/img/assets/text_icon.png')");
  }
};
Entry.EntryObject.prototype.updateCoordinateView = function(a) {
  if ((this.isSelected() || a) && this.coordinateView_ && this.coordinateView_.xInput_ && this.coordinateView_.yInput_) {
    a = this.coordinateView_.xInput_.value;
    var b = this.coordinateView_.yInput_.value, c = this.coordinateView_.sizeInput_.value, d = this.entity.getX().toFixed(1), e = this.entity.getY().toFixed(1), f = this.entity.getSize().toFixed(1);
    a != d && (this.coordinateView_.xInput_.value = d);
    b != e && (this.coordinateView_.yInput_.value = e);
    c != f && (this.coordinateView_.sizeInput_.value = f);
  }
};
Entry.EntryObject.prototype.updateRotationView = function(a) {
  if (this.isSelected() && this.view_ || a) {
    a = "", "free" == this.getRotateMethod() ? (this.rotateSpan_.removeClass("entryRemove"), this.rotateInput_.removeClass("entryRemove"), a += this.entity.getRotation().toFixed(1), this.rotateInput_.value = a + "\u02da") : (this.rotateSpan_.addClass("entryRemove"), this.rotateInput_.addClass("entryRemove")), a = "" + this.entity.getDirection().toFixed(1), a += "\u02da", this.directionInput_.value = a;
  }
};
Entry.EntryObject.prototype.select = function(a) {
  console.log(this);
};
Entry.EntryObject.prototype.addPicture = function(a, b) {
  Entry.stateManager.addCommand("add sprite", this, this.removePicture, a.id);
  b || 0 == b ? (this.pictures.splice(b, 0, a), Entry.playground.injectPicture(this)) : this.pictures.push(a);
  return new Entry.State(this, this.removePicture, a.id);
};
Entry.EntryObject.prototype.removePicture = function(a) {
  if (2 > this.pictures.length) {
    return !1;
  }
  a = this.getPicture(a);
  var b = this.pictures.indexOf(a);
  Entry.stateManager.addCommand("remove sprite", this, this.addPicture, a, b);
  this.pictures.splice(b, 1);
  a === this.selectedPicture && Entry.playground.selectPicture(this.pictures[0]);
  Entry.playground.injectPicture(this);
  Entry.playground.reloadPlayground();
  return new Entry.State(this, this.addPicture, a, b);
};
Entry.EntryObject.prototype.getPicture = function(a) {
  if (!a) {
    return this.selectedPicture;
  }
  a = a.trim();
  for (var b = this.pictures, c = b.length, d = 0;d < c;d++) {
    if (b[d].id == a) {
      return b[d];
    }
  }
  for (d = 0;d < c;d++) {
    if (b[d].name == a) {
      return b[d];
    }
  }
  a = Entry.parseNumber(a);
  if ((0 != a || "boolean" != typeof a) && c >= a && 0 < a) {
    return b[a - 1];
  }
  throw Error("No picture with pictureId : " + pictureId);
};
Entry.EntryObject.prototype.setPicture = function(a) {
  for (var b in this.pictures) {
    if (a.id === this.pictures[b].id) {
      this.pictures[b] = a;
      return;
    }
  }
  throw Error("No picture with pictureId : " + pictureId);
};
Entry.EntryObject.prototype.getNextPicture = function(a) {
  for (var b = this.pictures, c = b.length, d = 0;d < c;d++) {
    if (b[d].id == a) {
      return b[d == c - 1 ? 0 : d + 1];
    }
  }
};
Entry.EntryObject.prototype.selectPicture = function(a) {
  var b = this.getPicture(a);
  if (b) {
    this.selectedPicture = b, this.entity.setImage(b), this.updateThumbnailView();
  } else {
    throw Error("No picture with pictureId : " + a);
  }
};
Entry.EntryObject.prototype.addSound = function(a, b) {
  a.id || (a.id = Entry.generateHash());
  Entry.stateManager.addCommand("add sound", this, this.removeSound, a.id);
  Entry.initSound(a, b);
  b || 0 == b ? (this.sounds.splice(b, 0, a), Entry.playground.injectSound(this)) : this.sounds.push(a);
  return new Entry.State(this, this.removeSound, a.id);
};
Entry.EntryObject.prototype.removeSound = function(a) {
  var b;
  b = this.getSound(a);
  a = this.sounds.indexOf(b);
  Entry.stateManager.addCommand("remove sound", this, this.addSound, b, a);
  this.sounds.splice(a, 1);
  Entry.playground.reloadPlayground();
  Entry.playground.injectSound(this);
  return new Entry.State(this, this.addSound, b, a);
};
Entry.EntryObject.prototype.getRotateMethod = function() {
  null == this.rotateMethod && (this.rotateMethod = "free");
  return this.rotateMethod;
};
Entry.EntryObject.prototype.setRotateMethod = function(a) {
  null == a && (a = "free");
  this.rotateMethod = a;
  this.updateRotateMethodView();
};
Entry.EntryObject.prototype.updateRotateMethodView = function() {
  var a = this.rotateMethod;
  this.rotateModeAView_ && (this.rotateModeAView_.removeClass("selected"), this.rotateModeBView_.removeClass("selected"), this.rotateModeCView_.removeClass("selected"), "free" == a ? this.rotateModeAView_.addClass("selected") : "vertical" == a ? this.rotateModeBView_.addClass("selected") : this.rotateModeCView_.addClass("selected"), this.updateRotationView());
};
Entry.EntryObject.prototype.toggleInformation = function(a) {
  this.setRotateMethod(this.getRotateMethod());
  null == a && (a = this.isInformationToggle = !this.isInformationToggle);
  a ? this.view_.addClass("informationToggle") : this.view_.removeClass("informationToggle");
};
Entry.EntryObject.prototype.addCloneEntity = function(a, b, c) {
  this.clonedEntities.length > Entry.maxCloneLimit || (a = new Entry.EntityObject(this), b ? (a.injectModel(b.picture ? b.picture : null, b.toJSON()), a.snapshot_ = b.snapshot_, b.effect && (a.effect = Entry.cloneSimpleObject(b.effect), a.applyFilter())) : (a.injectModel(this.entity.picture ? this.entity.picture : null, this.entity.toJSON(a)), a.snapshot_ = this.entity.snapshot_, this.entity.effect && (a.effect = Entry.cloneSimpleObject(this.entity.effect), a.applyFilter())), Entry.engine.raiseEventOnEntity(a, 
  [a, "when_clone_start"]), a.isClone = !0, a.isStarted = !0, this.addCloneVariables(this, a, b ? b.variables : null, b ? b.lists : null), this.clonedEntities.push(a), Entry.stage.loadEntity(a));
};
Entry.EntryObject.prototype.initializeSplitter = function(a) {
  a.onmousedown = function(a) {
    Entry.container.disableSort();
    Entry.container.splitterEnable = !0;
  };
  document.addEventListener("mousemove", function(a) {
    Entry.container.splitterEnable && Entry.resizeElement({canvasWidth:a.x || a.clientX});
  });
  document.addEventListener("mouseup", function(a) {
    Entry.container.splitterEnable = !1;
    Entry.container.enableSort();
  });
};
Entry.EntryObject.prototype.isSelected = function() {
  return this.isSelected_;
};
Entry.EntryObject.prototype.toJSON = function() {
  var a = {};
  a.id = this.id;
  a.name = this.name;
  a.script = this.getScriptText();
  "sprite" == this.objectType && (a.selectedPictureId = this.selectedPicture.id);
  a.objectType = this.objectType;
  a.rotateMethod = this.getRotateMethod();
  a.scene = this.scene.id;
  a.sprite = {pictures:Entry.getPicturesJSON(this.pictures), sounds:Entry.getSoundsJSON(this.sounds)};
  a.lock = this.lock;
  a.entity = this.entity.toJSON();
  return a;
};
Entry.EntryObject.prototype.destroy = function() {
  Entry.stage.unloadEntity(this.entity);
  this.view_ && Entry.removeElement(this.view_);
};
Entry.EntryObject.prototype.getSound = function(a) {
  a = a.trim();
  for (var b = this.sounds, c = b.length, d = 0;d < c;d++) {
    if (b[d].id == a) {
      return b[d];
    }
  }
  for (d = 0;d < c;d++) {
    if (b[d].name == a) {
      return b[d];
    }
  }
  a = Entry.parseNumber(a);
  if ((0 != a || "boolean" != typeof a) && c >= a && 0 < a) {
    return b[a - 1];
  }
  throw Error("No Sound");
};
Entry.EntryObject.prototype.addCloneVariables = function(a, b, c, d) {
  b.variables = [];
  b.lists = [];
  c || (c = Entry.findObjsByKey(Entry.variableContainer.variables_, "object_", a.id));
  d || (d = Entry.findObjsByKey(Entry.variableContainer.lists_, "object_", a.id));
  for (a = 0;a < c.length;a++) {
    b.variables.push(c[a].clone());
  }
  for (a = 0;a < d.length;a++) {
    b.lists.push(d[a].clone());
  }
};
Entry.EntryObject.prototype.getLock = function() {
  return this.lock;
};
Entry.EntryObject.prototype.setLock = function(a) {
  return this.lock = a;
};
Entry.EntryObject.prototype.updateInputViews = function(a) {
  a = a || this.getLock();
  var b = [this.nameView_, this.coordinateView_.xInput_, this.coordinateView_.yInput_, this.rotateInput_, this.directionInput_, this.editView_, this.coordinateView_.sizeInput_], c = this.editView_;
  if (a) {
    if (c.removeClass("editButtonToggle"), c.addClass("editButtonToggle_"), "disabled" != b[0].getAttribute("disabled")) {
      for (a = 0;a < b.length;a++) {
        b[a].setAttribute("disabled", "disabled"), b[a].removeClass("selectedEditingObject"), tog = !0;
      }
    }
  } else {
    c.removeClass("editButtonToggle_"), c.addClass("editButtonToggle");
  }
};
var tog = !0;
Entry.EntryObject.prototype.editObjectValues = function(a) {
  var b = [this.nameView_, this.coordinateView_.xInput_, this.coordinateView_.yInput_, this.rotateInput_, this.directionInput_, this.coordinateView_.sizeInput_];
  if (a) {
    for (a = 0;a < b.length;a++) {
      b[a].removeAttribute("disabled"), b[a].addClass("selectedEditingObject");
    }
    this.nameView_.select();
    tog = !1;
  } else {
    for (a = 0;a < b.length;a++) {
      b[a].setAttribute("disabled", "disabled"), b[a].removeClass("selectedEditingObject");
    }
    b[0].blur();
    tog = !0;
  }
};
Entry.EntryObject.prototype.addStampEntity = function(a) {
  a = new Entry.StampEntity(this, a);
  Entry.stage.loadEntity(a);
  this.clonedEntities.push(a);
  Entry.stage.sortZorder();
};
Entry.EntryObject.prototype.getClonedEntities = function() {
  var a = [];
  this.clonedEntities.map(function(b) {
    b.isStamp || a.push(b);
  });
  return a;
};
Entry.EntryObject.prototype.getStampEntities = function() {
  var a = [];
  this.clonedEntities.map(function(b) {
    b.isStamp && a.push(b);
  });
  return a;
};
Entry.Painter = function() {
  this.toolbox = {selected:"cursor"};
  this.stroke = {enabled:!1, fillColor:"#000000", lineColor:"#000000", thickness:1, fill:!0, transparent:!1, style:"line", locked:!1};
  this.file = {id:Entry.generateHash(), name:"\uc0c8\uadf8\ub9bc", modified:!1, mode:"new"};
  this.font = {name:"KoPub Batang", size:20, style:"normal"};
  this.selectArea = {};
};
Entry.Painter.prototype.initialize = function(a) {
  this.generateView(a);
  this.canvas = document.getElementById("entryPainterCanvas");
  this.canvas_ = document.getElementById("entryPainterCanvas_");
  this.stage = new createjs.Stage(this.canvas);
  this.stage.autoClear = !0;
  this.stage.enableDOMEvents(!0);
  this.stage.enableMouseOver(10);
  this.stage.mouseMoveOutside = !0;
  createjs.Touch.enable(this.stage);
  this.objectContainer = new createjs.Container;
  this.objectContainer.name = "container";
  this.stage.addChild(this.objectContainer);
  this.ctx = this.stage.canvas.getContext("2d");
  this.ctx.imageSmoothingEnabled = !1;
  this.ctx.webkitImageSmoothingEnabled = !1;
  this.ctx.mozImageSmoothingEnabled = !1;
  this.ctx.msImageSmoothingEnabled = !1;
  this.ctx.oImageSmoothingEnabled = !1;
  this.ctx_ = this.canvas_.getContext("2d");
  this.initDashedLine();
  this.initPicture();
  this.initCoordinator();
  this.initHandle();
  this.initDraw();
  var b = this;
  Entry.addEventListener("textUpdate", function() {
    var a = b.inputField.value();
    "" == a ? (b.inputField.hide(), delete b.inputField) : (b.inputField.hide(), b.drawText(a), b.selectToolbox("cursor"));
  });
  this.selectToolbox("cursor");
};
Entry.Painter.prototype.initHandle = function() {
  this._handle = new createjs.Container;
  this._handle.rect = new createjs.Shape;
  this._handle.addChild(this._handle.rect);
  var a = new createjs.Container;
  a.name = "move";
  a.width = 90;
  a.height = 90;
  a.x = 90;
  a.y = 90;
  a.rect = new createjs.Shape;
  var b = this;
  a.rect.on("mousedown", function(c) {
    "cursor" === b.toolbox.selected && (b.initCommand(), this.offset = {x:this.parent.x - this.x - c.stageX, y:this.parent.y - this.y - c.stageY}, this.parent.handleMode = "move", a.isSelectCenter = !1);
  });
  a.rect.on("pressmove", function(c) {
    "cursor" !== b.toolbox.selected || a.isSelectCenter || (b.doCommand(), this.parent.x = c.stageX + this.offset.x, this.parent.y = c.stageY + this.offset.y, b.updateImageHandle());
  });
  a.on("mouseup", function(a) {
    b.checkCommand();
  });
  a.rect.cursor = "move";
  a.addChild(a.rect);
  a.notch = new createjs.Shape;
  a.addChild(a.notch);
  a.NEHandle = this.generateCornerHandle();
  a.addChild(a.NEHandle);
  a.NWHandle = this.generateCornerHandle();
  a.addChild(a.NWHandle);
  a.SWHandle = this.generateCornerHandle();
  a.addChild(a.SWHandle);
  a.SEHandle = this.generateCornerHandle();
  a.addChild(a.SEHandle);
  a.EHandle = this.generateXHandle();
  a.addChild(a.EHandle);
  a.WHandle = this.generateXHandle();
  a.addChild(a.WHandle);
  a.NHandle = this.generateYHandle();
  a.addChild(a.NHandle);
  a.SHandle = this.generateYHandle();
  a.addChild(a.SHandle);
  a.RHandle = new createjs.Shape;
  a.RHandle.graphics.ss(2, 2, 0).beginFill("#888").s("#c1c7cd").f("#c1c7cd").dr(-2, -2, 8, 8);
  a.RHandle.on("mousedown", function(a) {
    b.initCommand();
  });
  a.RHandle.on("pressmove", function(a) {
    b.doCommand();
    var d = a.stageX - this.parent.x;
    a = a.stageY - this.parent.y;
    this.parent.rotation = 0 <= d ? Math.atan(a / d) / Math.PI * 180 + 90 : Math.atan(a / d) / Math.PI * 180 + 270;
    b.updateImageHandle();
  });
  a.RHandle.cursor = "crosshair";
  a.addChild(a.RHandle);
  a.on("mouseup", function(a) {
    b.checkCommand();
  });
  a.visible = !1;
  this.handle = a;
  this.stage.addChild(a);
  this.updateImageHandleCursor();
};
Entry.Painter.prototype.generateCornerHandle = function() {
  var a = this, b = new createjs.Shape;
  b.graphics.beginFill("#c1c7cd").ss(2, 2, 0).s("#c1c7cd").dr(-4, -4, 8, 8);
  b.on("mousedown", function(b) {
    a.initCommand();
    this.offset = {x:b.stageX - this.parent.x + this.parent.regX, y:b.stageY - this.parent.y + this.parent.regY};
  });
  b.on("pressmove", function(b) {
    a.doCommand();
    var d = Math.sqrt(Math.abs((b.stageX - this.parent.x + this.parent.regX) / this.offset.x * (b.stageY - this.parent.y + this.parent.regY) / this.offset.y));
    10 < this.parent.width * d && 10 < this.parent.height * d && (this.parent.width *= d, this.parent.height *= d, this.offset = {x:b.stageX - this.parent.x + this.parent.regX, y:b.stageY - this.parent.y + this.parent.regY});
    a.updateImageHandle();
  });
  b.on("mouseup", function(b) {
    a.checkCommand();
  });
  return b;
};
Entry.Painter.prototype.generateXHandle = function() {
  var a = this, b = new createjs.Shape;
  b.graphics.beginFill("#c1c7cd").ss(2, 2, 0).s("#c1c7cd").dr(-4, -4, 8, 8);
  b.on("mousedown", function(b) {
    a.initCommand();
    this.offset = {x:b.stageX - this.parent.x + this.parent.regX};
  });
  b.on("pressmove", function(b) {
    a.doCommand();
    var d = Math.abs((b.stageX - this.parent.x + this.parent.regX) / this.offset.x);
    10 < this.parent.width * d && (this.parent.width *= d, this.offset = {x:b.stageX - this.parent.x + this.parent.regX});
    a.updateImageHandle();
  });
  b.on("mouseup", function(b) {
    a.checkCommand();
  });
  return b;
};
Entry.Painter.prototype.generateYHandle = function() {
  var a = this, b = new createjs.Shape;
  b.graphics.beginFill("#c1c7cd").ss(2, 2, 0).s("#c1c7cd").dr(-4, -4, 8, 8);
  b.on("mousedown", function(b) {
    a.initCommand();
    this.offset = {y:b.stageY - this.parent.y + this.parent.regY};
  });
  b.on("pressmove", function(b) {
    a.doCommand();
    var d = Math.abs((b.stageY - this.parent.y + this.parent.regY) / this.offset.y);
    10 < this.parent.height * d && (this.parent.height *= d, this.offset = {y:b.stageY - this.parent.y + this.parent.regY});
    a.updateImageHandle();
  });
  b.on("mouseup", function(b) {
    a.checkCommand();
  });
  return b;
};
Entry.Painter.prototype.updateImageHandle = function() {
  if (this.handle.visible) {
    var a = this.handle, b = a.direction, c = a.width, d = a.height, e = a.regX, f = a.regY;
    a.rect.graphics.clear().f("rgba(0,0,1,0.01)").ss(2, 2, 0).s("#c1c7cd").lt(-c / 2, -d / 2).lt(0, -d / 2).lt(0, -d / 2).lt(+c / 2, -d / 2).lt(+c / 2, +d / 2).lt(-c / 2, +d / 2).cp();
    a.notch.graphics.clear().f("rgba(0,0,1,0.01)").ss(2, 2, 0).s("#c1c7cd").lt(0, -d / 2).lt(0, -d / 2 - 20).cp();
    a.NEHandle.x = +a.width / 2;
    a.NEHandle.y = -a.height / 2;
    a.NWHandle.x = -a.width / 2;
    a.NWHandle.y = -a.height / 2;
    a.SWHandle.x = -a.width / 2;
    a.SWHandle.y = +a.height / 2;
    a.SEHandle.x = +a.width / 2;
    a.SEHandle.y = +a.height / 2;
    a.EHandle.x = +a.width / 2;
    a.EHandle.y = 0;
    a.WHandle.x = -a.width / 2;
    a.WHandle.y = 0;
    a.NHandle.x = 0;
    a.NHandle.y = -a.height / 2;
    a.SHandle.x = 0;
    a.SHandle.y = +a.height / 2;
    a.RHandle.x = -2;
    a.RHandle.y = -a.height / 2 - 20 - 2;
    this.handle.visible && (c = this.selectedObject, this.selectedObject.text ? (c.width = this.selectedObject.width, c.height = this.selectedObject.height) : (c.width = c.image.width, c.height = c.image.height), c.scaleX = a.width / c.width, c.scaleY = a.height / c.height, c.x = a.x, c.y = a.y, c.regX = c.width / 2 + e / c.scaleX, c.regY = c.height / 2 + f / c.scaleY, c.rotation = a.rotation, c.direction = b, this.selectArea.x1 = a.x - a.width / 2, this.selectArea.y1 = a.y - a.height / 2, this.selectArea.x2 = 
    a.width, this.selectArea.y2 = a.height, this.objectWidthInput.value = Math.abs(c.width * c.scaleX).toFixed(0), this.objectHeightInput.value = Math.abs(c.height * c.scaleY).toFixed(0), this.objectRotateInput.value = (1 * c.rotation).toFixed(0));
    this.updateImageHandleCursor();
    this.stage.update();
  }
};
Entry.Painter.prototype.updateImageHandleCursor = function() {
  var a = this.handle;
  a.rect.cursor = "move";
  a.RHandle.cursor = "crosshair";
  for (var b = ["nwse-resize", "ns-resize", "nesw-resize", "ew-resize"], c = Math.floor((a.rotation + 22.5) % 180 / 45), d = 0;d < c;d++) {
    b.push(b.shift());
  }
  a.NHandle.cursor = b[1];
  a.NEHandle.cursor = b[2];
  a.EHandle.cursor = b[3];
  a.SEHandle.cursor = b[0];
  a.SHandle.cursor = b[1];
  a.SWHandle.cursor = b[2];
  a.WHandle.cursor = b[3];
  a.NWHandle.cursor = b[0];
};
Entry.Painter.prototype.clearCanvas = function() {
  this.clearHandle();
  this.initCommand();
  this.objectContainer.removeAllChildren();
  this.stage.update();
  this.colorLayerData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  for (var a = 0, b = this.colorLayerData.data.length;a < b;a++) {
    this.colorLayerData.data[a] = 255, this.colorLayerData.data[a + 1] = 255, this.colorLayerData.data[a + 2] = 255, this.colorLayerData.data[a + 3] = 255;
  }
  this.reloadContext();
};
Entry.Painter.prototype.newPicture = function() {
  var a = {dimension:{height:1, width:1}, filename:"_1x1", name:"\uc0c8\uadf8\ub9bc"};
  a.id = Entry.generateHash();
  Entry.playground.addPicture(a, !0);
};
Entry.Painter.prototype.initPicture = function() {
  var a = this;
  Entry.addEventListener("pictureSelected", function(b) {
    if (a.file.id !== b.id) {
      a.file.modified && confirm("\uc218\uc815\ub41c \ub0b4\uc6a9\uc744 \uc800\uc7a5\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?") && (a.file_ = JSON.parse(JSON.stringify(a.file)), a.file_save(!0), a.file.modified = !1);
      a.clearCanvas();
      var c = new Image;
      c.id = b.id ? b.id : Entry.generateHash();
      a.file.id = c.id;
      a.file.name = b.name;
      a.file.mode = "edit";
      c.src = "/uploads/" + b.filename.substring(0, 2) + "/" + b.filename.substring(2, 4) + "/image/" + b.filename + ".png";
      c.onload = function(b) {
        a.addImage(b.target);
      };
    }
  });
  Entry.addEventListener("pictureImport", function(b) {
    a.addPicture(b);
  });
  Entry.addEventListener("pictureNameChanged", function(b) {
    a.file.name = b.name;
  });
};
Entry.Painter.prototype.initDraw = function() {
  var a = this;
  this.stage.on("stagemousedown", function(b) {
    a.stagemousedown(b);
  });
  this.stage.on("stagemouseup", function(b) {
    a.stagemouseup(b);
  });
  this.stage.on("stagemousemove", function(b) {
    a.stagemousemove(b);
  });
};
Entry.Painter.prototype.selectObject = function(a, b) {
  this.selectedObject = a;
  this.handle.visible = a.visible;
  b ? (this.handle.width = this.copy.width, this.handle.height = this.copy.height, this.handle.x = this.selectArea.x1 + this.copy.width / 2, this.handle.y = this.selectArea.y1 + this.copy.height / 2) : (this.handle.width = a.scaleX * a.image.width, this.handle.height = a.scaleY * a.image.height, this.handle.x = a.x, this.handle.y = a.y, this.handle.regX = +(a.regX - a.image.width / 2) * a.scaleX, this.handle.regY = +(a.regY - a.image.height / 2) * a.scaleY);
  this.handle.rotation = a.rotation;
  this.handle.direction = 0;
  this.updateImageHandle();
};
Entry.Painter.prototype.selectTextObject = function(a) {
  this.selectedObject = a;
  var b = a.getTransformedBounds();
  this.handle.visible = a.visible;
  a.width || (this.selectedObject.width = b.width);
  a.height || (this.selectedObject.height = b.height);
  this.handle.width = a.scaleX * this.selectedObject.width;
  this.handle.height = a.scaleY * this.selectedObject.height;
  this.handle.x = a.x;
  this.handle.y = a.y;
  a.regX || (a.regX = a.width / 2);
  a.regY || (a.regY = a.height / 2);
  this.handle.regX = (a.regX - this.selectedObject.width / 2) * a.scaleX;
  this.handle.regY = (a.regY - this.selectedObject.height / 2) * a.scaleY;
  this.handle.rotation = a.rotation;
  this.handle.direction = 0;
  this.updateImageHandle();
};
Entry.Painter.prototype.updateHandle = function() {
  -1 < this.stage.getChildIndex(this._handle) && this.stage.removeChild(this._handle);
  -1 === this.stage.getChildIndex(this.handle) && this.stage.addChild(this.handle);
  var a = new createjs.Shape;
  a.graphics.clear().beginFill("#000").rect(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2);
  this.handle.rect.hitArea = a;
  this.handle.rect.graphics.clear().setStrokeStyle(1, "round").beginStroke("#000000").drawDashedRect(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2, 4);
  this.stage.update();
};
Entry.Painter.prototype.updateHandle_ = function() {
  this.stage.getChildIndex(-1 < this._handle) && this.stage.addChild(this._handle);
  this._handle.rect.graphics.clear().setStrokeStyle(1, "round").beginStroke("#cccccc").drawDashedRect(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2, 2);
  this.stage.update();
};
Entry.Painter.prototype.matchTolerance = function(a, b, c, d, e) {
  var f = this.colorLayerData.data[a], h = this.colorLayerData.data[a + 1];
  a = this.colorLayerData.data[a + 2];
  return f >= b - e / 100 * b && f <= b + e / 100 * b && h >= c - e / 100 * c && h <= c + e / 100 * c && a >= d - e / 100 * d && a <= d + e / 100 * d;
};
Entry.Painter.prototype.matchColorOnly = function(a, b, c, d) {
  return b === this.colorLayerData.data[a] && c === this.colorLayerData.data[a + 1] && d === this.colorLayerData.data[a + 2] ? !0 : !1;
};
Entry.Painter.prototype.matchColor = function(a, b, c, d, e) {
  return b === this.colorLayerData.data[a] && c === this.colorLayerData.data[a + 1] && d === this.colorLayerData.data[a + 2] && e === this.colorLayerData.data[a + 3] ? !0 : !1;
};
Entry.Painter.prototype.colorPixel = function(a, b, c, d, e) {
  e || (e = 255);
  this.stroke.transparent && (e = d = c = b = 0);
  this.colorLayerData.data[a] = b;
  this.colorLayerData.data[a + 1] = c;
  this.colorLayerData.data[a + 2] = d;
  this.colorLayerData.data[a + 3] = e;
};
Entry.Painter.prototype.pickStrokeColor = function(a) {
  var b = Math.round(a.stageX);
  a = 4 * (Math.round(a.stageY) * this.canvas.width + b);
  this.stroke.lineColor = Entry.rgb2hex(this.colorLayerData.data[a], this.colorLayerData.data[a + 1], this.colorLayerData.data[a + 2]);
  document.getElementById("entryPainterAttrCircle").style.backgroundColor = this.stroke.lineColor;
  document.getElementById("entryPainterAttrCircleInput").value = this.stroke.lineColor;
};
Entry.Painter.prototype.drawText = function(a) {
  var b = document.getElementById("entryPainterAttrFontStyle").value, c = document.getElementById("entryPainterAttrFontName").value, d = document.getElementById("entryPainterAttrFontSize").value;
  a = new createjs.Text(a, b + " " + d + 'px "' + c + '"', this.stroke.lineColor);
  a.textBaseline = "top";
  a.x = this.oldPt.x;
  a.y = this.oldPt.y;
  this.objectContainer.addChild(a);
  this.selectTextObject(a);
  this.file.modified = !0;
};
Entry.Painter.prototype.addImage = function(a) {
  var b = new createjs.Bitmap(a);
  this.objectContainer.addChild(b);
  b.x = this.stage.canvas.width / 2;
  b.y = this.stage.canvas.height / 2;
  b.regX = b.image.width / 2 | 0;
  b.regY = b.image.height / 2 | 0;
  b.name = a.id;
  b.id = a.id;
  this.selectObject(b);
  this.stage.update();
};
Entry.Painter.prototype.createBrush = function() {
  this.initCommand();
  this.brush = new createjs.Shape;
  this.objectContainer.addChild(this.brush);
  this.stage.update();
};
Entry.Painter.prototype.createEraser = function() {
  this.initCommand();
  this.eraser = new createjs.Shape;
  this.objectContainer.addChild(this.eraser);
  this.stage.update();
};
Entry.Painter.prototype.clearHandle = function() {
  this.handle.visible && (this.handle.visible = !1);
  this.coordinator.visible && (this.coordinator.visible = !1);
  this.stage.update();
};
Entry.Painter.prototype.initCommand = function() {
  var a = !1;
  this.handle.visible && (a = !0, this.handle.visible = !1);
  var b = !1;
  this.coordinator.visible && (b = !0, this.coordinator.visible = !1);
  (a || b) && this.stage.update();
  this.isCommandValid = !1;
  this.colorLayerModel = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  Entry.stateManager.addCommand("edit sprite", this, this.restorePainter, this.colorLayerModel);
  a && (this.handle.visible = !0);
  b && (this.coordinator.visible = !0);
  (a || b) && this.stage.update();
};
Entry.Painter.prototype.doCommand = function() {
  this.isCommandValid = !0;
};
Entry.Painter.prototype.checkCommand = function() {
  this.isCommandValid || Entry.dispatchEvent("cancelLastCommand");
};
Entry.Painter.prototype.restorePainter = function(a) {
  this.clearHandle();
  var b = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.putImageData(a, 0, 0);
  a = new Image;
  a.src = this.canvas.toDataURL();
  var c = this;
  a.onload = function(a) {
    a = new createjs.Bitmap(a.target);
    c.objectContainer.removeAllChildren();
    c.objectContainer.addChild(a);
  };
  return new Entry.State(this, this.restorePainter, b);
};
Entry.Painter.prototype.platten = function() {
  this.colorLayerData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  this.reloadContext();
};
Entry.Painter.prototype.fill = function() {
  if (!this.stroke.locked) {
    this.stroke.locked = !0;
    this.initCommand();
    this.doCommand();
    this.clearHandle();
    var a = this.canvas.width, b = this.canvas.height;
    this.colorLayerData = this.ctx.getImageData(0, 0, a, b);
    var c = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
    c.x = Math.round(c.x);
    c.y = Math.round(c.y);
    for (var d = 4 * (c.y * a + c.x), e = this.colorLayerData.data[d], f = this.colorLayerData.data[d + 1], h = this.colorLayerData.data[d + 2], g = this.colorLayerData.data[d + 3], k, m, c = [[c.x, c.y]], n = Entry.hex2rgb(this.stroke.lineColor);c.length;) {
      for (var d = c.pop(), l = d[0], q = d[1], d = 4 * (q * a + l);0 <= q && this.matchColor(d, e, f, h, g);) {
        --q, d -= 4 * a;
      }
      d += 4 * a;
      q += 1;
      for (m = k = !1;q < b - 1 && this.matchColor(d, e, f, h, g);) {
        q += 1, this.colorPixel(d, n.r, n.g, n.b), 0 < l && (this.matchColor(d - 4, e, f, h, g) ? k || (c.push([l - 1, q]), k = !0) : k && (k = !1)), l < a - 1 && (this.matchColor(d + 4, e, f, h, g) ? m || (c.push([l + 1, q]), m = !0) : m && (m = !1)), d += 4 * a;
      }
      if (1080 < c.length) {
        break;
      }
    }
    delete c;
    this.file.modified = !0;
    this.reloadContext();
  }
};
Entry.Painter.prototype.reloadContext = function() {
  delete this.selectedObject;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.putImageData(this.colorLayerData, 0, 0);
  var a = new Image;
  a.src = this.canvas.toDataURL();
  var b = this;
  a.onload = function(a) {
    a = new createjs.Bitmap(a.target);
    b.objectContainer.removeAllChildren();
    b.objectContainer.addChild(a);
    b.stroke.locked = !1;
  };
};
Entry.Painter.prototype.move_pen = function() {
  var a = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1, this.oldPt.y + this.stage.mouseY >> 1);
  this.brush.graphics.setStrokeStyle(this.stroke.thickness, "round").beginStroke(this.stroke.lineColor).moveTo(a.x, a.y).curveTo(this.oldPt.x, this.oldPt.y, this.oldMidPt.x, this.oldMidPt.y);
  this.oldPt.x = this.stage.mouseX;
  this.oldPt.y = this.stage.mouseY;
  this.oldMidPt.x = a.x;
  this.oldMidPt.y = a.y;
  this.file.modified = !0;
  this.stage.update();
};
Entry.Painter.prototype.move_line = function() {
  this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").moveTo(this.oldPt.x, this.oldPt.y).lineTo(this.stage.mouseX, this.stage.mouseY);
  this.file.modified = !0;
  this.stage.update();
};
Entry.Painter.prototype.move_rect = function() {
  var a = this.stage.mouseX - this.oldPt.x, b = this.stage.mouseY - this.oldPt.y;
  event.shiftKey && (b = a);
  this.stroke.fill ? 0 == this.stroke.thickness ? this.brush.graphics.clear().setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawRect(this.oldPt.x, this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawRect(this.oldPt.x, this.oldPt.y, a, b) : 0 == this.stroke.thickness ? this.brush.graphics.clear().setStrokeStyle(this.stroke.thickness, "round").drawRect(this.oldPt.x, 
  this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").drawRect(this.oldPt.x, this.oldPt.y, a, b);
  this.stage.update();
};
Entry.Painter.prototype.move_circle = function() {
  var a = this.stage.mouseX - this.oldPt.x, b = this.stage.mouseY - this.oldPt.y;
  event.shiftKey && (b = a);
  this.stroke.fill ? 0 == this.stroke.thickness ? this.brush.graphics.clear().beginStroke(this.stroke.fillColor).setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawEllipse(this.oldPt.x, this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawEllipse(this.oldPt.x, this.oldPt.y, a, b) : this.stroke.fill || (0 == this.stroke.thickness ? this.brush.graphics.clear().drawEllipse(this.oldPt.x, 
  this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").drawEllipse(this.oldPt.x, this.oldPt.y, a, b));
  this.stage.update();
};
Entry.Painter.prototype.edit_copy = function() {
  this.selectArea ? (this.clearHandle(), this.selectedObject && delete this.selectedObject, this.copyLayerData = this.ctx.getImageData(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2), this.copy = {}, this.copy.width = this.selectArea.x2, this.copy.height = this.selectArea.y2, this.canvas_.width = this.copy.width, this.canvas_.height = this.copy.height, this.ctx_.clearRect(0, 0, this.canvas_.width, this.canvas_.height), this.ctx_.putImageData(this.copyLayerData, 0, 
  0)) : alert("\ubcf5\uc0ac\ud560 \uc601\uc5ed\uc744 \uc120\ud0dd\ud558\uc138\uc694.");
};
Entry.Painter.prototype.edit_cut = function() {
  this.selectArea ? (this.clearHandle(), this.selectedObject && delete this.selectedObject, this.copyLayerData = this.ctx.getImageData(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2), this.copy = {}, this.copy.width = this.selectArea.x2, this.copy.height = this.selectArea.y2, this.canvas_.width = this.copy.width, this.canvas_.height = this.copy.height, this.ctx_.clearRect(0, 0, this.canvas_.width, this.canvas_.height), this.ctx_.putImageData(this.copyLayerData, 0, 
  0), this.ctx.clearRect(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2), this.colorLayerData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), this.reloadContext(), this.file.modified = !0) : alert("\uc790\ub97c \uc601\uc5ed\uc744 \uc120\ud0dd\ud558\uc138\uc694.");
};
Entry.Painter.prototype.edit_paste = function() {
  var a = new Image;
  a.src = this.canvas_.toDataURL();
  var b = this;
  a.onload = function(a) {
    a = new createjs.Bitmap(a.target);
    a.x = b.canvas.width / 2;
    a.y = b.canvas.height / 2;
    a.regX = b.copy.width / 2 | 0;
    a.regY = b.copy.height / 2 | 0;
    a.id = Entry.generateHash();
    b.objectContainer.addChild(a);
    b.selectObject(a, !0);
  };
  this.file.modified = !0;
};
Entry.Painter.prototype.edit_select = function() {
  this.clearHandle();
  this.selectedObject && delete this.selectedObject;
  this.copyLayerData = this.ctx.getImageData(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2);
  this.copy = {};
  this.copy.width = this.selectArea.x2;
  this.copy.height = this.selectArea.y2;
  this.canvas_.width = this.copy.width;
  this.canvas_.height = this.copy.height;
  this.ctx_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
  this.ctx_.putImageData(this.copyLayerData, 0, 0);
  this.ctx.clearRect(this.selectArea.x1, this.selectArea.y1, this.selectArea.x2, this.selectArea.y2);
  this.colorLayerData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.putImageData(this.colorLayerData, 0, 0);
  var a = new Image;
  a.src = this.canvas.toDataURL();
  var b = this;
  a.onload = function(a) {
    a = new createjs.Bitmap(a.target);
    b.objectContainer.removeAllChildren();
    b.objectContainer.addChild(a);
    a = new Image;
    a.src = b.canvas_.toDataURL();
    a.onload = function(a) {
      a = new createjs.Bitmap(a.target);
      a.x = b.selectArea.x1 + b.copy.width / 2;
      a.y = b.selectArea.y1 + b.copy.height / 2;
      a.regX = b.copy.width / 2 | 0;
      a.regY = b.copy.height / 2 | 0;
      a.id = Entry.generateHash();
      a.name = a.id;
      b.objectContainer.addChild(a);
      b.selectObject(a, !0);
    };
  };
};
Entry.Painter.prototype.move_erase = function(a) {
  a = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1, this.oldPt.y + this.stage.mouseY >> 1);
  this.eraser.graphics.setStrokeStyle(this.stroke.thickness, "round").beginStroke("#ffffff").moveTo(a.x, a.y).curveTo(this.oldPt.x, this.oldPt.y, this.oldMidPt.x, this.oldMidPt.y);
  this.oldPt.x = this.stage.mouseX;
  this.oldPt.y = this.stage.mouseY;
  this.oldMidPt.x = a.x;
  this.oldMidPt.y = a.y;
  this.file.modified = !0;
  this.stage.update();
};
Entry.Painter.prototype.settingShapeBlur = function() {
  this.objectWidthInput.blur();
  this.objectHeightInput.blur();
  this.objectRotateInput.blur();
};
Entry.Painter.prototype.stagemousedown = function(a) {
  "picture" == Entry.playground.getViewMode() && (this.settingShapeBlur(), this.oldPt = new createjs.Point(a.stageX, a.stageY), this.oldMidPt = this.oldPt.clone(), "select" === this.toolbox.selected ? this.stage.addChild(this._handle) : "spoid" === this.toolbox.selected ? this.pickStrokeColor(a) : "text" === this.toolbox.selected ? (this.showInputField(a), this.stage.update()) : "erase" === this.toolbox.selected ? (this.createEraser(), this.stroke.enabled = !0) : "fill" === this.toolbox.selected ? 
  this.fill() : "cursor" !== this.toolbox.selected && (this.createBrush(), this.stroke.enabled = !0));
};
Entry.Painter.prototype.stagemousemove = function(a) {
  "picture" == Entry.playground.getViewMode() && ("select" === this.toolbox.selected && -1 < this.stage.getChildIndex(this._handle) ? (this.selectArea.x1 = this.oldPt.x, this.selectArea.y1 = this.oldPt.y, this.selectArea.x2 = a.stageX - this.oldPt.x, this.selectArea.y2 = a.stageY - this.oldPt.y, this.updateHandle_()) : this.stroke.enabled && (this.doCommand(), "pen" === this.toolbox.selected ? this.move_pen(a) : "line" === this.toolbox.selected ? this.move_line(a) : "rect" === this.toolbox.selected ? 
  this.move_rect(a) : "circle" === this.toolbox.selected ? this.move_circle(a) : "erase" === this.toolbox.selected && this.move_erase(a)), this.painterTopStageXY.innerHTML = "x:" + a.stageX.toFixed(1) + ", y:" + a.stageY.toFixed(1));
};
Entry.Painter.prototype.stagemouseup = function(a) {
  "picture" == Entry.playground.getViewMode() && ("select" === this.toolbox.selected ? (this.selectArea.x1 = this.oldPt.x, this.selectArea.y1 = this.oldPt.y, this.selectArea.x2 = a.stageX - this.oldPt.x, this.selectArea.y2 = a.stageY - this.oldPt.y, this.stage.removeChild(this._handle), this.stage.update(), 0 < this.selectArea.x2 && 0 < this.selectArea.y2 && this.edit_select(), this.selectToolbox("cursor")) : "cursor" !== this.toolbox.selected && this.stroke.enabled && (-1 < this.objectContainer.getChildIndex(this.eraser) && 
  this.eraser.graphics.endStroke(), -1 < this.objectContainer.getChildIndex(this.brush) && this.brush.graphics.endStroke(), this.clearHandle(), this.platten(), this.stroke.enabled = !1, this.checkCommand()));
};
Entry.Painter.prototype.file_save = function(a) {
  this.clearHandle();
  this.transparent();
  this.trim();
  var b = this.canvas_.toDataURL();
  Entry.dispatchEvent("saveCanvasImage", {file:a ? this.file_ : this.file, image:b});
  this.file.modified = !1;
};
Entry.Painter.prototype.transparent = function() {
  var a = this.canvas.width, b = this.canvas.height;
  this.colorLayerData = this.ctx.getImageData(0, 0, a, b);
  var c = a * (b - 1) * 4, d = 4 * (a - 1), e = 4 * (a * b - 1);
  this.matchColorOnly(0, 255, 255, 255) ? this.fillTransparent(1, 1) : this.matchColorOnly(c, 255, 255, 255) ? this.fillTransparent(1, b) : this.matchColorOnly(d, 255, 255, 255) ? this.fillTransparent(a, 1) : this.matchColorOnly(e, 255, 255, 255) && this.fillTransparent(a, b);
};
Entry.Painter.prototype.fillTransparent = function(a, b) {
  this.stage.mouseX = a;
  this.stage.mouseY = b;
  this.stroke.transparent = !0;
  this.fill();
};
Entry.Painter.prototype.trim = function() {
  var a = this.canvas.width, b = this.ctx.getImageData(0, 0, a, this.canvas.height), c = b.data.length, d, e = null, f = null, h = null, g = null, k;
  for (d = 0;d < c;d += 4) {
    0 !== b.data[d + 3] && (h = d / 4 % a, k = ~~(d / 4 / a), null === e && (e = k), null === f ? f = h : h < f && (f = h), null === g ? g = k : g < k && (g = k));
  }
  a = g - e;
  b = h - f;
  c = null;
  0 === a || 0 === b ? (c = this.ctx.getImageData(0, 0, 1, 1), c.data[0] = 255, c.data[1] = 255, c.data[2] = 255, c.data[3] = 255, this.canvas_.width = 1, this.canvas_.height = 1) : (c = this.ctx.getImageData(f, e, b, a), this.canvas_.width = b, this.canvas_.height = a);
  this.ctx_.putImageData(c, 0, 0);
};
Entry.Painter.prototype.showInputField = function(a) {
  this.inputField ? (Entry.dispatchEvent("textUpdate"), delete this.inputField) : (this.initCommand(), this.doCommand(), this.inputField = new CanvasInput({canvas:document.getElementById("entryPainterCanvas"), fontSize:20, fontFamily:this.font.name, fontColor:"#000", width:650, padding:8, borderWidth:1, borderColor:"#000", borderRadius:3, boxShadow:"1px 1px 0px #fff", innerShadow:"0px 0px 5px rgba(0, 0, 0, 0.5)", x:a.stageX, y:a.stageY, onsubmit:function() {
    Entry.dispatchEvent("textUpdate");
  }}), this.inputField.show());
};
Entry.Painter.prototype.addPicture = function(a) {
  this.initCommand();
  var b = new Image;
  b.id = Entry.generateHash();
  b.src = "/uploads/" + a.filename.substring(0, 2) + "/" + a.filename.substring(2, 4) + "/image/" + a.filename + ".png";
  var c = this;
  b.onload = function(a) {
    c.addImage(a.target);
    c.selectToolbox("cursor");
  };
};
Entry.Painter.prototype.initCoordinator = function() {
  var a = new createjs.Container, b = new createjs.Bitmap("/img/assets/workspace_coordinate.png");
  a.addChild(b);
  this.stage.addChild(a);
  a.visible = !1;
  this.coordinator = a;
};
Entry.Painter.prototype.toggleCoordinator = function() {
  this.coordinator.visible = !this.coordinator.visible;
  this.stage.update();
};
Entry.Painter.prototype.initDashedLine = function() {
  createjs.Graphics.prototype.dashedLineTo = function(a, b, c, d, e) {
    this.moveTo(a, b);
    var f = c - a, h = d - b;
    e = Math.floor(Math.sqrt(f * f + h * h) / e);
    for (var f = f / e, h = h / e, g = 0;g++ < e;) {
      a += f, b += h, this[0 == g % 2 ? "moveTo" : "lineTo"](a, b);
    }
    this[0 == g % 2 ? "moveTo" : "lineTo"](c, d);
    return this;
  };
  createjs.Graphics.prototype.drawDashedRect = function(a, b, c, d, e) {
    this.moveTo(a, b);
    c = a + c;
    d = b + d;
    this.dashedLineTo(a, b, c, b, e);
    this.dashedLineTo(c, b, c, d, e);
    this.dashedLineTo(c, d, a, d, e);
    this.dashedLineTo(a, d, a, b, e);
    return this;
  };
  createjs.Graphics.prototype.drawResizableDashedRect = function(a, b, c, d, e, f) {
    this.moveTo(a, b);
    c = a + c;
    d = b + d;
    this.dashedLineTo(a + f, b, c - f, b, e);
    this.dashedLineTo(c, b + f, c, d - f, e);
    this.dashedLineTo(c - f, d, a + f, d, e);
    this.dashedLineTo(a, d - f, a, b + f, e);
    return this;
  };
};
Entry.Painter.prototype.generateView = function(a) {
  var b = this;
  this.view_ = a;
  if (!Entry.type || "workspace" == Entry.type) {
    this.view_.addClass("entryPainterWorkspace");
    var c = Entry.createElement("div", "entryPainterTop");
    c.addClass("entryPlaygroundPainterTop");
    this.view_.appendChild(c);
    var d = Entry.createElement("div", "entryPainterToolbox");
    d.addClass("entryPlaygroundPainterToolbox");
    this.view_.appendChild(d);
    var e = Entry.createElement("div", "entryPainterToolboxTop");
    e.addClass("entryPainterToolboxTop");
    d.appendChild(e);
    var f = Entry.createElement("div", "entryPainterContainer");
    f.addClass("entryPlaygroundPainterContainer");
    this.view_.appendChild(f);
    e = Entry.createElement("canvas", "entryPainterCanvas");
    e.width = 960;
    e.height = 540;
    e.addClass("entryPlaygroundPainterCanvas");
    f.appendChild(e);
    e = Entry.createElement("canvas", "entryPainterCanvas_");
    e.addClass("entryRemove");
    e.width = 960;
    e.height = 540;
    f.appendChild(e);
    var h = Entry.createElement("div", "entryPainterAttr");
    h.addClass("entryPlaygroundPainterAttr");
    this.view_.appendChild(h);
    this.flipObject = Entry.createElement("div", "entryPictureFlip");
    this.flipObject.addClass("entryPlaygroundPainterFlip");
    h.appendChild(this.flipObject);
    e = Entry.createElement("div", "entryPictureFlipX");
    e.title = "\uc88c\uc6b0\ub4a4\uc9d1\uae30";
    e.bindOnClick(function() {
      b.selectedObject && (b.selectedObject.scaleX *= -1, b.selectedObject.text ? b.selectTextObject(b.selectedObject) : b.selectObject(b.selectedObject), b.updateImageHandle(), b.stage.update());
    });
    e.addClass("entryPlaygroundPainterFlipX");
    this.flipObject.appendChild(e);
    e = Entry.createElement("div", "entryPictureFlipY");
    e.title = "\uc0c1\ud558\ub4a4\uc9d1\uae30";
    e.bindOnClick(function() {
      b.selectedObject && (b.selectedObject.scaleY *= -1, b.selectedObject.text ? b.selectTextObject(b.selectedObject) : b.selectObject(b.selectedObject), b.updateImageHandle(), b.stage.update());
    });
    e.addClass("entryPlaygroundPainterFlipY");
    this.flipObject.appendChild(e);
    Entry.addEventListener("windowResized", function(b) {
      var c = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      b = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      var d = parseInt(document.getElementById("entryCanvas").style.width), c = c - (d + 240), d = b - 349;
      a.style.width = c + "px";
      f.style.width = c - 54 + "px";
      f.style.height = d + "px";
      h.style.top = d + 30 + "px";
      h.style.height = b - d + "px";
    });
    var g = Entry.createElement("nav", "entryPainterTopMenu");
    g.addClass("entryPlaygroundPainterTopMenu");
    c.appendChild(g);
    e = Entry.createElement("ul");
    g.appendChild(e);
    var k = Entry.createElement("li");
    g.appendChild(k);
    var m = Entry.createElement("a", "entryPainterTopMenuFileNew");
    m.bindOnClick(function() {
      b.newPicture();
    });
    m.addClass("entryPlaygroundPainterTopMenuFileNew");
    m.innerHTML = Lang.Workspace.new_picture;
    k.appendChild(m);
    k = Entry.createElement("li");
    g.appendChild(k);
    g = Entry.createElement("a", "entryPainterTopMenuFileSave");
    g.bindOnClick(function() {
      b.file_save();
    });
    g.addClass("entryPlaygroundPainterTopMenuFileSave");
    g.innerHTML = Lang.Workspace.file_save;
    k.appendChild(g);
    g = Entry.createElement("li", "entryPainterTopMenuEdit");
    g.addClass("entryPlaygroundPainterTopMenuEdit");
    g.innerHTML = Lang.Workspace.Painter_edit;
    e.appendChild(g);
    e = Entry.createElement("ul");
    g.appendChild(e);
    g = Entry.createElement("li");
    e.appendChild(g);
    k = Entry.createElement("a", "entryPainterTopMenuEditImportLink");
    k.bindOnClick(function() {
      Entry.dispatchEvent("openPictureImport");
    });
    k.addClass("entryPainterTopMenuEditImport");
    k.innerHTML = Lang.Workspace.get_file;
    g.appendChild(k);
    g = Entry.createElement("li");
    e.appendChild(g);
    k = Entry.createElement("a", "entryPainterTopMenuEditCopy");
    k.bindOnClick(function() {
      b.edit_copy();
    });
    k.addClass("entryPlaygroundPainterTopMenuEditCopy");
    k.innerHTML = Lang.Workspace.copy_file;
    g.appendChild(k);
    g = Entry.createElement("li");
    e.appendChild(g);
    k = Entry.createElement("a", "entryPainterTopMenuEditCut");
    k.bindOnClick(function() {
      b.edit_cut();
    });
    k.addClass("entryPlaygroundPainterTopMenuEditCut");
    k.innerHTML = Lang.Workspace.cut_picture;
    g.appendChild(k);
    g = Entry.createElement("li");
    e.appendChild(g);
    k = Entry.createElement("a", "entryPainterTopMenuEditPaste");
    k.bindOnClick(function() {
      b.edit_paste();
    });
    k.addClass("entryPlaygroundPainterTopMenuEditPaste");
    k.innerHTML = Lang.Workspace.paste_picture;
    g.appendChild(k);
    g = Entry.createElement("li");
    e.appendChild(g);
    e = Entry.createElement("a", "entryPainterTopMenuEditEraseAll");
    e.addClass("entryPlaygroundPainterTopMenuEditEraseAll");
    e.innerHTML = Lang.Workspace.remove_all;
    e.bindOnClick(function() {
      b.clearCanvas();
    });
    g.appendChild(e);
    this.painterTopStageXY = e = Entry.createElement("div", "entryPainterTopStageXY");
    e.addClass("entryPlaygroundPainterTopStageXY");
    c.appendChild(e);
    e = Entry.createElement("ul", "entryPainterTopToolbar");
    e.addClass("entryPlaygroundPainterTopToolbar");
    c.appendChild(e);
    c = Entry.createElement("li", "entryPainterTopToolbarUndo");
    c.bindOnClick(function() {
    });
    c.addClass("entryPlaygroundPainterTopToolbar");
    e.appendChild(c);
    c = Entry.createElement("li", "entryPainterTopToolbarRedo");
    c.bindOnClick(function() {
    });
    c.addClass("entryPlaygroundPainterTopToolbar");
    e.appendChild(c);
    c = Entry.createElement("ul");
    c.addClass("entryPlaygroundPainterToolboxContainer");
    d.appendChild(c);
    this.toolboxCursor = Entry.createElement("li", "entryPainterToolboxCursor");
    this.toolboxCursor.title = "\uc774\ub3d9";
    this.toolboxCursor.bindOnClick(function() {
      b.selectToolbox("cursor");
    });
    this.toolboxCursor.addClass("entryPlaygroundPainterToolboxCursor");
    c.appendChild(this.toolboxCursor);
    this.toolboxSelect = Entry.createElement("li", "entryPainterToolboxSelect");
    this.toolboxSelect.title = "\uc790\ub974\uae30";
    this.toolboxSelect.bindOnClick(function() {
      b.selectToolbox("select");
    });
    this.toolboxSelect.addClass("entryPlaygroundPainterToolboxSelect");
    c.appendChild(this.toolboxSelect);
    this.toolboxPen = Entry.createElement("li", "entryPainterToolboxPen");
    this.toolboxPen.title = "\ud39c";
    this.toolboxPen.bindOnClick(function() {
      b.selectToolbox("pen");
    });
    this.toolboxPen.addClass("entryPlaygroundPainterToolboxPen");
    c.appendChild(this.toolboxPen);
    this.toolboxLine = Entry.createElement("li", "entryPainterToolboxLine");
    this.toolboxLine.title = "\uc9c1\uc120";
    this.toolboxLine.bindOnClick(function() {
      b.selectToolbox("line");
    });
    this.toolboxLine.addClass("entryPlaygroundPainterToolboxLine");
    c.appendChild(this.toolboxLine);
    this.toolboxRect = Entry.createElement("li", "entryPainterToolboxRect");
    this.toolboxRect.title = "\uc0ac\uac01\ud615";
    this.toolboxRect.bindOnClick(function() {
      b.selectToolbox("rect");
    });
    this.toolboxRect.addClass("entryPlaygroundPainterToolboxRect");
    c.appendChild(this.toolboxRect);
    this.toolboxCircle = Entry.createElement("li", "entryPainterToolboxCircle");
    this.toolboxCircle.title = "\uc6d0";
    this.toolboxCircle.bindOnClick(function() {
      b.selectToolbox("circle");
    });
    this.toolboxCircle.addClass("entryPlaygroundPainterToolboxCircle");
    c.appendChild(this.toolboxCircle);
    this.toolboxText = Entry.createElement("li", "entryPainterToolboxText");
    this.toolboxText.title = "\uae00\uc0c1\uc790";
    this.toolboxText.bindOnClick(function() {
      b.selectToolbox("text");
    });
    this.toolboxText.addClass("entryPlaygroundPainterToolboxText");
    c.appendChild(this.toolboxText);
    this.toolboxFill = Entry.createElement("li", "entryPainterToolboxFill");
    this.toolboxFill.bindOnClick(function() {
      b.selectToolbox("fill");
    });
    this.toolboxFill.addClass("entryPlaygroundPainterToolboxFill");
    c.appendChild(this.toolboxFill);
    this.toolboxErase = Entry.createElement("li", "entryPainterToolboxErase");
    this.toolboxErase.title = "\uc9c0\uc6b0\uae30";
    this.toolboxErase.bindOnClick(function() {
      b.selectToolbox("erase");
    });
    this.toolboxErase.addClass("entryPlaygroundPainterToolboxErase");
    c.appendChild(this.toolboxErase);
    d = Entry.createElement("li", "entryPainterToolboxCoordinate");
    d.title = "\uc88c\ud45c";
    d.bindOnClick(function() {
      b.toggleCoordinator();
    });
    d.addClass("entryPlaygroundPainterToolboxCoordinate");
    c.appendChild(d);
    this.attrResizeArea = Entry.createElement("fieldset", "painterAttrResize");
    this.attrResizeArea.addClass("entryPlaygroundPainterAttrResize");
    h.appendChild(this.attrResizeArea);
    d = Entry.createElement("legend");
    d.innerHTML = Lang.Workspace.picture_size;
    this.attrResizeArea.appendChild(d);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPainterAttrResizeX");
    this.attrResizeArea.appendChild(d);
    c = Entry.createElement("div");
    c.addClass("entryPlaygroundPainterAttrResizeXTop");
    c.innerHTML = "X";
    d.appendChild(c);
    this.objectWidthInput = Entry.createElement("input", "entryPainterAttrWidth");
    this.objectWidthInput.onblur = function() {
      if (isNaN(this.value)) {
        return alert("\uc22b\uc790\ub9cc \uc785\ub825 \uac00\ub2a5\ud569\ub2c8\ub2e4."), !1;
      }
      b.handle.width = this.value;
      b.updateImageHandle();
    };
    this.objectWidthInput.addClass("entryPlaygroundPainterNumberInput");
    d.appendChild(this.objectWidthInput);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPainterSizeText");
    d.innerHTML = "x";
    this.attrResizeArea.appendChild(d);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundAttrReiszeY");
    this.attrResizeArea.appendChild(d);
    c = Entry.createElement("div");
    c.addClass("entryPlaygroundPainterAttrResizeYTop");
    c.innerHTML = "Y";
    d.appendChild(c);
    this.objectHeightInput = Entry.createElement("input", "entryPainterAttrHeight");
    this.objectHeightInput.onblur = function() {
      if (isNaN(this.value)) {
        return alert("\uc22b\uc790\ub9cc \uc785\ub825 \uac00\ub2a5\ud569\ub2c8\ub2e4."), !1;
      }
      b.handle.height = this.value;
      b.updateImageHandle();
    };
    this.objectHeightInput.addClass("entryPlaygroundPainterNumberInput");
    d.appendChild(this.objectHeightInput);
    this.attrRotateArea = Entry.createElement("div", "painterAttrRotateArea");
    this.attrRotateArea.addClass("painterAttrRotateArea");
    h.appendChild(this.attrRotateArea);
    d = Entry.createElement("fieldset", "entryPainterAttrRotate");
    d.addClass("entryPlaygroundPainterAttrRotate");
    this.attrRotateArea.appendChild(d);
    c = Entry.createElement("div");
    c.addClass("painterAttrRotateName");
    c.innerHTML = Lang.Workspace.picture_rotation;
    this.attrRotateArea.appendChild(c);
    c = Entry.createElement("div");
    c.addClass("painterAttrRotateTop");
    c.innerHTML = "\u03bf";
    d.appendChild(c);
    this.objectRotateInput = Entry.createElement("input", "entryPainterAttrDegree");
    this.objectRotateInput.onblur = function() {
      if (isNaN(this.value)) {
        return alert("\uc22b\uc790\ub9cc \uc785\ub825 \uac00\ub2a5\ud569\ub2c8\ub2e4."), !1;
      }
      360 <= this.value ? this.value %= 360 : 0 > this.value && (this.value = 360 + this.value % 360);
      b.handle.rotation = this.value;
      b.updateImageHandle();
    };
    this.objectRotateInput.addClass("entryPlaygroundPainterNumberInput");
    this.objectRotateInput.defaultValue = "0";
    d.appendChild(this.objectRotateInput);
    this.attrColorArea = Entry.createElement("fieldset", "entryPainterAttrColor");
    this.attrColorArea.addClass("entryPlaygroundPainterAttrColor");
    h.appendChild(this.attrColorArea);
    var n = Entry.createElement("div");
    n.addClass("entryPlaygroundPainterAttrColorContainer");
    this.attrColorArea.appendChild(n);
    this.attrCircleArea = Entry.createElement("div");
    this.attrCircleArea.addClass("painterAttrCircleArea");
    h.appendChild(this.attrCircleArea);
    d = Entry.createElement("div", "entryPainterAttrCircle");
    d.addClass("painterAttrCircle");
    this.attrCircleArea.appendChild(d);
    this.attrCircleArea.painterAttrCircle = d;
    d = Entry.createElement("input", "entryPainterAttrCircleInput");
    d.value = "#000000";
    d.addClass("painterAttrCircleInput");
    this.attrCircleArea.appendChild(d);
    this.attrColorSpoid = Entry.createElement("div");
    this.attrColorSpoid.bindOnClick(function() {
      b.selectToolbox("spoid");
    });
    this.attrColorSpoid.addClass("painterAttrColorSpoid");
    h.appendChild(this.attrColorSpoid);
    Entry.getColourCodes().forEach(function(a) {
      var c = Entry.createElement("div");
      c.addClass("entryPlaygroundPainterAttrColorElement");
      "transparent" === a ? c.style.backgroundImage = "url('/img/assets/transparent.png')" : c.style.backgroundColor = a;
      c.bindOnClick(function(c) {
        "transparent" === a ? (b.stroke.transparent = !0, b.stroke.lineColor = "#ffffff") : (b.stroke.transparent = !1, t && (document.getElementById("entryPainterShapeBackgroundColor").style.backgroundColor = a, b.stroke.fillColor = a), t || (document.getElementById("entryPainterShapeLineColor").style.backgroundColor = a, b.stroke.lineColor = a));
        document.getElementById("entryPainterAttrCircle").style.backgroundColor = b.stroke.lineColor;
        document.getElementById("entryPainterAttrCircleInput").value = a;
      });
      n.appendChild(c);
    });
    this.attrThickArea = Entry.createElement("div", "painterAttrThickArea");
    this.attrThickArea.addClass("entryPlaygroundentryPlaygroundPainterAttrThickArea");
    h.appendChild(this.attrThickArea);
    d = Entry.createElement("legend");
    d.addClass("painterAttrThickName");
    d.innerHTML = Lang.Workspace.thickness;
    this.attrThickArea.appendChild(d);
    var l = Entry.createElement("fieldset", "entryPainterAttrThick");
    l.addClass("entryPlaygroundPainterAttrThick");
    this.attrThickArea.appendChild(l);
    d = Entry.createElement("div");
    d.addClass("paintAttrThickTop");
    l.appendChild(d);
    e = Entry.createElement("select", "entryPainterAttrThick");
    e.addClass("entryPlaygroundPainterAttrThickInput");
    e.size = "1";
    e.onchange = function(a) {
      b.stroke.thickness = a.target.value;
    };
    for (d = 1;10 >= d;d++) {
      c = Entry.createElement("option"), c.value = d, c.innerHTML = d, e.appendChild(c);
    }
    l.appendChild(e);
    d = Entry.createElement("div", "entryPainterShapeLineColor");
    d.addClass("painterAttrShapeLineColor");
    c = Entry.createElement("div", "entryPainterShapeInnerBackground");
    c.addClass("painterAttrShapeInnerBackground");
    d.appendChild(c);
    l.appendChild(d);
    this.attrThickArea.painterAttrShapeLineColor = d;
    l.bindOnClick(function() {
      q.style.zIndex = "1";
      this.style.zIndex = "10";
      t = !1;
    });
    this.attrBackgroundArea = Entry.createElement("div", "painterAttrBackgroundArea");
    this.attrBackgroundArea.addClass("entryPlaygroundPainterBackgroundArea");
    h.appendChild(this.attrBackgroundArea);
    d = Entry.createElement("fieldset", "entryPainterAttrbackground");
    d.addClass("entryPlaygroundPainterAttrBackground");
    this.attrBackgroundArea.appendChild(d);
    c = Entry.createElement("div");
    c.addClass("paintAttrBackgroundTop");
    d.appendChild(c);
    var q = Entry.createElement("div", "entryPainterShapeBackgroundColor");
    q.addClass("painterAttrShapeBackgroundColor");
    this.attrBackgroundArea.painterAttrShapeBackgroundColor = q;
    c.appendChild(q);
    var t = !1;
    q.bindOnClick(function(a) {
      l.style.zIndex = "1";
      this.style.zIndex = "10";
      this.style.zIndex = new String("10");
      t = !0;
    });
    this.attrFontArea = Entry.createElement("div", "painterAttrFont");
    this.attrFontArea.addClass("entryPlaygroundPainterAttrFont");
    h.appendChild(this.attrFontArea);
    e = Entry.createElement("div");
    e.addClass("entryPlaygroundPainterAttrTop");
    this.attrFontArea.appendChild(e);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPaintAttrTop_");
    e.appendChild(d);
    d = Entry.createElement("legend");
    d.addClass("panterAttrFontTitle");
    d.innerHTML = Lang.Workspace.textStyle;
    g = Entry.createElement("select", "entryPainterAttrFontName");
    g.addClass("entryPlaygroundPainterAttrFontName");
    g.size = "1";
    g.onchange = function(a) {
      b.font.name = a.target.value;
    };
    for (d = 0;d < Entry.fonts.length;d++) {
      k = Entry.fonts[d], c = Entry.createElement("option"), c.value = k.family, c.innerHTML = k.name, g.appendChild(c);
    }
    e.appendChild(g);
    e = Entry.createElement("div");
    e.addClass("painterAttrFontSizeArea");
    this.attrFontArea.appendChild(e);
    d = Entry.createElement("div");
    d.addClass("painterAttrFontSizeTop");
    e.appendChild(d);
    g = Entry.createElement("select", "entryPainterAttrFontSize");
    g.addClass("entryPlaygroundPainterAttrFontSize");
    g.size = "1";
    g.onchange = function(a) {
      b.font.size = a.target.value;
    };
    for (d = 20;72 >= d;d++) {
      c = Entry.createElement("option"), c.value = d, c.innerHTML = d, g.appendChild(c);
    }
    e.appendChild(g);
    e = Entry.createElement("div");
    e.addClass("entryPlaygroundPainterAttrFontStyleArea");
    this.attrFontArea.appendChild(e);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPainterAttrFontTop");
    e.appendChild(d);
    g = Entry.createElement("select", "entryPainterAttrFontStyle");
    g.addClass("entryPlaygroundPainterAttrFontStyle");
    g.size = "1";
    g.onchange = function(a) {
      b.font.style = a.target.value;
    };
    k = [{label:"\ubcf4\ud1b5", value:"normal"}, {label:"\uad75\uac8c", value:"bold"}, {label:"\uae30\uc6b8\uc784", value:"italic"}];
    for (d = 0;d < k.length;d++) {
      m = k[d], c = Entry.createElement("option"), c.value = m.value, c.innerHTML = m.label, g.appendChild(c);
    }
    e.appendChild(g);
    this.attrLineArea = Entry.createElement("div", "painterAttrLineStyle");
    this.attrLineArea.addClass("entryPlaygroundPainterAttrLineStyle");
    h.appendChild(this.attrLineArea);
    var u = Entry.createElement("div");
    u.addClass("entryPlaygroundPainterAttrLineStyleLine");
    this.attrLineArea.appendChild(u);
    var r = Entry.createElement("div");
    r.addClass("entryPlaygroundPaitnerAttrLineArea");
    this.attrLineArea.appendChild(r);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPainterAttrLineStyleLine1");
    r.appendChild(d);
    d.value = "line";
    var v = Entry.createElement("div");
    v.addClass("painterAttrLineStyleBackgroundLine");
    u.bindOnClick(function(a) {
      r.removeClass("entryRemove");
    });
    r.blur = function(a) {
      this.addClass("entryRemove");
    };
    r.onmouseleave = function(a) {
      this.addClass("entryRemove");
    };
    d.bindOnClick(function(a) {
      this.attrLineArea.removeClass(u);
      this.attrLineArea.appendChild(v);
      this.attrLineArea.onchange(a);
      r.blur();
    });
    v.bindOnClick(function(a) {
      r.removeClass("entryRemove");
    });
    this.attrLineArea.onchange = function(a) {
      b.stroke.style = a.target.value;
    };
    r.blur();
  }
};
Entry.Painter.prototype.restoreHandle = function() {
  this.selectedObject && !1 === this.handle.visible && (this.handle.visible = !0, this.stage.update());
};
Entry.Painter.prototype.initDisplay = function() {
  this.stroke.enabled = !1;
  this.toolboxCursor.addClass("entryPlaygroundPainterToolboxCursor");
  this.toolboxCursor.removeClass("entryToolboxCursorClicked");
  this.toolboxSelect.addClass("entryPlaygroundPainterToolboxSelect");
  this.toolboxSelect.removeClass("entryToolboxSelectClicked");
  this.toolboxPen.addClass("entryPlaygroundPainterToolboxPen");
  this.toolboxPen.removeClass("entryToolboxPenClicked");
  this.toolboxLine.addClass("entryPlaygroundPainterToolboxLine");
  this.toolboxLine.removeClass("entryToolboxLineClicked");
  this.toolboxRect.addClass("entryPlaygroundPainterToolboxRect");
  this.toolboxRect.removeClass("entryToolboxRectClicked");
  this.toolboxCircle.addClass("entryPlaygroundPainterToolboxCircle");
  this.toolboxCircle.removeClass("entryToolBoxCircleClicked");
  this.toolboxText.addClass("entryPlaygroundPainterToolboxText");
  this.toolboxText.removeClass("entryToolBoxTextClicked");
  this.toolboxFill.addClass("entryPlaygroundPainterToolboxFill");
  this.toolboxFill.removeClass("entryToolBoxFillClicked");
  this.toolboxErase.addClass("entryPlaygroundPainterToolboxErase");
  this.toolboxErase.removeClass("entryToolBoxEraseClicked");
  this.attrColorSpoid.addClass("painterAttrColorSpoid");
  this.attrColorSpoid.removeClass("painterAttrColorSpoidClicked");
  this.attrResizeArea.addClass("entryRemove");
  this.attrRotateArea.addClass("entryRemove");
  this.attrThickArea.addClass("entryRemove");
  this.attrFontArea.addClass("entryRemove");
  this.attrLineArea.addClass("entryRemove");
  this.attrColorArea.addClass("entryRemove");
  this.attrCircleArea.addClass("entryRemove");
  this.attrColorSpoid.addClass("entryRemove");
  this.attrFontArea.addClass("entryRemove");
  this.attrBackgroundArea.addClass("entryRemove");
  this.flipObject.addClass("entryRemove");
  this.attrThickArea.painterAttrShapeLineColor.addClass("entryRemove");
  this.attrBackgroundArea.painterAttrShapeBackgroundColor.addClass("entryRemove");
  this.attrCircleArea.painterAttrCircle.addClass("entryRemove");
  this.inputField && !this.inputField._isHidden && (this.inputField.hide(), this.stage.update());
};
Entry.Painter.prototype.selectToolbox = function(a) {
  this.toolbox.selected = a;
  "erase" != a && $(".entryPlaygroundPainterContainer").removeClass("dd");
  this.initDisplay();
  "cursor" !== a && this.clearHandle();
  "text" !== a && this.inputField && delete this.inputField;
  switch(a) {
    case "cursor":
      this.restoreHandle();
      this.toolboxCursor.addClass("entryToolboxCursorClicked");
      this.attrResizeArea.removeClass("entryRemove");
      this.attrRotateArea.removeClass("entryRemove");
      this.flipObject.removeClass("entryRemove");
      break;
    case "select":
      this.toolboxSelect.addClass("entryToolboxSelectClicked");
      break;
    case "pen":
      this.toolboxPen.addClass("entryToolboxPenClicked");
      this.attrThickArea.removeClass("entryRemove");
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrThickArea.painterAttrShapeLineColor.removeClass("entryRemove");
      break;
    case "line":
      this.toolboxLine.addClass("entryToolboxLineClicked");
      this.attrThickArea.removeClass("entryRemove");
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrThickArea.painterAttrShapeLineColor.removeClass("entryRemove");
      break;
    case "rect":
      this.toolboxRect.addClass("entryToolboxRectClicked");
      this.attrThickArea.removeClass("entryRemove");
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrBackgroundArea.removeClass("entryRemove");
      this.attrThickArea.painterAttrShapeLineColor.removeClass("entryRemove");
      this.attrBackgroundArea.painterAttrShapeBackgroundColor.removeClass("entryRemove");
      break;
    case "circle":
      this.toolboxCircle.addClass("entryToolBoxCircleClicked");
      this.attrThickArea.removeClass("entryRemove");
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrThickArea.painterAttrShapeLineColor.removeClass("entryRemove");
      this.attrBackgroundArea.removeClass("entryRemove");
      this.attrBackgroundArea.painterAttrShapeBackgroundColor.removeClass("entryRemove");
      break;
    case "text":
      this.toolboxText.addClass("entryToolBoxTextClicked");
      this.attrFontArea.removeClass("entryRemove");
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrCircleArea.painterAttrCircle.removeClass("entryRemove");
      break;
    case "fill":
      this.toolboxFill.addClass("entryToolBoxFillClicked");
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrCircleArea.painterAttrCircle.removeClass("entryRemove");
      break;
    case "erase":
      $(".entryPlaygroundPainterContainer").addClass("dd");
      this.toolboxErase.addClass("entryToolBoxEraseClicked");
      this.attrThickArea.removeClass("entryRemove");
      break;
    case "spoid":
      this.attrColorArea.removeClass("entryRemove");
      this.attrCircleArea.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("entryRemove");
      this.attrColorSpoid.removeClass("painterAttrColorSpoid");
      this.attrColorSpoid.addClass("painterAttrColorSpoidClicked");
      break;
    case "coordinate":
      this.toggleCoordinator();
  }
};
Entry.Playground = function() {
  this.menuBlocks_ = {};
  this.enableArduino = this.isTextBGMode_ = !1;
  this.viewMode_ = "default";
  Entry.addEventListener("textEdited", this.injectText);
  Entry.addEventListener("entryBlocklyChanged", this.editBlock);
  Entry.addEventListener("hwChanged", this.updateHW);
  this.fonts = [];
  this.fonts.push({name:"\ubc14\ud0d5\uccb4", family:"KoPub Batang", url:"/css/kopubbatang.css"});
  this.fonts.push({name:"\uba85\uc870\uccb4", family:"Nanum Myeongjo", url:"/css/nanummyeongjo.css"});
  this.fonts.push({name:"\uace0\ub515\uccb4", family:"Nanum Gothic", url:"/css/nanumgothic.css"});
  this.fonts.push({name:"\ud544\uae30\uccb4", family:"Nanum Pen Script", url:"/css/nanumpenscript.css"});
  this.fonts.push({name:"\ud55c\ub77c\uc0b0\uccb4", family:"Jeju Hallasan", url:"/css/jejuhallasan.css"});
  this.fonts.push({name:"\ucf54\ub529\uace0\ub515\uccb4", family:"Nanum Gothic Coding", url:"/css/nanumgothiccoding.css"});
};
Entry.Playground.prototype.generateView = function(a, b) {
  this.view_ = a;
  this.view_.addClass("entryPlayground");
  if (b && "workspace" != b) {
    "phone" == b && (this.view_.addClass("entryPlaygroundPhone"), c = Entry.createElement("div", "entryCategoryTab"), c.addClass("entryPlaygroundTabPhone"), Entry.view_.insertBefore(c, this.view_), this.generateTabView(c), this.tabView_ = c, c = Entry.createElement("div", "entryCurtain"), c.addClass("entryPlaygroundCurtainPhone"), c.addClass("entryRemove"), c.innerHTML = Lang.Workspace.cannot_edit_click_to_stop, c.bindOnClick(function() {
      Entry.engine.toggleStop();
    }), this.view_.appendChild(c), this.curtainView_ = c, Entry.pictureEditable && (c = Entry.createElement("div", "entryPicture"), c.addClass("entryPlaygroundPicturePhone"), c.addClass("entryRemove"), this.view_.appendChild(c), this.generatePictureView(c), this.pictureView_ = c), c = Entry.createElement("div", "entryText"), c.addClass("entryRemove"), this.view_.appendChild(c), this.generateTextView(c), this.textView_ = c, Entry.soundEditable && (c = Entry.createElement("div", "entrySound"), c.addClass("entryPlaygroundSoundWorkspacePhone"), 
    c.addClass("entryRemove"), this.view_.appendChild(c), this.generateSoundView(c), this.soundView_ = c), c = Entry.createElement("div", "entryDefault"), this.view_.appendChild(c), this.generateDefaultView(c), this.defaultView_ = c, c = Entry.createElement("div", "entryCode"), c.addClass("entryPlaygroundCodePhone"), this.view_.appendChild(c), this.generateCodeView(c), this.codeView_ = this.codeView_ = c, Entry.addEventListener("run", function(a) {
      Entry.playground.curtainView_.removeClass("entryRemove");
    }), Entry.addEventListener("stop", function(a) {
      Entry.playground.curtainView_.addClass("entryRemove");
    }));
  } else {
    this.view_.addClass("entryPlaygroundWorkspace");
    var c = Entry.createElement("div", "entryCategoryTab");
    c.addClass("entryPlaygroundTabWorkspace");
    this.view_.appendChild(c);
    this.generateTabView(c);
    this.tabView_ = c;
    c = Entry.createElement("div", "entryCurtain");
    c.addClass("entryPlaygroundCurtainWorkspace");
    c.addClass("entryRemove");
    var d = Lang.Workspace.cannot_edit_click_to_stop.split(".");
    c.innerHTML = d[0] + ".<br/>" + d[1];
    c.addEventListener("click", function() {
      Entry.engine.toggleStop();
    });
    this.view_.appendChild(c);
    this.curtainView_ = c;
    Entry.pictureEditable && (c = Entry.createElement("div", "entryPicture"), c.addClass("entryPlaygroundPictureWorkspace"), c.addClass("entryRemove"), this.view_.appendChild(c), this.generatePictureView(c), this.pictureView_ = c);
    c = Entry.createElement("div", "entryText");
    c.addClass("entryPlaygroundTextWorkspace");
    c.addClass("entryRemove");
    this.view_.appendChild(c);
    this.generateTextView(c);
    this.textView_ = c;
    Entry.soundEditable && (c = Entry.createElement("div", "entrySound"), c.addClass("entryPlaygroundSoundWorkspace"), c.addClass("entryRemove"), this.view_.appendChild(c), this.generateSoundView(c), this.soundView_ = c);
    c = Entry.createElement("div", "entryDefault");
    c.addClass("entryPlaygroundDefaultWorkspace");
    this.view_.appendChild(c);
    this.generateDefaultView(c);
    this.defaultView_ = c;
    c = Entry.createElement("div", "entryCode");
    c.addClass("entryPlaygroundCodeWorkspace");
    c.addClass("entryRemove");
    this.view_.appendChild(c);
    this.generateCodeView(c);
    this.codeView_ = c;
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundResizeWorkspace", "entryRemove");
    this.resizeHandle_ = d;
    this.view_.appendChild(d);
    this.initializeResizeHandle(d);
    this.codeView_ = c;
    Entry.addEventListener("run", function(a) {
      Entry.playground.curtainView_.removeClass("entryRemove");
    });
    Entry.addEventListener("stop", function(a) {
      Entry.playground.curtainView_.addClass("entryRemove");
    });
  }
};
Entry.Playground.prototype.generateDefaultView = function(a) {
  return a;
};
Entry.Playground.prototype.generateTabView = function(a) {
  var b = Entry.createElement("ul");
  b.addClass("entryTabListWorkspace");
  this.tabList_ = b;
  a.appendChild(b);
  this.tabViewElements = {};
  a = Entry.createElement("li", "entryCodeTab");
  a.innerHTML = Lang.Workspace.tab_code;
  a.addClass("entryTabListItemWorkspace");
  a.addClass("entryTabSelected");
  b.appendChild(a);
  a.bindOnClick(function(a) {
    Entry.playground.changeViewMode("code");
  });
  this.tabViewElements.code = a;
  Entry.pictureEditable && (a = Entry.createElement("li", "entryPictureTab"), a.innerHTML = Lang.Workspace.tab_picture, a.addClass("entryTabListItemWorkspace"), b.appendChild(a), a.bindOnClick(function(a) {
    Entry.playground.changeViewMode("picture");
  }), this.tabViewElements.picture = a, a = Entry.createElement("li", "entryTextboxTab"), a.innerHTML = Lang.Workspace.tab_text, a.addClass("entryTabListItemWorkspace"), b.appendChild(a), a.bindOnClick(function(a) {
    Entry.playground.changeViewMode("text");
  }), this.tabViewElements.text = a, a.addClass("entryRemove"));
  Entry.soundEditable && (a = Entry.createElement("li", "entrySoundTab"), a.innerHTML = Lang.Workspace.tab_sound, a.addClass("entryTabListItemWorkspace"), b.appendChild(a), a.bindOnClick(function(a) {
    Entry.playground.changeViewMode("sound");
  }), this.tabViewElements.sound = a);
  Entry.hasVariableManager && (a = Entry.createElement("li", "entryVariableTab"), a.innerHTML = Lang.Workspace.tab_attribute, a.addClass("entryTabListItemWorkspace"), a.addClass("entryVariableTabWorkspace"), b.appendChild(a), a.bindOnClick(function(a) {
    Entry.playground.toggleOnVariableView();
    Entry.playground.changeViewMode("variable");
  }), this.tabViewElements.variable = a);
};
Entry.Playground.prototype.generateCodeView = function(a) {
  if (!Entry.type || "workspace" == Entry.type) {
    var b = Entry.createElement("div", "entryCategory");
    b.addClass("entryCategoryWorkspace");
    a.appendChild(b);
    this.categoryView_ = b;
    var c = Entry.createElement("ul", "entryCategoryList");
    c.addClass("entryCategoryListWorkspace");
    b.appendChild(c);
    this.categoryListView_ = c;
    var d = Entry.createElement("div", "entryBlocklyWorkspace");
    d.addClass("entryBlockMenuWorkspace");
    a.appendChild(d);
    $(d).mouseenter(function(a) {
      Entry.playground.resizing || (Entry.playground.focusBlockMenu = !0, a = Blockly.mainWorkspace.blockMenu.blockMenuWidth + 84, a > Entry.interfaceState.menuWidth && (this.widthBackup = Entry.interfaceState.menuWidth, $(".entryBlockMenuWorkspace>svg").stop().animate({width:a - 64}, 200)));
    });
    $(d).mouseleave(function(a) {
      Entry.playground.resizing || (d.widthBackup && !Blockly.mainWorkspace.blockMenu.hasStalkerBlock && $(".entryBlockMenuWorkspace>svg").stop().animate({width:this.widthBackup - 64}, 200), delete this.widthBackup, delete Entry.playground.focusBlockMenu);
    });
    Entry.addEventListener("entryBlocklyChanged", function(a) {
      a = Entry.playground.blockMenuView_;
      a.widthBackup && Entry.resizeElement({menuWidth:a.widthBackup});
      delete a.widthBackup;
      delete Entry.playground.focusBlockMenu;
    });
    this.blockMenuView_ = d;
    b = this.createVariableView();
    a.appendChild(b);
    this.variableView_ = b;
    b = Entry.createElement("div", "entryBlockly");
    b.addClass("entryBlocklyWorkspace");
    this.blocklyView_ = b;
    Entry.bindAnimationCallback(this.blocklyView_, function(a) {
      Blockly.fireUiEvent(window, "resize");
      Entry.playground.blocklyView_.removeClass("foldOut");
    });
    a.appendChild(b);
    c = Entry.parseTexttoXML("<xml></xml>");
    Blockly.inject(b, {path:".././", toolbox:c, trashcan:!0, blockmenu:this.blockMenuView_});
    Blockly.mainWorkspace.flyout_.hide();
    Blockly.mainWorkspace.blockMenu.hide();
    document.addEventListener("blocklyWorkspaceChange", this.syncObjectWithEvent, !1);
    this.blockMenu = Blockly.mainWorkspace.blockMenu;
    return a;
  }
  if ("phone" == Entry.type) {
    return b = Entry.createElement("div", "entryCategory"), b.addClass("entryCategoryPhone"), a.appendChild(b), this.categoryView_ = b, c = Entry.createElement("ul", "entryCategoryList"), c.addClass("entryCategoryListPhone"), b.appendChild(c), this.categoryListView_ = c, b = this.createVariableView(), a.appendChild(b), this.variableView_ = b, b = Entry.createElement("div", "entryBlockly"), b.addClass("entryBlocklyPhone"), this.blocklyView_ = b, a.appendChild(b), c = Entry.parseTexttoXML("<xml></xml>"), 
    Blockly.inject(b, {path:".././", toolbox:c, trashcan:!0}), Blockly.mainWorkspace.flyout_.autoClose = !0, Blockly.mainWorkspace.flyout_.hide(), document.addEventListener("blocklyWorkspaceChange", this.syncObjectWithEvent, !1), this.blockMenu = Blockly.mainWorkspace.flyout_, a;
  }
};
Entry.Playground.prototype.generatePictureView = function(a) {
  if ("workspace" == Entry.type) {
    var b = Entry.createElement("div", "entryAddPicture");
    b.addClass("entryPlaygroundAddPicture");
    b.bindOnClick(function(a) {
      Entry.dispatchEvent("openPictureManager");
    });
    var c = Entry.createElement("div", "entryAddPictureInner");
    c.addClass("entryPlaygroundAddPictureInner");
    c.innerHTML = Lang.Workspace.picture_add;
    b.appendChild(c);
    a.appendChild(b);
    b = Entry.createElement("ul", "entryPictureList");
    b.addClass("entryPlaygroundPictureList");
    $ && $(b).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), h = b.item.index();
      Entry.playground.movePicture(c, h);
    }, axis:"y"});
    a.appendChild(b);
    this.pictureListView_ = b;
    b = Entry.createElement("div", "entryPainter");
    b.addClass("entryPlaygroundPainter");
    a.appendChild(b);
    this.painter = new Entry.Painter;
    this.painter.initialize(b);
  } else {
    "phone" == Entry.type && (b = Entry.createElement("div", "entryAddPicture"), b.addClass("entryPlaygroundAddPicturePhone"), b.bindOnClick(function(a) {
      Entry.dispatchEvent("openPictureManager");
    }), c = Entry.createElement("div", "entryAddPictureInner"), c.addClass("entryPlaygroundAddPictureInnerPhone"), c.innerHTML = Lang.Workspace.picture_add, b.appendChild(c), a.appendChild(b), b = Entry.createElement("ul", "entryPictureList"), b.addClass("entryPlaygroundPictureListPhone"), $ && $(b).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), h = b.item.index();
      Entry.playground.movePicture(c, h);
    }, axis:"y"}), a.appendChild(b), this.pictureListView_ = b);
  }
};
Entry.Playground.prototype.generateTextView = function(a) {
  var b = Entry.createElement("div");
  a.appendChild(b);
  a = Entry.createElement("div");
  a.addClass("textProperties");
  b.appendChild(a);
  var c = Entry.createElement("div");
  c.addClass("entryTextFontSelect");
  a.appendChild(c);
  var d = Entry.createElement("select", "entryPainterAttrFontName");
  d.addClass("entryPlaygroundPainterAttrFontName", "entryTextFontSelecter");
  d.size = "1";
  d.onchange = function(a) {
    Entry.playground.object.entity.setFontType(a.target.value);
  };
  for (var e = 0;e < this.fonts.length;e++) {
    var f = this.fonts[e], h = Entry.createElement("option");
    h.value = f.family;
    h.innerHTML = f.name;
    d.appendChild(h);
  }
  this.fontName_ = d;
  c.appendChild(d);
  e = Entry.createElement("ul");
  e.addClass("entryPlayground_text_buttons");
  a.appendChild(e);
  c = Entry.createElement("li");
  c.addClass("entryPlaygroundTextAlignLeft");
  c.bindOnClick(function(a) {
    Entry.playground.setFontAlign(Entry.TEXT_ALIGN_LEFT);
  });
  e.appendChild(c);
  this.alignLeftBtn = c;
  c = Entry.createElement("li");
  c.addClass("entryPlaygroundTextAlignCenter");
  c.bindOnClick(function(a) {
    Entry.playground.setFontAlign(Entry.TEXT_ALIGN_CENTER);
  });
  e.appendChild(c);
  this.alignCenterBtn = c;
  c = Entry.createElement("li");
  c.addClass("entryPlaygroundTextAlignRight");
  c.bindOnClick(function(a) {
    Entry.playground.setFontAlign(Entry.TEXT_ALIGN_RIGHT);
  });
  e.appendChild(c);
  this.alignRightBtn = c;
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    Entry.playground.object.entity.toggleFontBold() ? g.src = "/img/assets/text_button_bold_true.png" : g.src = "/img/assets/text_button_bold_false.png";
  });
  var g = Entry.createElement("img", "entryPlaygroundText_boldImage");
  d.appendChild(g);
  g.src = "/img/assets/text_button_bold_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    var a = !Entry.playground.object.entity.getUnderLine() || !1;
    k.src = "/img/assets/text_button_underline_" + a + ".png";
    Entry.playground.object.entity.setUnderLine(a);
  });
  var k = Entry.createElement("img", "entryPlaygroundText_underlineImage");
  d.appendChild(k);
  k.src = "/img/assets/text_button_underline_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    Entry.playground.object.entity.toggleFontItalic() ? m.src = "/img/assets/text_button_italic_true.png" : m.src = "/img/assets/text_button_italic_false.png";
  });
  var m = Entry.createElement("img", "entryPlaygroundText_italicImage");
  d.appendChild(m);
  m.src = "/img/assets/text_button_italic_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    var a = !Entry.playground.object.entity.getStrike() || !1;
    Entry.playground.object.entity.setStrike(a);
    n.src = "/img/assets/text_button_strike_" + a + ".png";
  });
  var n = Entry.createElement("img", "entryPlaygroundText_strikeImage");
  d.appendChild(n);
  n.src = "/img/assets/text_button_strike_false.png";
  d = Entry.createElement("li");
  e.appendChild(d);
  c = Entry.createElement("a");
  d.appendChild(c);
  c.bindOnClick(function() {
    Entry.playground.toggleColourChooser("foreground");
  });
  d = Entry.createElement("img");
  c.appendChild(d);
  d.src = "/img/assets/text_button_color_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  e = Entry.createElement("a");
  c.appendChild(e);
  e.bindOnClick(function() {
    Entry.playground.toggleColourChooser("background");
  });
  c = Entry.createElement("img");
  e.appendChild(c);
  c.src = "/img/assets/text_button_background_false.png";
  e = Entry.createElement("div");
  e.addClass("entryPlayground_fgColorDiv");
  c = Entry.createElement("div");
  c.addClass("entryPlayground_bgColorDiv");
  a.appendChild(e);
  a.appendChild(c);
  d = Entry.createElement("div");
  d.addClass("entryPlaygroundTextColoursWrapper");
  this.coloursWrapper = d;
  b.appendChild(d);
  a = Entry.getColourCodes();
  for (e = 0;e < a.length;e++) {
    c = Entry.createElement("div"), c.addClass("modal_colour"), c.setAttribute("colour", a[e]), c.style.backgroundColor = a[e], 0 === e && c.addClass("modalColourTrans"), c.bindOnClick(function(a) {
      Entry.playground.setTextColour(a.target.getAttribute("colour"));
    }), d.appendChild(c);
  }
  d.style.display = "none";
  d = Entry.createElement("div");
  d.addClass("entryPlaygroundTextBackgroundsWrapper");
  this.backgroundsWrapper = d;
  b.appendChild(d);
  for (e = 0;e < a.length;e++) {
    c = Entry.createElement("div"), c.addClass("modal_colour"), c.setAttribute("colour", a[e]), c.style.backgroundColor = a[e], 0 === e && c.addClass("modalColourTrans"), c.bindOnClick(function(a) {
      Entry.playground.setBackgroundColour(a.target.getAttribute("colour"));
    }), d.appendChild(c);
  }
  d.style.display = "none";
  a = Entry.createElement("input");
  a.addClass("entryPlayground_textBox");
  a.onkeyup = function() {
    Entry.playground.object.setName(this.value);
    Entry.playground.object.entity.setText(this.value);
  };
  a.onblur = function() {
    Entry.dispatchEvent("textEdited");
  };
  this.textEditInput = a;
  b.appendChild(a);
  a = Entry.createElement("textarea");
  a.addClass("entryPlayground_textArea");
  a.style.display = "none";
  a.onkeyup = function() {
    Entry.playground.object.setName(this.value);
    Entry.playground.object.entity.setText(this.value);
  };
  a.onblur = function() {
    Entry.dispatchEvent("textEdited");
  };
  this.textEditArea = a;
  b.appendChild(a);
  a = Entry.createElement("div");
  a.addClass("entryPlaygroundFontSizeWrapper");
  b.appendChild(a);
  this.fontSizeWrapper = a;
  var l = Entry.createElement("div");
  l.addClass("entryPlaygroundFontSizeSlider");
  a.appendChild(l);
  var q = Entry.createElement("div");
  q.addClass("entryPlaygroundFontSizeIndicator");
  l.appendChild(q);
  this.fontSizeIndiciator = q;
  var t = Entry.createElement("div");
  t.addClass("entryPlaygroundFontSizeKnob");
  l.appendChild(t);
  this.fontSizeKnob = t;
  e = Entry.createElement("div");
  e.addClass("entryPlaygroundFontSizeLabel");
  e.innerHTML = "\uae00\uc790 \ud06c\uae30";
  a.appendChild(e);
  var u = !1, r = 0;
  t.onmousedown = function(a) {
    u = !0;
    r = $(l).offset().left;
  };
  document.addEventListener("mousemove", function(a) {
    u && (a = a.pageX - r, a = Math.max(a, 5), a = Math.min(a, 88), t.style.left = a + "px", a /= .88, q.style.width = a + "%", Entry.playground.object.entity.setFontSize(a));
  });
  document.addEventListener("mouseup", function(a) {
    u = !1;
  });
  a = Entry.createElement("div");
  a.addClass("entryPlaygroundLinebreakWrapper");
  b.appendChild(a);
  b = Entry.createElement("hr");
  b.addClass("entryPlaygroundLinebreakHorizontal");
  a.appendChild(b);
  b = Entry.createElement("div");
  b.addClass("entryPlaygroundLinebreakButtons");
  a.appendChild(b);
  e = Entry.createElement("img");
  e.bindOnClick(function() {
    Entry.playground.toggleLineBreak(!1);
  });
  e.src = "/img/assets/text-linebreak-off-true.png";
  b.appendChild(e);
  this.linebreakOffImage = e;
  e = Entry.createElement("img");
  e.bindOnClick(function() {
    Entry.playground.toggleLineBreak(!0);
  });
  e.src = "/img/assets/text-linebreak-on-false.png";
  b.appendChild(e);
  this.linebreakOnImage = e;
  b = Entry.createElement("div");
  b.addClass("entryPlaygroundLinebreakDescription");
  a.appendChild(b);
  a = Entry.createElement("p");
  a.innerHTML = "\uae00\uc0c1\uc790\uc758 \ud06c\uae30\uac00 \uae00\uc790\uac00 \uc4f0\uc77c \uc218 \uc788\ub294 \uc601\uc5ed\uc744 \uacb0\uc815\ud569\ub2c8\ub2e4.";
  b.appendChild(a);
  a = Entry.createElement("ul");
  b.appendChild(a);
  b = Entry.createElement("li");
  b.innerHTML = "\ub0b4\uc6a9 \uc791\uc131\uc2dc \uc5d4\ud130\ud0a4\ub85c \uc904\ubc14\uafc8\uc744 \ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.";
  a.appendChild(b);
  b = Entry.createElement("li");
  b.innerHTML = "\ub0b4\uc6a9\uc744 \uc791\uc131\ud558\uc2dc\uac70\ub098 \uc0c8\ub85c\uc6b4 \uae00\uc790\ub97c \ucd94\uac00\uc2dc \uae38\uc774\uac00 \uae00\uc0c1\uc790\uc758 \uac00\ub85c \uc601\uc5ed\uc744 \ub118\uc5b4\uc11c\uba74 \uc790\ub3d9\uc73c\ub85c \uc904\uc774 \ubc14\ub01d\ub2c8\ub2e4.";
  a.appendChild(b);
};
Entry.Playground.prototype.generateSoundView = function(a) {
  if ("workspace" == Entry.type) {
    var b = Entry.createElement("div", "entryAddSound");
    b.addClass("entryPlaygroundAddSound");
    b.bindOnClick(function(a) {
      Entry.dispatchEvent("openSoundManager");
    });
    var c = Entry.createElement("div", "entryAddSoundInner");
    c.addClass("entryPlaygroundAddSoundInner");
    c.innerHTML = Lang.Workspace.sound_add;
    b.appendChild(c);
    a.appendChild(b);
    b = Entry.createElement("ul", "entrySoundList");
    b.addClass("entryPlaygroundSoundList");
    $ && $(b).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), h = b.item.index();
      Entry.playground.moveSound(c, h);
    }, axis:"y"});
    a.appendChild(b);
    this.soundListView_ = b;
  } else {
    "phone" == Entry.type && (b = Entry.createElement("div", "entryAddSound"), b.addClass("entryPlaygroundAddSoundPhone"), b.bindOnClick(function(a) {
      Entry.dispatchEvent("openSoundManager");
    }), c = Entry.createElement("div", "entryAddSoundInner"), c.addClass("entryPlaygroundAddSoundInnerPhone"), c.innerHTML = Lang.Workspace.sound_add, b.appendChild(c), a.appendChild(b), b = Entry.createElement("ul", "entrySoundList"), b.addClass("entryPlaygroundSoundListPhone"), $ && $(b).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), h = b.item.index();
      Entry.playground.moveSound(c, h);
    }, axis:"y"}), a.appendChild(b), this.soundListView_ = b);
  }
};
Entry.Playground.prototype.injectObject = function(a) {
  if (!a) {
    this.changeViewMode("default"), this.object = null;
  } else {
    if (a !== this.object) {
      this.object && (this.syncObject(this.object), this.object.toggleInformation(!1));
      this.object = a;
      this.setMenu(a.objectType);
      this.injectCode();
      "sprite" == a.objectType && Entry.pictureEditable ? (this.tabViewElements.text && this.tabViewElements.text.addClass("entryRemove"), this.tabViewElements.picture && this.tabViewElements.picture.removeClass("entryRemove")) : "textBox" == a.objectType && (this.tabViewElements.picture && this.tabViewElements.picture.addClass("entryRemove"), this.tabViewElements.text && this.tabViewElements.text.removeClass("entryRemove"));
      var b = this.viewMode_;
      "default" == b ? this.changeViewMode("code") : "picture" != b && "text" != b || "textBox" != a.objectType ? "text" != b && "picture" != b || "sprite" != a.objectType ? "sound" == b && this.changeViewMode("sound") : this.changeViewMode("picture") : this.changeViewMode("text");
      this.menuInjected || this.selectMenu(0);
    }
  }
};
Entry.Playground.prototype.injectCode = function() {
  var a = this.object;
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, a.script);
};
Entry.Playground.prototype.injectPicture = function() {
  var a = this.pictureListView_;
  if (a) {
    for (;a.hasChildNodes();) {
      a.removeChild(a.lastChild);
    }
    if (this.object) {
      for (var b = this.object.pictures, c = 0, d = b.length;c < d;c++) {
        var e = b[c].view;
        e || console.log(e);
        e.orderHolder.innerHTML = c + 1;
        a.appendChild(e);
      }
      this.selectPicture(this.object.selectedPicture);
    }
  }
};
Entry.Playground.prototype.addPicture = function(a, b) {
  var c = Entry.cloneSimpleObject(a);
  delete c.id;
  delete c.view;
  a = JSON.parse(JSON.stringify(c));
  a.id = Entry.generateHash();
  a.name = Entry.getOrderedName(a.name, this.object.pictures);
  this.generatePictureElement(a);
  this.object.addPicture(a);
  this.injectPicture();
  this.selectPicture(a);
};
Entry.Playground.prototype.setPicture = function(a) {
  var b = document.getElementById(a.id);
  a.view = b;
  b.picture = a;
  var b = document.getElementById("t_" + a.id), c = a.filename;
  b.style.backgroundImage = 'url("/uploads/' + c.substring(0, 2) + "/" + c.substring(2, 4) + "/thumb/" + c + '.png")';
  document.getElementById("s_" + a.id).innerHTML = a.dimension.width + " X " + a.dimension.height;
  Entry.playground.object.setPicture(a);
};
Entry.Playground.prototype.clonePicture = function(a) {
  a = Entry.playground.object.getPicture(a);
  this.addPicture(a, !0);
};
Entry.Playground.prototype.selectPicture = function(a) {
  for (var b = this.object.pictures, c = 0, d = b.length;c < d;c++) {
    var e = b[c];
    e === a ? e.view.addClass("entryPictureSelected") : e.view.removeClass("entryPictureSelected");
  }
  Entry.playground.object.selectPicture(a.id);
  Entry.dispatchEvent("pictureSelected", a);
};
Entry.Playground.prototype.movePicture = function(a, b) {
  this.object.pictures.splice(b, 0, this.object.pictures.splice(a, 1)[0]);
  this.injectPicture();
  Entry.stage.sortZorder();
};
Entry.Playground.prototype.injectText = function() {
  if (Entry.playground.object) {
    Entry.playground.textEditInput.value = Entry.playground.object.entity.getText();
    Entry.playground.textEditArea.value = Entry.playground.object.entity.getText();
    Entry.playground.fontName_.value = Entry.playground.object.entity.getFontName();
    if (Entry.playground.object.entity.font) {
      var a = -1 < Entry.playground.object.entity.font.indexOf("bold") || !1;
      $("#entryPlaygroundText_boldImage").attr("src", "/img/assets/text_button_bold_" + a + ".png");
      a = -1 < Entry.playground.object.entity.font.indexOf("italic") || !1;
      $("#entryPlaygroundText_italicImage").attr("src", "/img/assets/text_button_italic_" + a + ".png");
    }
    a = Entry.playground.object.entity.getUnderLine() || !1;
    $("#entryPlaygroundText_underlineImage").attr("src", "/img/assets/text_button_underline_" + a + ".png");
    a = Entry.playground.object.entity.getStrike() || !1;
    $("#entryPlaygroundText_strikeImage").attr("src", "/img/assets/text_button_strike_" + a + ".png");
    $(".entryPlayground_fgColorDiv").css("backgroundColor", Entry.playground.object.entity.colour);
    $(".entryPlayground_bgColorDiv").css("backgroundColor", Entry.playground.object.entity.bgColour);
    Entry.playground.toggleLineBreak(Entry.playground.object.entity.getLineBreak());
    Entry.playground.setFontAlign(Entry.playground.object.entity.getTextAlign());
    a = Entry.playground.object.entity.getFontSize();
    Entry.playground.fontSizeIndiciator.style.width = a + "%";
    Entry.playground.fontSizeKnob.style.left = .88 * a + "px";
  }
};
Entry.Playground.prototype.injectSound = function() {
  var a = this.soundListView_;
  if (a) {
    for (;a.hasChildNodes();) {
      a.removeChild(a.lastChild);
    }
    if (this.object) {
      for (var b = this.object.sounds, c = 0, d = b.length;c < d;c++) {
        var e = b[c].view;
        e.orderHolder.innerHTML = c + 1;
        a.appendChild(e);
      }
    }
  }
};
Entry.Playground.prototype.moveSound = function(a, b) {
  this.object.sounds.splice(b, 0, this.object.sounds.splice(a, 1)[0]);
  this.updateListViewOrder("sound");
  Entry.stage.sortZorder();
};
Entry.Playground.prototype.addSound = function(a, b) {
  var c = Entry.cloneSimpleObject(a);
  delete c.view;
  delete c.id;
  a = JSON.parse(JSON.stringify(c));
  a.id = Entry.generateHash();
  a.name = Entry.getOrderedName(a.name, this.object.sounds);
  this.generateSoundElement(a);
  this.object.addSound(a);
  this.injectSound();
};
Entry.Playground.prototype.changeViewMode = function(a) {
  for (var b in this.tabViewElements) {
    this.tabViewElements[b].removeClass("entryTabSelected");
  }
  "default" != a && this.tabViewElements[a].addClass("entryTabSelected");
  if ("variable" != a) {
    var c = this.view_.children;
    this.viewMode_ = a;
    for (b = 0;b < c.length;b++) {
      var d = c[b];
      -1 < d.id.toUpperCase().indexOf(a.toUpperCase()) ? d.removeClass("entryRemove") : d.addClass("entryRemove");
    }
    if ("picture" == a && (!this.pictureView_.object || this.pictureView_.object != this.object)) {
      this.pictureView_.object = this.object, this.injectPicture();
    } else {
      if ("sound" == a && (!this.soundView_.object || this.soundView_.object != this.object)) {
        this.soundView_.object = this.object, this.injectSound();
      } else {
        if ("text" == a && "textBox" == this.object.objectType || this.textView_.object != this.object) {
          this.textView_.object = this.object, this.injectText();
        }
      }
    }
    "code" == a && this.resizeHandle_ && this.resizeHandle_.removeClass("entryRemove");
    Entry.engine.isState("run") && this.curtainView_.removeClass("entryRemove");
    this.viewMode_ = a;
    this.toggleOffVariableView();
  }
};
Entry.Playground.prototype.createVariableView = function() {
  var a = Entry.createElement("div");
  Entry.type && "workspace" != Entry.type ? "phone" == Entry.type && a.addClass("entryVariablePanelPhone") : a.addClass("entryVariablePanelWorkspace");
  this.variableViewWrapper_ = a;
  Entry.variableContainer.createDom(a);
  return a;
};
Entry.Playground.prototype.toggleOnVariableView = function() {
  Entry.playground.changeViewMode("code");
  this.categoryView_.addClass("entryRemove");
  this.blockMenuView_ && this.blockMenuView_.addClass("entryHidden");
  Entry.variableContainer.updateList();
  this.variableView_.removeClass("entryRemove");
  this.resizeHandle_.removeClass("entryRemove");
};
Entry.Playground.prototype.toggleOffVariableView = function() {
  this.categoryView_.removeClass("entryRemove");
  this.blockMenuView_ && this.blockMenuView_.removeClass("entryHidden");
  this.variableView_.addClass("entryRemove");
};
Entry.Playground.prototype.syncObject = function(a) {
  this.object && !a && (a = this.object);
  a && a.setScript(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
};
Entry.Playground.prototype.editBlock = function() {
  var a = Entry.playground;
  Entry.stateManager.addCommand("edit block", a, a.restoreBlock, a.object, a.object.getScriptText());
};
Entry.Playground.prototype.restoreBlock = function(a, b) {
  Entry.container.selectObject(a.id);
  Entry.stateManager.addCommand("restore block", this, this.restoreBlock, this.object, this.object.getScriptText());
  var c = Blockly.Xml.textToDom(b);
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, c);
  this.syncObject();
};
Entry.Playground.prototype.syncObjectWithEvent = function(a) {
  Entry.playground.syncObject();
};
Entry.Playground.prototype.setMenu = function(a) {
  if (this.currentObjectType != a) {
    this.categoryListView_.innerHTML = "";
    this.blockMenu.unbanClass(this.currentObjectType);
    this.blockMenu.banClass(a);
    for (var b in this.blockJSON) {
      var c = this.blockJSON[b].category, d = Entry.createElement("li", "entryCategory" + c);
      ("brush" == c && "textBox" == a || "text" == c && "sprite" == a || !("func" == c || this.blockJSON[b].blocks && this.blockJSON[b].blocks.length)) && d.addClass("entryRemove");
      d.innerHTML = Lang.Blocks[c.toUpperCase()];
      d.bindOnClick(function() {
        Entry.playground.selectMenu(this.id.substring(13));
      });
      Entry.type && "workspace" != Entry.type ? "phone" == Entry.type && d.addClass("entryCategoryElementPhone") : d.addClass("entryCategoryElementWorkspace");
      this.categoryListView_.appendChild(d);
    }
    this.selectMenu(0);
    this.currentObjectType = a;
  }
};
Entry.Playground.prototype.selectMenu = function(a, b) {
  if (this.object) {
    this.lastSelector = a;
    var c = this.categoryListView_.children;
    if (!Entry.type || "workspace" == Entry.type) {
      for (var d in this.blockJSON) {
        var e = this.blockJSON[d].category;
        "string" == typeof a && e == a || "number" == typeof a && a == d ? c[d].hasClass("entrySelectedCategory") && !b ? (this.blocklyView_.addClass("folding"), this.blocklyView_.removeClass("foldOut"), this.hideTabs(), c[d].removeClass("entrySelectedCategory"), delete this.selectedMenu) : ("func" == e ? this.blockMenu.show(Entry.Func.getMenuXml()) : ("variable" == e && this.checkVariables(), this.blockMenu.showCategory(this.blockJSON[d])), this.menuInjected = !0, this.blocklyView_.hasClass("folding") && 
        (this.blocklyView_.addClass("foldOut"), this.blocklyView_.removeClass("folding")), this.showTabs(), c[d].addClass("entrySelectedCategory"), this.selectedMenu = e) : c[d].removeClass("entrySelectedCategory");
      }
    } else {
      if ("phone" == Entry.type) {
        for (d = 0;d < categories.length;d++) {
          e = categories[d].attributes[0].value, "string" == typeof a && e == a || "number" == typeof a && a == d ? c[d].hasClass("entrySelectedCategory") ? (this.blockMenu.hide(), c[d].removeClass("entrySelectedCategory"), this.menuInjected = !0, this.selectedMenu = e) : (c[d].addClass("entrySelectedCategory"), this.blockMenu.show(categories[d].childNodes), this.menuInjected = !0, delete this.selctedMenu) : c[d].removeClass("entrySelectedCategory");
        }
      }
    }
  } else {
    Entry.toast.alert(Lang.Workspace.add_object_alert, Lang.Workspace.add_object_alert_msg);
  }
};
Entry.Playground.prototype.hideTabs = function() {
  var a = ["picture", "text", "sound", "variable"], b;
  for (b in a) {
    this.hideTab([a[b]]);
  }
};
Entry.Playground.prototype.hideTab = function(a) {
  this.tabViewElements[a] && (this.tabViewElements[a].addClass("hideTab"), this.tabViewElements[a].removeClass("showTab"));
};
Entry.Playground.prototype.showTabs = function() {
  var a = ["picture", "text", "sound", "variable"], b;
  for (b in a) {
    this.showTab(a[b]);
  }
};
Entry.Playground.prototype.showTab = function(a) {
  this.tabViewElements[a] && (this.tabViewElements[a].addClass("showTab"), this.tabViewElements[a].removeClass("hideTab"));
};
Entry.Playground.prototype.setBlockMenu = function(a) {
  a || (a = EntryStatic.getAllBlocks());
  Entry.functionEnable && 1 < a.length && "arduino" == a[a.length - 1].category && a.splice(a.length - 1, 0, {category:"func"});
  Entry.messageEnable || this.blockMenu.banClass("message");
  Entry.variableEnable || this.blockMenu.banClass("variable");
  Entry.listEnable || this.blockMenu.banClass("list");
  this.updateHW();
  if (!Entry.sceneEditable) {
    for (var b in a) {
      "scene" == a[b].category && a.splice(b, 1);
    }
  }
  this.blockJSON = a;
};
Entry.Playground.prototype.initializeResizeHandle = function(a) {
  a.onmousedown = function(a) {
    Entry.playground.resizing = !0;
  };
  document.addEventListener("mousemove", function(a) {
    Entry.playground.resizing && Entry.resizeElement({menuWidth:a.x - Entry.interfaceState.canvasWidth});
  });
  document.addEventListener("mouseup", function(a) {
    Entry.playground.resizing = !1;
  });
};
Entry.Playground.prototype.reloadPlayground = function() {
  var a, b;
  document.getElementsByClassName("entrySelectedCategory")[0] && (a = document.getElementsByClassName("entrySelectedCategory")[0], b = a.getAttribute("id").substring(13), a.removeClass("entrySelectedCategory"), Entry.playground.selectMenu(b));
  Entry.stage.selectedObject && (Blockly.mainWorkspace.clear(), Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Entry.stage.selectedObject.script));
};
Entry.Playground.prototype.flushPlayground = function() {
  this.object = null;
  Entry.playground && Entry.playground.view_ && (Blockly.mainWorkspace.clear(), this.injectPicture(), this.injectSound());
};
Entry.Playground.prototype.updateListViewOrder = function(a) {
  a = "picture" == a ? this.pictureListView_.childNodes : this.soundListView_.childNodes;
  for (var b = 0, c = a.length;b < c;b++) {
    a[b].orderHolder.innerHTML = b + 1;
  }
};
Entry.Playground.prototype.generatePictureElement = function(a) {
  function b() {
    if ("" === this.value.trim()) {
      Entry.deAttachEventListener(this, "blur", b), alert("\uc774\ub984\uc744 \uc785\ub825\ud558\uc5ec \uc8fc\uc138\uc694."), this.focus(), Entry.attachEventListener(this, "blur", b);
    } else {
      for (var a = $(".entryPlaygroundPictureName"), c = 0;c < a.length;c++) {
        if (a.eq(c).val() == f.value && a[c] != this) {
          Entry.deAttachEventListener(this, "blur", b);
          alert("\uc774\ub984\uc774 \uc911\ubcf5 \ub418\uc5c8\uc2b5\ub2c8\ub2e4.");
          this.focus();
          Entry.attachEventListener(this, "blur", b);
          return;
        }
      }
      this.picture.name = this.value;
      Entry.dispatchEvent("pictureNameChanged", this.picture);
    }
  }
  var c = Entry.createElement("li", a.id);
  a.view = c;
  c.addClass("entryPlaygroundPictureElement");
  c.picture = a;
  c.bindOnClick(function(a) {
    Entry.playground.selectPicture(this.picture);
  });
  $ && context.attach("#" + a.id, [{text:Lang.Workspace.context_rename, href:"/", action:function(a) {
    a.preventDefault();
    f.focus();
  }}, {text:Lang.Workspace.context_duplicate, href:"/", action:function(b) {
    b.preventDefault();
    Entry.playground.clonePicture(a.id);
  }}, {text:Lang.Workspace.context_remove, href:"/", action:function(b) {
    b.preventDefault();
    Entry.playground.object.removePicture(a.id) ? (Entry.removeElement(c), Entry.toast.success(Lang.Workspace.shape_remove_ok, a.name + " " + Lang.Workspace.shape_remove_ok_msg)) : Entry.toast.alert(Lang.Workspace.shape_remove_fail, Lang.Workspace.shape_remove_fail_msg);
  }}, {divider:!0}, {text:Lang.Workspace.context_download, href:"/", action:function(b) {
    b.preventDefault();
    window.open("/api/sprite/download/image/" + encodeURIComponent(a.filename) + "/" + encodeURIComponent(a.name) + ".png");
  }}]);
  var d = Entry.createElement("div");
  d.addClass("entryPlaygroundPictureOrder");
  c.orderHolder = d;
  c.appendChild(d);
  d = Entry.createElement("div", "t_" + a.id);
  d.addClass("entryPlaygroundPictureThumbnail");
  var e = a.filename;
  d.style.backgroundImage = 'url("/uploads/' + e.substring(0, 2) + "/" + e.substring(2, 4) + "/thumb/" + e + '.png")';
  c.appendChild(d);
  var f = Entry.createElement("input");
  f.addClass("entryPlaygroundPictureName");
  f.addClass("entryEllipsis");
  f.picture = a;
  f.value = a.name;
  Entry.attachEventListener(f, "blur", b);
  f.onkeypress = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.appendChild(f);
  d = Entry.createElement("div", "s_" + a.id);
  d.addClass("entryPlaygroundPictureSize");
  d.innerHTML = a.dimension.width + " X " + a.dimension.height;
  c.appendChild(d);
};
Entry.Playground.prototype.generateSoundElement = function(a) {
  var b = Entry.createElement("sound", a.id);
  a.view = b;
  b.addClass("entryPlaygroundSoundElement");
  b.sound = a;
  $ && context.attach("#" + a.id, [{text:Lang.Workspace.context_rename, href:"/", action:function(a) {
    a.preventDefault();
    h.focus();
  }}, {text:Lang.Workspace.context_duplicate, href:"/", action:function(b) {
    b.preventDefault();
    Entry.playground.addSound(a, !0);
  }}, {text:Lang.Workspace.context_remove, href:"/", action:function(c) {
    c.preventDefault();
    Entry.playground.object.removeSound(a.id) ? (Entry.removeElement(b), Entry.toast.success(Lang.Workspace.sound_remove_ok, a.name + " " + Lang.Workspace.sound_remove_ok_msg)) : Entry.toast.alert(Lang.Workspace.sound_remove_fail, "");
    Entry.removeElement(b);
  }}]);
  var c = Entry.createElement("div");
  c.addClass("entryPlaygroundSoundOrder");
  b.orderHolder = c;
  b.appendChild(c);
  var d = Entry.createElement("div");
  d.addClass("entryPlaygroundSoundThumbnail");
  d.addClass("entryPlaygroundSoundPlay");
  var e = !1, f;
  d.addEventListener("click", function() {
    e ? (e = !1, d.removeClass("entryPlaygroundSoundStop"), d.addClass("entryPlaygroundSoundPlay"), f.stop()) : (e = !0, d.removeClass("entryPlaygroundSoundPlay"), d.addClass("entryPlaygroundSoundStop"), f = createjs.Sound.play(a.id), f.addEventListener("complete", function(a) {
      d.removeClass("entryPlaygroundSoundStop");
      d.addClass("entryPlaygroundSoundPlay");
      e = !1;
    }), f.addEventListener("loop", function(a) {
    }), f.addEventListener("failed", function(a) {
    }));
  });
  b.appendChild(d);
  var h = Entry.createElement("input");
  h.addClass("entryPlaygroundSoundName");
  h.sound = a;
  h.value = a.name;
  var g = document.getElementsByClassName("entryPlaygroundSoundName");
  h.onblur = function() {
    if ("" === this.value) {
      alert("\uc774\ub984\uc744 \uc785\ub825\ud558\uc5ec \uc8fc\uc138\uc694."), this.focus();
    } else {
      for (var a = 0, b = 0;b < g.length;b++) {
        if (g[b].value == h.value && (a += 1, 1 < a)) {
          alert("\uc774\ub984\uc774 \uc911\ubcf5 \ub418\uc5c8\uc2b5\ub2c8\ub2e4.");
          this.focus();
          return;
        }
      }
      this.sound.name = this.value;
    }
  };
  h.onkeypress = function(a) {
    13 == a.keyCode && this.blur();
  };
  b.appendChild(h);
  c = Entry.createElement("div");
  c.addClass("entryPlaygroundSoundLength");
  c.innerHTML = a.duration + " \ucd08";
  b.appendChild(c);
};
Entry.Playground.prototype.toggleColourChooser = function(a) {
  "foreground" === a ? "none" === this.coloursWrapper.style.display ? (this.coloursWrapper.style.display = "block", this.backgroundsWrapper.style.display = "none") : this.coloursWrapper.style.display = "none" : "background" === a && ("none" === this.backgroundsWrapper.style.display ? (this.backgroundsWrapper.style.display = "block", this.coloursWrapper.style.display = "none") : this.backgroundsWrapper.style.display = "none");
};
Entry.Playground.prototype.setTextColour = function(a) {
  Entry.playground.object.entity.setColour(a);
  Entry.playground.toggleColourChooser("foreground");
  $(".entryPlayground_fgColorDiv").css("backgroundColor", a);
};
Entry.Playground.prototype.setBackgroundColour = function(a) {
  Entry.playground.object.entity.setBGColour(a);
  Entry.playground.toggleColourChooser("background");
  $(".entryPlayground_bgColorDiv").css("backgroundColor", a);
};
Entry.Playground.prototype.isTextBGMode = function() {
  return this.isTextBGMode_;
};
Entry.Playground.prototype.checkVariables = function() {
  Entry.forEBS || (Entry.variableContainer.lists_.length ? this.blockMenu.unbanClass("listNotExist") : this.blockMenu.banClass("listNotExist"), Entry.variableContainer.variables_.length ? this.blockMenu.unbanClass("variableNotExist") : this.blockMenu.banClass("variableNotExist"));
};
Entry.Playground.prototype.getViewMode = function() {
  return this.viewMode_;
};
Entry.Playground.prototype.updateHW = function() {
  var a = Entry.playground;
  a.blockMenu && (Entry.hw && Entry.hw.connected ? (a.blockMenu.unbanClass("arduinoConnected"), a.blockMenu.banClass("arduinoDisconnected")) : (a.blockMenu.banClass("arduinoConnected"), a.blockMenu.unbanClass("arduinoDisconnected")), a.object && a.selectMenu(a.lastSelector, !0));
};
Entry.Playground.prototype.toggleLineBreak = function(a) {
  this.object && "textBox" == this.object.objectType && (a ? (Entry.playground.object.entity.setLineBreak(!0), $(".entryPlayground_textArea").css("display", "block"), $(".entryPlayground_textBox").css("display", "none"), this.linebreakOffImage.src = "/img/assets/text-linebreak-off-false.png", this.linebreakOnImage.src = "/img/assets/text-linebreak-on-true.png", this.fontSizeWrapper.removeClass("entryHide")) : (Entry.playground.object.entity.setLineBreak(!1), $(".entryPlayground_textArea").css("display", 
  "none"), $(".entryPlayground_textBox").css("display", "block"), this.linebreakOffImage.src = "/img/assets/text-linebreak-off-true.png", this.linebreakOnImage.src = "/img/assets/text-linebreak-on-false.png", this.fontSizeWrapper.addClass("entryHide")));
};
Entry.Playground.prototype.setFontAlign = function(a) {
  if ("textBox" == this.object.objectType) {
    this.alignLeftBtn.removeClass("toggle");
    this.alignCenterBtn.removeClass("toggle");
    this.alignRightBtn.removeClass("toggle");
    switch(a) {
      case Entry.TEXT_ALIGN_LEFT:
        this.alignLeftBtn.addClass("toggle");
        break;
      case Entry.TEXT_ALIGN_CENTER:
        this.alignCenterBtn.addClass("toggle");
        break;
      case Entry.TEXT_ALIGN_RIGHT:
        this.alignRightBtn.addClass("toggle");
    }
    this.object.entity.setTextAlign(a);
  }
};
Entry.Popup = function() {
  Entry.assert(!window.popup, "Popup exist");
  this.body_ = Entry.createElement("div");
  this.body_.addClass("entryPopup");
  this.body_.bindOnClick(function(a) {
    a.target == this && this.popup.remove();
  });
  this.body_.popup = this;
  document.body.appendChild(this.body_);
  this.window_ = Entry.createElement("div");
  this.window_.addClass("entryPopupWindow");
  this.window_.bindOnClick(function() {
  });
  Entry.addEventListener("windowResized", this.resize);
  window.popup = this;
  this.resize();
  this.body_.appendChild(this.window_);
};
Entry.Popup.prototype.remove = function() {
  for (;this.window_.hasChildNodes();) {
    "workspace" == Entry.type ? Entry.view_.insertBefore(this.window_.firstChild, Entry.container.view_) : Entry.view_.insertBefore(this.window_.lastChild, Entry.view_.firstChild);
  }
  $("body").css("overflow", "auto");
  Entry.removeElement(this.body_);
  window.popup = null;
  Entry.removeEventListener("windowResized", this.resize);
  Entry.engine.popup = null;
};
Entry.Popup.prototype.resize = function(a) {
  a = window.popup.window_;
  var b = .9 * window.innerWidth, c = .9 * window.innerHeight - 35;
  9 * b <= 16 * c ? c = b / 16 * 9 : b = 16 * c / 9;
  a.style.width = String(b) + "px";
  a.style.height = String(c + 35) + "px";
};
Entry.Reporter = function() {
  this.userId;
  this.projectId;
};
Entry.Reporter.prototype.start = function(a, b, c) {
  this.io = io(window.location.href.split("/")[2]);
  this.io.emit("activity", {message:"start", userId:b, projectId:a, time:c});
  this.userId = b;
  this.projectId = a;
};
Entry.Reporter.prototype.report = function(a) {
  if (this.io) {
    var b = [], c;
    for (c in a.params) {
      var d = a.params[c];
      "object" !== typeof d ? b.push(d) : d.id && b.push(d.id);
    }
    this.io.emit("activity", {message:a.message, userId:this.userId, projectId:this.projectId, time:a.time, params:b});
  }
};
Entry.Scene = function() {
  this.scenes_ = [];
  this.selectedScene = null;
  this.maxCount = 10;
};
Entry.Scene.prototype.generateView = function(a, b) {
  this.view_ = a;
  this.view_.addClass("entryScene");
  if (!b || "workspace" == b) {
    this.view_.addClass("entrySceneWorkspace");
    var c = Entry.createElement("ul");
    c.addClass("entrySceneListWorkspace");
    Entry.sceneEditable && $ && $(c).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
      $(b.item[0]).clone(!0);
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), h = b.item.index();
      Entry.scene.moveScene(c, h);
    }, axis:"x"});
    this.view_.appendChild(c);
    this.listView_ = c;
    Entry.sceneEditable && (c = Entry.createElement("span"), c.addClass("entrySceneElementWorkspace"), c.addClass("entrySceneAddButtonWorkspace"), c.bindOnClick(function(a) {
      Entry.engine.isState("run") || Entry.scene.addScene();
    }), this.view_.appendChild(c), this.addButton_ = c);
  }
};
Entry.Scene.prototype.generateElement = function(a) {
  var b = Entry.createElement("li", a.id);
  b.addClass("entrySceneElementWorkspace");
  b.addClass("entrySceneButtonWorkspace");
  b.bindOnClick(function(b) {
    Entry.engine.isState("run") ? b.preventDefault() : Entry.scene.selectScene(a);
  });
  var c = Entry.createElement("input");
  c.addClass("entrySceneFieldWorkspace");
  c.value = a.name;
  c.style.width = Entry.computeInputWidth(c);
  Entry.sceneEditable || (c.disabled = "disabled");
  var d = Entry.createElement("span");
  d.addClass("entrySceneLeftWorkspace");
  b.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entrySceneInputCover");
  b.appendChild(d);
  c.onkeyup = function(b) {
    b = b.keyCode;
    Entry.isArrowOrBackspace(b) || (a.name = this.value, c.style.width = Entry.computeInputWidth(this), 13 == b && this.blur(), 9 < this.value.length && (this.value = this.value.substring(0, 10), this.blur()));
  };
  c.onblur = function(b) {
    c.value = this.value;
    a.name = this.value;
    c.style.width = Entry.computeInputWidth(this);
  };
  d.appendChild(c);
  d.nameField = c;
  d = Entry.createElement("span");
  d.addClass("entrySceneRemoveButtonCoverWorkspace");
  b.appendChild(d);
  if (Entry.sceneEditable) {
    var e = Entry.createElement("button");
    e.addClass("entrySceneRemoveButtonWorkspace");
    e.innerHTML = "x";
    e.scene = a;
    e.bindOnClick(function(a) {
      a.stopPropagation();
      Entry.engine.isState("run") || confirm("\uc120\ud0dd\ud55c \uc7a5\uba74\uc744 \uc0ad\uc81c \ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?") && Entry.scene.removeScene(this.scene);
    });
    d.appendChild(e);
  }
  $ && context.attach("#" + a.id, [{text:"\ubcf5\uc81c\ud558\uae30", href:"/", action:function(b) {
    b.preventDefault();
    Entry.scene.cloneScene(a);
  }}]);
  return a.view = b;
};
Entry.Scene.prototype.updateView = function() {
  if (!Entry.type || "workspace" == Entry.type) {
    for (var a = this.listView_;a.hasChildNodes();) {
      a.lastChild.removeClass("selectedScene"), a.removeChild(a.lastChild);
    }
    for (var b in this.getScenes()) {
      var c = this.scenes_[b];
      a.appendChild(c.view);
      this.selectedScene.id == c.id && c.view.addClass("selectedScene");
    }
    this.addButton_ && (this.getScenes().length < this.maxCount ? this.addButton_.removeClass("entryRemove") : this.addButton_.addClass("entryRemove"));
  }
};
Entry.Scene.prototype.addScenes = function(a) {
  if ((this.scenes_ = a) && 0 != a.length) {
    for (var b = 0, c = a.length;b < c;b++) {
      this.generateElement(a[b]);
    }
  } else {
    this.scenes_ = [], this.scenes_.push(this.createScene());
  }
  this.selectScene(this.getScenes()[0]);
  this.updateView();
};
Entry.Scene.prototype.addScene = function(a, b) {
  null == a && (a = this.createScene());
  a.view || this.generateElement(a);
  b || "number" == typeof b ? this.getScenes().splice(b, 0, a) : this.getScenes().push(a);
  Entry.stage.objectContainers.push(Entry.stage.createObjectContainer(a));
  Entry.playground.flushPlayground();
  this.selectScene(a);
  this.updateView();
  return a;
};
Entry.Scene.prototype.removeScene = function(a) {
  if (1 >= this.getScenes().length) {
    Entry.toast.alert(Lang.Msgs.runtime_error, "\uc7a5\uba74\uc740 \ucd5c\uc18c \ud558\ub098 \uc774\uc0c1 \uc874\uc7ac \ud574\uc57c \ud569\ub2c8\ub2e4.", !1);
  } else {
    var b = this.getScenes().indexOf(this.getSceneById(a.id));
    this.getScenes().splice(b, 1);
    this.selectScene();
    for (var b = Entry.container.getSceneObjects(a), c = 0;c < b.length;c++) {
      Entry.container.removeObject(b[c]);
    }
    Entry.stage.removeObjectContainer(a);
    this.updateView();
  }
};
Entry.Scene.prototype.selectScene = function(a) {
  a = a || this.getScenes()[0];
  this.selectedScene && this.selectedScene.id == a.id || (Entry.engine.isState("run") && Entry.container.resetSceneDuringRun(), this.selectedScene = a, Entry.container.setCurrentObjects(), Entry.stage.objectContainers && 0 != Entry.stage.objectContainers.length && Entry.stage.selectObjectContainer(a), (a = Entry.container.getCurrentObjects()[0]) && "minimize" != Entry.type ? Entry.container.selectObject(a.id) : (Entry.stage.selectObject(null), Entry.playground.flushPlayground(), Entry.variableContainer.updateList()), 
  Entry.container.listView_ || Entry.stage.sortZorder(), Entry.container.updateListView(), this.updateView());
};
Entry.Scene.prototype.toJSON = function() {
  for (var a = [], b = this.getScenes().length, c = 0;c < b;c++) {
    var d = this.getScenes()[c], e = d.view;
    delete d.view;
    a.push(JSON.parse(JSON.stringify(d)));
    d.view = e;
  }
  return a;
};
Entry.Scene.prototype.moveScene = function(a, b) {
  this.getScenes().splice(b, 0, this.getScenes().splice(a, 1)[0]);
  Entry.container.updateObjectsOrder();
  Entry.stage.sortZorder();
};
Entry.Scene.prototype.getSceneById = function(a) {
  for (var b = this.getScenes(), c = 0;c < b.length;c++) {
    if (b[c].id == a) {
      return b[c];
    }
  }
  return !1;
};
Entry.Scene.prototype.getScenes = function() {
  return this.scenes_;
};
Entry.Scene.prototype.takeStartSceneSnapshot = function() {
  this.sceneBeforeRun = this.selectedScene;
};
Entry.Scene.prototype.loadStartSceneSnapshot = function() {
  this.selectScene(this.sceneBeforeRun);
  this.sceneBeforeRun = null;
};
Entry.Scene.prototype.createScene = function() {
  var a = {name:Lang.Blocks.SCENE + " " + (this.getScenes().length + 1), id:Entry.generateHash()};
  this.generateElement(a);
  return a;
};
Entry.Scene.prototype.cloneScene = function(a) {
  if (this.scenes_.length >= this.maxCount) {
    Entry.toast.alert(Lang.Msgs.runtime_error, "\uc7a5\uba74\uc740 \ucd5c\ub300 10\uac1c\uae4c\uc9c0 \ucd94\uac00 \uac00\ub2a5\ud569\ub2c8\ub2e4.", !1);
  } else {
    var b = {name:a.name + "\uc758 \ubcf5\uc81c\ubcf8", id:Entry.generateHash()};
    this.generateElement(b);
    this.addScene(b);
    a = Entry.container.getSceneObjects(a);
    for (var c = a.length - 1;0 <= c;c--) {
      Entry.container.addCloneObject(a[c], b.id);
    }
  }
};
Entry.Script = function(a) {
  this.entity = a;
};
p = Entry.Script.prototype;
p.init = function(a, b, c) {
  Entry.assert("BLOCK" == a.tagName.toUpperCase(), a.tagName);
  this.type = a.getAttribute("type");
  this.id = Number(a.getAttribute("id"));
  a.getElementsByTagName("mutation").length && a.getElementsByTagName("mutation")[0].hasAttribute("hashid") && (this.hashId = a.childNodes[0].getAttribute("hashid"));
  "REPEAT" == this.type.substr(0, 6).toUpperCase() && (this.isRepeat = !0);
  b instanceof Entry.Script && (this.previousScript = b, b.parentScript && (this.parentScript = b.parentScript));
  c instanceof Entry.Script && (this.parentScript = c);
  a = a.childNodes;
  for (b = 0;b < a.length;b++) {
    if (c = a[b], "NEXT" == c.tagName.toUpperCase()) {
      this.nextScript = new Entry.Script(this.entity), this.register && (this.nextScript.register = this.register), this.nextScript.init(a[b].childNodes[0], this);
    } else {
      if ("VALUE" == c.tagName.toUpperCase()) {
        this.values || (this.values = {});
        var d = new Entry.Script(this.entity);
        this.register && (d.register = this.register);
        d.init(c.childNodes[0]);
        this.values[c.getAttribute("name")] = d;
      } else {
        "FIELD" == c.tagName.toUpperCase() ? (this.fields || (this.fields = {}), this.fields[c.getAttribute("name")] = c.textContent) : "STATEMENT" == c.tagName.toUpperCase() && (this.statements || (this.statements = {}), d = new Entry.Script(this.entity), this.register && (d.register = this.register), d.init(c.childNodes[0], null, this), d.key = c.getAttribute("name"), this.statements[c.getAttribute("name")] = d);
      }
    }
  }
};
p.clone = function(a, b) {
  var c = new Entry.Script(a);
  c.id = this.id;
  c.type = this.type;
  c.isRepeat = this.isRepeat;
  if (this.parentScript && !this.previousScript && 2 != b) {
    c.parentScript = this.parentScript.clone(a);
    for (var d = c.parentScript.statements[this.key] = c;d.nextScript;) {
      d = d.nextScript, d.parentScript = c.parentScript;
    }
  }
  this.nextScript && 1 != b && (c.nextScript = this.nextScript.clone(a, 0), c.nextScript.previousScript = this);
  this.previousScript && 0 != b && (c.previousScript = this.previousScript.clone(a, 1), c.previousScript.previousScript = this);
  if (this.fields) {
    c.fields = {};
    for (var e in this.fields) {
      c.fields[e] = this.fields[e];
    }
  }
  if (this.values) {
    for (e in c.values = {}, this.values) {
      c.values[e] = this.values[e].clone(a);
    }
  }
  if (this.statements) {
    for (e in c.statements = {}, this.statements) {
      for (c.statements[e] = this.statements[e].clone(a, 2), d = c.statements[e], d.parentScript = c;d.nextScript;) {
        d = d.nextScript, d.parentScript = c;
      }
    }
  }
  return c;
};
p.getStatement = function(a) {
  return this.statements[a];
};
p.compute = function() {
};
p.getValue = function(a) {
  return this.values[a].run();
};
p.getNumberValue = function(a) {
  return Number(this.values[a].run());
};
p.getStringValue = function(a) {
  return String(this.values[a].run());
};
p.getBooleanValue = function(a) {
  return this.values[a].run() ? !0 : !1;
};
p.getField = function(a) {
  return this.fields[a];
};
p.getStringField = function(a) {
  return String(this.fields[a]);
};
p.getNumberField = function(a) {
  return Number(this.fields[a]);
};
p.callReturn = function() {
  return this.nextScript ? this.nextScript : this.parentScript ? this.parentScript : null;
};
p.run = function() {
  return Entry.block[this.type](this.entity, this);
};
Entry.Stage = function() {
  this.variables = {};
  this.background = new createjs.Shape;
  this.background.graphics.beginFill("#ffffff").drawRect(-480, -240, 960, 480);
  this.objectContainers = [];
  this.selectedObjectContainer = null;
  this.variableContainer = new createjs.Container;
  this.dialogContainer = new createjs.Container;
  this.selectedObject = null;
  this.isObjectClick = !1;
};
Entry.Stage.prototype.initStage = function(a) {
  this.canvas = new createjs.Stage(a.id);
  this.canvas.x = 320;
  this.canvas.y = 180;
  this.canvas.scaleX = this.canvas.scaleY = 2 / 1.5;
  createjs.Touch.enable(this.canvas);
  this.canvas.enableMouseOver(10);
  this.canvas.mouseMoveOutside = !0;
  this.canvas.addChild(this.background);
  this.canvas.addChild(this.variableContainer);
  this.canvas.addChild(this.dialogContainer);
  this.inputField = null;
  this.initCoordinator();
  this.initHandle();
  this.mouseCoordinate = {x:0, y:0};
  if (Entry.isPhone()) {
    a.ontouchstart = function(a) {
      Entry.dispatchEvent("canvasClick", a);
      Entry.stage.isClick = !0;
    }, a.ontouchend = function(a) {
      Entry.stage.isClick = !1;
      Entry.dispatchEvent("canvasClickCanceled", a);
    };
  } else {
    var b = function(a) {
      Entry.dispatchEvent("canvasClick", a);
      Entry.stage.isClick = !0;
    };
    a.onmousedown = b;
    a.ontouchstart = b;
    b = function(a) {
      Entry.stage.isClick = !1;
      Entry.dispatchEvent("canvasClickCanceled", a);
    };
    a.onmouseup = b;
    a.ontouchend = b;
    $(document).click(function(a) {
      Entry.stage.focused = "entryCanvas" === a.target.id ? !0 : !1;
    });
  }
  Entry.addEventListener("canvasClick", function(a) {
    Entry.stage.isObjectClick = !1;
  });
  b = function(a) {
    a.preventDefault();
    var b = this.getBoundingClientRect(), e;
    -1 < Entry.getBrowserType().indexOf("IE") ? (e = 480 * ((a.pageX - b.left - document.documentElement.scrollLeft) / b.width - .5), a = -270 * ((a.pageY - b.top - document.documentElement.scrollTop) / b.height - .5)) : a.changedTouches ? (e = 480 * ((a.changedTouches[0].pageX - b.left - document.body.scrollLeft) / b.width - .5), a = -270 * ((a.changedTouches[0].pageY - b.top - document.body.scrollTop) / b.height - .5)) : (e = 480 * ((a.pageX - b.left - document.body.scrollLeft) / b.width - .5), 
    a = -270 * ((a.pageY - b.top - document.body.scrollTop) / b.height - .5));
    Entry.stage.mouseCoordinate = {x:e.toFixed(1), y:a.toFixed(1)};
    Entry.dispatchEvent("stageMouseMove");
  };
  a.onmousemove = b;
  a.ontouchmove = b;
  a.onmouseout = function(a) {
    Entry.dispatchEvent("stageMouseOut");
  };
  Entry.addEventListener("updateObject", function(a) {
    Entry.engine.isState("stop") && Entry.stage.updateObject();
  });
  Entry.addEventListener("canvasInputComplete", function(a) {
    try {
      var b = Entry.stage.inputField.value();
      Entry.stage.hideInputField();
      b && Entry.container.setInputValue(b);
    } catch (e) {
    }
  });
  this.initWall();
  this.render();
};
Entry.Stage.prototype.render = function() {
  Entry.stage.timer && clearTimeout(Entry.stage.timer);
  var a = (new Date).getTime();
  Entry.stage.update();
  a = (new Date).getTime() - a;
  Entry.stage.timer = setTimeout(Entry.stage.render, 16 - a % 16 + 16 * Math.floor(a / 16));
};
Entry.Stage.prototype.update = function() {
  Entry.engine.isState("stop") && this.objectUpdated ? (this.canvas.update(), this.objectUpdated = !1) : this.canvas.update();
  this.inputField && !this.inputField._isHidden && this.inputField.render();
};
Entry.Stage.prototype.loadObject = function(a) {
  var b = a.entity.object;
  this.getObjectContainerByScene(a.scene).addChild(b);
  this.canvas.update();
};
Entry.Stage.prototype.loadEntity = function(a) {
  Entry.stage.getObjectContainerByScene(a.parent.scene).addChild(a.object);
  this.sortZorder();
};
Entry.Stage.prototype.unloadEntity = function(a) {
  Entry.stage.getObjectContainerByScene(a.parent.scene).removeChild(a.object);
};
Entry.Stage.prototype.loadVariable = function(a) {
  var b = a.view_;
  this.variables[a.id] = b;
  this.variableContainer.addChild(b);
  this.canvas.update();
};
Entry.Stage.prototype.removeVariable = function(a) {
  this.variableContainer.removeChild(a.view_);
  this.canvas.update();
};
Entry.Stage.prototype.loadDialog = function(a) {
  this.dialogContainer.addChild(a.object);
};
Entry.Stage.prototype.unloadDialog = function(a) {
  this.dialogContainer.removeChild(a.object);
};
Entry.Stage.prototype.sortZorder = function() {
  for (var a = Entry.container.getCurrentObjects(), b = this.selectedObjectContainer, c = 0, d = a.length - 1;0 <= d;d--) {
    for (var e = a[d], f = e.clonedEntities, h = 0, g = f.length;h < g;h++) {
      b.setChildIndex(f[h].object, c++);
    }
    e = e.entity;
    e.shape && b.setChildIndex(e.shape, c++);
    b.setChildIndex(e.object, c++);
  }
};
Entry.Stage.prototype.initCoordinator = function() {
  var a = new createjs.Container, b = new createjs.Bitmap("/img/assets/workspace_coordinate.png");
  b.scaleX = .5;
  b.scaleY = .5;
  b.x = -240;
  b.y = -135;
  a.addChild(b);
  this.canvas.addChild(a);
  a.visible = !1;
  this.coordinator = a;
};
Entry.Stage.prototype.toggleCoordinator = function() {
  this.coordinator.visible = !this.coordinator.visible;
};
Entry.Stage.prototype.selectObject = function(a) {
  this.selectedObject = a ? a : null;
  this.updateObject();
};
Entry.Stage.prototype.initHandle = function() {
  this.handle = new EaselHandle(this.canvas);
  this.handle.setChangeListener(this, this.updateHandle);
  this.handle.setEditStartListener(this, this.startEdit);
  this.handle.setEditEndListener(this, this.endEdit);
};
Entry.Stage.prototype.updateObject = function() {
  this.handle.setDraggable(!0);
  if (!this.editEntity) {
    var a = this.selectedObject;
    if (a && a.entity.getVisible()) {
      "textBox" == a.objectType ? this.handle.toggleCenter(!1) : this.handle.toggleCenter(!0);
      "free" == a.getRotateMethod() ? this.handle.toggleRotation(!0) : this.handle.toggleRotation(!1);
      this.handle.toggleDirection(!0);
      a.getLock() ? (this.handle.toggleRotation(!1), this.handle.toggleDirection(!1), this.handle.toggleResize(!1), this.handle.toggleCenter(!1), this.handle.setDraggable(!1)) : this.handle.toggleResize(!0);
      this.handle.setVisible(!0);
      a = a.entity;
      this.handle.setWidth(a.getScaleX() * a.getWidth());
      this.handle.setHeight(a.getScaleY() * a.getHeight());
      if ("textBox" == a.type) {
        if (a.getLineBreak()) {
          var b = a.regX * a.scaleX, c = -a.regY * a.scaleY
        } else {
          var d = a.getTextAlign(), c = -a.regY * a.scaleY;
          switch(d) {
            case Entry.TEXT_ALIGN_LEFT:
              b = -a.getWidth() / 2 * a.scaleX;
              break;
            case Entry.TEXT_ALIGN_CENTER:
              b = a.regX * a.scaleX;
              break;
            case Entry.TEXT_ALIGN_RIGHT:
              b = a.getWidth() / 2 * a.scaleX;
          }
        }
      } else {
        b = (a.regX - a.width / 2) * a.scaleX, c = (a.height / 2 - a.regY) * a.scaleY;
      }
      d = a.getRotation() / 180 * Math.PI;
      this.handle.setX(a.getX() - b * Math.cos(d) - c * Math.sin(d));
      this.handle.setY(-a.getY() - b * Math.sin(d) + c * Math.cos(d));
      this.handle.setRegX((a.regX - a.width / 2) * a.scaleX);
      this.handle.setRegY((a.regY - a.height / 2) * a.scaleY);
      this.handle.setRotation(a.getRotation());
      this.handle.setDirection(a.getDirection());
      this.handle.render();
      this.objectUpdated = !0;
    } else {
      this.handle.setVisible(!1);
    }
  }
};
Entry.Stage.prototype.updateHandle = function() {
  this.editEntity = !0;
  var a = this.handle, b = this.selectedObject.entity;
  b.lineBreak ? (b.setHeight(a.height / b.getScaleY()), b.setWidth(a.width / b.getScaleX())) : (0 !== b.width && (0 > b.getScaleX() ? b.setScaleX(-a.width / b.width) : b.setScaleX(a.width / b.width)), 0 !== b.height && b.setScaleY(a.height / b.height));
  var c = a.rotation / 180 * Math.PI;
  if ("textBox" == b.type) {
    var d = a.regX / b.scaleX, d = a.regY / b.scaleY;
    if (b.getLineBreak()) {
      b.setX(a.x), b.setY(-a.y);
    } else {
      switch(b.getTextAlign()) {
        case Entry.TEXT_ALIGN_LEFT:
          b.setX(a.x - a.width / 2 * Math.cos(c));
          b.setY(-a.y + a.width / 2 * Math.sin(c));
          break;
        case Entry.TEXT_ALIGN_CENTER:
          b.setX(a.x);
          b.setY(-a.y);
          break;
        case Entry.TEXT_ALIGN_RIGHT:
          b.setX(a.x + a.width / 2 * Math.cos(c)), b.setY(-a.y - a.width / 2 * Math.sin(c));
      }
    }
  } else {
    d = b.width / 2 + a.regX / b.scaleX, b.setX(a.x + a.regX * Math.cos(c) - a.regY * Math.sin(c)), b.setRegX(d), d = b.height / 2 + a.regY / b.scaleY, b.setY(-a.y - a.regX * Math.sin(c) - a.regY * Math.cos(c)), b.setRegY(d);
  }
  b.setDirection(a.direction);
  b.setRotation(a.rotation);
  this.selectedObject.entity.doCommand();
  this.editEntity = !1;
};
Entry.Stage.prototype.startEdit = function() {
  this.selectedObject.entity.initCommand();
};
Entry.Stage.prototype.endEdit = function() {
  this.selectedObject.entity.checkCommand();
};
Entry.Stage.prototype.initWall = function() {
  var a = new createjs.Container, b = new Image;
  b.src = "/media/bound.png";
  a.up = new createjs.Bitmap;
  a.up.scaleX = 16;
  a.up.y = -165;
  a.up.x = -240;
  a.up.image = b;
  a.addChild(a.up);
  a.down = new createjs.Bitmap;
  a.down.scaleX = 16;
  a.down.y = 135;
  a.down.x = -240;
  a.down.image = b;
  a.addChild(a.down);
  a.right = new createjs.Bitmap;
  a.right.scaleY = 9;
  a.right.y = -135;
  a.right.x = 240;
  a.right.image = b;
  a.addChild(a.right);
  a.left = new createjs.Bitmap;
  a.left.scaleY = 9;
  a.left.y = -135;
  a.left.x = -270;
  a.left.image = b;
  a.addChild(a.left);
  this.canvas.addChild(a);
  this.wall = a;
};
Entry.Stage.prototype.showInputField = function(a) {
  a = 1 / 1.5;
  this.inputField || (this.inputField = new CanvasInput({canvas:document.getElementById("entryCanvas"), fontSize:30 * a, fontFamily:"NanumGothic", fontColor:"#212121", width:556 * a, height:26 * a, padding:8 * a, borderWidth:1 * a, borderColor:"#000", borderRadius:3 * a, boxShadow:"none", innerShadow:"0px 0px 5px rgba(0, 0, 0, 0.5)", x:202 * a, y:450 * a, topPosition:!0, onsubmit:function() {
    Entry.dispatchEvent("canvasInputComplete");
  }}));
  a = new createjs.Container;
  var b = new Image;
  b.src = "/img/assets/confirm_button.png";
  var c = new createjs.Bitmap;
  c.scaleX = .23;
  c.scaleY = .23;
  c.x = 160;
  c.y = 89;
  c.cursor = "pointer";
  c.image = b;
  a.addChild(c);
  a.on("mousedown", function(a) {
    Entry.dispatchEvent("canvasInputComplete");
  });
  this.inputSubmitButton || (this.inputField.value(""), this.canvas.addChild(a), this.inputSubmitButton = a);
  this.inputField.show();
};
Entry.Stage.prototype.hideInputField = function() {
  this.inputField && this.inputField.value() && this.inputField.value("");
  this.inputSubmitButton && (this.canvas.removeChild(this.inputSubmitButton), this.inputSubmitButton = null);
  this.inputField && this.inputField.hide();
};
Entry.Stage.prototype.initObjectContainers = function() {
  var a = Entry.scene.scenes_;
  if (a && 0 != a.length) {
    for (var b = 0;b < a.length;b++) {
      this.objectContainers[b] = this.createObjectContainer(a[b]);
    }
    this.selectedObjectContainer = this.objectContainers[0];
  } else {
    a = this.createObjectContainer(Entry.scene.selectedScene), this.objectContainers.push(a), this.selectedObjectContainer = a;
  }
  this.canvas.addChild(this.selectedObjectContainer);
  this.selectObjectContainer(Entry.scene.selectedScene);
};
Entry.Stage.prototype.selectObjectContainer = function(a) {
  if (this.canvas) {
    for (var b = this.objectContainers, c = 0;c < b.length;c++) {
      this.canvas.removeChild(b[c]);
    }
    this.selectedObjectContainer = this.getObjectContainerByScene(a);
    this.canvas.addChildAt(this.selectedObjectContainer, 2);
  }
};
Entry.Stage.prototype.reAttachToCanvas = function() {
  for (var a = [this.selectedObjectContainer, this.variableContainer, this.coordinator, this.handle, this.dialogContainer], b = 0;b < a.length;b++) {
    this.canvas.removeChild(a[b]), this.canvas.addChild(a[b]);
  }
  console.log(this.canvas.getChildIndex(this.selectedObjectContainer));
};
Entry.Stage.prototype.createObjectContainer = function(a) {
  var b = new createjs.Container;
  b.scene = a;
  return b;
};
Entry.Stage.prototype.removeObjectContainer = function(a) {
  var b = this.objectContainers;
  a = this.getObjectContainerByScene(a);
  this.canvas.removeChild(a);
  b.splice(this.objectContainers.indexOf(a), 1);
};
Entry.Stage.prototype.getObjectContainerByScene = function(a) {
  for (var b = this.objectContainers, c = 0;c < b.length;c++) {
    if (b[c].scene.id == a.id) {
      return b[c];
    }
  }
};
Entry.Stage.prototype.moveSprite = function(a) {
  if (this.selectedObject && Entry.stage.focused && !this.selectedObject.getLock()) {
    var b = 5;
    a.shiftKey && (b = 10);
    var c = this.selectedObject.entity;
    switch(a.keyCode) {
      case 38:
        c.setY(c.getY() + b);
        break;
      case 40:
        c.setY(c.getY() - b);
        break;
      case 37:
        c.setX(c.getX() - b);
        break;
      case 39:
        c.setX(c.getX() + b);
    }
    this.updateObject();
  }
};
Entry.StampEntity = function(a, b) {
  this.parent = a;
  this.type = a.objectType;
  this.isStamp = this.isClone = !0;
  this.width = b.getWidth();
  this.height = b.getHeight();
  "sprite" == this.type && (this.object = b.object.clone(!0), this.object.filters = null, b.effect && (this.effect = Entry.cloneSimpleObject(b.effect), this.applyFilter()));
  this.object.entity = this;
  if (b.dialog) {
    var c = b.dialog;
    new Entry.Dialog(this, c.message_, c.mode_, !0);
    this.dialog.object = b.dialog.object.clone(!0);
    Entry.stage.loadDialog(this.dialog);
  }
};
var EntityPrototype = Entry.EntityObject.prototype;
Entry.StampEntity.prototype.applyFilter = EntityPrototype.applyFilter;
Entry.StampEntity.prototype.removeClone = EntityPrototype.removeClone;
Entry.StampEntity.prototype.getWidth = EntityPrototype.getWidth;
Entry.StampEntity.prototype.getHeight = EntityPrototype.getHeight;
Entry.State = function(a, b, c, d) {
  this.caller = b;
  this.func = c;
  3 < arguments.length && (this.params = Array.prototype.slice.call(arguments).slice(3));
  this.message = a;
  this.time = Entry.getUpTime();
};
Entry.State.prototype.generateMessage = function() {
};
Entry.StateManager = function() {
  this.undoStack_ = [];
  this.redoStack_ = [];
  this.isIgnore = this.isRestore = !1;
  Entry.addEventListener("cancelLastCommand", function(a) {
    Entry.stateManager.cancelLastCommand();
  });
  Entry.addEventListener("run", function(a) {
    Entry.stateManager.updateView();
  });
  Entry.addEventListener("stop", function(a) {
    Entry.stateManager.updateView();
  });
  Entry.addEventListener("saveWorkspace", function(a) {
    Entry.stateManager.addStamp();
  });
  Entry.addEventListener("undo", function(a) {
    Entry.stateManager.undo();
  });
  Entry.addEventListener("redo", function(a) {
    Entry.stateManager.redo();
  });
};
Entry.StateManager.prototype.generateView = function(a, b) {
};
Entry.StateManager.prototype.addCommand = function(a, b, c, d) {
  if (!this.isIgnoring()) {
    if (this.isRestoring()) {
      var e = new Entry.State, f = Array.prototype.slice.call(arguments);
      Entry.State.prototype.constructor.apply(e, f);
      this.redoStack_.push(e);
      Entry.reporter && Entry.reporter.report(e);
    } else {
      e = new Entry.State, f = Array.prototype.slice.call(arguments), Entry.State.prototype.constructor.apply(e, f), this.undoStack_.push(e), Entry.reporter && Entry.reporter.report(e), this.updateView();
    }
  }
};
Entry.StateManager.prototype.cancelLastCommand = function() {
  this.canUndo() && (this.undoStack_.pop(), this.updateView());
};
Entry.StateManager.prototype.undo = function() {
  if (this.canUndo() && !this.isRestoring()) {
    this.addActivity("undo");
    this.startRestore();
    var a = this.undoStack_.pop();
    a.func.apply(a.caller, a.params);
    this.updateView();
    this.endRestore();
  }
};
Entry.StateManager.prototype.redo = function() {
  if (this.canRedo() && !this.isRestoring()) {
    this.addActivity("redo");
    var a = this.redoStack_.pop();
    a.func.apply(a.caller, a.params);
    this.updateView();
  }
};
Entry.StateManager.prototype.updateView = function() {
  this.undoButton && this.redoButton && (this.canUndo() ? this.undoButton.addClass("active") : this.undoButton.removeClass("active"), this.canRedo() ? this.redoButton.addClass("active") : this.redoButton.removeClass("active"));
};
Entry.StateManager.prototype.startRestore = function() {
  this.isRestore = !0;
};
Entry.StateManager.prototype.endRestore = function() {
  this.isRestore = !1;
};
Entry.StateManager.prototype.isRestoring = function() {
  return this.isRestore;
};
Entry.StateManager.prototype.startIgnore = function() {
  this.isIgnore = !0;
};
Entry.StateManager.prototype.endIgnore = function() {
  this.isIgnore = !1;
};
Entry.StateManager.prototype.isIgnoring = function() {
  return this.isIgnore;
};
Entry.StateManager.prototype.canUndo = function() {
  return 0 < this.undoStack_.length && Entry.engine.isState("stop");
};
Entry.StateManager.prototype.canRedo = function() {
  return 0 < this.redoStack_.length && Entry.engine.isState("stop");
};
Entry.StateManager.prototype.addStamp = function() {
  this.stamp = Entry.generateHash();
  this.undoStack_.length && (this.undoStack_[this.undoStack_.length - 1].stamp = this.stamp);
};
Entry.StateManager.prototype.isSaved = function() {
  return 0 == this.undoStack_.length || this.undoStack_[this.undoStack_.length - 1].stamp == this.stamp && "string" == typeof this.stamp;
};
Entry.StateManager.prototype.addActivity = function(a) {
  Entry.reporter && Entry.reporter.report(new Entry.State(a));
};
Entry.Toast = function() {
  this.toasts_ = [];
  var a = document.getElementById("entryToastContainer");
  a && document.body.removeChild(a);
  this.body_ = Entry.createElement("div", "entryToastContainer");
  this.body_.addClass("entryToastContainer");
  document.body.appendChild(this.body_);
};
Entry.Toast.prototype.success = function(a, b, c) {
  var d = Entry.createElement("div", "entryToast");
  d.addClass("entryToast");
  d.addClass("entryToastSuccess");
  d.bindOnClick(function() {
    Entry.toast.body_.removeChild(this);
  });
  var e = Entry.createElement("div", "entryToast");
  e.addClass("entryToastTitle");
  e.innerHTML = a;
  d.appendChild(e);
  a = Entry.createElement("p", "entryToast");
  a.addClass("entryToastMessage");
  a.innerHTML = b;
  d.appendChild(a);
  this.toasts_.push(d);
  this.body_.appendChild(d);
  c || window.setTimeout(function() {
    d.style.opacity = 1;
    var a = setInterval(function() {
      .05 > d.style.opacity && (clearInterval(a), d.style.display = "none", Entry.removeElement(d));
      d.style.opacity *= .9;
    }, 20);
  }, 1E3);
};
Entry.Toast.prototype.alert = function(a, b, c) {
  var d = Entry.createElement("div", "entryToast");
  d.addClass("entryToast");
  d.addClass("entryToastAlert");
  d.bindOnClick(function() {
    Entry.toast.body_.removeChild(this);
  });
  var e = Entry.createElement("div", "entryToast");
  e.addClass("entryToastTitle");
  e.innerHTML = a;
  d.appendChild(e);
  a = Entry.createElement("p", "entryToast");
  a.addClass("entryToastMessage");
  a.innerHTML = b;
  d.appendChild(a);
  this.toasts_.push(d);
  this.body_.appendChild(d);
  c || window.setTimeout(function() {
    d.style.opacity = 1;
    var a = setInterval(function() {
      .05 > d.style.opacity && (clearInterval(a), d.style.display = "none", Entry.toast.body_.removeChild(d));
      d.style.opacity *= .9;
    }, 20);
  }, 5E3);
};
Entry.Utils = {};
Entry.overridePrototype = function() {
  Number.prototype.mod = function(a) {
    return (this % a + a) % a;
  };
};
Entry.sampleColours = [];
Entry.assert = function(a, b) {
  if (!a) {
    throw Error(b || "Assert failed");
  }
};
Entry.parseTexttoXML = function(a) {
  if (window.ActiveXObject) {
    var b = new ActiveXObject("Microsoft.XMLDOM");
    b.async = "false";
    b.loadXML(a);
  } else {
    b = (new DOMParser).parseFromString(a, "text/xml");
  }
  return b;
};
Entry.createElement = function(a, b) {
  var c = document.createElement(a);
  b && (c.id = b);
  c.hasClass = function(a) {
    return this.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"));
  };
  c.addClass = function(a) {
    for (var b = 0;b < arguments.length;b++) {
      a = arguments[b], this.hasClass(a) || (this.className += " " + a);
    }
  };
  c.removeClass = function(a) {
    for (var b = 0;b < arguments.length;b++) {
      a = arguments[b], this.hasClass(a) && (this.className = this.className.replace(new RegExp("(\\s|^)" + a + "(\\s|$)"), " "));
    }
  };
  c.bindOnClick = function(a) {
    $(this).on("click touchstart", function(b) {
      b.stopImmediatePropagation();
      b.handled || (b.handled = !0, a.call(this, b));
    });
  };
  return c;
};
Entry.generateHash = function() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4);
};
Entry.addEventListener = function(a, b) {
  this.events_[a] || (this.events_[a] = []);
  b instanceof Function && this.events_[a].push(b);
  return !0;
};
Entry.dispatchEvent = function(a, b) {
  if (this.events_[a]) {
    for (var c = 0, d = this.events_[a].length;c < d;c++) {
      this.events_[a][c].call(window, b);
    }
  }
};
Entry.removeEventListener = function(a, b) {
  if (this.events_[a]) {
    for (var c = 0, d = this.events_[a].length;c < d;c++) {
      if (this.events_[a][c] === b) {
        this.events_[a].splice(c, 1);
        break;
      }
    }
  }
};
Entry.removeAllEventListener = function(a) {
  a && delete this.events_[a];
};
Entry.addTwoNumber = function(a, b) {
  if (isNaN(a) || isNaN(b)) {
    return a + b;
  }
  a += "";
  b += "";
  var c = a.indexOf("."), d = b.indexOf("."), e = 0, f = 0;
  0 < c && (e = a.length - c - 1);
  0 < d && (f = b.length - d - 1);
  return 0 < e || 0 < f ? e >= f ? (parseFloat(a) + parseFloat(b)).toFixed(e) : (parseFloat(a) + parseFloat(b)).toFixed(f) : parseInt(a) + parseInt(b);
};
Entry.hex2rgb = function(a) {
  return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {r:parseInt(a[1], 16), g:parseInt(a[2], 16), b:parseInt(a[3], 16)} : null;
};
Entry.rgb2hex = function(a, b, c) {
  return "#" + (16777216 + (a << 16) + (b << 8) + c).toString(16).slice(1);
};
Entry.generateRgb = function() {
  return {r:Math.floor(256 * Math.random()), g:Math.floor(256 * Math.random()), b:Math.floor(256 * Math.random())};
};
Entry.adjustValueWithMaxMin = function(a, b, c) {
  return a > c ? c : a < b ? b : a;
};
Entry.isExist = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (c[d][b] == a) {
      return c[d];
    }
  }
  return !1;
};
Entry.getColourCodes = function() {
  return "transparent #660000 #663300 #996633 #003300 #003333 #003399 #000066 #330066 #660066 #FFFFFF #990000 #993300 #CC9900 #006600 #336666 #0033FF #000099 #660099 #990066 #000000 #CC0000 #CC3300 #FFCC00 #009900 #006666 #0066FF #0000CC #663399 #CC0099 #333333 #FF0000 #FF3300 #FFFF00 #00CC00 #009999 #0099FF #0000FF #9900CC #FF0099 #666666 #CC3333 #FF6600 #FFFF33 #00FF00 #00CCCC #00CCFF #3366FF #9933FF #FF00FF #999999 #FF6666 #FF6633 #FFFF66 #66FF66 #66CCCC #00FFFF #3399FF #9966FF #FF66FF #BBBBBB #FF9999 #FF9966 #FFFF99 #99FF99 #66FFCC #99FFFF #66CCff #9999FF #FF99FF #CCCCCC #FFCCCC #FFCC99 #FFFFCC #CCFFCC #99FFCC #CCFFFF #99CCFF #CCCCFF #FFCCFF".split(" ");
};
Entry.removeElement = function(a) {
  a && a.parentNode && a.parentNode.removeChild(a);
};
Entry.getElementsByClassName = function(a) {
  for (var b = [], c = document.getElementsByTagName("*"), d = 0;d < c.length;d++) {
    -1 < (" " + c[d].className + " ").indexOf(" " + a + " ") && b.push(c[d]);
  }
  return b;
};
Entry.parseNumber = function(a) {
  return "string" != typeof a || isNaN(Number(a)) ? "number" != typeof a || isNaN(Number(a)) ? !1 : a : Number(a);
};
Entry.countStringLength = function(a) {
  var b, c = 0;
  for (b = 0;b < a.length;b++) {
    255 < a.charCodeAt(b) ? c += 2 : c++;
  }
  return c;
};
Entry.cutStringByLength = function(a, b) {
  var c, d = 0;
  for (c = 0;d < b && c < a.length;c++) {
    255 < a.charCodeAt(c) ? d += 2 : d++;
  }
  return a.substr(0, c);
};
Entry.isChild = function(a, b) {
  if (null != b) {
    for (;b.parentNode;) {
      if ((b = b.parentNode) == a) {
        return !0;
      }
    }
  }
  return !1;
};
Entry.launchFullScreen = function(a) {
  a.requestFullscreen ? a.requestFullscreen() : a.mozRequestFulScreen ? a.mozRequestFulScreen() : a.webkitRequestFullscreen ? a.webkitRequestFullscreen() : a.msRequestFullScreen && a.msRequestFullScreen();
};
Entry.exitFullScreen = function() {
  document.exitFullScreen ? document.exitFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
};
Entry.isPhone = function() {
  return !1;
};
Entry.getKeyCodeMap = function() {
  return {65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z", 32:Lang.Blocks.START_press_some_key_space, 37:Lang.Blocks.START_press_some_key_left, 38:Lang.Blocks.START_press_some_key_up, 39:Lang.Blocks.START_press_some_key_right, 40:Lang.Blocks.START_press_some_key_down, 48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 
  13:Lang.Blocks.START_press_some_key_enter};
};
Entry.checkCollisionRect = function(a, b) {
  return !(a.y + a.height < b.y || a.y > b.y + b.height || a.x + a.width < b.x || a.x > b.x + b.width);
};
Entry.bindAnimationCallback = function(a, b) {
  a.addEventListener("webkitAnimationEnd", b, !1);
  a.addEventListener("animationend", b, !1);
  a.addEventListener("oanimationend", b, !1);
};
Entry.cloneSimpleObject = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
};
Entry.nodeListToArray = function(a) {
  for (var b = Array(a.length), c = -1, d = a.length;++c !== d;b[c] = a[c]) {
  }
  return b;
};
Entry.computeInputWidth = function(a) {
  var b = document.createElement("span");
  b.className = "tmp-element";
  b.innerHTML = a.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  document.body.appendChild(b);
  a = b.offsetWidth;
  document.body.removeChild(b);
  return Number(a + 10) + "px";
};
Entry.isArrowOrBackspace = function(a) {
  return -1 < [37, 38, 39, 40, 8].indexOf(a);
};
Entry.hexStringToBin = function(a) {
  bytes = [];
  str;
  for (var b = 0;b < a.length - 1;b += 2) {
    bytes.push(parseInt(a.substr(b, 2), 16));
  }
  return str = String.fromCharCode.apply(String, bytes);
};
Entry.findObjsByKey = function(a, b, c) {
  for (var d = [], e = 0;e < a.length;e++) {
    a[e][b] == c && d.push(a[e]);
  }
  return d;
};
Entry.factorials = [];
Entry.factorial = function(a) {
  return 0 == a || 1 == a ? 1 : 0 < Entry.factorials[a] ? Entry.factorials[a] : Entry.factorials[a] = Entry.factorial(a - 1) * a;
};
Entry.getListRealIndex = function(a, b) {
  if (isNaN(a)) {
    switch(a) {
      case "FIRST":
        a = 1;
        break;
      case "LAST":
        a = b.array_.length;
        break;
      case "RANDOM":
        a = Math.floor(Math.random() * b.array_.length) + 1;
    }
  }
  return a;
};
Entry.toRadian = function(a) {
  return Math.PI / 180 * a;
};
Entry.getPicturesJSON = function(a) {
  for (var b = [], c = 0, d = a.length;c < d;c++) {
    var e = a[c], f = {};
    f._id = e._id;
    f.id = e.id;
    f.dimension = e.dimension;
    f.filename = e.filename;
    f.name = e.name;
    f.scale = e.scale;
    b.push(f);
  }
  return b;
};
Entry.getSoundsJSON = function(a) {
  for (var b = [], c = 0, d = a.length;c < d;c++) {
    var e = a[c], f = {};
    f._id = e._id;
    f.duration = e.duration;
    f.ext = e.ext;
    f.id = e.id;
    f.filename = e.filename;
    f.name = e.name;
    b.push(f);
  }
  return b;
};
Entry.cutDecimal = function(a) {
  return Math.round(100 * a) / 100;
};
Entry.getBrowserType = function() {
  if (Entry.userAgent) {
    return Entry.userAgent;
  }
  var a = navigator.userAgent, b, c = a.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(c[1])) {
    return b = /\brv[ :]+(\d+)/g.exec(a) || [], "IE " + (b[1] || "");
  }
  if ("Chrome" === c[1] && (b = a.match(/\b(OPR|Edge)\/(\d+)/), null != b)) {
    return b.slice(1).join(" ").replace("OPR", "Opera");
  }
  c = c[2] ? [c[1], c[2]] : [navigator.appName, navigator.appVersion, "-?"];
  null != (b = a.match(/version\/(\d+)/i)) && c.splice(1, 1, b[1]);
  a = c.join(" ");
  return Entry.userAgent = a;
};
Entry.setBasicBrush = function(a) {
  var b = new createjs.Graphics;
  b.thickness = 1;
  b.rgb = Entry.hex2rgb("#ff0000");
  b.opacity = 100;
  b.setStrokeStyle(1);
  b.beginStroke("rgba(255,0,0,1)");
  var c = new createjs.Shape(b);
  Entry.stage.selectedObjectContainer.addChild(c);
  a.brush && (a.brush = null);
  a.brush = b;
  a.shape && (a.shape = null);
  a.shape = c;
};
Entry.isFloat = function(a) {
  return /\d+\.{1}\d+/.test(a);
};
Entry.getStringIndex = function(a) {
  if (!a) {
    return "";
  }
  for (var b = {string:a, index:1}, c = 0, d = [], e = a.length - 1;0 < e;--e) {
    var f = a.charAt(e);
    if (isNaN(f)) {
      break;
    } else {
      d.unshift(f), c = e;
    }
  }
  0 < c && (b.string = a.substring(0, c), b.index = parseInt(d.join("")) + 1);
  return b;
};
Entry.getOrderedName = function(a, b, c) {
  if (!a) {
    return "untitled";
  }
  if (!b || 0 === b.length) {
    return a;
  }
  c || (c = "name");
  for (var d = 0, e = Entry.getStringIndex(a), f = 0, h = b.length;f < h;f++) {
    var g = Entry.getStringIndex(b[f][c]);
    e.string === g.string && g.index > d && (d = g.index);
  }
  return 0 < d ? e.string + d : a;
};
Entry.changeXmlHashId = function(a) {
  if (/function_field/.test(a.getAttribute("type"))) {
    for (var b = a.getElementsByTagName("mutation"), c = 0, d = b.length;c < d;c++) {
      b[c].setAttribute("hashid", Entry.generateHash());
    }
  }
  return a;
};
Entry.getMaxFloatPoint = function(a) {
  for (var b = 0, c = 0, d = a.length;c < d;c++) {
    var e = String(a[c]), f = e.indexOf(".");
    -1 !== f && (e = e.length - (f + 1), e > b && (b = e));
  }
  return Math.min(b, 20);
};
Entry.convertToRoundedDecimals = function(a, b) {
  return isNaN(a) || !this.isFloat(a) ? a : Number(Math.round(a + "e" + b) + "e-" + b);
};
Entry.attachEventListener = function(a, b, c) {
  setTimeout(function() {
    a.addEventListener(b, c);
  }, 0);
};
Entry.deAttachEventListener = function(a, b, c) {
  a.removeEventListener(b, c);
};
Entry.Func = function() {
  this.id = Entry.generateHash();
  this.content = Blockly.Xml.textToDom(Entry.Func.CREATE_BLOCK);
  this.block = null;
  this.stringHash = {};
  this.booleanHash = {};
};
Entry.Func.threads = {};
Entry.Func.registerFunction = function(a, b) {
  var c = Entry.generateHash(), d = Entry.variableContainer.getFunction(a), e = new Entry.Script(b);
  e.init(d.content.childNodes[0]);
  this.threads[c] = e;
  return c;
};
Entry.Func.executeFunction = function(a) {
  var b = this.threads[a];
  if (b = Entry.Engine.computeThread(b.entity, b)) {
    return this.threads[a] = b, !0;
  }
  delete this.threads[a];
  return !1;
};
Entry.Func.clearThreads = function() {
  this.threads = {};
};
Entry.Func.prototype.init = function(a) {
  this.id = a.id;
  this.content = Blockly.Xml.textToDom(a.content);
  this.block = Blockly.Xml.textToDom("<xml>" + a.block + "</xml>").childNodes[0];
};
Entry.Func.CREATE_BTN = '<xml><btn text="Lang.Workspace.create_function" onclick="Entry.variableContainer.createFunction()"></btn></xml>';
Entry.Func.createBtn = Entry.nodeListToArray(Blockly.Xml.textToDom(Entry.Func.CREATE_BTN).childNodes);
Entry.Func.FIELD_BLOCK = '<xml><block type="function_field_string"><value name="PARAM"><block type="function_param_string"><mutation hashid="#1"/></block></value></block><block type="function_field_boolean"><value name="PARAM"><block type="function_param_boolean"><mutation hashid="#2"/></block></value></block><block type="function_field_label"></block></xml>';
Entry.Func.fieldBlocks = Entry.nodeListToArray(Blockly.Xml.textToDom(Entry.Func.FIELD_BLOCK).childNodes);
Entry.Func.CREATE_BLOCK = '<xml><block type="function_create" deletable="false" x="28" y="28"></block></xml>';
Entry.Func.edit = function(a) {
  this.cancelEdit();
  this.workspace && (this.workspace.visible = !0);
  this.initEditView();
  this.targetFunc = a;
  this.workspace.clear();
  Blockly.Xml.domToWorkspace(this.workspace, a.content);
  this.updateMenu();
  this.position_();
};
Entry.Func.initEditView = function() {
  this.parentView = Entry.playground.blocklyView_;
  if (!this.svg) {
    this.svg = Blockly.createSvgElement("svg", {xmlns:"http://www.w3.org/2000/svg", "xmlns:html":"http://www.w3.org/1999/xhtml", "xmlns:xlink":"http://www.w3.org/1999/xlink", version:"1.1", "class":"blocklySvg entryFunctionEdit"});
    this.workspace = new Blockly.Workspace;
    this.workspace.visible = !0;
    this.generateButtons();
    this.svg.appendChild(this.workspace.createDom());
    this.workspace.scrollbar = new Blockly.ScrollbarPair(this.workspace);
    var a = this.workspace.scrollbar;
    a.resize();
    this.workspace.addTrashcan();
    Blockly.bindEvent_(window, "resize", a, a.resize);
    document.addEventListener("blocklyWorkspaceChange", this.syncFunc, !1);
    var b = this.workspace;
    Blockly.bindEvent_(this.svg, "mousedown", null, function(a) {
      b.dragMode = !0;
      b.startDragMouseX = a.clientX;
      b.startDragMouseY = a.clientY;
      b.startDragMetrics = b.getMetrics();
      b.startScrollX = b.scrollX;
      b.startScrollY = b.scrollY;
    });
    Blockly.bindEvent_(this.svg, "mousemove", null, function(c) {
      var d = a.hScroll;
      a.hScroll.svgGroup_.setAttribute("opacity", "1");
      d.svgGroup_.setAttribute("opacity", "1");
      if (b.dragMode) {
        Blockly.removeAllRanges();
        var d = b.startDragMetrics, e = b.startScrollX + (c.clientX - b.startDragMouseX);
        c = b.startScrollY + (c.clientY - b.startDragMouseY);
        e = Math.min(e, -d.contentLeft);
        c = Math.min(c, -d.contentTop);
        e = Math.max(e, d.viewWidth - d.contentLeft - d.contentWidth);
        c = Math.max(c, d.viewHeight - d.contentTop - d.contentHeight);
        a.set(-e - d.contentLeft, -c - d.contentTop);
      }
    });
    Blockly.bindEvent_(this.svg, "mouseup", null, function(a) {
      b.dragMode = !1;
    });
  }
  Blockly.mainWorkspace.blockMenu.targetWorkspace = this.workspace;
  this.doWhenInit();
  this.parentView.appendChild(this.svg);
};
Entry.Func.save = function() {
  this.targetFunc.content = Blockly.Xml.workspaceToDom(this.workspace);
  this.targetFunc.generateBlock(!0);
  Entry.variableContainer.saveFunction(this.targetFunc);
  this.cancelEdit();
};
Entry.Func.cancelEdit = function() {
  this.svg && this.targetFunc && (this.workspace.visible = !1, this.parentView.removeChild(this.svg), Entry.Func.isEdit = !1, Blockly.mainWorkspace.blockMenu.targetWorkspace = Blockly.mainWorkspace, this.targetFunc.block || (delete Entry.variableContainer.functions_[this.targetFunc.id], delete Entry.variableContainer.selected), delete this.targetFunc, this.updateMenu(), this.doWhenCancel(), Entry.variableContainer.updateList());
};
Entry.Func.getMenuXml = function() {
  var a = [];
  this.targetFunc || (a = a.concat(this.createBtn));
  if (this.targetFunc) {
    var b = this.FIELD_BLOCK, b = b.replace("#1", Entry.generateHash()), b = b.replace("#2", Entry.generateHash()), b = Blockly.Xml.textToDom(b).childNodes, a = a.concat(Entry.nodeListToArray(b))
  }
  for (var c in Entry.variableContainer.functions_) {
    b = Entry.variableContainer.functions_[c], b === this.targetFunc ? (b = Entry.Func.generateBlock(this.targetFunc, Blockly.Xml.workspaceToDom(Entry.Func.workspace), b.id).block, a.push(b)) : a.push(b.block);
  }
  return a;
};
Entry.Func.syncFunc = function() {
  var a = Entry.Func;
  if (a.targetFunc) {
    var b = a.workspace.topBlocks_[0].toString(), c = a.workspace.topBlocks_.length;
    (a.fieldText != b || a.workspaceLength != c) && 1 > Blockly.Block.dragMode_ && (a.updateMenu(), a.fieldText = b, a.workspaceLength = c);
  }
};
Entry.Func.updateMenu = function() {
  if ("func" == Entry.playground.selectedMenu && (Entry.playground.blockMenu.hide(), Entry.playground.blockMenu.show(Entry.Func.getMenuXml()), !Blockly.WidgetDiv.field_ && Entry.Func.targetFunc)) {
    var a = Entry.Func.targetFunc, b = Blockly.Xml.workspaceToDom(Entry.Func.workspace), c = b.getElementsByClassName("function_general"), d = a.id, e, c = Entry.nodeListToArray(c), c = c.filter(function(a) {
      return a.getElementsByTagName("mutation")[0].getAttribute("hashid") == d;
    });
    c.map(function(a) {
      for (e = Entry.Func.generateBlock(b, Blockly.Xml.workspaceToDom(Entry.Func.workspace), d).block;a.firstChild;) {
        a.removeChild(a.firstChild);
      }
      for (;e.firstChild;) {
        a.appendChild(e.firstChild);
      }
    });
    Entry.Func.workspace.clear();
    Blockly.Xml.domToWorkspace(Entry.Func.workspace, b);
  }
};
Entry.Func.prototype.edit = function() {
  Entry.Func.isEdit || (Entry.Func.isEdit = !0, Entry.Func.svg ? this.parentView.appendChild(this.svg) : Entry.Func.initEditView());
};
Entry.Func.generateBlock = function(a, b, c) {
  b = Entry.nodeListToArray(b.childNodes);
  for (var d in b) {
    if ("function_create" == b[d].getAttribute("type")) {
      var e = b[d]
    }
  }
  d = new Entry.Script;
  d.init(e);
  e = d;
  e.values && (e = d.values.FIELD);
  b = '<mutation hashid="' + c + '">';
  var f = "";
  c = "";
  var h = 0, g = 0;
  a.stringHash = {};
  a.booleanHash = {};
  for (d = 0;;d++) {
    switch(e.type) {
      case "function_field_label":
        b += '<field type="label" content="' + e.fields.NAME.replace("<", "&lt;").replace(">", "&gt;") + '"></field>';
        c += e.fields.NAME;
        break;
      case "function_field_boolean":
        var k = e.values.PARAM.hashId;
        b += '<field type="boolean" hashid="' + k + '"></field>';
        f += '<value name="' + k + '"><block type="True"></block></value>';
        a.booleanHash[k] = g;
        g++;
        c += "\ub17c\ub9ac\uac12" + g;
        break;
      case "function_field_string":
        k = e.values.PARAM.hashId, b += '<field type="string" hashid="' + k + '"></field>', f += '<value name="' + k + '"><block type="text"><field name="NAME">10</field></block></value>', a.stringHash[k] = h, h++, c += "\ubb38\uc790\uac12" + h;
    }
    if (e.values && e.values.NEXT) {
      e = e.values.NEXT;
    } else {
      break;
    }
    c += " ";
  }
  a = Blockly.Xml.textToDom('<xml><block type="function_general">' + (b + "</mutation>") + f + "</block></xml>").childNodes[0];
  c || (c = "\ud568\uc218");
  return {block:a, description:c};
};
Entry.Func.prototype.generateBlock = function(a) {
  a = Entry.Func.generateBlock(this, this.content, this.id);
  this.block = a.block;
  this.description = a.description;
};
Entry.Func.prototype.syncViewSize_ = function() {
  var a = this.parentView.getBoundingClientRect();
  this.svg.style.width = a.width;
  this.svg.style.height = a.height;
};
Entry.Func.generateButtons = function() {
  var a = this, b = Blockly.createSvgElement("g", {}, this.svg);
  this.btnWrapper = b;
  var c = Blockly.createSvgElement("text", {x:"27", y:"33", "class":"entryFunctionButtonText"}, b), d = document.createTextNode(Lang.Buttons.save);
  c.appendChild(d);
  var d = Blockly.createSvgElement("text", {x:"102.5", y:"33", "class":"entryFunctionButtonText"}, b), e = document.createTextNode(Lang.Buttons.cancel);
  d.appendChild(e);
  e = Blockly.createSvgElement("circle", {cx:"27.5", cy:"27.5", r:"27.5", "class":"entryFunctionButton"}, b);
  b = Blockly.createSvgElement("circle", {cx:"102.5", cy:"27.5", r:"27.5", "class":"entryFunctionButton"}, b);
  e.onclick = function(b) {
    a.save();
  };
  c.onclick = function(b) {
    a.save();
  };
  b.onclick = function(b) {
    a.cancelEdit();
  };
  d.onclick = function(b) {
    a.cancelEdit();
  };
};
Entry.Func.position_ = function() {
  var a = this.workspace.getMetrics();
  if (a && this.workspace.visible) {
    var b = this.btnWrapper;
    b.setAttribute("transform", "translate(30, 501)");
    Blockly.RTL ? this.left_ = this.MARGIN_SIDE_ : b.left_ = a.viewWidth / 2 + a.absoluteLeft - 60;
    b.top_ = a.viewHeight + a.absoluteTop - 200;
    b.setAttribute("transform", "translate(" + b.left_ + "," + b.top_ + ")");
  }
};
Entry.Func.positionBlock_ = function(a) {
  var b = this.workspace.getMetrics();
  if (b && this.workspace.visible) {
    var c = a.getSvgRoot(), c = Blockly.getSvgXY_(c);
    a.getHeightWidth();
    a.moveBy(b.viewWidth / 2 - 80 - c.x, b.viewHeight / 2 - 50 - c.y);
  }
};
Entry.Func.doWhenInit = function() {
  var a = this.svg;
  a.appendChild(Blockly.fieldKeydownDom);
  a.appendChild(Blockly.fieldDropdownDom);
  a.appendChild(Blockly.contextMenu);
  Blockly.bindEvent_(window, "resize", this, this.position_);
  Blockly.bindEvent_(a, "mousedown", null, Blockly.onMouseDown_);
  Blockly.bindEvent_(a, "contextmenu", null, Blockly.onContextMenu_);
};
Entry.Func.doWhenCancel = function() {
  Blockly.clipboard_ = null;
  var a = Blockly.svg;
  a.appendChild(Blockly.fieldKeydownDom);
  a.appendChild(Blockly.fieldDropdownDom);
  a.appendChild(Blockly.contextMenu);
  Blockly.unbindEvent_(window, "resize", this, this.position_);
  Blockly.unbindEvent_(a, "mousedown", null, Blockly.onMouseDown_);
  Blockly.unbindEvent_(a, "contextmenu", null, Blockly.onContextMenu_);
};
Entry.Variable = function(a) {
  Entry.assert("string" == typeof a.name, "Variable name must be given");
  this.name_ = a.name;
  this.id_ = a.id ? a.id : Entry.generateHash();
  this.type = a.variableType ? a.variableType : "variable";
  this.object_ = a.object || null;
  this.isCloud_ = a.isCloud || !1;
  var b = Entry.parseNumber(a.value);
  this.value_ = "number" == typeof b ? b : a.value ? a.value : 0;
  "slide" == this.type && (this.minValue_ = a.minValue ? a.minValue : 0, this.maxValue_ = a.maxValue ? a.maxValue : 100);
  a.isClone || (this.visible_ = a.visible || "boolean" == typeof a.visible ? a.visible : !0, this.x_ = a.x ? a.x : null, this.y_ = a.y ? a.y : null, "list" == this.type && (this.width_ = a.width ? a.width : 100, this.height_ = a.height ? a.height : 120, this.array_ = a.array ? a.array : [], this.scrollPosition = 0), this.BORDER = 6, this.FONT = "10pt NanumGothic");
};
Entry.Variable.prototype.generateView = function(a) {
  if ("variable" == this.type || "timer" == this.type) {
    this.view_ = new createjs.Container;
    this.rect_ = new createjs.Shape;
    this.view_.addChild(this.rect_);
    this.view_.variable = this;
    this.wrapper_ = new createjs.Shape;
    this.view_.addChild(this.wrapper_);
    this.textView_ = new createjs.Text("asdf", this.FONT, "#000000");
    this.textView_.textBaseline = "alphabetic";
    this.textView_.x = 4;
    this.textView_.y = 1;
    this.view_.addChild(this.textView_);
    this.valueView_ = new createjs.Text("asdf", "10pt NanumGothic", "#ffffff");
    this.valueView_.textBaseline = "alphabetic";
    var b = Entry.variableContainer.variables_.length;
    this.getX() && this.getY() ? (this.setX(this.getX()), this.setY(this.getY())) : (this.setX(-230 + 80 * Math.floor(b / 11)), this.setY(24 * a + 20 - 135 - 264 * Math.floor(b / 11)));
    this.view_.visible = this.visible_;
    this.view_.addChild(this.valueView_);
    this.view_.on("mousedown", function(a) {
      "workspace" == Entry.type && (this.offset = {x:this.x - (.75 * a.stageX - 240), y:this.y - (.75 * a.stageY - 135)}, this.cursor = "move");
    });
    this.view_.on("pressmove", function(a) {
      "workspace" == Entry.type && (this.variable.setX(.75 * a.stageX - 240 + this.offset.x), this.variable.setY(.75 * a.stageY - 135 + this.offset.y), this.variable.updateView());
    });
  } else {
    if ("slide" == this.type) {
      var c = this;
      this.view_ = new createjs.Container;
      this.rect_ = new createjs.Shape;
      this.view_.addChild(this.rect_);
      this.view_.variable = this;
      this.wrapper_ = new createjs.Shape;
      this.view_.addChild(this.wrapper_);
      this.textView_ = new createjs.Text("name", this.FONT, "#000000");
      this.textView_.textBaseline = "alphabetic";
      this.textView_.x = 4;
      this.textView_.y = 1;
      this.view_.addChild(this.textView_);
      this.valueView_ = new createjs.Text("value", "10pt NanumGothic", "#ffffff");
      this.valueView_.textBaseline = "alphabetic";
      this.view_.on("mousedown", function(a) {
        "workspace" == Entry.type && (this.offset = {x:this.x - (.75 * a.stageX - 240), y:this.y - (.75 * a.stageY - 135)});
      });
      this.view_.on("pressmove", function(a) {
        "workspace" != Entry.type || c.isAdjusting || (this.variable.setX(.75 * a.stageX - 240 + this.offset.x), this.variable.setY(.75 * a.stageY - 135 + this.offset.y), this.variable.updateView());
      });
      this.view_.visible = this.visible_;
      this.view_.addChild(this.valueView_);
      b = this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26;
      b = Math.max(b, 90);
      this.maxWidth = b - 20;
      this.slideBar_ = new createjs.Shape;
      this.slideBar_.graphics.beginFill("#A0A1A1").s("#A0A1A1").ss(1).dr(10, 10, this.maxWidth, 1.5);
      this.view_.addChild(this.slideBar_);
      b = this.getSlidePosition(this.maxWidth);
      this.valueSetter_ = new createjs.Shape;
      this.valueSetter_.graphics.beginFill("#1bafea").s("#A0A1A1").ss(1).dc(b, 10.5, 3);
      this.valueSetter_.cursor = "pointer";
      this.valueSetter_.on("mousedown", function(a) {
        Entry.engine.isState("run") && (c.isAdjusting = !0, this.offsetX = -(this.x - .75 * a.stageX + 240));
      });
      this.valueSetter_.on("pressmove", function(a) {
        if (Entry.engine.isState("run")) {
          var b = .75 * a.stageX - 240 - this.offsetX, f = this.graphics.command.x;
          0 >= b + f ? c.setSlideCommandX(0, !0) : b + f > c.maxWidth + 10 ? c.setSlideCommandX(c.maxWidth, !0) : (this.offsetX = -(this.x - .75 * a.stageX + 240), c.setSlideCommandX(b), c.updateView());
        }
      });
      this.valueSetter_.on("pressup", function(a) {
        c.isAdjusting = !1;
      });
      this.view_.addChild(this.valueSetter_);
      b = Entry.variableContainer.variables_.length;
      this.getX() && this.getY() ? (this.setX(this.getX()), this.setY(this.getY())) : (this.setX(-230 + 80 * Math.floor(b / 11)), this.setY(24 * a + 20 - 135 - 264 * Math.floor(b / 11)));
    } else {
      this.view_ = new createjs.Container, this.rect_ = new createjs.Shape, this.view_.addChild(this.rect_), this.view_.variable = this, this.titleView_ = new createjs.Text("asdf", this.FONT, "#000"), this.titleView_.textBaseline = "alphabetic", this.titleView_.textAlign = "center", this.titleView_.width = this.width_ - 2 * this.BORDER, this.titleView_.y = this.BORDER + 10, this.titleView_.x = this.width_ / 2, this.view_.addChild(this.titleView_), this.resizeHandle_ = new createjs.Shape, this.resizeHandle_.graphics.f("#1bafea").ss(1, 
      0, 0).s("#1bafea").lt(0, -7).lt(-7, 0).lt(0, 0), this.view_.addChild(this.resizeHandle_), this.resizeHandle_.list = this, this.resizeHandle_.on("mousedown", function(a) {
        this.list.isResizing = !0;
        this.offset = {x:.75 * a.stageX - this.list.getWidth(), y:.75 * a.stageY - this.list.getHeight()};
        this.parent.cursor = "se-resize";
      }), this.resizeHandle_.on("pressmove", function(a) {
        this.list.setWidth(.75 * a.stageX - this.offset.x);
        this.list.setHeight(.75 * a.stageY - this.offset.y);
        this.list.updateView();
      }), this.view_.on("mousedown", function(a) {
        "workspace" != Entry.type || this.variable.isResizing || (this.offset = {x:this.x - (.75 * a.stageX - 240), y:this.y - (.75 * a.stageY - 135)}, this.cursor = "move");
      }), this.view_.on("pressup", function(a) {
        this.cursor = "initial";
        this.variable.isResizing = !1;
      }), this.view_.on("pressmove", function(a) {
        "workspace" != Entry.type || this.variable.isResizing || (this.variable.setX(.75 * a.stageX - 240 + this.offset.x), this.variable.setY(.75 * a.stageY - 135 + this.offset.y), this.variable.updateView());
      }), this.elementView = new createjs.Container, b = new createjs.Text("asdf", this.FONT, "#000"), b.textBaseline = "middle", b.y = 5, this.elementView.addChild(b), this.elementView.indexView = b, b = new createjs.Shape, this.elementView.addChild(b), this.elementView.valueWrapper = b, b = new createjs.Text("fdsa", this.FONT, "#eee"), b.x = 24, b.y = 6, b.textBaseline = "middle", this.elementView.addChild(b), this.elementView.valueView = b, this.elementView.x = this.BORDER, this.scrollButton_ = 
      new createjs.Shape, this.scrollButton_.graphics.f("#aaa").rr(0, 0, 7, 30, 3.5), this.view_.addChild(this.scrollButton_), this.scrollButton_.y = 23, this.scrollButton_.list = this, this.scrollButton_.on("mousedown", function(a) {
        this.list.isResizing = !0;
        this.cursor = "pointer";
        this.offsetY = a.rawY / 2;
      }), this.scrollButton_.on("pressmove", function(a) {
        this.y = a.rawY / 2 - this.offsetY + 23;
        23 > this.y && (this.y = 23);
        this.y > this.list.getHeight() - 40 && (this.y = this.list.getHeight() - 40);
        this.list.updateView();
      }), this.getX() && this.getY() ? (this.setX(this.getX()), this.setY(this.getY())) : (b = Entry.variableContainer.lists_.length, this.setX(110 * -Math.floor(b / 6) + 120), this.setY(24 * a + 20 - 135 - 145 * Math.floor(b / 6)));
    }
  }
  this.setVisible(this.isVisible());
  this.updateView();
  Entry.stage.loadVariable(this);
};
Entry.Variable.prototype.updateView = function() {
  if (this.view_ && this.isVisible()) {
    if ("variable" == this.type) {
      this.view_.x = this.getX();
      this.view_.y = this.getY();
      if (this.object_) {
        var a = Entry.container.getObject(this.object_);
        this.textView_.text = a ? a.name + ":" + this.getName() : this.getName();
      } else {
        this.textView_.text = this.getName();
      }
      this.valueView_.x = this.textView_.getMeasuredWidth() + 14;
      this.valueView_.y = 1;
      this.isNumber() ? this.valueView_.text = this.getValue().toFixed(2).replace(".00", "") : this.valueView_.text = this.getValue();
      this.rect_.graphics.clear().f("#ffffff").ss(1, 2, 0).s("#A0A1A1").rc(0, -14, this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26, 20, 4, 4, 4, 4);
      this.wrapper_.graphics.clear().f("#1bafea").ss(1, 2, 0).s("#1bafea").rc(this.textView_.getMeasuredWidth() + 7, -11, this.valueView_.getMeasuredWidth() + 15, 14, 7, 7, 7, 7);
    } else {
      if ("slide" == this.type) {
        this.view_.x = this.getX(), this.view_.y = this.getY(), this.object_ ? (a = Entry.container.getObject(this.object_), this.textView_.text = a ? a.name + ":" + this.getName() : this.getName()) : this.textView_.text = this.getName(), this.valueView_.x = this.textView_.getMeasuredWidth() + 14, this.valueView_.y = 1, this.isNumber() ? this.valueView_.text = this.getValue().toFixed(2).replace(".00", "") : this.valueView_.text = this.getValue(), a = this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 
        26, a = Math.max(a, 90), this.rect_.graphics.clear().f("#ffffff").ss(1, 2, 0).s("#A0A1A1").rc(0, -14, a, 33, 4, 4, 4, 4), this.wrapper_.graphics.clear().f("#1bafea").ss(1, 2, 0).s("#1bafea").rc(this.textView_.getMeasuredWidth() + 7, -11, this.valueView_.getMeasuredWidth() + 15, 14, 7, 7, 7, 7), a = this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26, a = Math.max(a, 90), this.maxWidth = a - 20, this.slideBar_.graphics.clear().beginFill("#A0A1A1").s("#A0A1A1").ss(1).dr(10, 
        10, this.maxWidth, 1.5), a = this.getSlidePosition(this.maxWidth), this.valueSetter_.graphics.clear().beginFill("#1bafea").s("#A0A1A1").ss(1).dc(a, 10.5, 3);
      } else {
        if ("list" == this.type) {
          this.view_.x = this.getX();
          this.view_.y = this.getY();
          this.resizeHandle_.x = this.width_ - 2;
          this.resizeHandle_.y = this.height_ - 2;
          var b = this.getName();
          this.object_ && (a = Entry.container.getObject(this.object_)) && (b = a.name + ":" + b);
          b = 7 < b.length ? b.substr(0, 6) + ".." : b;
          this.titleView_.text = b;
          this.titleView_.x = this.width_ / 2;
          for (this.rect_.graphics.clear().f("#ffffff").ss(1, 2, 0).s("#A0A1A1").rect(0, 0, this.width_, this.height_);this.view_.children[4];) {
            this.view_.removeChild(this.view_.children[4]);
          }
          a = Math.floor((this.getHeight() - 20) / 20);
          a < this.array_.length ? (this.scrollButton_.y > this.getHeight() - 40 && (this.scrollButton_.y = this.getHeight() - 40), this.elementView.valueWrapper.graphics.clear().f("#1bafea").rr(20, -2, this.getWidth() - 20 - 10 - 2 * this.BORDER, 17, 2), this.scrollButton_.visible = !0, this.scrollButton_.x = this.getWidth() - 12, this.scrollPosition = Math.floor((this.scrollButton_.y - 23) / (this.getHeight() - 23 - 40) * (this.array_.length - a))) : (this.elementView.valueWrapper.graphics.clear().f("#1bafea").rr(20, 
          -2, this.getWidth() - 20 - 2 * this.BORDER, 17, 2), this.scrollButton_.visible = !1, this.scrollPosition = 0);
          for (b = this.scrollPosition;b < this.scrollPosition + a && b < this.array_.length;b++) {
            this.elementView.indexView.text = b + 1;
            var c = String(this.array_[b].data), d = Math.floor((this.getWidth() - 50) / 7), c = Entry.cutStringByLength(c, d), c = String(this.array_[b].data).length > c.length ? c + ".." : c;
            this.elementView.valueView.text = c;
            c = this.elementView.clone(!0);
            c.y = 20 * (b - this.scrollPosition) + 23;
            this.view_.addChild(c);
          }
        } else {
          this.view_.x = this.getX(), this.view_.y = this.getY(), this.textView_.text = this.getName(), this.valueView_.x = this.textView_.getMeasuredWidth() + 14, this.valueView_.y = 1, this.isNumber() ? this.valueView_.text = this.getValue().toFixed(1).replace(".00", "") : this.valueView_.text = this.getValue(), this.rect_.graphics.clear().f("#ffffff").ss(1, 2, 0).s("#A0A1A1").rc(0, -14, this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26, 20, 4, 4, 4, 4), this.wrapper_.graphics.clear().f("#ffbb14").ss(1, 
          2, 0).s("orange").rc(this.textView_.getMeasuredWidth() + 7, -11, this.valueView_.getMeasuredWidth() + 15, 14, 7, 7, 7, 7);
        }
      }
    }
  }
};
Entry.Variable.prototype.getName = function() {
  return this.name_;
};
Entry.Variable.prototype.setName = function(a) {
  Entry.assert("string" == typeof a, "Variable name must be string");
  this.name_ = a;
  this.updateView();
};
Entry.Variable.prototype.getId = function() {
  return this.id_;
};
Entry.Variable.prototype.getValue = function() {
  return this.isNumber() ? Number(this.value_) : this.value_;
};
Entry.Variable.prototype.isNumber = function() {
  return isNaN(this.value_) ? !1 : !0;
};
Entry.Variable.prototype.setValue = function(a) {
  this.value_ = "slide" != this.type ? a : a < this.minValue_ ? this.minValue_ : a > this.maxValue_ ? this.maxValue_ : a;
  this.updateView();
};
Entry.Variable.prototype.isVisible = function() {
  return this.visible_;
};
Entry.Variable.prototype.setVisible = function(a) {
  Entry.assert("boolean" == typeof a, "Variable visible state must be boolean");
  (this.visible_ = this.view_.visible = a) && this.updateView();
};
Entry.Variable.prototype.setX = function(a) {
  this.x_ = a;
  this.updateView();
};
Entry.Variable.prototype.getX = function() {
  return this.x_;
};
Entry.Variable.prototype.setY = function(a) {
  this.y_ = a;
  this.updateView();
};
Entry.Variable.prototype.getY = function() {
  return this.y_;
};
Entry.Variable.prototype.setWidth = function(a) {
  this.width_ = 100 > a ? 100 : a;
  this.updateView();
};
Entry.Variable.prototype.getWidth = function() {
  return this.width_;
};
Entry.Variable.prototype.setHeight = function(a) {
  this.height_ = 100 > a ? 100 : a;
  this.updateView();
};
Entry.Variable.prototype.getHeight = function() {
  return this.height_;
};
Entry.Variable.prototype.takeSnapshot = function() {
  this.snapshot_ = this.toJSON();
};
Entry.Variable.prototype.loadSnapshot = function() {
  this.snapshot_ && this.syncModel_(this.snapshot_);
};
Entry.Variable.prototype.syncModel_ = function(a) {
  this.setX(a.x);
  this.setY(a.y);
  this.id_ = a.id;
  this.setVisible(a.visible);
  this.setValue(a.value);
  this.setName(a.name);
  "list" == this.type && (this.setWidth(a.width), this.setHeight(a.height), this.array_ = a.array);
};
Entry.Variable.prototype.toJSON = function() {
  var a = {};
  a.name = this.name_;
  a.id = this.id_;
  a.visible = this.visible_;
  a.value = this.value_;
  a.variableType = this.type;
  "list" == this.type ? (a.width = this.getWidth(), a.height = this.getHeight(), a.array = JSON.parse(JSON.stringify(this.array_))) : "slide" == this.type && (a.minValue = this.minValue_, a.maxValue = this.maxValue_);
  a.isCloud = this.isCloud_;
  a.object = this.object_;
  a.x = this.x_;
  a.y = this.y_;
  return a;
};
Entry.Variable.prototype.remove = function() {
  Entry.stage.removeVariable(this);
};
Entry.Variable.prototype.clone = function() {
  var a = this.toJSON();
  a.isClone = !0;
  return a = new Entry.Variable(a);
};
Entry.Variable.prototype.getType = function() {
  return this.type;
};
Entry.Variable.prototype.setType = function(a) {
  this.type = a;
};
Entry.Variable.prototype.getSlidePosition = function(a) {
  var b = this.minValue_, c = this.maxValue_, b = Math.abs(this.value_ - b) / Math.abs(c - b);
  return a * b + 10;
};
Entry.Variable.prototype.setSlideCommandX = function(a, b) {
  var c = this.valueSetter_.graphics.command;
  a = "undefined" == typeof a ? 10 : a;
  c.x = b ? a + 10 : c.x + a;
  this.updateSlideValueByView();
};
Entry.Variable.prototype.updateSlideValueByView = function() {
  var a = this.maxWidth, a = Math.max(this.valueSetter_.graphics.command.x - 10, 0) / a;
  0 > a && (a = 0);
  1 < a && (a = 1);
  a = (this.minValue_ + Number(Math.abs(this.maxValue_ - this.minValue_) * a)).toFixed(2);
  a < this.minValue_ ? this.setValue(this.minValue_) : a > this.maxValue_ ? this.setValue(this.maxValue_) : this.setValue(a);
};
Entry.Variable.prototype.getMinValue = function() {
  return this.minValue_;
};
Entry.Variable.prototype.setMinValue = function(a) {
  this.minValue_ = a;
  this.value_ < a && (this.value_ = a);
  this.updateView();
};
Entry.Variable.prototype.getMaxValue = function() {
  return this.maxValue_;
};
Entry.Variable.prototype.setMaxValue = function(a) {
  this.maxValue_ = a;
  this.value_ > a && (this.value_ = a);
  this.updateView();
};
Entry.VariableContainer = function() {
  this.variables_ = [];
  this.messages_ = [];
  this.lists_ = [];
  this.functions_ = {};
  this.viewMode_ = "all";
  this.selected = null;
  this.variableAddPanel = {isOpen:!1, info:{object:null, isCloud:!1}};
  this.listAddPanel = {isOpen:!1, info:{object:null, isCloud:!1}};
  null;
};
Entry.VariableContainer.prototype.createDom = function(a) {
  var b = this;
  this.view_ = a;
  var c = Entry.createElement("table");
  c.addClass("entryVariableSelectorWorkspace");
  this.view_.appendChild(c);
  var d = Entry.createElement("tr");
  c.appendChild(d);
  var e = this.createSelectButton("all");
  e.setAttribute("rowspan", "2");
  e.addClass("selected", "allButton");
  d.appendChild(e);
  d.appendChild(this.createSelectButton("variable", Entry.variableEnable));
  d.appendChild(this.createSelectButton("message", Entry.messageEnable));
  d = Entry.createElement("tr");
  d.appendChild(this.createSelectButton("list", Entry.listEnable));
  d.appendChild(this.createSelectButton("func", Entry.functionEnable));
  c.appendChild(d);
  c = Entry.createElement("ul");
  c.addClass("entryVariableListWorkspace");
  this.view_.appendChild(c);
  this.listView_ = c;
  c = Entry.createElement("li");
  c.addClass("entryVariableAddWorkspace");
  c.addClass("entryVariableListElementWorkspace");
  c.innerHTML = "+ " + Lang.Workspace.variable_create;
  var f = this;
  this.variableAddButton_ = c;
  c.bindOnClick(function(a) {
    a = f.variableAddPanel;
    var c = a.view.name.value.trim();
    a.isOpen ? c && 0 != c.length ? b.addVariable() : (a.view.addClass("entryRemove"), a.isOpen = !1) : (a.view.removeClass("entryRemove"), a.view.name.focus(), a.isOpen = !0);
  });
  this.generateVariableAddView();
  this.generateListAddView();
  this.generateVariableSplitterView();
  this.generateVariableSettingView();
  this.generateListSettingView();
  c = Entry.createElement("li");
  c.addClass("entryVariableAddWorkspace");
  c.addClass("entryVariableListElementWorkspace");
  c.innerHTML = "+ " + Lang.Workspace.message_create;
  this.messageAddButton_ = c;
  c.bindOnClick(function(a) {
    b.addMessage({name:Lang.Workspace.message + " " + (b.messages_.length + 1)});
  });
  c = Entry.createElement("li");
  c.addClass("entryVariableAddWorkspace");
  c.addClass("entryVariableListElementWorkspace");
  c.innerHTML = "+ " + Lang.Workspace.list_create;
  this.listAddButton_ = c;
  c.bindOnClick(function(a) {
    a = f.listAddPanel;
    var c = a.view.name.value.trim();
    a.isOpen ? c && 0 != c.length ? b.addList() : (a.view.addClass("entryRemove"), a.isOpen = !1) : (a.view.removeClass("entryRemove"), a.view.name.focus(), a.isOpen = !0);
  });
  c = Entry.createElement("li");
  c.addClass("entryVariableAddWorkspace");
  c.addClass("entryVariableListElementWorkspace");
  c.innerHTML = "+ " + Lang.Workspace.function_create;
  this.functionAddButton_ = c;
  c.bindOnClick(function(a) {
    Entry.playground.changeViewMode("code");
    "func" != Entry.playground.selectedMenu && Entry.playground.selectMenu("func");
    b.createFunction();
  });
  return a;
};
Entry.VariableContainer.prototype.createSelectButton = function(a, b) {
  var c = this;
  void 0 == b && (b = !0);
  var d = Entry.createElement("td");
  d.addClass("entryVariableSelectButtonWorkspace", a);
  d.innerHTML = Lang.Workspace[a];
  b ? d.bindOnClick(function(b) {
    c.selectFilter(a);
    this.addClass("selected");
  }) : d.addClass("disable");
  return d;
};
Entry.VariableContainer.prototype.selectFilter = function(a) {
  for (var b = this.view_.getElementsByTagName("td"), c = 0;c < b.length;c++) {
    b[c].removeClass("selected"), b[c].hasClass(a) && b[c].addClass("selected");
  }
  this.viewMode_ = a;
  this.select();
  this.updateList();
};
Entry.VariableContainer.prototype.updateVariableAddView = function(a) {
  a = "variable" == (a ? a : "variable") ? this.variableAddPanel : this.listAddPanel;
  var b = a.info, c = a.view;
  a.view.addClass("entryRemove");
  c.cloudCheck.removeClass("entryVariableAddChecked");
  c.localCheck.removeClass("entryVariableAddChecked");
  c.globalCheck.removeClass("entryVariableAddChecked");
  c.cloudWrapper.removeClass("entryVariableAddSpaceUnCheckedWorkspace");
  b.isCloud && c.cloudCheck.addClass("entryVariableAddChecked");
  a.isOpen && (c.removeClass("entryRemove"), c.name.focus());
  b.object ? (c.localCheck.addClass("entryVariableAddChecked"), c.cloudWrapper.addClass("entryVariableAddSpaceUnCheckedWorkspace")) : c.globalCheck.addClass("entryVariableAddChecked");
};
Entry.VariableContainer.prototype.select = function(a) {
  a = this.selected == a ? null : a;
  this.selected && (this.selected.listElement.removeClass("selected"), this.listView_.removeChild(this.selected.callerListElement), delete this.selected.callerListElement, this.selected = null);
  a && (a.listElement.addClass("selected"), this.selected = a, null != a && (a instanceof Entry.Variable ? (this.renderVariableReference(a), a.object_ && Entry.container.selectObject(a.object_, !0)) : a instanceof Entry.Func ? this.renderFunctionReference(a) : this.renderMessageReference(a)));
};
Entry.VariableContainer.prototype.renderMessageReference = function(a) {
  var b = this, c = Entry.container.objects_, d = ["when_message_cast", "message_cast"], e = [], f = Entry.createElement("ul");
  f.addClass("entryVariableListCallerListWorkspace");
  for (var h in c) {
    for (var g = c[h], k = g.script.getElementsByTagName("block"), m = 0;m < k.length;m++) {
      var n = k[m], l = n.getAttribute("type");
      -1 < d.indexOf(l) && Entry.Xml.getField("VALUE", n) == a.id && e.push({object:g, block:n});
    }
  }
  for (h in e) {
    c = e[h], d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.appendChild(c.object.thumbnailView_.cloneNode()), g = Entry.createElement("div"), g.addClass("entryVariableListCallerNameWorkspace"), g.innerHTML = c.object.name + " : " + Lang.Blocks["START_" + c.block.getAttribute("type")], d.appendChild(g), d.caller = c, d.message = a, d.bindOnClick(function(a) {
      Entry.playground.object != this.caller.object && (Entry.container.selectObject(), Entry.container.selectObject(this.caller.object.id, !0), b.select(null), b.select(this.message));
      a = this.caller.block.getAttribute("id");
      Blockly.mainWorkspace.activatePreviousBlock(Number(a));
      Entry.playground.toggleOnVariableView();
    }), f.appendChild(d);
  }
  0 == e.length && (d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.addClass("entryVariableListCallerNoneWorkspace"), d.innerHTML = Lang.Workspace.no_use, f.appendChild(d));
  a.callerListElement = f;
  this.listView_.insertBefore(f, a.listElement);
  this.listView_.insertBefore(a.listElement, f);
};
Entry.VariableContainer.prototype.renderVariableReference = function(a) {
  var b = this, c = Entry.container.objects_, d = "get_variable change_variable hide_variable set_variable show_variable add_value_to_list remove_value_from_list insert_value_to_list change_value_list_index value_of_index_from_list length_of_list show_list hide_list".split(" "), e = [], f = Entry.createElement("ul");
  f.addClass("entryVariableListCallerListWorkspace");
  for (var h in c) {
    for (var g = c[h], k = g.script.getElementsByTagName("block"), m = 0;m < k.length;m++) {
      var n = k[m], l = n.getAttribute("type");
      -1 < d.indexOf(l) && (Entry.Xml.getField("VARIABLE", n) || Entry.Xml.getField("LIST", n)) == a.id_ && e.push({object:g, block:n});
    }
  }
  for (h in e) {
    c = e[h], d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.appendChild(c.object.thumbnailView_.cloneNode()), g = Entry.createElement("div"), g.addClass("entryVariableListCallerNameWorkspace"), g.innerHTML = c.object.name + " : " + Lang.Blocks["VARIABLE_" + c.block.getAttribute("type")], d.appendChild(g), d.caller = c, d.variable = a, d.bindOnClick(function(a) {
      Entry.playground.object != this.caller.object && (Entry.container.selectObject(), Entry.container.selectObject(this.caller.object.id, !0), b.select(null), b.select(this.variable));
      a = this.caller.block.getAttribute("id");
      Blockly.mainWorkspace.activatePreviousBlock(Number(a));
      Entry.playground.toggleOnVariableView();
    }), f.appendChild(d);
  }
  0 == e.length && (d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.addClass("entryVariableListCallerNoneWorkspace"), d.innerHTML = Lang.Workspace.no_use, f.appendChild(d));
  a.callerListElement = f;
  this.listView_.insertBefore(f, a.listElement);
  this.listView_.insertBefore(a.listElement, f);
};
Entry.VariableContainer.prototype.renderFunctionReference = function(a) {
  var b = this, c = Entry.container.objects_, d = ["function_general"], e = [], f = Entry.createElement("ul");
  f.addClass("entryVariableListCallerListWorkspace");
  for (var h in c) {
    for (var g = c[h], k = g.script.getElementsByTagName("block"), m = 0;m < k.length;m++) {
      var n = k[m], l = n.getAttribute("type");
      -1 < d.indexOf(l) && n.getElementsByTagName("mutation")[0].getAttribute("hashid") == a.id && e.push({object:g, block:n});
    }
  }
  for (h in e) {
    c = e[h], d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.appendChild(c.object.thumbnailView_.cloneNode()), g = Entry.createElement("div"), g.addClass("entryVariableListCallerNameWorkspace"), g.innerHTML = c.object.name, d.appendChild(g), d.caller = c, d.bindOnClick(function(c) {
      Entry.playground.object != this.caller.object && (Entry.container.selectObject(), Entry.container.selectObject(this.caller.object.id, !0), b.select(null), b.select(a));
      c = this.caller.block.getAttribute("id");
      Blockly.mainWorkspace.activatePreviousBlock(Number(c));
      Entry.playground.toggleOnVariableView();
    }), f.appendChild(d);
  }
  0 == e.length && (d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.addClass("entryVariableListCallerNoneWorkspace"), d.innerHTML = Lang.Workspace.no_use, f.appendChild(d));
  a.callerListElement = f;
  this.listView_.insertBefore(f, a.listElement);
  this.listView_.insertBefore(a.listElement, f);
};
Entry.VariableContainer.prototype.updateList = function() {
  if (this.listView_) {
    this.variableSettingView.addClass("entryRemove");
    for (this.listSettingView.addClass("entryRemove");this.listView_.firstChild;) {
      this.listView_.removeChild(this.listView_.firstChild);
    }
    var a = this.viewMode_, b = [];
    if ("all" == a || "message" == a) {
      "message" == a && this.listView_.appendChild(this.messageAddButton_);
      for (var c in this.messages_) {
        var d = this.messages_[c];
        b.push(d);
        var e = d.listElement;
        this.listView_.appendChild(e);
        d.callerListElement && this.listView_.appendChild(d.callerListElement);
      }
    }
    if ("all" == a || "variable" == a) {
      if ("variable" == a) {
        e = this.variableAddPanel.info;
        e.object && !Entry.playground.object && (e.object = null);
        this.listView_.appendChild(this.variableAddButton_);
        this.listView_.appendChild(this.variableAddPanel.view);
        this.variableSplitters.top.innerHTML = Lang.Workspace.Variable_used_at_all_objects;
        this.listView_.appendChild(this.variableSplitters.top);
        for (c in this.variables_) {
          d = this.variables_[c], d.object_ || (b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement));
        }
        this.variableSplitters.bottom.innerHTML = Lang.Workspace.Variable_used_at_special_object;
        this.listView_.appendChild(this.variableSplitters.bottom);
        for (c in this.variables_) {
          d = this.variables_[c], d.object_ && (b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement));
        }
        this.updateVariableAddView("variable");
      } else {
        for (c in this.variables_) {
          d = this.variables_[c], b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement);
        }
      }
    }
    if ("all" == a || "list" == a) {
      if ("list" == a) {
        e = this.listAddPanel.info;
        e.object && !Entry.playground.object && (e.object = null);
        this.listView_.appendChild(this.listAddButton_);
        this.listView_.appendChild(this.listAddPanel.view);
        this.variableSplitters.top.innerHTML = "\ubaa8\ub4e0 \uc624\ube0c\uc81d\ud2b8\uc5d0\uc11c \uc0ac\uc6a9\ub418\ub294 \ub9ac\uc2a4\ud2b8";
        this.listView_.appendChild(this.variableSplitters.top);
        this.updateVariableAddView("list");
        for (c in this.lists_) {
          d = this.lists_[c], d.object_ || (b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement));
        }
        this.variableSplitters.bottom.innerHTML = "\ud2b9\uc815 \uc624\ube0c\uc81d\ud2b8\uc5d0\uc11c \uc0ac\uc6a9\ub418\ub294 \ub9ac\uc2a4\ud2b8";
        this.listView_.appendChild(this.variableSplitters.bottom);
        for (c in this.lists_) {
          d = this.lists_[c], d.object_ && (b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement));
        }
        this.updateVariableAddView("variable");
      } else {
        for (c in this.lists_) {
          d = this.lists_[c], b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement);
        }
      }
    }
    if ("all" == a || "func" == a) {
      for (c in "func" == a && this.listView_.appendChild(this.functionAddButton_), this.functions_) {
        a = this.functions_[c], b.push(a), e = a.listElement, this.listView_.appendChild(e), a.callerListElement && this.listView_.appendChild(a.callerListElement);
      }
    }
    this.listView_.appendChild(this.variableSettingView);
    this.listView_.appendChild(this.listSettingView);
    0 != b.length && this.select(b[0]);
  }
};
Entry.VariableContainer.prototype.setMessages = function(a) {
  for (var b in a) {
    var c = a[b];
    c.id || (c.id = Entry.generateHash());
    this.createMessageView(c);
    this.messages_.push(c);
  }
  Entry.playground.reloadPlayground();
  this.updateList();
};
Entry.VariableContainer.prototype.setVariables = function(a) {
  for (var b in a) {
    var c = new Entry.Variable(a[b]), d = c.getType();
    "variable" == d || "slide" == d ? (c.generateView(this.variables_.length), this.createVariableView(c), this.variables_.push(c)) : "list" == d ? (c.generateView(this.lists_.length), this.createListView(c), this.lists_.push(c)) : this.generateTimer(c);
  }
  Entry.playground.reloadPlayground();
  this.updateList();
};
Entry.VariableContainer.prototype.setFunctions = function(a) {
  for (var b in a) {
    var c = new Entry.Func;
    c.init(a[b]);
    c.generateBlock();
    this.createFunctionView(c);
    this.functions_[c.id] = c;
  }
  this.updateList();
};
Entry.VariableContainer.prototype.getFunction = function(a) {
  return this.functions_[a];
};
Entry.VariableContainer.prototype.getVariable = function(a, b) {
  var c = Entry.findObjsByKey(this.variables_, "id_", a)[0];
  b && b.isClone && c.object_ && (c = Entry.findObjsByKey(b.variables, "id_", a)[0]);
  return c;
};
Entry.VariableContainer.prototype.getList = function(a, b) {
  var c = Entry.findObjsByKey(this.lists_, "id_", a)[0];
  b && b.isClone && c.object_ && (c = Entry.findObjsByKey(b.lists, "id_", a)[0]);
  return c;
};
Entry.VariableContainer.prototype.createFunction = function() {
  if (!Entry.Func.isEdit) {
    var a = new Entry.Func;
    Entry.Func.edit(a);
    this.saveFunction(a);
  }
};
Entry.VariableContainer.prototype.addFunction = function(a) {
};
Entry.VariableContainer.prototype.removeFunction = function(a) {
  delete this.functions_[a.id];
  this.updateList();
};
Entry.VariableContainer.prototype.editFunction = function(a, b) {
};
Entry.VariableContainer.prototype.saveFunction = function(a) {
  this.functions_[a.id] || (this.functions_[a.id] = a, this.createFunctionView(a));
  a.listElement.nameField.innerHTML = a.description;
  this.updateList();
};
Entry.VariableContainer.prototype.createFunctionView = function(a) {
  var b = this, c = Entry.createElement("li");
  c.addClass("entryVariableListElementWorkspace");
  c.addClass("entryFunctionElementWorkspace");
  c.bindOnClick(function(c) {
    c.stopPropagation();
    b.select(a);
  });
  var d = Entry.createElement("button");
  d.addClass("entryVariableListElementDeleteWorkspace");
  d.bindOnClick(function(c) {
    c.stopPropagation();
    b.removeFunction(a);
    b.selected = null;
  });
  var e = Entry.createElement("button");
  e.addClass("entryVariableListElementEditWorkspace");
  e.bindOnClick(function(b) {
    b.stopPropagation();
    Entry.Func.edit(a);
    Entry.playground && (Entry.playground.changeViewMode("code"), "func" != Entry.playground.selectedMenu && Entry.playground.selectMenu("func"));
  });
  var f = Entry.createElement("div");
  f.addClass("entryVariableFunctionElementNameWorkspace");
  f.innerHTML = a.description;
  c.nameField = f;
  c.appendChild(f);
  c.appendChild(e);
  c.appendChild(d);
  a.listElement = c;
};
Entry.VariableContainer.prototype.addVariable = function(a) {
  if (!a) {
    var b = this.variableAddPanel;
    a = b.view.name.value.trim();
    a && 0 != a.length || (a = Lang.Workspace.variable);
    a = Entry.getOrderedName(a, this.variables_, "name_");
    var c = b.info;
    a = {name:a, isCloud:c.isCloud, object:c.object, variableType:"variable"};
    b.view.addClass("entryRemove");
    this.resetVariableAddPanel("variable");
  }
  a = new Entry.Variable(a);
  Entry.stateManager.addCommand("add variable", this, this.removeVariable, a);
  a.generateView(this.variables_.length);
  this.createVariableView(a);
  this.variables_.unshift(a);
  Entry.playground.reloadPlayground();
  this.updateList();
  a.listElement.nameField.focus();
  return new Entry.State(this, this.removeVariable, a);
};
Entry.VariableContainer.prototype.removeVariable = function(a) {
  var b = this.variables_.indexOf(a), c = a.toJSON();
  Entry.stateManager.addCommand("remove variable", this, this.addVariable, c);
  this.selected == a && this.select(null);
  a.remove();
  this.variables_.splice(b, 1);
  Entry.playground.reloadPlayground();
  this.updateList();
  return new Entry.State(this, this.addVariable, c);
};
Entry.VariableContainer.prototype.changeVariableName = function(a, b) {
  a.name_ != b && (Entry.isExist(b, "name_", this.variables_) ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.variable_rename_failed, Lang.Workspace.variable_dup)) : 10 < b.length ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.variable_rename_failed, Lang.Workspace.variable_too_long)) : (a.name_ = b, a.updateView(), Entry.toast.success(Lang.Workspace.variable_rename, Lang.Workspace.variable_rename_ok)));
};
Entry.VariableContainer.prototype.changeListName = function(a, b) {
  a.name_ != b && (Entry.isExist(b, "name_", this.lists_) ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.list_rename_failed, Lang.Workspace.list_dup)) : 10 < b.length ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.list_rename_failed, Lang.Workspace.list_too_long)) : (a.name_ = b, a.updateView(), Entry.toast.success(Lang.Workspace.list_rename, Lang.Workspace.list_rename_ok)));
};
Entry.VariableContainer.prototype.removeList = function(a) {
  var b = this.lists_.indexOf(a), c = a.toJSON();
  Entry.stateManager.addCommand("remove list", this, this.addList, c);
  this.selected == a && this.select(null);
  a.remove();
  this.lists_.splice(b, 1);
  Entry.playground.reloadPlayground();
  this.updateList();
  return new Entry.State(this, this.addList, c);
};
Entry.VariableContainer.prototype.createVariableView = function(a) {
  var b = this, c = Entry.createElement("li"), d = Entry.createElement("div");
  d.addClass("entryVariableListElementWrapperWorkspace");
  c.appendChild(d);
  c.addClass("entryVariableListElementWorkspace");
  a.object_ ? c.addClass("entryVariableLocalElementWorkspace") : a.isCloud_ ? c.addClass("entryVariableCloudElementWorkspace") : c.addClass("entryVariableGlobalElementWorkspace");
  c.bindOnClick(function(c) {
    b.select(a);
  });
  var e = Entry.createElement("button");
  e.addClass("entryVariableListElementDeleteWorkspace");
  e.bindOnClick(function(c) {
    c.stopPropagation();
    b.removeVariable(a);
    b.selectedVariable = null;
    b.variableSettingView.addClass("entryRemove");
  });
  var f = Entry.createElement("button");
  f.addClass("entryVariableListElementEditWorkspace");
  f.bindOnClick(function(c) {
    c.stopPropagation();
    g.removeAttribute("disabled");
    h.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.updateSelectedVariable(a);
    g.focus();
  });
  c.editButton = f;
  var h = Entry.createElement("button");
  h.addClass("entryVariableListElementEditWorkspace");
  h.addClass("entryRemove");
  h.bindOnClick(function(a) {
    a.stopPropagation();
    g.blur();
    g.setAttribute("disabled", "disabled");
    f.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.updateSelectedVariable(null, "variable");
  });
  c.editSaveButton = h;
  var g = Entry.createElement("input");
  g.addClass("entryVariableListElementNameWorkspace");
  g.setAttribute("disabled", "disabled");
  g.value = a.name_;
  g.bindOnClick(function(a) {
    a.stopPropagation();
  });
  g.onblur = function(c) {
    (c = this.value.trim()) && 0 != c.length ? b.changeVariableName(a, this.value) : (Entry.toast.alert("\uacbd\uace0", "\ubcc0\uc218\uc758 \uc774\ub984\uc740 \ube48 \uce78\uc774 \ub420 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.."), this.value = a.getName());
  };
  g.onkeydown = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.nameField = g;
  d.appendChild(g);
  d.appendChild(f);
  d.appendChild(h);
  d.appendChild(e);
  a.listElement = c;
};
Entry.VariableContainer.prototype.addMessage = function(a) {
  a.id || (a.id = Entry.generateHash());
  Entry.stateManager.addCommand("add message", this, this.removeMessage, a);
  this.createMessageView(a);
  this.messages_.unshift(a);
  Entry.playground.reloadPlayground();
  this.updateList();
  a.listElement.nameField.focus();
  return new Entry.State(this, this.removeMessage, a);
};
Entry.VariableContainer.prototype.removeMessage = function(a) {
  this.selected == a && this.select(null);
  Entry.stateManager.addCommand("remove message", this, this.addMessage, a);
  var b = this.messages_.indexOf(a);
  this.messages_.splice(b, 1);
  this.updateList();
  Entry.playground.reloadPlayground();
  return new Entry.State(this, this.addMessage, a);
};
Entry.VariableContainer.prototype.changeMessageName = function(a, b) {
  a.name != b && (Entry.isExist(b, "name", this.messages_) ? (a.listElement.nameField.value = a.name, Entry.toast.alert(Lang.Workspace.message_rename_failed, Lang.Workspace.message_dup)) : 10 < b.length ? (a.listElement.nameField.value = a.name, Entry.toast.alert(Lang.Workspace.message_rename_failed, Lang.Workspace.message_too_long)) : (a.name = b, Entry.toast.success(Lang.Workspace.message_rename, Lang.Workspace.message_rename_ok)));
};
Entry.VariableContainer.prototype.createMessageView = function(a) {
  var b = this, c = Entry.createElement("li");
  c.addClass("entryVariableListElementWorkspace");
  c.addClass("entryMessageElementWorkspace");
  c.bindOnClick(function(c) {
    b.select(a);
  });
  var d = Entry.createElement("button");
  d.addClass("entryVariableListElementDeleteWorkspace");
  d.bindOnClick(function(c) {
    c.stopPropagation();
    b.removeMessage(a);
  });
  var e = Entry.createElement("button");
  e.addClass("entryVariableListElementEditWorkspace");
  e.bindOnClick(function(a) {
    a.stopPropagation();
    h.removeAttribute("disabled");
    h.focus();
    f.removeClass("entryRemove");
    this.addClass("entryRemove");
  });
  var f = Entry.createElement("button");
  f.addClass("entryVariableListElementEditWorkspace");
  f.addClass("entryRemove");
  f.bindOnClick(function(a) {
    a.stopPropagation();
    h.blur();
    e.removeClass("entryRemove");
    this.addClass("entryRemove");
  });
  var h = Entry.createElement("input");
  h.addClass("entryVariableListElementNameWorkspace");
  h.value = a.name;
  h.bindOnClick(function(a) {
    a.stopPropagation();
  });
  h.onblur = function(c) {
    (c = this.value.trim()) && 0 != c.length ? (b.changeMessageName(a, this.value), e.removeClass("entryRemove"), f.addClass("entryRemove"), h.setAttribute("disabled", "disabled")) : (Entry.toast.alert("\uacbd\uace0", "\uc2e0\ud638\uc758 \uc774\ub984\uc740 \ube48 \uce78\uc774 \ub420 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.."), this.value = a.name);
  };
  h.onkeydown = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.nameField = h;
  c.appendChild(h);
  c.appendChild(e);
  c.appendChild(f);
  c.appendChild(d);
  a.listElement = c;
};
Entry.VariableContainer.prototype.addList = function(a) {
  if (!a) {
    var b = this.listAddPanel;
    a = b.view.name.value.trim();
    a && 0 != a.length || (a = Lang.Workspace.list);
    var c = b.info;
    a = Entry.getOrderedName(a, this.lists_, "name_");
    a = {name:a, isCloud:c.isCloud, object:c.object, variableType:"list"};
    b.view.addClass("entryRemove");
    this.resetVariableAddPanel("list");
  }
  a = new Entry.Variable(a);
  Entry.stateManager.addCommand("add list", this, this.removeList, a);
  a.generateView(this.lists_.length);
  this.createListView(a);
  this.lists_.unshift(a);
  Entry.playground.reloadPlayground();
  this.updateList();
  a.listElement.nameField.focus();
  return new Entry.State(this, this.removelist, a);
};
Entry.VariableContainer.prototype.createListView = function(a) {
  var b = this, c = Entry.createElement("li"), d = Entry.createElement("div");
  d.addClass("entryVariableListElementWrapperWorkspace");
  c.appendChild(d);
  c.addClass("entryVariableListElementWorkspace");
  a.object_ ? c.addClass("entryListLocalElementWorkspace") : a.isCloud_ ? c.addClass("entryListCloudElementWorkspace") : c.addClass("entryListGlobalElementWorkspace");
  c.bindOnClick(function(c) {
    b.select(a);
  });
  var e = Entry.createElement("button");
  e.addClass("entryVariableListElementDeleteWorkspace");
  e.bindOnClick(function(c) {
    c.stopPropagation();
    b.removeList(a);
    b.selectedList = null;
    b.listSettingView.addClass("entryRemove");
  });
  var f = Entry.createElement("button");
  f.addClass("entryVariableListElementEditWorkspace");
  f.bindOnClick(function(c) {
    c.stopPropagation();
    g.removeAttribute("disabled");
    h.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.updateSelectedVariable(a);
    g.focus();
  });
  c.editButton = f;
  var h = Entry.createElement("button");
  h.addClass("entryVariableListElementEditWorkspace");
  h.addClass("entryRemove");
  h.bindOnClick(function(c) {
    c.stopPropagation();
    g.blur();
    g.setAttribute("disabled", "disabled");
    f.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.select(a);
    b.updateSelectedVariable(null, "list");
  });
  c.editSaveButton = h;
  var g = Entry.createElement("input");
  g.setAttribute("disabled", "disabled");
  g.addClass("entryVariableListElementNameWorkspace");
  g.value = a.name_;
  g.bindOnClick(function(a) {
    a.stopPropagation();
  });
  g.onblur = function(c) {
    (c = this.value.trim()) && 0 != c.length ? b.changeListName(a, this.value) : (Entry.toast.alert("\uacbd\uace0", "\ub9ac\uc2a4\ud2b8\uc758 \uc774\ub984\uc740 \ube48 \uce78\uc774 \ub420 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.."), this.value = a.getName());
  };
  g.onkeydown = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.nameField = g;
  d.appendChild(g);
  d.appendChild(f);
  d.appendChild(h);
  d.appendChild(e);
  a.listElement = c;
};
Entry.VariableContainer.prototype.mapVariable = function(a, b) {
  for (var c = this.variables_.length, d = 0;d < c;d++) {
    a(this.variables_[d], b);
  }
};
Entry.VariableContainer.prototype.mapList = function(a, b) {
  for (var c = this.lists_.length, d = 0;d < c;d++) {
    a(this.lists_[d], b);
  }
};
Entry.VariableContainer.prototype.getVariableJSON = function() {
  for (var a = [], b = 0;b < this.variables_.length;b++) {
    a.push(this.variables_[b].toJSON());
  }
  for (b = 0;b < this.lists_.length;b++) {
    a.push(this.lists_[b].toJSON());
  }
  Entry.engine.projectTimer && a.push(Entry.engine.projectTimer);
  return a;
};
Entry.VariableContainer.prototype.getMessageJSON = function() {
  for (var a = [], b = 0;b < this.messages_.length;b++) {
    a.push({id:this.messages_[b].id, name:this.messages_[b].name});
  }
  return a;
};
Entry.VariableContainer.prototype.getFunctionJSON = function() {
  var a = [], b;
  for (b in this.functions_) {
    var c = this.functions_[b], c = {id:c.id, block:Blockly.Xml.domToText(c.block), content:Blockly.Xml.domToText(c.content)};
    a.push(c);
  }
  return a;
};
Entry.VariableContainer.prototype.resetVariableAddPanel = function(a) {
  a = a || "variable";
  var b = "variable" == a ? this.variableAddPanel : this.listAddPanel, c = b.info;
  c.isCloud = !1;
  c.object = null;
  b.view.name.value = "";
  b.isOpen = !1;
  this.updateVariableAddView(a);
};
Entry.VariableContainer.prototype.generateVariableAddView = function() {
  var a = this, b = Entry.createElement("li");
  this.variableAddPanel.view = b;
  this.variableAddPanel.isOpen = !1;
  b.addClass("entryVariableAddSpaceWorkspace");
  b.addClass("entryRemove");
  var c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceNameWrapperWorkspace");
  b.appendChild(c);
  var d = Entry.createElement("input");
  d.addClass("entryVariableAddSpaceInputWorkspace");
  d.setAttribute("placeholder", Lang.Workspace.Variable_placeholder_name);
  d.variableContainer = this;
  d.onkeypress = function(b) {
    13 == b.keyCode && (Entry.variableContainer.addVariable(), a.updateSelectedVariable(a.variables_[0]), b = a.variables_[0].listElement, b.editButton.addClass("entryRemove"), b.editSaveButton.removeClass("entryRemove"), b.nameField.removeAttribute("disabled"), b.nameField.focus());
  };
  this.variableAddPanel.view.name = d;
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceGlobalWrapperWorkspace");
  c.bindOnClick(function(b) {
    a.variableAddPanel.info.object = null;
    a.updateVariableAddView("variable");
  });
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = Lang.Workspace.Variable_use_all_objects;
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableAddSpaceCheckWorkspace");
  this.variableAddPanel.view.globalCheck = d;
  this.variableAddPanel.info.object || d.addClass("entryVariableAddChecked");
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceLocalWrapperWorkspace");
  c.bindOnClick(function(b) {
    Entry.playground.object && (b = a.variableAddPanel.info, b.object = Entry.playground.object.id, b.isCloud = !1, a.updateVariableAddView("variable"));
  });
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = Lang.Workspace.Variable_use_this_object;
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableAddSpaceCheckWorkspace");
  this.variableAddPanel.view.localCheck = d;
  this.variableAddPanel.info.object && d.addClass("entryVariableAddChecked");
  c.appendChild(d);
  c = Entry.createElement("div");
  b.cloudWrapper = c;
  c.addClass("entryVariableAddSpaceCloudWrapperWorkspace");
  c.bindOnClick(function(b) {
    b = a.variableAddPanel.info;
    b.object || (b.isCloud = !b.isCloud, a.updateVariableAddView("variable"));
  });
  b.appendChild(c);
  d = Entry.createElement("span");
  d.addClass("entryVariableAddSpaceCloudSpanWorkspace");
  d.innerHTML = "\ud074\ub77c\uc6b0\ub4dc \ubcc0\uc218\ub85c \uc0ac\uc6a9 <br>(\uc11c\ubc84\uc5d0 \uc800\uc7a5\ub429\ub2c8\ub2e4)";
  c.appendChild(d);
  d = Entry.createElement("span");
  this.variableAddPanel.view.cloudCheck = d;
  d.addClass("entryVariableAddSpaceCheckWorkspace");
  d.addClass("entryVariableAddSpaceCloudCheckWorkspace");
  this.variableAddPanel.info.isCloud && d.addClass("entryVariableAddChecked");
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceButtonWrapperWorkspace");
  b.appendChild(c);
  b = Entry.createElement("span");
  b.addClass("entryVariableAddSpaceCancelWorkspace");
  b.addClass("entryVariableAddSpaceButtonWorkspace");
  b.innerHTML = Lang.Buttons.cancel;
  b.bindOnClick(function(b) {
    a.variableAddPanel.view.addClass("entryRemove");
    a.resetVariableAddPanel("variable");
  });
  c.appendChild(b);
  b = Entry.createElement("span");
  b.addClass("entryVariableAddSpaceConfirmWorkspace");
  b.addClass("entryVariableAddSpaceButtonWorkspace");
  b.innerHTML = Lang.Buttons.save;
  b.variableContainer = this;
  b.bindOnClick(function(b) {
    Entry.variableContainer.addVariable();
    a.updateSelectedVariable(a.variables_[0]);
    b = a.variables_[0].listElement;
    b.editButton.addClass("entryRemove");
    b.editSaveButton.removeClass("entryRemove");
    b.nameField.removeAttribute("disabled");
    b.nameField.focus();
  });
  c.appendChild(b);
};
Entry.VariableContainer.prototype.generateListAddView = function() {
  var a = this, b = Entry.createElement("li");
  this.listAddPanel.view = b;
  this.listAddPanel.isOpen = !1;
  b.addClass("entryVariableAddSpaceWorkspace");
  b.addClass("entryRemove");
  var c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceNameWrapperWorkspace");
  c.addClass("entryListAddSpaceNameWrapperWorkspace");
  b.appendChild(c);
  var d = Entry.createElement("input");
  d.addClass("entryVariableAddSpaceInputWorkspace");
  d.setAttribute("placeholder", "\ub9ac\uc2a4\ud2b8 \uc774\ub984");
  this.listAddPanel.view.name = d;
  d.variableContainer = this;
  d.onkeypress = function(b) {
    13 == b.keyCode && (a.addList(), b = a.lists_[0], a.updateSelectedVariable(b), b = b.listElement, b.editButton.addClass("entryRemove"), b.editSaveButton.removeClass("entryRemove"), b.nameField.removeAttribute("disabled"), b.nameField.focus());
  };
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceGlobalWrapperWorkspace");
  c.bindOnClick(function(b) {
    a.listAddPanel.info.object = null;
    a.updateVariableAddView("list");
  });
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = "\ubaa8\ub4e0 \uc624\ube0c\uc81d\ud2b8\uc5d0\uc11c \uc0ac\uc6a9";
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableAddSpaceCheckWorkspace");
  this.listAddPanel.view.globalCheck = d;
  this.listAddPanel.info.object || d.addClass("entryVariableAddChecked");
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceLocalWrapperWorkspace");
  c.bindOnClick(function(b) {
    Entry.playground.object && (b = a.listAddPanel.info, b.object = Entry.playground.object.id, b.isCloud = !1, a.updateVariableAddView("list"));
  });
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = "\uc774 \uc624\ube0c\uc81d\ud2b8\uc5d0\uc11c \uc0ac\uc6a9";
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableAddSpaceCheckWorkspace");
  this.listAddPanel.view.localCheck = d;
  this.variableAddPanel.info.object && addVariableLocalCheck.addClass("entryVariableAddChecked");
  c.appendChild(d);
  c = Entry.createElement("div");
  b.cloudWrapper = c;
  c.addClass("entryVariableAddSpaceCloudWrapperWorkspace");
  c.bindOnClick(function(b) {
    b = a.listAddPanel.info;
    b.object || (b.isCloud = !b.isCloud, a.updateVariableAddView("list"));
  });
  b.appendChild(c);
  d = Entry.createElement("span");
  d.addClass("entryVariableAddSpaceCloudSpanWorkspace");
  d.innerHTML = "\ud074\ub77c\uc6b0\ub4dc \ubcc0\uc218\ub85c \uc0ac\uc6a9 <br>(\uc11c\ubc84\uc5d0 \uc800\uc7a5\ub429\ub2c8\ub2e4)";
  c.appendChild(d);
  d = Entry.createElement("span");
  this.listAddPanel.view.cloudCheck = d;
  d.addClass("entryVariableAddSpaceCheckWorkspace");
  d.addClass("entryVariableAddSpaceCloudCheckWorkspace");
  this.listAddPanel.info.isCloud && d.addClass("entryVariableAddChecked");
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableAddSpaceButtonWrapperWorkspace");
  b.appendChild(c);
  b = Entry.createElement("span");
  b.addClass("entryVariableAddSpaceCancelWorkspace");
  b.addClass("entryVariableAddSpaceButtonWorkspace");
  b.innerHTML = "\ucde8\uc18c";
  b.bindOnClick(function(b) {
    a.listAddPanel.view.addClass("entryRemove");
    a.resetVariableAddPanel("list");
  });
  c.appendChild(b);
  b = Entry.createElement("span");
  b.addClass("entryVariableAddSpaceConfirmWorkspace");
  b.addClass("entryVariableAddSpaceButtonWorkspace");
  b.innerHTML = "\ud655\uc778";
  b.variableContainer = this;
  b.bindOnClick(function(b) {
    a.addList();
    b = a.lists_[0];
    a.updateSelectedVariable(b);
    b = b.listElement;
    b.editButton.addClass("entryRemove");
    b.editSaveButton.removeClass("entryRemove");
    b.nameField.removeAttribute("disabled");
    b.nameField.focus();
  });
  c.appendChild(b);
};
Entry.VariableContainer.prototype.generateVariableSplitterView = function() {
  var a = Entry.createElement("li");
  a.addClass("entryVariableSplitterWorkspace");
  var b = Entry.createElement("li");
  b.addClass("entryVariableSplitterWorkspace");
  this.variableSplitters = {top:a, bottom:b};
};
Entry.VariableContainer.prototype.openVariableAddPanel = function(a) {
  a = a ? a : "variable";
  Entry.playground.toggleOnVariableView();
  Entry.playground.changeViewMode("variable");
  "variable" == a ? this.variableAddPanel.isOpen = !0 : this.listAddPanel.isOpen = !0;
  this.selectFilter(a);
  this.updateVariableAddView(a);
};
Entry.VariableContainer.prototype.getMenuXml = function(a) {
  for (var b = [], c = 0 != this.variables_.length, d = 0 != this.lists_.length, e = 0, f;f = a[e];e++) {
    var h = f.tagName;
    if (h && "BLOCK" == h.toUpperCase()) {
      var g = f.getAttribute("bCategory");
      !c && "variable" == g || !d && "list" == g || b.push(f);
    } else {
      !h || "SPLITTER" != h.toUpperCase() && "BTN" != h.toUpperCase() || !c && "variable" == g || (d || "list" != g) && b.push(f);
    }
  }
  return b;
};
Entry.VariableContainer.prototype.addCloneLocalVariables = function(a) {
  var b = [], c = this;
  this.mapVariable(function(a, c) {
    if (a.object_ && a.object_ == c.objectId) {
      var f = a.toJSON();
      f.originId = f.id;
      f.id = Entry.generateHash();
      f.object = c.newObjectId;
      delete f.x;
      delete f.y;
      b.push(f);
      c.json.script = c.json.script.replace(f.originId, f.id);
    }
  }, a);
  b.map(function(a) {
    c.addVariable(a);
  });
};
Entry.VariableContainer.prototype.generateTimer = function(a) {
  a || (a = {}, a.id = Entry.generateHash(), a.name = Lang.Workspace.Variable_Timer, a.value = 0, a.variableType = "timer", a.visible = !1, a.x = -45, a.y = 2, a = new Entry.Variable(a));
  a.generateView();
  a.tick = null;
  Entry.engine.projectTimer = a;
  Entry.addEventListener("run", function() {
    Entry.engine.toggleProjectTimer();
  });
  Entry.addEventListener("stop", function() {
    Entry.engine.toggleProjectTimer();
  });
};
Entry.VariableContainer.prototype.generateVariableSettingView = function() {
  var a = this, b = Entry.createElement("div");
  b.bindOnClick(function(a) {
    a.stopPropagation();
  });
  this.variableSettingView = b;
  b.addClass("entryVariableSettingWorkspace");
  this.listView_.appendChild(b);
  b.addClass("entryRemove");
  var c = Entry.createElement("div");
  c.addClass("entryVariableSettingVisibleWrapperWorkspace");
  c.bindOnClick(function(b) {
    b = a.selectedVariable;
    var c = a.variableSettingView.visibleCheck;
    b.setVisible(!b.isVisible());
    b.isVisible() ? c.addClass("entryVariableSettingChecked") : c.removeClass("entryVariableSettingChecked");
  });
  b.appendChild(c);
  var d = Entry.createElement("span");
  d.innerHTML = "\ubcc0\uc218 \ubcf4\uc774\uae30";
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableSettingCheckWorkspace");
  b.visibleCheck = d;
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableSettingInitValueWrapperWorkspace");
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = "\uae30\ubcf8\uac12";
  c.appendChild(d);
  d = Entry.createElement("input");
  d.addClass("entryVariableSettingInitValueInputWorkspace");
  b.initValueInput = d;
  d.value = 0;
  d.onkeyup = function(b) {
    a.selectedVariable.setValue(this.value);
  };
  d.onblur = function(b) {
    a.selectedVariable.setValue(this.value);
  };
  b.initValueInput = d;
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableSettingSplitterWorkspace");
  b.appendChild(c);
  c = Entry.createElement("div");
  c.addClass("entryVariableSettingSlideWrapperWorkspace");
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = "\uc2ac\ub77c\uc774\ub4dc";
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableSettingCheckWorkspace");
  b.slideCheck = d;
  c.appendChild(d);
  c.bindOnClick(function(b) {
    b = a.selectedVariable;
    var c = a.variables_, d = b.getType();
    if ("variable" == d) {
      var f = b.toJSON();
      f.variableType = "slide";
      f = new Entry.Variable(f);
      c.splice(c.indexOf(b), 0, f);
      0 > f.getValue() && f.setValue(0);
      100 < f.getValue() && f.setValue(100);
      e.removeAttribute("disabled");
      h.removeAttribute("disabled");
    } else {
      "slide" == d && (f = b.toJSON(), f.variableType = "variable", f = new Entry.Variable(f), c.splice(c.indexOf(b), 0, f), e.setAttribute("disabled", "disabled"), h.setAttribute("disabled", "disabled"));
    }
    a.createVariableView(f);
    a.removeVariable(b);
    a.updateSelectedVariable(f);
    f.generateView();
  });
  c = Entry.createElement("div");
  b.minMaxWrapper = c;
  c.addClass("entryVariableSettingMinMaxWrapperWorkspace");
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = "\ucd5c\uc18c\uac12";
  c.appendChild(d);
  var e = Entry.createElement("input");
  e.addClass("entryVariableSettingMinValueInputWorkspace");
  d = a.selectedVariable;
  e.value = d && "slide" == d.type ? d.minValue_ : 0;
  e.onblur = function(b) {
    isNaN(this.value) || (b = a.selectedVariable, b.setMinValue(Number(this.value)), a.updateVariableSettingView(b));
  };
  b.minValueInput = e;
  c.appendChild(e);
  var f = Entry.createElement("span");
  f.addClass("entryVariableSettingMaxValueSpanWorkspace");
  f.innerHTML = "\ucd5c\ub300\uac12";
  c.appendChild(f);
  var h = Entry.createElement("input");
  h.addClass("entryVariableSettingMaxValueInputWorkspace");
  h.value = d && "slide" == d.type ? d.maxValue_ : 100;
  h.onblur = function(b) {
    isNaN(this.value) || (b = a.selectedVariable, b.setMaxValue(Number(this.value)), a.updateVariableSettingView(b));
  };
  b.maxValueInput = h;
  c.appendChild(h);
};
Entry.VariableContainer.prototype.updateVariableSettingView = function(a) {
  var b = this.variableSettingView, c = b.visibleCheck, d = b.initValueInput, e = b.slideCheck, f = b.minValueInput, h = b.maxValueInput, g = b.minMaxWrapper;
  c.removeClass("entryVariableSettingChecked");
  a.isVisible() && c.addClass("entryVariableSettingChecked");
  e.removeClass("entryVariableSettingChecked");
  "slide" == a.getType() ? (e.addClass("entryVariableSettingChecked"), f.removeAttribute("disabled"), h.removeAttribute("disabled"), f.value = a.getMinValue(), h.value = a.getMaxValue(), g.removeClass("entryVariableMinMaxDisabledWorkspace")) : (g.addClass("entryVariableMinMaxDisabledWorkspace"), f.setAttribute("disabled", "disabled"), h.setAttribute("disabled", "disabled"));
  d.value = a.getValue();
  a.listElement.appendChild(b);
  b.removeClass("entryRemove");
};
Entry.VariableContainer.prototype.generateListSettingView = function() {
  var a = this, b = Entry.createElement("div");
  b.bindOnClick(function(a) {
    a.stopPropagation();
  });
  this.listSettingView = b;
  b.addClass("entryListSettingWorkspace");
  this.listView_.appendChild(b);
  b.addClass("entryRemove");
  var c = Entry.createElement("div");
  c.addClass("entryListSettingVisibleWrapperWorkspace");
  c.bindOnClick(function(b) {
    b = a.selectedList;
    var c = a.listSettingView.visibleCheck;
    b.setVisible(!b.isVisible());
    b.isVisible() ? c.addClass("entryListSettingCheckedWorkspace") : c.removeClass("entryListSettingCheckedWorkspace");
  });
  b.appendChild(c);
  var d = Entry.createElement("span");
  d.innerHTML = "\ub9ac\uc2a4\ud2b8 \ubcf4\uc774\uae30";
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryListSettingCheckWorkspace");
  b.visibleCheck = d;
  c.appendChild(d);
  d = Entry.createElement("div");
  d.addClass("entryListSettingLengthWrapperWorkspace");
  c = Entry.createElement("span");
  c.addClass("entryListSettingLengthSpanWorkspace");
  c.innerHTML = "\ub9ac\uc2a4\ud2b8 \ud56d\ubaa9 \uc218";
  d.appendChild(c);
  b.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryListSettingLengthControllerWorkspace");
  d.appendChild(c);
  d = Entry.createElement("span");
  d.addClass("entryListSettingMinusWorkspace");
  d.bindOnClick(function(b) {
    a.selectedList.array_.pop();
    a.updateListSettingView(a.selectedList);
  });
  c.appendChild(d);
  d = Entry.createElement("input");
  d.addClass("entryListSettingLengthInputWorkspace");
  d.setAttribute("disabled", "disabled");
  d.onblur = function() {
    a.setListLength(this.value);
  };
  d.onkeypress = function(a) {
    13 == a.keyCode && this.blur();
  };
  b.lengthInput = d;
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryListSettingPlusWorkspace");
  d.bindOnClick(function(b) {
    a.selectedList.array_.push({data:0});
    a.updateListSettingView(a.selectedList);
  });
  c.appendChild(d);
  c = Entry.createElement("div");
  b.seperator = c;
  b.appendChild(c);
  c.addClass("entryListSettingSeperatorWorkspace");
  c = Entry.createElement("div");
  c.addClass("entryListSettingListValuesWorkspace");
  b.listValues = c;
  b.appendChild(c);
};
Entry.VariableContainer.prototype.updateListSettingView = function(a) {
  var b = this;
  a = a || this.selectedList;
  var c = this.listSettingView, d = c.listValues, e = c.visibleCheck, f = c.lengthInput, h = c.seperator;
  e.removeClass("entryListSettingCheckedWorkspace");
  a.isVisible() && e.addClass("entryListSettingCheckedWorkspace");
  f.value = a.array_.length;
  for (a.listElement.appendChild(c);d.firstChild;) {
    d.removeChild(d.firstChild);
  }
  var g = a.array_;
  0 == g.length ? h.addClass("entryRemove") : h.removeClass("entryRemove");
  for (e = 0;e < g.length;e++) {
    (function(c) {
      var e = Entry.createElement("div");
      e.addClass("entryListSettingValueWrapperWorkspace");
      var f = Entry.createElement("span");
      f.addClass("entryListSettingValueNumberSpanWorkspace");
      f.innerHTML = c + 1;
      e.appendChild(f);
      f = Entry.createElement("input");
      f.value = g[c].data;
      f.onblur = function() {
        g[c].data = this.value;
        a.updateView();
      };
      f.onkeypress = function(a) {
        13 == a.keyCode && this.blur();
      };
      f.addClass("entryListSettingEachInputWorkspace");
      e.appendChild(f);
      f = Entry.createElement("span");
      f.bindOnClick(function() {
        g.splice(c, 1);
        b.updateListSettingView();
      });
      f.addClass("entryListSettingValueRemoveWorkspace");
      e.appendChild(f);
      d.appendChild(e);
    })(e);
  }
  a.updateView();
  c.removeClass("entryRemove");
};
Entry.VariableContainer.prototype.setListLength = function(a) {
  a = Number(a);
  var b = this.selectedList.array_;
  if (!isNaN(a)) {
    var c = b.length;
    if (c < a) {
      for (a -= c, c = 0;c < a;c++) {
        b.push({data:0});
      }
    } else {
      c > a && (b.length = a);
    }
  }
  this.updateListSettingView();
};
Entry.VariableContainer.prototype.updateViews = function() {
  var a = this.lists_;
  this.variables_.map(function(a) {
    a.updateView();
  });
  a.map(function(a) {
    a.updateView();
  });
};
Entry.VariableContainer.prototype.updateSelectedVariable = function(a, b) {
  a ? "variable" == a.type ? (this.selectedVariable = a, this.updateVariableSettingView(a)) : "slide" == a.type ? (this.selectedVariable = a, this.updateVariableSettingView(a)) : "list" == a.type && (this.selectedList = a, this.updateListSettingView(a)) : (this.selectedVariable = null, "variable" == (b || "variable") ? this.variableSettingView.addClass("entryRemove") : this.listSettingView.addClass("entryRemove"));
};
Entry.VariableContainer.prototype.removeLocalVariables = function(a) {
  var b = [], c = this;
  this.mapVariable(function(a, c) {
    a.object_ && a.object_ == c && b.push(a);
  }, a);
  b.map(function(a) {
    c.removeVariable(a);
  });
};
Entry.Xml = {};
Entry.Xml.isTypeOf = function(a, b) {
  return b.getAttribute("type") == a;
};
Entry.Xml.getNextBlock = function(a) {
  a = a.childNodes;
  for (var b = 0;b < a.length;b++) {
    if ("NEXT" == a[b].tagName.toUpperCase()) {
      return a[b].children[0];
    }
  }
  return null;
};
Entry.Xml.getStatementBlock = function(a, b) {
  var c = b.getElementsByTagName("statement");
  if (!c.length) {
    return b;
  }
  for (var d in c) {
    if (c[d].getAttribute("name") == a) {
      return c[d].children[0];
    }
  }
  return null;
};
Entry.Xml.getParentLoop = function(a) {
  for (;;) {
    if (!a) {
      return null;
    }
    if ((a = a.parentNode) && "STATEMENT" == a.tagName.toUpperCase()) {
      return a.parentNode;
    }
    if (a) {
      a = a.parentNode;
    } else {
      return null;
    }
  }
};
Entry.Xml.getParentIterateLoop = function(a) {
  for (;;) {
    if (!a) {
      return null;
    }
    if ((a = a.parentNode) && a.getAttribute("type") && "REPEAT" == a.getAttribute("type").toUpperCase().substr(0, 6)) {
      return a;
    }
    if (!a) {
      return null;
    }
  }
};
Entry.Xml.getParentBlock = function(a) {
  return (a = a.parentNode) ? a.parentNode : null;
};
Entry.Xml.callReturn = function(a) {
  var b = Entry.Xml.getNextBlock(a);
  return b ? b : Entry.Xml.getParentLoop(a);
};
Entry.Xml.isRootBlock = function(a) {
};
Entry.Xml.getValue = function(a, b) {
  var c = b.childNodes;
  if (!c.length) {
    return null;
  }
  for (var d in c) {
    if ("VALUE" == c[d].tagName.toUpperCase() && c[d].getAttribute("name") == a) {
      return c[d].children[0];
    }
  }
  return null;
};
Entry.Xml.getNumberValue = function(a, b, c) {
  c = c.childNodes;
  if (!c.length) {
    return null;
  }
  for (var d in c) {
    if (c[d].tagName && "VALUE" == c[d].tagName.toUpperCase() && c[d].getAttribute("name") == b) {
      return Number(Entry.Xml.operate(a, c[d].children[0]));
    }
  }
  return null;
};
Entry.Xml.getField = function(a, b) {
  var c = b.childNodes;
  if (!c.length) {
    return null;
  }
  for (var d in c) {
    if (c[d].tagName && "FIELD" == c[d].tagName.toUpperCase() && c[d].getAttribute("name") == a) {
      return c[d].textContent;
    }
  }
};
Entry.Xml.getNumberField = function(a, b) {
  var c = b.childNodes;
  if (!c.length) {
    return null;
  }
  for (var d in c) {
    if ("FIELD" == c[d].tagName.toUpperCase() && c[d].getAttribute("name") == a) {
      return Number(c[d].textContent);
    }
  }
};
Entry.Xml.getBooleanValue = function(a, b, c) {
  c = c.getElementsByTagName("value");
  if (!c.length) {
    return null;
  }
  for (var d in c) {
    if (c[d].getAttribute("name") == b) {
      return Entry.Xml.operate(a, c[d].children[0]);
    }
  }
  return null;
};
Entry.Xml.operate = function(a, b) {
  return Entry.block[b.getAttribute("type")](a, b);
};
Entry.Xml.cloneBlock = function(a, b, c) {
  var d = a.cloneNode();
  a.parentNode && "xml" != a.parentNode.tagName && Entry.Xml.cloneBlock(a.parentNode, d, "parent");
  for (var e = 0;e < a.childNodes.length;e++) {
    var f = a.childNodes[e];
    f instanceof Text ? d.textContent = f.textContent : "parent" == c ? d.appendChild(b) : d.appendChild(Entry.Xml.cloneBlock(f, d, "child"));
  }
  return d;
};

