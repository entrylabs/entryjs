var Entry = {block:{}, TEXT_ALIGN_CENTER:0, TEXT_ALIGN_LEFT:1, TEXT_ALIGN_RIGHT:2, TEXT_ALIGNS:["center", "left", "right"], loadProject:function(a) {
  a || (a = Entry.getStartProject(Entry.mediaFilePath));
  "workspace" == this.type && Entry.stateManager.startIgnore();
  Entry.projectId = a._id;
  Entry.variableContainer.setVariables(a.variables);
  Entry.variableContainer.setMessages(a.messages);
  Entry.variableContainer.setFunctions(a.functions);
  Entry.scene.addScenes(a.scenes);
  Entry.stage.initObjectContainers();
  Entry.container.setObjects(a.objects);
  Entry.FPS = a.speed ? a.speed : 60;
  createjs.Ticker.setFPS(Entry.FPS);
  "workspace" == this.type && Entry.stateManager.endIgnore();
  Entry.engine.projectTimer || Entry.variableContainer.generateTimer();
  0 === Object.keys(Entry.container.inputValue).length && Entry.variableContainer.generateAnswer();
  Entry.start();
  return a;
}, exportProject:function(a) {
  a || (a = {});
  Entry.engine.isState("stop") || Entry.engine.toggleStop();
  Entry.Func && Entry.Func.workspace && Entry.Func.workspace.visible && Entry.Func.cancelEdit();
  a.objects = Entry.container.toJSON();
  a.scenes = Entry.scene.toJSON();
  a.variables = Entry.variableContainer.getVariableJSON();
  a.messages = Entry.variableContainer.getMessageJSON();
  a.functions = Entry.variableContainer.getFunctionJSON();
  a.scenes = Entry.scene.toJSON();
  a.speed = Entry.FPS;
  return a;
}, setBlockByText:function(a, b) {
  for (var c = [], d = jQuery.parseXML(b).getElementsByTagName("category"), e = 0;e < d.length;e++) {
    for (var f = d[e], g = {category:f.getAttribute("id"), blocks:[]}, f = f.childNodes, h = 0;h < f.length;h++) {
      var k = f[h];
      !k.tagName || "BLOCK" != k.tagName.toUpperCase() && "BTN" != k.tagName.toUpperCase() || g.blocks.push(k.getAttribute("type"));
    }
    c.push(g);
  }
  Entry.playground.setBlockMenu(c);
}, setBlock:function(a, b) {
  Entry.playground.setMenuBlock(a, b);
}, enableArduino:function() {
}, initSound:function(a) {
  a.path = a.fileurl ? a.fileurl : "/uploads/" + a.filename.substring(0, 2) + "/" + a.filename.substring(2, 4) + "/" + a.filename + a.ext;
  Entry.soundQueue.loadFile({id:a.id, src:a.path, type:createjs.LoadQueue.SOUND});
}, beforeUnload:function(a) {
  Entry.hw.closeConnection();
  Entry.variableContainer.updateCloudVariables();
  if ("workspace" == Entry.type && (localStorage && Entry.interfaceState && localStorage.setItem("workspace-interface", JSON.stringify(Entry.interfaceState)), !Entry.stateManager.isSaved())) {
    return Lang.Workspace.project_changed;
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
    var b = this.interfaceState;
    !a.canvasWidth && b.canvasWidth && (a.canvasWidth = b.canvasWidth);
    !a.menuWidth && this.interfaceState.menuWidth && (a.menuWidth = b.menuWidth);
    Entry.engine.speedPanelOn && Entry.engine.toggleSpeedPanel();
    (b = a.canvasWidth) ? 300 > b ? b = 300 : 720 < b && (b = 720) : b = 400;
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
  Entry.reporter && Entry.reporter.start(Entry.projectId, window.user ? window.user._id : null, Entry.startTime);
}, getActivityLog:function() {
  var a = {};
  Entry.stateManager && (a.activityLog = Entry.stateManager.activityLog_);
  return a;
}, DRAG_MODE_NONE:0, DRAG_MODE_MOUSEDOWN:1, DRAG_MODE_DRAG:2};
window.Entry = Entry;
Entry.Albert = {PORT_MAP:{leftWheel:0, rightWheel:0, buzzer:0, leftEye:0, rightEye:0, note:0, bodyLed:0, frontLed:0, padWidth:0, padHeight:0}, setZero:function() {
  var a = Entry.Albert.PORT_MAP, b = Entry.hw.sendQueue, c;
  for (c in a) {
    b[c] = a[c];
  }
  Entry.hw.update();
  a = Entry.Albert;
  a.tempo = 60;
  a.removeAllTimeouts();
}, tempo:60, timeouts:[], removeTimeout:function(a) {
  clearTimeout(a);
  var b = this.timeouts;
  a = b.indexOf(a);
  0 <= a && b.splice(a, 1);
}, removeAllTimeouts:function() {
  var a = this.timeouts, b;
  for (b in a) {
    clearTimeout(a[b]);
  }
  this.timeouts = [];
}, name:"albert"};
Blockly.Blocks.albert_hand_found = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_hand_found);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.albert_hand_found = function(a, b) {
  var c = Entry.hw.portData;
  return 40 < c.leftProximity || 40 < c.rightProximity;
};
Blockly.Blocks.albert_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdown([[Lang.Blocks.ALBERT_sensor_leftProximity, "leftProximity"], [Lang.Blocks.ALBERT_sensor_rightProximity, "rightProximity"], [Lang.Blocks.ALBERT_sensor_light, "light"], [Lang.Blocks.ALBERT_sensor_battery, "battery"], [Lang.Blocks.ALBERT_sensor_signalStrength, "signalStrength"], [Lang.Blocks.ALBERT_sensor_frontOid, "frontOid"], [Lang.Blocks.ALBERT_sensor_backOid, "backOid"], [Lang.Blocks.ALBERT_sensor_positionX, "positionX"], 
  [Lang.Blocks.ALBERT_sensor_positionY, "positionY"], [Lang.Blocks.ALBERT_sensor_orientation, "orientation"]]), "DEVICE");
  this.setInputsInline(!0);
  this.setOutput(!0, "Number");
}};
Entry.block.albert_value = function(a, b) {
  var c = Entry.hw.portData, d = b.getField("DEVICE");
  return c[d];
};
Blockly.Blocks.albert_move_forward_for_secs = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_move_forward_for_secs_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_move_forward_for_secs_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_move_forward_for_secs = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  c.leftWheel = 30;
  c.rightWheel = 30;
  var c = 1E3 * b.getNumberValue("VALUE"), d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Albert.removeTimeout(d);
  }, c);
  Entry.Albert.timeouts.push(d);
  return b;
};
Blockly.Blocks.albert_move_backward_for_secs = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_move_backward_for_secs_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_move_backward_for_secs_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_move_backward_for_secs = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  c.leftWheel = -30;
  c.rightWheel = -30;
  var c = 1E3 * b.getNumberValue("VALUE"), d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Albert.removeTimeout(d);
  }, c);
  Entry.Albert.timeouts.push(d);
  return b;
};
Blockly.Blocks.albert_turn_for_secs = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_turn_for_secs_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"]]), "DIRECTION").appendField(Lang.Blocks.ALBERT_turn_for_secs_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_turn_for_secs_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_turn_for_secs = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  "LEFT" == b.getField("DIRECTION", b) ? (c.leftWheel = -30, c.rightWheel = 30) : (c.leftWheel = 30, c.rightWheel = -30);
  var c = 1E3 * b.getNumberValue("VALUE"), d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Albert.removeTimeout(d);
  }, c);
  Entry.Albert.timeouts.push(d);
  return b;
};
Blockly.Blocks.albert_change_both_wheels_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_both_wheels_by_1);
  this.appendValueInput("LEFT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_both_wheels_by_2);
  this.appendValueInput("RIGHT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_both_wheels_by_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_change_both_wheels_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getNumberValue("LEFT"), e = b.getNumberValue("RIGHT");
  c.leftWheel = void 0 != c.leftWheel ? c.leftWheel + d : d;
  c.rightWheel = void 0 != c.rightWheel ? c.rightWheel + e : e;
  return b.callReturn();
};
Blockly.Blocks.albert_set_both_wheels_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_both_wheels_to_1);
  this.appendValueInput("LEFT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_both_wheels_to_2);
  this.appendValueInput("RIGHT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_both_wheels_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_set_both_wheels_to = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.leftWheel = b.getNumberValue("LEFT");
  c.rightWheel = b.getNumberValue("RIGHT");
  return b.callReturn();
};
Blockly.Blocks.albert_change_wheel_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_wheel_by_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.ALBERT_change_wheel_by_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_wheel_by_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_change_wheel_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION"), e = b.getNumberValue("VALUE");
  "LEFT" == d ? c.leftWheel = void 0 != c.leftWheel ? c.leftWheel + e : e : ("RIGHT" != d && (c.leftWheel = void 0 != c.leftWheel ? c.leftWheel + e : e), c.rightWheel = void 0 != c.rightWheel ? c.rightWheel + e : e);
  return b.callReturn();
};
Blockly.Blocks.albert_set_wheel_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_wheel_to_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.ALBERT_set_wheel_to_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_wheel_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_set_wheel_to = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION"), e = b.getNumberValue("VALUE");
  "LEFT" == d ? c.leftWheel = e : ("RIGHT" != d && (c.leftWheel = e), c.rightWheel = e);
  return b.callReturn();
};
Blockly.Blocks.albert_stop = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_stop).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_stop = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.leftWheel = 0;
  c.rightWheel = 0;
  return b.callReturn();
};
Blockly.Blocks.albert_set_pad_size_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_pad_size_to_1);
  this.appendValueInput("WIDTH").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_pad_size_to_2);
  this.appendValueInput("HEIGHT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_pad_size_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_set_pad_size_to = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.padWidth = b.getNumberValue("WIDTH");
  c.padHeight = b.getNumberValue("HEIGHT");
  return b.callReturn();
};
Blockly.Blocks.albert_set_eye_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_eye_to_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.ALBERT_set_eye_to_2).appendField(new Blockly.FieldDropdown([[Lang.General.red, "4"], [Lang.General.yellow, "6"], [Lang.General.green, "2"], [Lang.Blocks.ALBERT_color_cyan, "3"], [Lang.General.blue, "1"], [Lang.Blocks.ALBERT_color_magenta, "5"], [Lang.General.white, 
  "7"]]), "COLOR").appendField(Lang.Blocks.ALBERT_set_eye_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_set_eye_to = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION", b), e = Number(b.getField("COLOR", b));
  "LEFT" == d ? c.leftEye = e : ("RIGHT" != d && (c.leftEye = e), c.rightEye = e);
  return b.callReturn();
};
Blockly.Blocks.albert_clear_eye = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_clear_eye_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.ALBERT_clear_eye_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_clear_eye = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION", b);
  "LEFT" == d ? c.leftEye = 0 : ("RIGHT" != d && (c.leftEye = 0), c.rightEye = 0);
  return b.callReturn();
};
Blockly.Blocks.albert_body_led = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_body_led_1).appendField(new Blockly.FieldDropdown([[Lang.General.turn_on, "ON"], [Lang.General.turn_off, "OFF"]]), "STATE").appendField(Lang.Blocks.ALBERT_body_led_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_body_led = function(a, b) {
  var c = Entry.hw.sendQueue;
  "ON" == b.getField("STATE", b) ? c.bodyLed = 1 : c.bodyLed = 0;
  return b.callReturn();
};
Blockly.Blocks.albert_front_led = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_front_led_1).appendField(new Blockly.FieldDropdown([[Lang.General.turn_on, "ON"], [Lang.General.turn_off, "OFF"]]), "STATE").appendField(Lang.Blocks.ALBERT_front_led_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_front_led = function(a, b) {
  var c = Entry.hw.sendQueue;
  "ON" == b.getField("STATE", b) ? c.frontLed = 1 : c.frontLed = 0;
  return b.callReturn();
};
Blockly.Blocks.albert_beep = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_beep).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_beep = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.buzzer = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  c.buzzer = 440;
  c.note = 0;
  var d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Albert.removeTimeout(d);
  }, 200);
  Entry.Albert.timeouts.push(d);
  return b;
};
Blockly.Blocks.albert_change_buzzer_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_buzzer_by_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_buzzer_by_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_change_buzzer_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getNumberValue("VALUE");
  c.buzzer = void 0 != c.buzzer ? c.buzzer + d : d;
  c.note = 0;
  return b.callReturn();
};
Blockly.Blocks.albert_set_buzzer_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_buzzer_to_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_buzzer_to_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_set_buzzer_to = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.buzzer = b.getNumberValue("VALUE");
  c.note = 0;
  return b.callReturn();
};
Blockly.Blocks.albert_clear_buzzer = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_clear_buzzer).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_clear_buzzer = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.buzzer = 0;
  c.note = 0;
  return b.callReturn();
};
Blockly.Blocks.albert_play_note_for = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_play_note_for_1).appendField(new Blockly.FieldDropdown([[Lang.General.note_c + "", "4"], [Lang.General.note_c + "#", "5"], [Lang.General.note_d + "", "6"], [Lang.General.note_e + "b", "7"], [Lang.General.note_e + "", "8"], [Lang.General.note_f + "", "9"], [Lang.General.note_f + "#", "10"], [Lang.General.note_g + "", "11"], [Lang.General.note_g + "#", "12"], [Lang.General.note_a + "", "13"], [Lang.General.note_b + "b", "14"], [Lang.General.note_b + 
  "", "15"]]), "NOTE").appendField(Lang.Blocks.ALBERT_play_note_for_2).appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "OCTAVE").appendField(Lang.Blocks.ALBERT_play_note_for_3);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_play_note_for_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_play_note_for = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.note = 0;
    return b.callReturn();
  }
  var d = b.getNumberField("NOTE", b), e = b.getNumberField("OCTAVE", b), f = b.getNumberValue("VALUE", b), g = Entry.Albert.tempo, f = 6E4 * f / g;
  b.isStart = !0;
  b.timeFlag = 1;
  c.buzzer = 0;
  c.note = d + 12 * (e - 1);
  if (100 < f) {
    var h = setTimeout(function() {
      c.note = 0;
      Entry.Albert.removeTimeout(h);
    }, f - 100);
    Entry.Albert.timeouts.push(h);
  }
  var k = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Albert.removeTimeout(k);
  }, f);
  Entry.Albert.timeouts.push(k);
  return b;
};
Blockly.Blocks.albert_rest_for = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_rest_for_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_rest_for_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_rest_for = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  var d = b.getNumberValue("VALUE"), d = 6E4 * d / Entry.Albert.tempo;
  c.buzzer = 0;
  c.note = 0;
  var e = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Albert.removeTimeout(e);
  }, d);
  Entry.Albert.timeouts.push(e);
  return b;
};
Blockly.Blocks.albert_change_tempo_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_tempo_by_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_change_tempo_by_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_change_tempo_by = function(a, b) {
  Entry.Albert.tempo += b.getNumberValue("VALUE");
  1 > Entry.Albert.tempo && (Entry.Albert.tempo = 1);
  return b.callReturn();
};
Blockly.Blocks.albert_set_tempo_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_tempo_to_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.ALBERT_set_tempo_to_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.albert_set_tempo_to = function(a, b) {
  Entry.Albert.tempo = b.getNumberValue("VALUE");
  1 > Entry.Albert.tempo && (Entry.Albert.tempo = 1);
  return b.callReturn();
};
Entry.Arduino = {name:"arduino", setZero:function() {
  for (var a = 0;14 > a;a++) {
    Entry.hw.sendQueue[a] = 0;
  }
  Entry.hw.update();
}};
Entry.SensorBoard = {name:"sensorBoard", setZero:Entry.Arduino.setZero};
Entry.CODEino = {name:"CODEino", setZero:Entry.Arduino.setZero};
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
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.ARDUINO_on, "on"], [Lang.Blocks.ARDUINO_off, "off"]]), "OPERATOR").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
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
  var c = b.getNumberValue("VALUE1", b), d = b.getNumberValue("VALUE2", b), e = b.getNumberValue("VALUE3", b), f = b.getNumberValue("VALUE4", b), g = b.getNumberValue("VALUE5", b);
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
Blockly.Blocks.sensorBoard_get_named_sensor_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdown([["\uc18c\ub9ac", "0"], ["\ube5b \uac10\uc9c0", "1"], ["\uc2ac\ub77c\uc774\ub354", "2"], ["\uc628\ub3c4", "3"]]), "PORT").appendField(" \uc13c\uc11c\uac12");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.sensorBoard_get_named_sensor_value = function(a, b) {
  return Entry.hw.getAnalogPortValue(b.getField("PORT", b));
};
Blockly.Blocks.sensorBoard_is_button_pressed = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdown([["\ube68\uac04", "8"], ["\ud30c\ub780", "9"], ["\ub178\ub780", "10"], ["\ucd08\ub85d", "11"]]), "PORT");
  this.appendDummyInput().appendField(" \ubc84\ud2bc\uc744 \ub20c\ub800\ub294\uac00?");
  this.setInputsInline(!0);
  this.setOutput(!0, "Boolean");
}};
Entry.block.sensorBoard_is_button_pressed = function(a, b) {
  return Entry.hw.getDigitalPortValue(b.getNumberField("PORT", b));
};
Blockly.Blocks.sensorBoard_led = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdown([["\ube68\uac04", "2"], ["\ucd08\ub85d", "3"], ["\ud30c\ub780", "4"], ["\ud770\uc0c9", "5"]]), "PORT").appendField(" LED").appendField(new Blockly.FieldDropdown([["\ucf1c\uae30", "255"], ["\ub044\uae30", "0"]]), "OPERATOR").appendField(" ").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.sensorBoard_led = function(a, b) {
  Entry.hw.setDigitalPortValue(b.getField("PORT"), b.getNumberField("OPERATOR"));
  return b.callReturn();
};
Blockly.Blocks.CODEino_get_sensor_number = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CODEino_get_sensor_number_0, "A0"], [Lang.Blocks.CODEino_get_sensor_number_1, "A1"], [Lang.Blocks.CODEino_get_sensor_number_2, "A2"], [Lang.Blocks.CODEino_get_sensor_number_3, "A3"], [Lang.Blocks.CODEino_get_sensor_number_4, "A4"], [Lang.Blocks.CODEino_get_sensor_number_5, "A5"], [Lang.Blocks.CODEino_get_sensor_number_6, "A6"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.CODEino_get_sensor_number = function(a, b) {
  return b.getStringField("PORT");
};
Blockly.Blocks.CODEino_get_named_sensor_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(" ").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CODEino_sensor_name_0, "0"], [Lang.Blocks.CODEino_sensor_name_1, "1"], [Lang.Blocks.CODEino_sensor_name_2, "2"], [Lang.Blocks.CODEino_sensor_name_3, "3"], [Lang.Blocks.CODEino_sensor_name_4, "4"], [Lang.Blocks.CODEino_sensor_name_5, "5"], [Lang.Blocks.CODEino_sensor_name_6, "6"]]), "PORT").appendField(Lang.Blocks.CODEino_string_1);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.CODEino_get_named_sensor_value = function(a, b) {
  return Entry.hw.getAnalogPortValue(b.getField("PORT", b));
};
Blockly.Blocks.CODEino_is_button_pressed = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.CODEino_string_2).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CODEino_string_3, "4"], [Lang.Blocks.CODEino_string_4, "17"], [Lang.Blocks.CODEino_string_5, "18"], [Lang.Blocks.CODEino_string_6, "19"], [Lang.Blocks.CODEino_string_7, "20"]]), "PORT");
  this.appendDummyInput().appendField(" ");
  this.setInputsInline(!0);
  this.setOutput(!0, "Boolean");
}};
Entry.block.CODEino_is_button_pressed = function(a, b) {
  var c = b.getNumberField("PORT", b);
  return 14 < c ? Entry.hw.getAnalogPortValue(c - 14) : !Entry.hw.getDigitalPortValue(c);
};
Blockly.Blocks.CODEino_get_accelerometer_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.CODEino_string_8).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CODEino_accelerometer_X, "3"], [Lang.Blocks.CODEino_accelerometer_Y, "4"], [Lang.Blocks.CODEino_accelerometer_Z, "5"]]), "PORT").appendField(Lang.Blocks.CODEino_string_9);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.CODEino_get_accelerometer_value = function(a, b) {
  var c = 265, d = 402, e = -90, f = 90, g = Entry.hw.getAnalogPortValue(b.getField("PORT", b));
  if (c > d) {
    var h = c, c = d, d = h
  }
  e > f && (h = e, e = f, f = h);
  g = (f - e) / (d - c) * (g - c);
  g += e;
  g = Math.min(f, g);
  g = Math.max(e, g);
  return Math.round(g);
};
Entry.Bitbrick = {SENSOR_MAP:{1:"light", 2:"IR", 3:"touch", 4:"potentiometer", 5:"MIC", 21:"UserSensor", 11:"USER INPUT", 20:"LED", 19:"SERVO", 18:"DC"}, PORT_MAP:{buzzer:2, 5:4, 6:6, 7:8, 8:10, LEDR:12, LEDG:14, LEDB:16}, sensorList:function() {
  for (var a = [], b = Entry.hw.portData, c = 1;5 > c;c++) {
    var d = b[c];
    d && (d.value || 0 === d.value) && a.push([c + " - " + Lang.Blocks["BITBRICK_" + d.type], c.toString()]);
  }
  return 0 == a.length ? [[Lang.Blocks.no_target, "null"]] : a;
}, touchList:function() {
  for (var a = [], b = Entry.hw.portData, c = 1;5 > c;c++) {
    var d = b[c];
    d && "touch" === d.type && a.push([c.toString(), c.toString()]);
  }
  return 0 == a.length ? [[Lang.Blocks.no_target, "null"]] : a;
}, servoList:function() {
  for (var a = [], b = Entry.hw.portData, c = 5;9 > c;c++) {
    var d = b[c];
    d && "SERVO" === d.type && a.push(["ABCD"[c - 5], c.toString()]);
  }
  return 0 == a.length ? [[Lang.Blocks.no_target, "null"]] : a;
}, dcList:function() {
  for (var a = [], b = Entry.hw.portData, c = 5;9 > c;c++) {
    var d = b[c];
    d && "DC" === d.type && a.push(["ABCD"[c - 5], c.toString()]);
  }
  return 0 == a.length ? [[Lang.Blocks.no_target, "null"]] : a;
}, setZero:function() {
  var a = Entry.hw.sendQueue, b;
  for (b in Entry.Bitbrick.PORT_MAP) {
    a[b] = 0;
  }
  Entry.hw.update();
}, name:"bitbrick", servoMaxValue:181, servoMinValue:1, dcMaxValue:100, dcMinValue:-100};
Blockly.Blocks.bitbrick_sensor_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.sensorList), "PORT").appendField(" \uac12");
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.bitbrick_sensor_value = function(a, b) {
  var c = b.getStringField("PORT");
  return Entry.hw.portData[c].value;
};
Blockly.Blocks.bitbrick_is_touch_pressed = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.BITBRICK_touch).appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.touchList), "PORT").appendField("\uc774(\uac00) \ub20c\ub838\ub294\uac00?");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.bitbrick_is_touch_pressed = function(a, b) {
  return 0 === Entry.hw.portData[b.getStringField("PORT")].value;
};
Blockly.Blocks.bitbrick_turn_off_color_led = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\uceec\ub7ec LED \ub044\uae30").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bitbrick_turn_off_color_led = function(a, b) {
  Entry.hw.sendQueue.LEDR = 0;
  Entry.hw.sendQueue.LEDG = 0;
  Entry.hw.sendQueue.LEDB = 0;
  return b.callReturn();
};
Blockly.Blocks.bitbrick_turn_on_color_led_by_rgb = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\uceec\ub7ec LED \ucf1c\uae30 R");
  this.appendValueInput("rValue").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("G");
  this.appendValueInput("gValue").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("B");
  this.appendValueInput("bValue").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bitbrick_turn_on_color_led_by_rgb = function(a, b) {
  var c = b.getNumberValue("rValue"), d = b.getNumberValue("gValue"), e = b.getNumberValue("bValue"), f = Entry.adjustValueWithMaxMin, g = Entry.hw.sendQueue;
  g.LEDR = f(c, 0, 255);
  g.LEDG = f(d, 0, 255);
  g.LEDB = f(e, 0, 255);
  return b.callReturn();
};
Blockly.Blocks.bitbrick_turn_on_color_led_by_picker = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\uceec\ub7ec LED \uc0c9 ").appendField(new Blockly.FieldColour("#ff0000"), "VALUE").appendField("\ub85c \uc815\ud558\uae30").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bitbrick_turn_on_color_led_by_picker = function(a, b) {
  var c = b.getStringField("VALUE");
  Entry.hw.sendQueue.LEDR = parseInt(c.substr(1, 2), 16);
  Entry.hw.sendQueue.LEDG = parseInt(c.substr(3, 2), 16);
  Entry.hw.sendQueue.LEDB = parseInt(c.substr(5, 2), 16);
  return b.callReturn();
};
Blockly.Blocks.bitbrick_turn_on_color_led_by_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\uceec\ub7ec LED \ucf1c\uae30 \uc0c9");
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("\ub85c \uc815\ud558\uae30").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bitbrick_turn_on_color_led_by_value = function(a, b) {
  var c = b.getNumberValue("VALUE"), d, e, f, c = c % 200;
  67 > c ? (d = 200 - 3 * c, e = 3 * c, f = 0) : 134 > c ? (c -= 67, d = 0, e = 200 - 3 * c, f = 3 * c) : 201 > c && (c -= 134, d = 3 * c, e = 0, f = 200 - 3 * c);
  Entry.hw.sendQueue.LEDR = d;
  Entry.hw.sendQueue.LEDG = e;
  Entry.hw.sendQueue.LEDB = f;
  return b.callReturn();
};
Blockly.Blocks.bitbrick_buzzer = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\ubc84\uc800\uc74c ");
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("\ub0b4\uae30").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bitbrick_buzzer = function(a, b) {
  if (b.isStart) {
    return Entry.hw.sendQueue.buzzer = 0, delete b.isStart, b.callReturn();
  }
  var c = b.getNumberValue("VALUE");
  Entry.hw.sendQueue.buzzer = c;
  b.isStart = !0;
  return b;
};
Blockly.Blocks.bitbrick_turn_off_all_motors = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\ubaa8\ub4e0 \ubaa8\ud130 \ub044\uae30").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bitbrick_turn_off_all_motors = function(a, b) {
  var c = Entry.hw.sendQueue, d = Entry.Bitbrick;
  d.servoList().map(function(a) {
    c[a[1]] = 0;
  });
  d.dcList().map(function(a) {
    c[a[1]] = 128;
  });
  return b.callReturn();
};
Blockly.Blocks.bitbrick_dc_speed = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("DC \ubaa8\ud130").appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.dcList), "PORT").appendField(" \uc18d\ub3c4");
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setInputsInline(!0);
}};
Entry.block.bitbrick_dc_speed = function(a, b) {
  var c = b.getNumberValue("VALUE"), c = Math.min(c, Entry.Bitbrick.dcMaxValue), c = Math.max(c, Entry.Bitbrick.dcMinValue);
  Entry.hw.sendQueue[b.getStringField("PORT")] = c + 128;
  return b.callReturn();
};
Blockly.Blocks.bitbrick_dc_direction_speed = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("DC \ubaa8\ud130").appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.dcList), "PORT").appendField(" ").appendField(new Blockly.FieldDropdown([[Lang.Blocks.BITBRICK_dc_direction_cw, "CW"], [Lang.Blocks.BITBRICK_dc_direction_ccw, "CCW"]]), "DIRECTION").appendField(" \ubc29\ud5a5").appendField(" \uc18d\ub825");
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setInputsInline(!0);
}};
Entry.block.bitbrick_dc_direction_speed = function(a, b) {
  var c = "CW" === b.getStringField("DIRECTION"), d = b.getNumberValue("VALUE"), d = Math.min(d, Entry.Bitbrick.dcMaxValue), d = Math.max(d, 0);
  Entry.hw.sendQueue[b.getStringField("PORT")] = c ? d + 128 : 128 - d;
  return b.callReturn();
};
Blockly.Blocks.bitbrick_servomotor_angle = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\uc11c\ubcf4 \ubaa8\ud130").appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.servoList), "PORT").appendField(" \uac01\ub3c4");
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
  this.setInputsInline(!0);
}};
Entry.block.bitbrick_servomotor_angle = function(a, b) {
  var c = b.getNumberValue("VALUE") + 1, c = Math.min(c, Entry.Bitbrick.servoMaxValue), c = Math.max(c, Entry.Bitbrick.servoMinValue);
  Entry.hw.sendQueue[b.getStringField("PORT")] = c;
  return b.callReturn();
};
Blockly.Blocks.bitbrick_convert_scale = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("\ubcc0\ud658");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdownDynamic(Entry.Bitbrick.sensorList), "PORT");
  this.appendDummyInput().appendField("\uac12");
  this.appendValueInput("VALUE2").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_3);
  this.appendValueInput("VALUE3").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField("\uc5d0\uc11c");
  this.appendValueInput("VALUE4").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.ARDUINO_convert_scale_5);
  this.appendValueInput("VALUE5").setCheck(["Number", "String", null]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.bitbrick_convert_scale = function(a, b) {
  var c = b.getNumberField("PORT"), d = Entry.hw.portData[c].value, c = b.getNumberValue("VALUE2", b), e = b.getNumberValue("VALUE3", b), f = b.getNumberValue("VALUE4", b), g = b.getNumberValue("VALUE5", b);
  if (f > g) {
    var h = f, f = g, g = h
  }
  d -= c;
  d *= (g - f) / (e - c);
  d += f;
  d = Math.min(g, d);
  d = Math.max(f, d);
  return Math.round(d);
};
var categoryColor = "#FF9E20";
Blockly.Blocks.start_drawing = {init:function() {
  this.setColour(categoryColor);
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_start_drawing).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_stop_drawing).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_color_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_random_color).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_thickness_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_thickness_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_opacity_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_opacity_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_brush_erase_all).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_stamp).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_change_brush_transparency_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.BRUSH_set_brush_transparency_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/brush_03.png", "*"));
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
var calcArrowColor = "#e8b349", calcBlockColor = "#FFD974", calcFontColor = "#3D3D3D";
Blockly.Blocks.number = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(new Blockly.FieldTextInput(""), "NUM");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.number = function(a, b) {
  return b.fields.NUM;
};
Blockly.Blocks.angle = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(new Blockly.FieldAngle("90"), "ANGLE");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.angle = function(a, b) {
  return b.getNumberField("ANGLE");
};
Blockly.Blocks.get_x_coordinate = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_x_coordinate, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_x_coordinate = function(a, b) {
  return a.getX();
};
Blockly.Blocks.get_y_coordinate = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_y_coordinate, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_y_coordinate = function(a, b) {
  return a.getY();
};
Blockly.Blocks.get_angle = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_angle, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_angle = function(a, b) {
  return parseFloat(a.getRotation().toFixed(1));
};
Blockly.Blocks.get_rotation_direction = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_rotation_value, "ROTATION"], [Lang.Blocks.CALC_direction_value, "DIRECTION"]], null, !0, calcArrowColor), "OPERATOR");
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_rotation_direction = function(a, b) {
  return "DIRECTION" == b.getField("OPERATOR", b).toUpperCase() ? parseFloat(a.getDirection().toFixed(1)) : parseFloat(a.getRotation().toFixed(1));
};
Blockly.Blocks.distance_something = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_distance_something_1, calcFontColor).appendField(new Blockly.FieldDropdownDynamic("spritesWithMouse", null, !0, calcArrowColor), "VALUE").appendField(Lang.Blocks.CALC_distance_something_2, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.distance_something = function(a, b) {
  var c = b.getField("VALUE", b);
  if ("mouse" == c) {
    return c = Entry.stage.mouseCoordinate, Math.sqrt(Math.pow(a.getX() - c.x, 2) + Math.pow(a.getY() - c.y, 2));
  }
  c = Entry.container.getEntity(c);
  return Math.sqrt(Math.pow(a.getX() - c.getX(), 2) + Math.pow(a.getY() - c.getY(), 2));
};
Blockly.Blocks.coordinate_mouse = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_coordinate_mouse_1, calcFontColor).appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"]], null, !0, calcArrowColor), "VALUE").appendField(Lang.Blocks.CALC_coordinate_mouse_2, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.coordinate_mouse = function(a, b) {
  return "x" === b.getField("VALUE", b) ? Number(Entry.stage.mouseCoordinate.x) : Number(Entry.stage.mouseCoordinate.y);
};
Blockly.Blocks.coordinate_object = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_coordinate_object_1, calcFontColor).appendField(new Blockly.FieldDropdownDynamic("spritesWithSelf", null, !0, calcArrowColor), "VALUE").appendField(Lang.Blocks.CALC_coordinate_object_2, calcFontColor).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_coordinate_x_value, "x"], [Lang.Blocks.CALC_coordinate_y_value, "y"], [Lang.Blocks.CALC_coordinate_rotation_value, "rotation"], [Lang.Blocks.CALC_coordinate_direction_value, "direction"], 
  [Lang.Blocks.CALC_coordinate_size_value, "size"], [Lang.Blocks.CALC_picture_index, "picture_index"], [Lang.Blocks.CALC_picture_name, "picture_name"]], null, !0, calcArrowColor), "COORDINATE").appendField(Lang.Blocks.CALC_coordinate_object_3, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.coordinate_object = function(a, b) {
  var c = b.getField("VALUE", b), c = "self" == c ? a : Entry.container.getEntity(c);
  switch(b.getField("COORDINATE", b)) {
    case "x":
      return c.getX();
    case "y":
      return c.getY();
    case "rotation":
      return c.getRotation();
    case "direction":
      return c.getDirection();
    case "picture_index":
      var d = c.parent, d = d.pictures;
      return d.indexOf(c.picture) + 1;
    case "size":
      return Number(c.getSize().toFixed(1));
    case "picture_name":
      return d = c.parent, d = d.pictures, d[d.indexOf(c.picture)].name;
  }
};
Blockly.Blocks.calc_basic = {init:function() {
  this.setColour(calcBlockColor);
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
  this.setColour(calcBlockColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("+", calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_plus = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c + d;
};
Blockly.Blocks.calc_minus = {init:function() {
  this.setColour(calcBlockColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("-", calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_minus = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c - d;
};
Blockly.Blocks.calc_times = {init:function() {
  this.setColour(calcBlockColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("x", calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_times = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c * d;
};
Blockly.Blocks.calc_divide = {init:function() {
  this.setColour(calcBlockColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField("/", calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.calc_divide = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c / d;
};
Blockly.Blocks.calc_mod = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_mod_1, calcFontColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_mod_2, calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_mod_3, calcFontColor);
  this.setInputsInline(!0);
}};
Entry.block.calc_mod = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return c % d;
};
Blockly.Blocks.calc_share = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_share_1, calcFontColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_share_2, calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_share_3, calcFontColor);
  this.setInputsInline(!0);
}};
Entry.block.calc_share = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  return Math.floor(c / d);
};
Blockly.Blocks.calc_operation = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_operation_of_1, calcFontColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_operation_of_2, calcFontColor);
  this.appendDummyInput("VALUE").appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_calc_operation_square, "square"], [Lang.Blocks.CALC_calc_operation_root, "root"], [Lang.Blocks.CALC_calc_operation_sin, "sin"], [Lang.Blocks.CALC_calc_operation_cos, "cos"], [Lang.Blocks.CALC_calc_operation_tan, "tan"], [Lang.Blocks.CALC_calc_operation_asin, "asin_radian"], [Lang.Blocks.CALC_calc_operation_acos, "acos_radian"], [Lang.Blocks.CALC_calc_operation_atan, "atan_radian"], [Lang.Blocks.CALC_calc_operation_log, 
  "log"], [Lang.Blocks.CALC_calc_operation_ln, "ln"], [Lang.Blocks.CALC_calc_operation_unnatural, "unnatural"], [Lang.Blocks.CALC_calc_operation_floor, "floor"], [Lang.Blocks.CALC_calc_operation_ceil, "ceil"], [Lang.Blocks.CALC_calc_operation_round, "round"], [Lang.Blocks.CALC_calc_operation_factorial, "factorial"], [Lang.Blocks.CALC_calc_operation_abs, "abs"]], null, !0, calcArrowColor), "VALUE");
  this.setOutput(!0, "Number");
  this.appendDummyInput().appendField(" ");
  this.setInputsInline(!0);
}};
Entry.block.calc_operation = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getField("VALUE", b);
  if (-1 < ["asin_radian", "acos_radian"].indexOf(d) && (1 < c || -1 > c)) {
    throw Error("x range exceeded");
  }
  d.indexOf("_") && (d = d.split("_")[0]);
  -1 < ["sin", "cos", "tan"].indexOf(d) && (c = Entry.toRadian(c));
  var e = 0;
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
    case "asin":
    ;
    case "acos":
    ;
    case "atan":
      e = Entry.toDegrees(Math[d](c));
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
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_calc_rand_1, calcFontColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_rand_2, calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_calc_rand_3, calcFontColor);
  this.setInputsInline(!0);
}};
Entry.block.calc_rand = function(a, b) {
  var c = b.getStringValue("LEFTHAND", b), d = b.getStringValue("RIGHTHAND", b), e = Math.min(c, d), f = Math.max(c, d), c = Entry.isFloat(c);
  return Entry.isFloat(d) || c ? (Math.random() * (f - e) + e).toFixed(2) : Math.floor(Math.random() * (f - e + 1) + e);
};
Blockly.Blocks.get_date = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_date_1, calcFontColor).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_get_date_year, "YEAR"], [Lang.Blocks.CALC_get_date_month, "MONTH"], [Lang.Blocks.CALC_get_date_day, "DAY"], [Lang.Blocks.CALC_get_date_hour, "HOUR"], [Lang.Blocks.CALC_get_date_minute, "MINUTE"], [Lang.Blocks.CALC_get_date_second, "SECOND"]], null, !0, calcArrowColor), "VALUE");
  this.appendDummyInput().appendField(" ").appendField(Lang.Blocks.CALC_get_date_2, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_date = function(a, b) {
  var c = b.getField("VALUE", b), d = new Date;
  return "YEAR" == c ? d.getFullYear() : "MONTH" == c ? d.getMonth() + 1 : "DAY" == c ? d.getDate() : "HOUR" == c ? d.getHours() : "MINUTE" == c ? d.getMinutes() : d.getSeconds();
};
Blockly.Blocks.get_sound_duration = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_duration_1, calcFontColor);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("sounds", null, !0, calcArrowColor), "VALUE");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_duration_2, calcFontColor);
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
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_reset, calcFontColor);
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
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_visible_1, calcFontColor);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_timer_visible_show, "SHOW"], [Lang.Blocks.CALC_timer_visible_hide, "HIDE"]], null, !0, calcArrowColor), "ACTION");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_timer_visible_2, calcFontColor).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/calc_01.png", "*"));
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
Blockly.Blocks.timer_variable = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_timer_value, calcFontColor).appendField(" ", calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.timer_variable = function(a, b) {
  return Entry.container.inputValue.getValue();
};
Blockly.Blocks.get_project_timer_value = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_timer_value, calcFontColor).appendField(" ", calcFontColor);
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
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_char_at_1, calcFontColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_char_at_2, calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_char_at_3, calcFontColor);
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
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_length_of_string_1, calcFontColor);
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_length_of_string_2, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.length_of_string = function(a, b) {
  return b.getStringValue("STRING", b).length;
};
Blockly.Blocks.substring = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_substring_1, calcFontColor);
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_substring_2, calcFontColor);
  this.appendValueInput("START").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_substring_3, calcFontColor);
  this.appendValueInput("END").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_substring_4, calcFontColor);
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
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_replace_string_1, calcFontColor);
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_replace_string_2, calcFontColor);
  this.appendValueInput("OLD_WORD").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_replace_string_3, calcFontColor);
  this.appendValueInput("NEW_WORD").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_replace_string_4, calcFontColor);
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.replace_string = function(a, b) {
  return b.getStringValue("STRING", b).replace(new RegExp(b.getStringValue("OLD_WORD", b), "gm"), b.getStringValue("NEW_WORD", b));
};
Blockly.Blocks.change_string_case = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_change_string_case_1, calcFontColor);
  this.appendValueInput("STRING").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_change_string_case_2, calcFontColor);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_change_string_case_sub_1, "toUpperCase"], [Lang.Blocks.CALC_change_string_case_sub_2, "toLowerCase"]], null, !0, calcArrowColor), "CASE");
  this.appendDummyInput().appendField(Lang.Blocks.CALC_change_string_case_3, calcFontColor);
  this.setOutput(!0, "String");
  this.setInputsInline(!0);
}};
Entry.block.change_string_case = function(a, b) {
  return b.getStringValue("STRING", b)[b.getField("CASE", b)]();
};
Blockly.Blocks.index_of_string = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_index_of_string_1, calcFontColor);
  this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]);
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_index_of_string_2, calcFontColor);
  this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]);
  this.setOutput(!0, "Number");
  this.appendDummyInput("VALUE").appendField(Lang.Blocks.CALC_index_of_string_3, calcFontColor);
  this.setInputsInline(!0);
}};
Entry.block.index_of_string = function(a, b) {
  var c = b.getStringValue("LEFTHAND", b), d = b.getStringValue("RIGHTHAND", b), c = c.indexOf(d);
  return -1 < c ? c + 1 : 0;
};
Blockly.Blocks.combine_something = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_1, calcFontColor);
  this.appendValueInput("VALUE1").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_2, calcFontColor);
  this.appendValueInput("VALUE2").setCheck(["String", "Number", null]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_combine_something_3, calcFontColor);
  this.setInputsInline(!0);
  this.setOutput(!0, "String");
}};
Entry.block.combine_something = function(a, b) {
  var c = b.getStringValue("VALUE1", b), d = b.getStringValue("VALUE2", b);
  isNaN(c) || (c = Entry.convertToRoundedDecimals(c, 3));
  isNaN(d) || (d = Entry.convertToRoundedDecimals(d, 3));
  return c + d;
};
Blockly.Blocks.get_sound_volume = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_get_sound_volume, calcFontColor).appendField(" ", calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.get_sound_volume = function(a, b) {
  return 100 * createjs.Sound.getVolume();
};
Blockly.Blocks.quotient_and_mod = {init:function() {
  this.setColour(calcBlockColor);
  "ko" == Lang.type ? (this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_1, calcFontColor), this.appendValueInput("LEFTHAND").setCheck(["Number", "String"]), this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_2, calcFontColor), this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]), this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_3, calcFontColor).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_quotient_and_mod_sub_1, 
  "QUOTIENT"], [Lang.Blocks.CALC_quotient_and_mod_sub_2, "MOD"]], null, !0, calcArrowColor), "OPERATOR")) : "en" == Lang.type && (this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_1, calcFontColor).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_quotient_and_mod_sub_1, "QUOTIENT"], [Lang.Blocks.CALC_quotient_and_mod_sub_2, "MOD"]], null, !0, calcArrowColor), "OPERATOR"), this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_2, calcFontColor), this.appendValueInput("LEFTHAND").setCheck(["Number", 
  "String"]), this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_3, calcFontColor), this.appendValueInput("RIGHTHAND").setCheck(["Number", "String"]));
  this.appendDummyInput().appendField(Lang.Blocks.CALC_quotient_and_mod_4, calcFontColor);
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}};
Entry.block.quotient_and_mod = function(a, b) {
  var c = b.getNumberValue("LEFTHAND", b), d = b.getNumberValue("RIGHTHAND", b);
  if (isNaN(c) || isNaN(d)) {
    throw Error();
  }
  return "QUOTIENT" == b.getField("OPERATOR", b) ? Math.floor(c / d) : c % d;
};
Blockly.Blocks.choose_project_timer_action = {init:function() {
  this.setColour(calcBlockColor);
  this.appendDummyInput().appendField(Lang.Blocks.CALC_choose_project_timer_action_1, calcFontColor).appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_choose_project_timer_action_sub_1, "START"], [Lang.Blocks.CALC_choose_project_timer_action_sub_2, "STOP"], [Lang.Blocks.CALC_choose_project_timer_action_sub_3, "RESET"]], null, !0, calcArrowColor), "ACTION").appendField(Lang.Blocks.CALC_choose_project_timer_action_2, calcFontColor).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/calc_01.png", 
  "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}, whenAdd:function() {
  Entry.engine.showProjectTimer();
}, whenRemove:function(a) {
  Entry.engine.hideProjectTimer(a);
}};
Entry.block.choose_project_timer_action = function(a, b) {
  var c = b.getField("ACTION"), d = Entry.engine, e = d.projectTimer;
  "START" == c ? e.isInit ? e.isInit && e.isPaused && (e.pauseStart && (e.pausedTime += (new Date).getTime() - e.pauseStart), delete e.pauseStart, e.isPaused = !1) : d.startProjectTimer() : "STOP" == c ? e.isInit && !e.isPaused && (e.isPaused = !0, e.pauseStart = (new Date).getTime()) : "RESET" == c && e.isInit && (e.setValue(0), e.start = (new Date).getTime(), e.pausedTime = 0, delete e.pauseStart);
  return b.callReturn();
};
Blockly.Blocks.wait_second = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_second_1);
  this.appendValueInput("SECOND").setCheck(["Number", "String", null]);
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_second_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_basic_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_inf).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_repeat).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_wait_until_true_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW__if_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_if_else_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_create_clone_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_delete_clone).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_clone.png", "*", "start")).appendField(Lang.Blocks.FLOW_when_clone_start);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_clone_start = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.stop_run = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_run).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.stop_run = function(a, b) {
  return Entry.engine.toggleStop();
};
Blockly.Blocks.repeat_while_true = {init:function() {
  this.setColour("#498deb");
  "ko" == Lang.type ? (this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_while_true_1), this.appendValueInput("BOOL").setCheck("Boolean"), this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.FLOW_repeat_while_true_until, "until"], [Lang.Blocks.FLOW_repeat_while_true_while, "while"]]), "OPTION").appendField(Lang.Blocks.FLOW_repeat_while_true_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"))) : (this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_while_true_1), 
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.FLOW_repeat_while_true_until, "until"], [Lang.Blocks.FLOW_repeat_while_true_while, "while"]]), "OPTION"), this.appendValueInput("BOOL").setCheck("Boolean"), this.appendDummyInput().appendField(Lang.Blocks.FLOW_repeat_while_true_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*")));
  this.appendStatementInput("DO");
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.repeat_while_true = function(a, b) {
  var c = b.getBooleanValue("BOOL", b);
  "until" == b.getField("OPTION", b) && (c = !c);
  return (b.isLooped = c) ? b.getStatement("DO", b) : b.callReturn();
};
Blockly.Blocks.stop_object = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_object_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.FLOW_stop_object_all, "all"], [Lang.Blocks.FLOW_stop_object_this_object, "thisOnly"], [Lang.Blocks.FLOW_stop_object_this_thread, "thisThread"], [Lang.Blocks.FLOW_stop_object_other_thread, "otherThread"]]), "TARGET");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_stop_object_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
    case "thisOnly":
      a.clearScript();
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
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_restart).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.restart_project = function(a, b) {
  Entry.engine.toggleStop();
  Entry.engine.toggleRun();
};
Blockly.Blocks.remove_all_clones = {init:function() {
  this.setColour("#498deb");
  this.appendDummyInput().appendField(Lang.Blocks.FLOW_delete_clone_all).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/flow_03.png", "*"));
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
  this.setColour("#FFD974");
  this.appendValueInput("PARAM").setCheck(["String"]);
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
}};
Blockly.Blocks.function_field_boolean = {init:function() {
  this.setColour("#AEB8FF");
  this.appendValueInput("PARAM").setCheck(["Boolean"]);
  this.appendValueInput("NEXT").setCheck(["Param"]);
  this.setOutput(!0, "Param");
  this.setInputsInline(!0);
}};
Blockly.Blocks.function_param_string = {init:function() {
  this.setEditable(!1);
  this.setColour("#FFD974");
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
  this.setColour("#AEB8FF");
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
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/function_03.png", "*"));
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
  }
  this.hashId = a.getAttribute("hashid");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/function_03.png", "*"));
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
  if (!b.thread) {
    var c = Entry.variableContainer.getFunction(b.hashId);
    b.thread = new Entry.Script(a);
    b.thread.register = b.values;
    for (var d = 0;d < c.content.childNodes.length;d++) {
      "function_create" == c.content.childNodes[d].getAttribute("type") && b.thread.init(c.content.childNodes[d]);
    }
  }
  if (c = Entry.Engine.computeThread(a, b.thread)) {
    return b.thread = c, b;
  }
  delete b.thread;
  return b.callReturn();
};
Entry.Hamster = {PORT_MAP:{leftWheel:0, rightWheel:0, buzzer:0, outputA:0, outputB:0, leftLed:0, rightLed:0, note:0, lineTracerMode:0, lineTracerModeId:0, lineTracerSpeed:5, ioModeA:0, ioModeB:0}, setZero:function() {
  var a = Entry.Hamster.PORT_MAP, b = Entry.hw.sendQueue, c;
  for (c in a) {
    b[c] = a[c];
  }
  Entry.hw.update();
  a = Entry.Hamster;
  a.lineTracerModeId = 0;
  a.lineTracerStateId = -1;
  a.tempo = 60;
  a.removeAllTimeouts();
}, lineTracerModeId:0, lineTracerStateId:-1, tempo:60, timeouts:[], removeTimeout:function(a) {
  clearTimeout(a);
  var b = this.timeouts;
  a = b.indexOf(a);
  0 <= a && b.splice(a, 1);
}, removeAllTimeouts:function() {
  var a = this.timeouts, b;
  for (b in a) {
    clearTimeout(a[b]);
  }
  this.timeouts = [];
}, setLineTracerMode:function(a, b) {
  this.lineTracerModeId = this.lineTracerModeId + 1 & 255;
  a.lineTracerMode = b;
  a.lineTracerModeId = this.lineTracerModeId;
}, name:"hamster"};
Blockly.Blocks.hamster_hand_found = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_hand_found);
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.hamster_hand_found = function(a, b) {
  var c = Entry.hw.portData;
  return 50 < c.leftProximity || 50 < c.rightProximity;
};
Blockly.Blocks.hamster_value = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_sensor_leftProximity, "leftProximity"], [Lang.Blocks.HAMSTER_sensor_rightProximity, "rightProximity"], [Lang.Blocks.HAMSTER_sensor_leftFloor, "leftFloor"], [Lang.Blocks.HAMSTER_sensor_rightFloor, "rightFloor"], [Lang.Blocks.HAMSTER_sensor_accelerationX, "accelerationX"], [Lang.Blocks.HAMSTER_sensor_accelerationY, "accelerationY"], [Lang.Blocks.HAMSTER_sensor_accelerationZ, "accelerationZ"], [Lang.Blocks.HAMSTER_sensor_light, 
  "light"], [Lang.Blocks.HAMSTER_sensor_temperature, "temperature"], [Lang.Blocks.HAMSTER_sensor_signalStrength, "signalStrength"], [Lang.Blocks.HAMSTER_sensor_inputA, "inputA"], [Lang.Blocks.HAMSTER_sensor_inputB, "inputB"]]), "DEVICE");
  this.setInputsInline(!0);
  this.setOutput(!0, "Number");
}};
Entry.block.hamster_value = function(a, b) {
  var c = Entry.hw.portData, d = b.getField("DEVICE");
  return c[d];
};
Blockly.Blocks.hamster_move_forward_once = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_move_forward_once).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_move_forward_once = function(a, b) {
  var c = Entry.hw.sendQueue, d = Entry.hw.portData;
  if (b.isStart) {
    if (b.isMoving) {
      switch(b.boardState) {
        case 1:
          2 > b.count ? (50 > d.leftFloor && 50 > d.rightFloor ? b.count++ : b.count = 0, d = d.leftFloor - d.rightFloor, c.leftWheel = 45 + .25 * d, c.rightWheel = 45 - .25 * d) : (b.count = 0, b.boardState = 2);
          break;
        case 2:
          d = d.leftFloor - d.rightFloor;
          c.leftWheel = 45 + .25 * d;
          c.rightWheel = 45 - .25 * d;
          b.boardState = 3;
          var e = setTimeout(function() {
            b.boardState = 4;
            Entry.Hamster.removeTimeout(e);
          }, 250);
          Entry.Hamster.timeouts.push(e);
          break;
        case 3:
          d = d.leftFloor - d.rightFloor;
          c.leftWheel = 45 + .25 * d;
          c.rightWheel = 45 - .25 * d;
          break;
        case 4:
          c.leftWheel = 0, c.rightWheel = 0, b.boardState = 0, b.isMoving = !1;
      }
      return b;
    }
    delete b.isStart;
    delete b.isMoving;
    delete b.count;
    delete b.boardState;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.isMoving = !0;
  b.count = 0;
  b.boardState = 1;
  c.leftWheel = 45;
  c.rightWheel = 45;
  Entry.Hamster.setLineTracerMode(c, 0);
  return b;
};
Blockly.Blocks.hamster_turn_once = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_turn_once_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_turn_once_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_turn_once = function(a, b) {
  var c = Entry.hw.sendQueue, d = Entry.hw.portData;
  if (b.isStart) {
    if (b.isMoving) {
      if (b.isLeft) {
        switch(b.boardState) {
          case 1:
            2 > b.count ? 50 < d.leftFloor && b.count++ : (b.count = 0, b.boardState = 2);
            break;
          case 2:
            20 > d.leftFloor && (b.boardState = 3);
            break;
          case 3:
            2 > b.count ? 20 > d.leftFloor && b.count++ : (b.count = 0, b.boardState = 4);
            break;
          case 4:
            50 < d.leftFloor && (b.boardState = 5);
            break;
          case 5:
            d = d.leftFloor - d.rightFloor, -15 < d ? (c.leftWheel = 0, c.rightWheel = 0, b.boardState = 0, b.isMoving = !1) : (c.leftWheel = .5 * d, c.rightWheel = .5 * -d);
        }
      } else {
        switch(b.boardState) {
          case 1:
            2 > b.count ? 50 < d.rightFloor && b.count++ : (b.count = 0, b.boardState = 2);
            break;
          case 2:
            20 > d.rightFloor && (b.boardState = 3);
            break;
          case 3:
            2 > b.count ? 20 > d.rightFloor && b.count++ : (b.count = 0, b.boardState = 4);
            break;
          case 4:
            50 < d.rightFloor && (b.boardState = 5);
            break;
          case 5:
            d = d.rightFloor - d.leftFloor, -15 < d ? (c.leftWheel = 0, c.rightWheel = 0, b.boardState = 0, b.isMoving = !1) : (c.leftWheel = .5 * -d, c.rightWheel = .5 * d);
        }
      }
      return b;
    }
    delete b.isStart;
    delete b.isMoving;
    delete b.count;
    delete b.boardState;
    delete b.isLeft;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.isMoving = !0;
  b.count = 0;
  b.boardState = 1;
  "LEFT" == b.getField("DIRECTION", b) ? (b.isLeft = !0, c.leftWheel = -45, c.rightWheel = 45) : (b.isLeft = !1, c.leftWheel = 45, c.rightWheel = -45);
  Entry.Hamster.setLineTracerMode(c, 0);
  return b;
};
Blockly.Blocks.hamster_move_forward_for_secs = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_move_forward_for_secs_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_move_forward_for_secs_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_move_forward_for_secs = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  c.leftWheel = 30;
  c.rightWheel = 30;
  Entry.Hamster.setLineTracerMode(c, 0);
  var c = 1E3 * b.getNumberValue("VALUE"), d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Hamster.removeTimeout(d);
  }, c);
  Entry.Hamster.timeouts.push(d);
  return b;
};
Blockly.Blocks.hamster_move_backward_for_secs = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_move_backward_for_secs_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_move_backward_for_secs_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_move_backward_for_secs = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  c.leftWheel = -30;
  c.rightWheel = -30;
  Entry.Hamster.setLineTracerMode(c, 0);
  var c = 1E3 * b.getNumberValue("VALUE"), d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Hamster.removeTimeout(d);
  }, c);
  Entry.Hamster.timeouts.push(d);
  return b;
};
Blockly.Blocks.hamster_turn_for_secs = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_turn_for_secs_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_turn_for_secs_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_turn_for_secs_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_turn_for_secs = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.leftWheel = 0;
    c.rightWheel = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  "LEFT" == b.getField("DIRECTION", b) ? (c.leftWheel = -30, c.rightWheel = 30) : (c.leftWheel = 30, c.rightWheel = -30);
  Entry.Hamster.setLineTracerMode(c, 0);
  var c = 1E3 * b.getNumberValue("VALUE"), d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Hamster.removeTimeout(d);
  }, c);
  Entry.Hamster.timeouts.push(d);
  return b;
};
Blockly.Blocks.hamster_change_both_wheels_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_1);
  this.appendValueInput("LEFT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_2);
  this.appendValueInput("RIGHT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_both_wheels_by_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_change_both_wheels_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getNumberValue("LEFT"), e = b.getNumberValue("RIGHT");
  c.leftWheel = void 0 != c.leftWheel ? c.leftWheel + d : d;
  c.rightWheel = void 0 != c.rightWheel ? c.rightWheel + e : e;
  Entry.Hamster.setLineTracerMode(c, 0);
  return b.callReturn();
};
Blockly.Blocks.hamster_set_both_wheels_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_1);
  this.appendValueInput("LEFT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_2);
  this.appendValueInput("RIGHT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_both_wheels_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_both_wheels_to = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.leftWheel = b.getNumberValue("LEFT");
  c.rightWheel = b.getNumberValue("RIGHT");
  Entry.Hamster.setLineTracerMode(c, 0);
  return b.callReturn();
};
Blockly.Blocks.hamster_change_wheel_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_wheel_by_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_change_wheel_by_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_wheel_by_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_change_wheel_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION"), e = b.getNumberValue("VALUE");
  "LEFT" == d ? c.leftWheel = void 0 != c.leftWheel ? c.leftWheel + e : e : ("RIGHT" != d && (c.leftWheel = void 0 != c.leftWheel ? c.leftWheel + e : e), c.rightWheel = void 0 != c.rightWheel ? c.rightWheel + e : e);
  Entry.Hamster.setLineTracerMode(c, 0);
  return b.callReturn();
};
Blockly.Blocks.hamster_set_wheel_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_wheel_to_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_set_wheel_to_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_wheel_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_wheel_to = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION"), e = b.getNumberValue("VALUE");
  "LEFT" == d ? c.leftWheel = e : ("RIGHT" != d && (c.leftWheel = e), c.rightWheel = e);
  Entry.Hamster.setLineTracerMode(c, 0);
  return b.callReturn();
};
Blockly.Blocks.hamster_follow_line_using = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_follow_line_using_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_color_black, "BLACK"], [Lang.General.white, "WHITE"]]), "COLOR").appendField(Lang.Blocks.HAMSTER_follow_line_using_2).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_follow_line_using_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 
  "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_follow_line_using = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("COLOR"), e = b.getField("DIRECTION"), f = 1;
  "RIGHT" == e ? f = 2 : "BOTH" == e && (f = 3);
  "WHITE" == d && (f += 7);
  c.leftWheel = 0;
  c.rightWheel = 0;
  Entry.Hamster.setLineTracerMode(c, f);
  return b.callReturn();
};
Blockly.Blocks.hamster_follow_line_until = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_follow_line_until_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_color_black, "BLACK"], [Lang.General.white, "WHITE"]]), "COLOR").appendField(Lang.Blocks.HAMSTER_follow_line_until_2).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.Blocks.HAMSTER_front, "FRONT"], [Lang.Blocks.HAMSTER_rear, "REAR"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_follow_line_until_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 
  "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_follow_line_until = function(a, b) {
  var c = Entry.hw.sendQueue, d = Entry.hw.portData, e = b.getField("COLOR"), f = b.getField("DIRECTION"), g = 4;
  "RIGHT" == f ? g = 5 : "FRONT" == f ? g = 6 : "REAR" == f && (g = 7);
  "WHITE" == e && (g += 7);
  if (b.isStart) {
    if (e = Entry.Hamster, d.lineTracerStateId != e.lineTracerStateId && (e.lineTracerStateId = d.lineTracerStateId, 64 == d.lineTracerState)) {
      return delete b.isStart, Entry.engine.isContinue = !1, e.setLineTracerMode(c, 0), b.callReturn();
    }
  } else {
    b.isStart = !0, c.leftWheel = 0, c.rightWheel = 0, Entry.Hamster.setLineTracerMode(c, g);
  }
  return b;
};
Blockly.Blocks.hamster_set_following_speed_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_following_speed_to_1).appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"]]), "SPEED").appendField(Lang.Blocks.HAMSTER_set_following_speed_to_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_following_speed_to = function(a, b) {
  Entry.hw.sendQueue.lineTracerSpeed = Number(b.getField("SPEED", b));
  return b.callReturn();
};
Blockly.Blocks.hamster_stop = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_stop).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_stop = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.leftWheel = 0;
  c.rightWheel = 0;
  Entry.Hamster.setLineTracerMode(c, 0);
  return b.callReturn();
};
Blockly.Blocks.hamster_set_led_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_led_to_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_set_led_to_2).appendField(new Blockly.FieldDropdown([[Lang.General.red, "4"], [Lang.General.yellow, "6"], [Lang.General.green, "2"], [Lang.Blocks.HAMSTER_color_cyan, "3"], [Lang.General.blue, "1"], [Lang.Blocks.HAMSTER_color_magenta, "5"], [Lang.General.white, 
  "7"]]), "COLOR").appendField(Lang.Blocks.HAMSTER_set_led_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_led_to = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION", b), e = Number(b.getField("COLOR", b));
  "LEFT" == d ? c.leftLed = e : ("RIGHT" != d && (c.leftLed = e), c.rightLed = e);
  return b.callReturn();
};
Blockly.Blocks.hamster_clear_led = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_clear_led_1).appendField(new Blockly.FieldDropdown([[Lang.General.left, "LEFT"], [Lang.General.right, "RIGHT"], [Lang.General.both, "BOTH"]]), "DIRECTION").appendField(Lang.Blocks.HAMSTER_clear_led_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_clear_led = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("DIRECTION", b);
  "LEFT" == d ? c.leftLed = 0 : ("RIGHT" != d && (c.leftLed = 0), c.rightLed = 0);
  return b.callReturn();
};
Blockly.Blocks.hamster_beep = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_beep).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_beep = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.buzzer = 0;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  c.buzzer = 440;
  c.note = 0;
  var d = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Hamster.removeTimeout(d);
  }, 200);
  Entry.Hamster.timeouts.push(d);
  return b;
};
Blockly.Blocks.hamster_change_buzzer_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_buzzer_by_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_buzzer_by_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_change_buzzer_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getNumberValue("VALUE");
  c.buzzer = void 0 != c.buzzer ? c.buzzer + d : d;
  c.note = 0;
  return b.callReturn();
};
Blockly.Blocks.hamster_set_buzzer_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_buzzer_to_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_buzzer_to_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_buzzer_to = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.buzzer = b.getNumberValue("VALUE");
  c.note = 0;
  return b.callReturn();
};
Blockly.Blocks.hamster_clear_buzzer = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_clear_buzzer).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_clear_buzzer = function(a, b) {
  var c = Entry.hw.sendQueue;
  c.buzzer = 0;
  c.note = 0;
  return b.callReturn();
};
Blockly.Blocks.hamster_play_note_for = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_play_note_for_1).appendField(new Blockly.FieldDropdown([[Lang.General.note_c + "", "4"], [Lang.General.note_c + "#", "5"], [Lang.General.note_d + "", "6"], [Lang.General.note_e + "b", "7"], [Lang.General.note_e + "", "8"], [Lang.General.note_f + "", "9"], [Lang.General.note_f + "#", "10"], [Lang.General.note_g + "", "11"], [Lang.General.note_g + "#", "12"], [Lang.General.note_a + "", "13"], [Lang.General.note_b + "b", "14"], [Lang.General.note_b + 
  "", "15"]]), "NOTE").appendField(Lang.Blocks.HAMSTER_play_note_for_2).appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "OCTAVE").appendField(Lang.Blocks.HAMSTER_play_note_for_3);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_play_note_for_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_play_note_for = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    c.note = 0;
    return b.callReturn();
  }
  var d = b.getNumberField("NOTE", b), e = b.getNumberField("OCTAVE", b), f = b.getNumberValue("VALUE", b), g = Entry.Hamster.tempo, f = 6E4 * f / g;
  b.isStart = !0;
  b.timeFlag = 1;
  c.buzzer = 0;
  c.note = d + 12 * (e - 1);
  if (100 < f) {
    var h = setTimeout(function() {
      c.note = 0;
      Entry.Hamster.removeTimeout(h);
    }, f - 100);
    Entry.Hamster.timeouts.push(h);
  }
  var k = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Hamster.removeTimeout(k);
  }, f);
  Entry.Hamster.timeouts.push(k);
  return b;
};
Blockly.Blocks.hamster_rest_for = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_rest_for_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_rest_for_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_rest_for = function(a, b) {
  var c = Entry.hw.sendQueue;
  if (b.isStart) {
    if (1 == b.timeFlag) {
      return b;
    }
    delete b.isStart;
    delete b.timeFlag;
    Entry.engine.isContinue = !1;
    return b.callReturn();
  }
  b.isStart = !0;
  b.timeFlag = 1;
  var d = b.getNumberValue("VALUE"), d = 6E4 * d / Entry.Hamster.tempo;
  c.buzzer = 0;
  c.note = 0;
  var e = setTimeout(function() {
    b.timeFlag = 0;
    Entry.Hamster.removeTimeout(e);
  }, d);
  Entry.Hamster.timeouts.push(e);
  return b;
};
Blockly.Blocks.hamster_change_tempo_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_tempo_by_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_tempo_by_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_change_tempo_by = function(a, b) {
  Entry.Hamster.tempo += b.getNumberValue("VALUE");
  1 > Entry.Hamster.tempo && (Entry.Hamster.tempo = 1);
  return b.callReturn();
};
Blockly.Blocks.hamster_set_tempo_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_tempo_to_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_tempo_to_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_tempo_to = function(a, b) {
  Entry.Hamster.tempo = b.getNumberValue("VALUE");
  1 > Entry.Hamster.tempo && (Entry.Hamster.tempo = 1);
  return b.callReturn();
};
Blockly.Blocks.hamster_set_port_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_port_to_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_port_a, "A"], [Lang.Blocks.HAMSTER_port_b, "B"], [Lang.Blocks.HAMSTER_port_ab, "AB"]]), "PORT").appendField(Lang.Blocks.HAMSTER_set_port_to_2).appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_analog_input, "0"], [Lang.Blocks.HAMSTER_digital_input, "1"], [Lang.Blocks.HAMSTER_servo_output, "8"], [Lang.Blocks.HAMSTER_pwm_output, "9"], [Lang.Blocks.HAMSTER_digital_output, 
  "10"]]), "MODE").appendField(Lang.Blocks.HAMSTER_set_port_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_port_to = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("PORT", b), e = Number(b.getField("MODE", b));
  "A" == d ? c.ioModeA = e : ("B" != d && (c.ioModeA = e), c.ioModeB = e);
  return b.callReturn();
};
Blockly.Blocks.hamster_change_output_by = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_output_by_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_port_a, "A"], [Lang.Blocks.HAMSTER_port_b, "B"], [Lang.Blocks.HAMSTER_port_ab, "AB"]]), "PORT").appendField(Lang.Blocks.HAMSTER_change_output_by_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_change_output_by_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_change_output_by = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("PORT"), e = b.getNumberValue("VALUE");
  "A" == d ? c.outputA = void 0 != c.outputA ? c.outputA + e : e : ("B" != d && (c.outputA = void 0 != c.outputA ? c.outputA + e : e), c.outputB = void 0 != c.outputB ? c.outputB + e : e);
  return b.callReturn();
};
Blockly.Blocks.hamster_set_output_to = {init:function() {
  this.setColour("#00979D");
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_output_to_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.HAMSTER_port_a, "A"], [Lang.Blocks.HAMSTER_port_b, "B"], [Lang.Blocks.HAMSTER_port_ab, "AB"]]), "PORT").appendField(Lang.Blocks.HAMSTER_set_output_to_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.HAMSTER_set_output_to_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/hardware_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.hamster_set_output_to = function(a, b) {
  var c = Entry.hw.sendQueue, d = b.getField("PORT"), e = b.getNumberValue("VALUE");
  "A" == d ? c.outputA = e : ("B" != d && (c.outputA = e), c.outputB = e);
  return b.callReturn();
};
Blockly.Blocks.is_clicked = {init:function() {
  this.setColour("#AEB8FF");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_is_clicked, "#3D3D3D");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.is_clicked = function(a, b) {
  return Entry.stage.isClick;
};
Blockly.Blocks.is_press_some_key = {init:function() {
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
    if ("mouse" == c) {
      return f = Entry.stage.canvas, f = d.globalToLocal(f.mouseX, f.mouseY), d.hitTest(f.x, f.y);
    }
    c = Entry.container.getEntity(c);
    if ("textBox" == c.type || "textBox" == a.type) {
      f = c.object.getTransformedBounds();
      d = d.getTransformedBounds();
      if (Entry.checkCollisionRect(d, f)) {
        return !0;
      }
      for (var c = c.parent.clonedEntities, e = 0, g = c.length;e < g;e++) {
        var h = c[e];
        if (!h.isStamp && h.getVisible() && Entry.checkCollisionRect(d, h.object.getTransformedBounds())) {
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
        if (h = c[e], !h.isStamp && h.getVisible() && f(d, h.object, .2, !0)) {
          return !0;
        }
      }
    }
  }
  return !1;
};
Blockly.Blocks.boolean_comparison = {init:function() {
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
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
  this.setColour("#AEB8FF");
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.JUDGEMENT_true, "true"], [Lang.Blocks.JUDGEMENT_false, "false"]]), "VALUE");
  this.appendDummyInput();
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.true_or_false = function(a, b) {
  return "true" == b.children[0].textContent;
};
Blockly.Blocks.True = {init:function() {
  this.setColour("#AEB8FF");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_true, "#3D3D3D").appendField(" ");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.True = function(a, b) {
  return !0;
};
Blockly.Blocks.False = {init:function() {
  this.setColour("#AEB8FF");
  this.appendDummyInput().appendField(Lang.Blocks.JUDGEMENT_false, "#3D3D3D").appendField(" ");
  this.setOutput(!0, "Boolean");
  this.setInputsInline(!0);
}};
Entry.block.False = function(a, b) {
  return !1;
};
Blockly.Blocks.boolean_basic_operator = {init:function() {
  this.setColour("#AEB8FF");
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_show).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_hide).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_time_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_dialog_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_remove_dialog).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_near_shape_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.LOOKS_change_shape_next, "next"], [Lang.Blocks.LOOKS_change_shape_prev, "prev"]]), "DRIECTION").appendField(Lang.Blocks.LOOKS_change_to_near_shape_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_to_next_shape = function(a, b) {
  var c;
  c = b.fields && "prev" === b.getStringField("DRIECTION") ? a.parent.getPrevPicture(a.picture.id) : a.parent.getNextPicture(a.picture.id);
  a.setImage(c);
  return b.callReturn();
};
Blockly.Blocks.set_effect_volume = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.opacity, "opacity"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_erase_all_effects).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
Blockly.Blocks.change_scale_size = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_scale_percent_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_scale_size = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setSize(a.getSize() + c);
  return b.callReturn();
};
Blockly.Blocks.set_scale_size = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_scale_percent_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.set_scale_size = function(a, b) {
  var c = b.getNumberValue("VALUE", b);
  a.setSize(c);
  return b.callReturn();
};
Blockly.Blocks.flip_y = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_flip_y).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_flip_x).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_object_order_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_to_nth_shape_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
Blockly.Blocks.add_effect_amount = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.transparency, "transparency"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.add_effect_amount = function(a, b) {
  var c = b.getField("EFFECT", b), d = b.getNumberValue("VALUE", b);
  "color" == c ? a.effect.hsv = d + a.effect.hsv : "brightness" == c ? a.effect.brightness = d + a.effect.brightness : "transparency" == c && (a.effect.alpha -= d / 100);
  a.applyFilter();
  return b.callReturn();
};
Blockly.Blocks.change_effect_amount = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.transparency, "transparency"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_effect_amount = function(a, b) {
  var c = b.getField("EFFECT", b), d = b.getNumberValue("VALUE", b);
  "color" == c ? a.effect.hsv = d : "brightness" == c ? a.effect.brightness = d : "transparency" == c && (a.effect.alpha = 1 - d / 100);
  a.applyFilter();
  return b.callReturn();
};
Blockly.Blocks.set_effect_amount = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.color, "color"], [Lang.Blocks.brightness, "brightness"], [Lang.Blocks.transparency, "transparency"]]), "EFFECT");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_2);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_volume_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_set_effect_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
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
Blockly.Blocks.change_object_index = {init:function() {
  this.setColour("#EC4466");
  this.appendDummyInput().appendField(Lang.Blocks.LOOKS_change_object_index_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.LOOKS_change_object_index_sub_1, "FRONT"], [Lang.Blocks.LOOKS_change_object_index_sub_2, "FORWARD"], [Lang.Blocks.LOOKS_change_object_index_sub_3, "BACKWARD"], [Lang.Blocks.LOOKS_change_object_index_sub_4, "BACK"]]), "LOCATION").appendField(Lang.Blocks.LOOKS_change_object_index_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/looks_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.change_object_index = function(a, b) {
  var c, d = b.getField("LOCATION", b), e = Entry.container.getCurrentObjects(), f = e.indexOf(a.parent), e = e.length - 1;
  if (0 > f) {
    throw Error("object is not available for current scene");
  }
  switch(d) {
    case "FRONT":
      c = 0;
      break;
    case "FORWARD":
      c = Math.max(0, f - 1);
      break;
    case "BACKWARD":
      c = Math.min(e, f + 1);
      break;
    case "BACK":
      c = e;
  }
  Entry.container.moveElementByBlock(f, c);
  return b.callReturn();
};
Blockly.Blocks.move_direction = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_x_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_y_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_time_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([["45", "45"], ["90", "90"], ["135", "135"], ["180", "180"]]), "VALUE").appendField(Lang.Blocks.MOVING_rotate_by_angle_dropdown_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_direction_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_xy_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_x_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_y_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_xy_time_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_time_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_by_angle_time_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_when_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
  this.setPreviousStatement(!0);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Blockly.Blocks.bounce_wall = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_bounce_wall).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.bounce_wall = function(a, b) {
  var c = a.parent.getRotateMethod(), d = "free" == c ? (a.getRotation() + a.getDirection()).mod(360) : a.getDirection(), e = Entry.Utils.COLLISION.NONE;
  if (90 > d && 0 <= d || 360 > d && 270 <= d) {
    var e = a.collision == Entry.Utils.COLLISION.UP, f = ndgmr.checkPixelCollision(Entry.stage.wall.up, a.object, 0, !1);
    !f && e && (a.collision = Entry.Utils.COLLISION.NONE);
    f && e && (f = !1);
    f ? ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection() + 180) : a.setDirection(-a.getDirection() + 180), a.collision = Entry.Utils.COLLISION.UP) : (e = a.collision == Entry.Utils.COLLISION.DOWN, f = ndgmr.checkPixelCollision(Entry.stage.wall.down, a.object, 0, !1), !f && e && (a.collision = Entry.Utils.COLLISION.NONE), f && e && (f = !1), f && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection() + 180) : a.setDirection(-a.getDirection() + 180), a.collision = 
    Entry.Utils.COLLISION.DOWN));
  } else {
    270 > d && 90 <= d && (e = a.collision == Entry.Utils.COLLISION.DOWN, f = ndgmr.checkPixelCollision(Entry.stage.wall.down, a.object, 0, !1), !f && e && (a.collision = Entry.Utils.COLLISION.NONE), f && e && (f = !1), f ? ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection() + 180) : a.setDirection(-a.getDirection() + 180), a.collision = Entry.Utils.COLLISION.DOWN) : (e = a.collision == Entry.Utils.COLLISION.UP, f = ndgmr.checkPixelCollision(Entry.stage.wall.up, a.object, 0, !1), 
    !f && e && (a.collision = Entry.Utils.COLLISION.NONE), f && e && (f = !1), f && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection() + 180) : a.setDirection(-a.getDirection() + 180), a.collision = Entry.Utils.COLLISION.UP)));
  }
  360 > d && 180 <= d ? (e = a.collision == Entry.Utils.COLLISION.LEFT, d = ndgmr.checkPixelCollision(Entry.stage.wall.left, a.object, 0, !1), !d && e && (a.collision = Entry.Utils.COLLISION.NONE), d && e && (d = !1), d ? ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection()) : a.setDirection(-a.getDirection() + 360), a.collision = Entry.Utils.COLLISION.LEFT) : (e = a.collision == Entry.Utils.COLLISION.RIGHT, d = ndgmr.checkPixelCollision(Entry.stage.wall.right, a.object, 0, !1), !d && 
  e && (a.collision = Entry.Utils.COLLISION.NONE), d && e && (d = !1), d && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection()) : a.setDirection(-a.getDirection() + 360), a.collision = Entry.Utils.COLLISION.RIGHT))) : 180 > d && 0 <= d && (e = a.collision == Entry.Utils.COLLISION.RIGHT, d = ndgmr.checkPixelCollision(Entry.stage.wall.right, a.object, 0, !1), !d && e && (a.collision = Entry.Utils.COLLISION.NONE), d && e && (d = !1), d ? ("free" == c ? a.setRotation(-a.getRotation() - 
  2 * a.getDirection()) : a.setDirection(-a.getDirection() + 360), a.collision = Entry.Utils.COLLISION.RIGHT) : (e = a.collision == Entry.Utils.COLLISION.LEFT, d = ndgmr.checkPixelCollision(Entry.stage.wall.left, a.object, 0, !1), !d && e && (a.collision = Entry.Utils.COLLISION.NONE), d && e && (d = !1), d && ("free" == c ? a.setRotation(-a.getRotation() - 2 * a.getDirection()) : a.setDirection(-a.getDirection() + 360), a.collision = Entry.Utils.COLLISION.LEFT)));
  return b.callReturn();
};
Blockly.Blocks.flip_arrow_horizontal = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_flip_arrow_horizontal).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_flip_arrow_vertical).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_object_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_direction_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_locate_object_time_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_set_direction_by_angle_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_see_angle_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_rotate_direction_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_move_direction_angle_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_explain_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_2);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_1);
  this.appendValueInput("ANGLE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_add_direction_by_angle_time_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
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
Blockly.Blocks.direction_relative_duration = {init:function() {
  this.setColour("#A751E3");
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_direction_relative_duration_1);
  this.appendValueInput("DURATION").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_direction_relative_duration_2);
  this.appendValueInput("AMOUNT").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.MOVING_direction_relative_duration_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/moving_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}};
Entry.block.direction_relative_duration = function(a, b) {
  if (!b.isStart) {
    var c;
    c = b.getNumberValue("DURATION", b);
    var d = b.getNumberValue("AMOUNT", b);
    b.isStart = !0;
    b.frameCount = Math.floor(c * Entry.FPS);
    b.dDirection = d / b.frameCount;
  }
  if (0 != b.frameCount) {
    return a.setDirection(a.getDirection() + b.dDirection), b.frameCount--, b;
  }
  delete b.isStart;
  delete b.frameCount;
  delete b.dDirection;
  return b.callReturn();
};
Blockly.Blocks.when_scene_start = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_scene_1_2.png", "*", "start")).appendField(Lang.Blocks.SCENE_when_scene_start);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_scene_start = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.start_scene = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.SCENE_start_scene_1).appendField(new Blockly.FieldDropdownDynamic("scenes"), "VALUE").appendField(Lang.Blocks.SCENE_start_scene_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_03.png", "*"));
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
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.SCENE_start_neighbor_scene_1).appendField(new Blockly.FieldDropdown([[Lang.Blocks.SCENE_start_scene_next, "next"], [Lang.Blocks.SCENE_start_scene_pre, "pre"]]), "OPERATOR").appendField(Lang.Blocks.SCENE_start_neighbor_scene_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_change_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_volume_set_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_silent_all).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_wait_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_something_second_wait_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
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
Blockly.Blocks.sound_from_to = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_2);
  this.appendValueInput("START").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_3);
  this.appendValueInput("END").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_from_to = function(a, b) {
  var c = b.getStringValue("VALUE", b);
  if (c = a.parent.getSound(c)) {
    var d = 1E3 * b.getNumberValue("START", b), e = 1E3 * b.getNumberValue("END", b);
    createjs.Sound.play(c.id, {startTime:Math.min(d, e), duration:Math.max(d, e) - Math.min(d, e)});
  }
  return b.callReturn();
};
Blockly.Blocks.sound_from_to_and_wait = {init:function() {
  this.setColour("#A4D01D");
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_and_wait_1);
  this.appendValueInput("VALUE").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_and_wait_2);
  this.appendValueInput("START").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_and_wait_3);
  this.appendValueInput("END").setCheck(["String", "Number"]);
  this.appendDummyInput().appendField(Lang.Blocks.SOUND_sound_from_to_and_wait_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/sound_03.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
  this.setPreviousStatement(!0);
}};
Entry.block.sound_from_to_and_wait = function(a, b) {
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
    var d = 1E3 * b.getNumberValue("START", b), e = 1E3 * b.getNumberValue("END", b), f = Math.min(d, e), d = Math.max(d, e) - f;
    createjs.Sound.play(c.id, {startTime:f, duration:d});
    setTimeout(function() {
      b.playState = 0;
    }, d);
  }
  return b;
};
Blockly.Blocks.when_run_button_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_play.png", "*", "start")).appendField(Lang.Blocks.START_when_run_button_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_run_button_click = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.press_some_key = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_press_some_key_1).appendField(new Blockly.FieldDropdown([["q", "81"], ["w", "87"], ["e", "69"], ["r", "82"], ["a", "65"], ["s", "83"], ["d", "68"], [Lang.Blocks.START_press_some_key_up, "38"], [Lang.Blocks.START_press_some_key_down, "40"], [Lang.Blocks.START_press_some_key_left, "37"], [Lang.Blocks.START_press_some_key_right, "39"], [Lang.Blocks.START_press_some_key_enter, 
  "13"], [Lang.Blocks.START_press_some_key_space, "32"]]), "VALUE").appendField(Lang.Blocks.START_press_some_key_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_03.png", "*"));
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.press_some_key = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_some_key_pressed = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_press_some_key_1).appendField(new Blockly.FieldKeydownInput("81"), "VALUE").appendField(Lang.Blocks.START_press_some_key_2);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_some_key_pressed = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.mouse_clicked = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_mouse_clicked);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.mouse_clicked = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.mouse_click_cancled = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_mouse_click_cancled);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.mouse_click_cancled = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_object_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_when_object_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_object_click = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_object_click_canceled = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_mouse.png", "*", "start")).appendField(Lang.Blocks.START_when_object_click_canceled);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_object_click_canceled = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_some_key_click = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_keyboard.png", "*", "start")).appendField(Lang.Blocks.START_when_some_key_click);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_some_key_click = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.when_message_cast = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_icon_signal.png", "*", "start")).appendField(Lang.Blocks.START_when_message_cast_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_when_message_cast_2);
  this.setInputsInline(!0);
  this.setNextStatement(!0);
}};
Entry.block.when_message_cast = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.message_cast = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_message_cast_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_message_cast_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.START_add_message).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_03.png", "*"));
  this.setInputsInline(!0);
}};
Entry.block.add_massage = function(a, b) {
  return b.callReturn();
};
Blockly.Blocks.message_cast_wait = {init:function() {
  this.setColour("#3BBD70");
  this.appendDummyInput().appendField(Lang.Blocks.START_message_send_wait_1).appendField(new Blockly.FieldDropdownDynamic("messages"), "VALUE").appendField(Lang.Blocks.START_message_send_wait_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/start_03.png", "*"));
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
    for (var c = b[0], d = b[1], l = a.parent.script.childNodes, n = 0;n < l.length;n++) {
      var m = l[n], q = Entry.Xml.getField("VALUE", m);
      Entry.Xml.isTypeOf(c, m) && q == d && (q = new Entry.Script(a), q.init(m), e.push(q));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_variable_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_set_variable_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_show_variable_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("variables"), "VARIABLE").appendField(Lang.Blocks.VARIABLE_hide_variable_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_y).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_ask_and_wait_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}, whenAdd:function() {
  Entry.container.showProjectAnswer();
}, whenRemove:function(a) {
  Entry.container.hideProjectAnswer(a);
}};
Entry.block.ask_and_wait = function(a, b) {
  var c = Entry.container.inputValue, d = Entry.stage.inputField, e = b.getValue("VALUE", b);
  if (!e) {
    throw Error("message can not be empty");
  }
  if (c.sprite == a && d && !d._isHidden) {
    return b;
  }
  if (c.sprite != a && b.isInit) {
    return a.dialog && a.dialog.remove(), delete b.isInit, b.callReturn();
  }
  if (c.complete && c.sprite == a && d._isHidden && b.isInit) {
    return a.dialog && a.dialog.remove(), delete c.complete, delete b.isInit, b.callReturn();
  }
  e = Entry.convertToRoundedDecimals(e, 3);
  new Entry.Dialog(a, e, "speak");
  Entry.stage.showInputField();
  c.script = b;
  c.sprite = a;
  b.isInit = !0;
  return b;
};
Blockly.Blocks.get_canvas_input_value = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_canvas_input_value);
  this.appendDummyInput().appendField(" ");
  this.setOutput(!0, "Number");
  this.setInputsInline(!0);
}, whenAdd:function() {
  Entry.container.showProjectAnswer();
}, whenRemove:function(a) {
  Entry.container.hideProjectAnswer(a);
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_add_value_to_list_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_remove_value_from_list_3).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_insert_value_to_list_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_change_value_list_index_4).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST").appendField(Lang.Blocks.VARIABLE_show_list_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST").appendField(Lang.Blocks.VARIABLE_hide_list_2).appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
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
Blockly.Blocks.set_visible_answer = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_get_canvas_input_value);
  this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Lang.Blocks.CALC_timer_visible_show, "SHOW"], [Lang.Blocks.CALC_timer_visible_hide, "HIDE"]]), "BOOL");
  this.appendDummyInput().appendField("").appendField(new Blockly.FieldIcon(Entry.mediaFilePath + "block_icon/variable_03.png", "*"));
  this.setInputsInline(!0);
  this.setPreviousStatement(!0);
  this.setNextStatement(!0);
}, whenAdd:function() {
  Entry.container.showProjectAnswer();
}, whenRemove:function(a) {
  Entry.container.hideProjectAnswer(a);
}};
Entry.block.set_visible_answer = function(a, b) {
  "HIDE" == b.getField("BOOL", b) ? Entry.container.inputValue.setVisible(!1) : Entry.container.inputValue.setVisible(!0);
  return b.callReturn();
};
Blockly.Blocks.is_included_in_list = {init:function() {
  this.setColour("#E457DC");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_is_included_in_list_1);
  this.appendDummyInput().appendField(new Blockly.FieldDropdownDynamic("lists"), "LIST");
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_is_included_in_list_2);
  this.appendValueInput("DATA").setCheck(["Number", "String"]);
  this.appendDummyInput().appendField(Lang.Blocks.VARIABLE_is_included_in_list_3);
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
Entry.Collection = function(a) {
  this.length = 0;
  this._hashMap = {};
  this._observers = [];
  this.set(a);
};
(function(a, b) {
  a.set = function(a) {
    for (;this.length;) {
      b.pop.call(this);
    }
    var d = this._hashMap, e;
    for (e in d) {
      delete d[e];
    }
    if (void 0 !== a) {
      e = 0;
      for (var f = a.length;e < f;e++) {
        var g = a[e];
        d[g.id] = g;
        b.push.call(this, g);
      }
    }
  };
  a.push = function(a) {
    this._hashMap[a.id] = a;
    b.push.call(this, a);
  };
  a.unshift = function() {
    for (var a = Array.prototype.slice.call(arguments, 0), d = this._hashMap, e = a.length - 1;0 <= e;e--) {
      var f = a[e];
      b.unshift.call(this, f);
      d[f.id] = f;
    }
  };
  a.insert = function(a, d) {
    b.splice.call(this, d, 0, a);
    this._hashMap[a.id] = a;
  };
  a.has = function(a) {
    return !!this._hashMap[a];
  };
  a.get = function(a) {
    return this._hashMap[a];
  };
  a.at = function(a) {
    return this[a];
  };
  a.getAll = function() {
    for (var a = this.length, b = [], e = 0;e < a;e++) {
      b.push(this[e]);
    }
    return b;
  };
  a.indexOf = function(a) {
    return b.indexOf.call(this, a);
  };
  a.find = function(a) {
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
  a.pop = function() {
    var a = b.pop.call(this);
    delete this._hashMap[a.id];
    return a;
  };
  a.shift = function() {
    var a = b.shift.call(this);
    delete this._hashMap[a.id];
    return a;
  };
  a.slice = function(a, d) {
    var e = b.slice.call(this, a, d), f = this._hashMap, g;
    for (g in e) {
      delete f[e[g].id];
    }
    return e;
  };
  a.remove = function(a) {
    var b = this.indexOf(a);
    -1 < b && (delete this._hashMap[a.id], this.splice(b, 1));
  };
  a.splice = function(a, d) {
    var e = b.slice.call(arguments, 2), f = this._hashMap;
    d = void 0 === d ? this.length - a : d;
    for (var g = b.splice.call(this, a, d), h = 0, k = g.length;h < k;h++) {
      delete f[g[h].id];
    }
    h = 0;
    for (k = e.length;h < k;h++) {
      f = e[h], b.splice.call(this, a++, 0, f), this._hashMap[f.id] = f;
    }
    return g;
  };
  a.clear = function() {
    for (;this.length;) {
      b.pop.call(this);
    }
    this._hashMap = {};
  };
  a.map = function(a, b) {
    for (var e = 0, f = this.length;e < f;e++) {
      a(this[e], b);
    }
  };
  a.moveFromTo = function(a, d) {
    var e = this.length - 1;
    0 > a || 0 > d || a > e || d > e || b.splice.call(this, d, 0, b.splice.call(this, a, 1)[0]);
  };
  a.sort = function() {
  };
  a.fromJSON = function() {
  };
  a.toJSON = function() {
    for (var a = [], b = 0, e = this.length;b < e;b++) {
      a.push(this[b].toJSON());
    }
    return a;
  };
  a.observe = function() {
  };
  a.unobserve = function() {
  };
  a.notify = function() {
  };
  a.destroy = function() {
  };
})(Entry.Collection.prototype, Array.prototype);
Entry.Event = function(a) {
  this._sender = a;
  this._listeners = [];
};
(function(a) {
  a.attach = function(a, c) {
    var d = {obj:a, fn:c};
    this._listeners.push(d);
    return d;
  };
  a.detach = function(a) {
    var c = this._listeners;
    a = c.indexOf(a);
    if (-1 < a) {
      return c.splice(a, 1);
    }
  };
  a.clear = function() {
    for (var a = this._listeners;a.length;) {
      a.pop();
    }
  };
  a.notify = function(a) {
    var c = this._sender;
    this._listeners.slice().forEach(function(d) {
      d.fn.call(d.obj, c, a);
    });
  };
})(Entry.Event.prototype);
Entry.Observer = function(a, b, c, d) {
  this.parent = a;
  this.object = b;
  this.funcName = c;
  this.attrs = d;
  a.push(this);
};
(function(a) {
  a.destroy = function() {
    var a = this.parent, c = a.indexOf(this);
    -1 < c && a.splice(c, 1);
    return this;
  };
})(Entry.Observer.prototype);
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
    }), c = Entry.createElement("div"), c.addClass("entryContainerListPhoneWrapper"), this.view_.appendChild(c), d = Entry.createElement("ul"), d.addClass("entryContainerListPhone"), c.appendChild(d), this.listView_ = d);
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
    Entry.Utils.disableContextmenu(c);
    $(c).on("contextmenu", function(a) {
      Entry.ContextMenu.show([{text:Lang.Blocks.Paste_blocks, callback:function() {
        Entry.container.copiedObject ? Entry.container.addCloneObject(Entry.container.copiedObject) : Entry.toast.alert(Lang.Workspace.add_object_alert, Lang.Workspace.object_not_found_for_paste);
      }}], "workspace-contextmenu");
    });
    this.view_.appendChild(c);
    var d = Entry.createElement("ul");
    d.addClass("entryContainerListWorkspace");
    c.appendChild(d);
    this.listView_ = d;
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
Entry.Container.prototype.getPictureElement = function(a) {
  for (var b in this.objects_) {
    var c = this.objects_[b], d;
    for (d in c.pictures) {
      if (a === c.pictures[d].id) {
        return c.pictures[d].view;
      }
    }
  }
  throw Error("No picture found");
};
Entry.Container.prototype.setPicture = function(a) {
  for (var b in this.objects_) {
    var c = this.objects_[b], d;
    for (d in c.pictures) {
      if (a.id === c.pictures[d].id) {
        b = {};
        b.dimension = a.dimension;
        b.id = a.id;
        b.filename = a.filename;
        b.fileurl = a.fileurl;
        b.name = a.name;
        b.view = c.pictures[d].view;
        c.pictures[d] = b;
        return;
      }
    }
  }
  throw Error("No picture found");
};
Entry.Container.prototype.selectPicture = function(a) {
  for (var b in this.objects_) {
    var c = this.objects_[b], d;
    for (d in c.pictures) {
      var e = c.pictures[d];
      if (a === e.id) {
        return c.selectedPicture = e, c.entity.setImage(e), c.updateThumbnailView(), c.id;
      }
    }
  }
  throw Error("No picture found");
};
Entry.Container.prototype.addObject = function(a, b) {
  var c = new Entry.EntryObject(a);
  c.name = Entry.getOrderedName(c.name, this.objects_);
  Entry.stateManager && Entry.stateManager.addCommand("add object", this, this.removeObject, c);
  c.scene || (c.scene = Entry.scene.selectedScene);
  "number" == typeof b ? a.sprite.category && "background" == a.sprite.category.main ? (c.setLock(!0), this.objects_.push(c)) : this.objects_.splice(b, 0, c) : a.sprite.category && "background" == a.sprite.category.main ? this.objects_.push(c) : this.objects_.unshift(c);
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
  Entry.stateManager && Entry.stateManager.addCommand("remove object", this, this.addObject, c, b);
  c = new Entry.State(this.addObject, c, b);
  a.destroy();
  this.objects_.splice(b, 1);
  this.setCurrentObjects();
  Entry.stage.sortZorder();
  this.objects_.length && 0 !== b ? 0 < this.getCurrentObjects().length ? Entry.container.selectObject(this.getCurrentObjects()[0].id) : Entry.container.selectObject() : this.objects_.length && 0 === b ? Entry.container.selectObject(this.getCurrentObjects()[0].id) : (Entry.container.selectObject(), Entry.playground.flushPlayground());
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
  !c && Entry.stateManager && Entry.stateManager.addCommand("reorder object", Entry.container, Entry.container.moveElement, b, a, !0);
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
  0 === this.messages_.length ? Entry.toast.alert(Lang.Msgs.warn, Lang.Workspace.no_message_to_remove, "true") : Entry.dispatchEvent("deleteMessage");
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
      c = this.getCurrentObjects();
      d = c.length;
      for (a = 0;a < d;a++) {
        e = c[a], b.push([e.name, e.id]);
      }
      b.push([Lang.Blocks.mouse_pointer, "mouse"]);
    } else {
      if ("spritesWithSelf" == a) {
        c = this.getCurrentObjects();
        d = c.length;
        for (a = 0;a < d;a++) {
          e = c[a], b.push([e.name, e.id]);
        }
        b.push([Lang.Blocks.self, "self"]);
      } else {
        if ("collision" == a) {
          b.push([Lang.Blocks.mouse_pointer, "mouse"]);
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
                b && 0 !== b.length || b.push([Lang.Blocks.VARIABLE_variable, "null"]);
              } else {
                if ("lists" == a) {
                  c = Entry.variableContainer.lists_;
                  for (a = 0;a < c.length;a++) {
                    d = c[a], b.push([d.getName(), d.getId()]);
                  }
                  b && 0 !== b.length || b.push([Lang.Blocks.VARIABLE_list, "null"]);
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
    var f = c[e], g = f.clonedEntities.length;
    a(f.entity, b);
    for (var h = 0;h < g;h++) {
      var k = f.clonedEntities[h];
      k && !k.isStamp && a(k, b);
    }
  }
};
Entry.Container.prototype.mapEntityIncludeCloneOnScene = function(a, b) {
  for (var c = this.getCurrentObjects(), d = c.length, e = 0;e < d;e++) {
    var f = c[e], g = f.clonedEntities.length;
    a(f.entity, b);
    for (var h = 0;h < g;h++) {
      var k = f.clonedEntities[h];
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
  return this.inputValue.getValue();
};
Entry.Container.prototype.setInputValue = function(a) {
  a ? this.inputValue.setValue(a) : this.inputValue.setValue(0);
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
  a && 0 !== a.length || this.setCurrentObjects();
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
Entry.Container.prototype.initTvcast = function(a) {
  this.tvcast = a;
  this.youtubeTab.removeClass("entryRemove");
  a = this.view_;
  a = a.style.width.substring(0, a.style.width.length - 2);
  var b = this.movieContainer, c = Entry.createElement("iframe");
  c.setAttribute("width", a);
  c.setAttribute("height", 9 * a / 16);
  c.setAttribute("allowfullscreen", "");
  c.setAttribute("frameborder", 0);
  c.setAttribute("src", this.tvcast);
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
Entry.Container.prototype.showProjectAnswer = function() {
  var a = this.inputValue;
  a && a.setVisible(!0);
};
Entry.Container.prototype.hideProjectAnswer = function(a) {
  var b = this.inputValue;
  if (b && b.isVisible() && !Entry.engine.isState("run")) {
    for (var c = Entry.container.getAllObjects(), d = ["ask_and_wait", "get_canvas_input_value", "set_visible_answer"], e = 0, f = c.length;e < f;e++) {
      for (var g = c[e].script.getElementsByTagName("block"), h = 0, k = g.length;h < k;h++) {
        if (-1 < d.indexOf(g[h].getAttribute("type")) && g[h].getAttribute("id") != a.getAttribute("id")) {
          return;
        }
      }
    }
    b.setVisible(!1);
  }
};
Entry.db = {data:{}, typeMap:{}};
(function(a) {
  a.add = function(a) {
    this.data[a.id] = a;
    var c = a.type;
    void 0 === this.typeMap[c] && (this.typeMap[c] = {});
    this.typeMap[c][a.id] = a;
  };
  a.has = function(a) {
    return this.data.hasOwnProperty(a);
  };
  a.remove = function(a) {
    this.has(a) && (delete this.typeMap[this.data[a].type][a], delete this.data[a]);
  };
  a.get = function(a) {
    return this.data[a];
  };
  a.find = function() {
  };
  a.clear = function() {
    this.data = {};
    this.typeMap = {};
  };
})(Entry.db);
Entry.Dom = function(a, b) {
  var c = /<(\w+)>/, d;
  d = a instanceof HTMLElement ? $(a) : a instanceof jQuery ? a : c.test(a) ? $(a) : $("<" + a + "></" + a + ">");
  if (void 0 === b) {
    return d;
  }
  b.id && d.attr("id", b.id);
  b.class && d.addClass(b.class);
  b.classes && b.classes.map(function(a) {
    d.addClass(a);
  });
  b.parent && b.parent.append(d);
  return d;
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
  function a(a) {
    var c = [37, 38, 39, 40, 32], d = a.keyCode || a.which, e = Entry.stage.inputField;
    32 == d && e && e.hasFocus() || -1 < c.indexOf(d) && a.preventDefault();
  }
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
  Entry.addEventListener("run", function() {
    $(window).bind("keydown", a);
  });
  Entry.addEventListener("stop", function() {
    $(window).unbind("keydown", a);
  });
};
Entry.Engine.prototype.generateView = function(a, b) {
  if (b && "workspace" != b) {
    "minimize" == b ? (this.view_ = a, this.view_.addClass("entryEngine"), this.view_.addClass("entryEngineMinimize"), this.maximizeButton = Entry.createElement("button"), this.maximizeButton.addClass("entryEngineButtonMinimize"), this.maximizeButton.addClass("entryMaximizeButtonMinimize"), this.view_.appendChild(this.maximizeButton), this.maximizeButton.bindOnClick(function(a) {
      Entry.engine.toggleFullscreen();
    }), this.coordinateButton = Entry.createElement("button"), this.coordinateButton.addClass("entryEngineButtonMinimize"), this.coordinateButton.addClass("entryCoordinateButtonMinimize"), this.view_.appendChild(this.coordinateButton), this.coordinateButton.bindOnClick(function(a) {
      this.hasClass("toggleOn") ? this.removeClass("toggleOn") : this.addClass("toggleOn");
      Entry.stage.toggleCoordinator();
    }), this.runButton = Entry.createElement("button"), this.runButton.addClass("entryEngineButtonMinimize"), this.runButton.addClass("entryRunButtonMinimize"), this.runButton.innerHTML = Lang.Blocks.START, this.view_.appendChild(this.runButton), this.runButton.bindOnClick(function(a) {
      a.preventDefault();
      Entry.engine.toggleRun();
    }), this.runButton2 = Entry.createElement("button"), this.runButton2.addClass("entryEngineBigButtonMinimize_popup"), this.runButton2.addClass("entryEngineBigButtonMinimize_popup_run"), this.view_.appendChild(this.runButton2), this.runButton2.bindOnClick(function(a) {
      a.preventDefault();
      Entry.engine.toggleRun();
    }), this.stopButton = Entry.createElement("button"), this.stopButton.addClass("entryEngineButtonMinimize"), this.stopButton.addClass("entryStopButtonMinimize"), this.stopButton.addClass("entryRemove"), this.stopButton.innerHTML = Lang.Workspace.stop, this.view_.appendChild(this.stopButton), this.stopButton.bindOnClick(function(a) {
      this.blur();
      a.preventDefault();
      Entry.engine.toggleStop();
    }), this.pauseButton = Entry.createElement("button"), this.pauseButton.innerHTML = Lang.Workspace.pause, this.pauseButton.addClass("entryEngineButtonMinimize"), this.pauseButton.addClass("entryPauseButtonMinimize"), this.pauseButton.addClass("entryRemove"), this.view_.appendChild(this.pauseButton), this.pauseButton.bindOnClick(function(a) {
      this.blur();
      a.preventDefault();
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
      a.preventDefault();
      Entry.engine.toggleRun();
    }), this.stopButton = Entry.createElement("button"), this.stopButton.addClass("entryEngineButtonPhone", "entryStopButtonPhone", "entryRemove"), Entry.objectAddable && this.stopButton.addClass("small"), this.stopButton.innerHTML = Lang.Workspace.stop, this.footerView_.appendChild(this.stopButton), this.stopButton.bindOnClick(function(a) {
      a.preventDefault();
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
      a.preventDefault();
      Entry.engine.toggleRun();
    });
    this.runButton2 = Entry.createElement("button");
    this.runButton2.addClass("entryEngineButtonWorkspace_w");
    this.runButton2.addClass("entryRunButtonWorkspace_w2");
    this.view_.appendChild(this.runButton2);
    this.runButton2.bindOnClick(function(a) {
      a.preventDefault();
      Entry.engine.toggleRun();
    });
    this.stopButton = Entry.createElement("button");
    this.stopButton.addClass("entryEngineButtonWorkspace_w");
    this.stopButton.addClass("entryStopButtonWorkspace_w");
    this.stopButton.addClass("entryRemove");
    this.stopButton.innerHTML = Lang.Workspace.stop;
    this.view_.appendChild(this.stopButton);
    this.stopButton.bindOnClick(function(a) {
      a.preventDefault();
      Entry.engine.toggleStop();
    });
    this.stopButton2 = Entry.createElement("button");
    this.stopButton2.addClass("entryEngineButtonWorkspace_w");
    this.stopButton2.addClass("entryStopButtonWorkspace_w2");
    this.stopButton2.addClass("entryRemove");
    this.stopButton2.innerHTML = Lang.Workspace.stop;
    this.view_.appendChild(this.stopButton2);
    this.stopButton2.bindOnClick(function(a) {
      a.preventDefault();
      Entry.engine.toggleStop();
    });
    this.pauseButton = Entry.createElement("button");
    this.pauseButton.addClass("entryEngineButtonWorkspace_w");
    this.pauseButton.addClass("entryPauseButtonWorkspace_w");
    this.pauseButton.addClass("entryRemove");
    this.view_.appendChild(this.pauseButton);
    this.pauseButton.bindOnClick(function(a) {
      a.preventDefault();
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
        var d = !c.isLooped, f = c.run(), e = f && f === c, c = f;
      } catch (g) {
        throw Entry.engine.toggleStop(), Entry.engine.isUpdating = !1, "workspace" == Entry.type && (Entry.container.selectObject(), Entry.container.selectObject(c.entity.parent.id), Entry.playground.changeViewMode("code"), Blockly.mainWorkspace.activatePreviousBlock(c.id)), Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.check_runtime_error, !0), g;
      }
    }
    c && a.push(c);
  }
};
Entry.Engine.computeThread = function(a, b) {
  Entry.engine.isContinue = !0;
  for (var c = !1;b && Entry.engine.isContinue && !c;) {
    Entry.engine.isContinue = !b.isRepeat;
    var d = b.run(), c = d && d.type == b.type;
    b = d;
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
  }), Entry.container.takeSequenceSnapshot(), Entry.scene.takeStartSceneSnapshot(), this.state = "run", this.fireEvent("when_run_button_click"));
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
  var a = Entry.container, b = Entry.variableContainer;
  a.mapEntity(function(a) {
    a.loadSnapshot();
    a.object.filters = [];
    a.resetFilter();
    a.dialog && a.dialog.remove();
    a.brush && a.removeBrush();
  });
  b.mapVariable(function(a) {
    a.loadSnapshot();
  });
  b.mapList(function(a) {
    a.loadSnapshot();
    a.updateView();
  });
  this.stopProjectTimer();
  a.clearRunningState();
  a.loadSequenceSnapshot();
  a.setInputValue();
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
        var g = new Entry.Script(a);
        g.init(f);
        a.runningScript.push(g);
      }
    }
  }
};
Entry.Engine.prototype.captureKeyEvent = function(a) {
  var b = a.keyCode, c = Entry.type;
  0 > Entry.engine.pressedKeys.indexOf(b) && Entry.engine.pressedKeys.push(b);
  a.ctrlKey && "workspace" == c ? 83 == b ? (a.preventDefault(), Entry.dispatchEvent("saveWorkspace")) : 82 == b ? (a.preventDefault(), Entry.engine.run()) : 90 == b ? (a.preventDefault(), Entry.dispatchEvent(a.shiftKey ? "redo" : "undo")) : 48 < b && 58 > b && (a.preventDefault(), Entry.playground.selectMenu(b - 49)) : Entry.engine.isState("run") && (Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, ["press_some_key", b]), Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, 
  ["when_some_key_pressed", b]));
  Entry.engine.isState("stop") && "workspace" === c && 37 <= b && 40 >= b && Entry.stage.moveSprite(a);
};
Entry.Engine.prototype.captureKeyUpEvent = function(a) {
  a = a.keyCode;
  0 <= Entry.engine.pressedKeys.indexOf(a) && Entry.engine.pressedKeys.splice(Entry.engine.pressedKeys.indexOf(a), 1);
};
Entry.Engine.prototype.raiseKeyEvent = function(a, b) {
  for (var c = b[0], d = b[1], e = a.parent.script.childNodes, f = 0;f < e.length;f++) {
    var g = e[f], h = Entry.Xml.getField("VALUE", g);
    Entry.Xml.isTypeOf(c, g) && h == d && (h = new Entry.Script(a), h.init(g), a.runningScript.push(h));
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
Entry.Engine.prototype.showProjectTimer = function() {
  Entry.engine.projectTimer && this.projectTimer.setVisible(!0);
};
Entry.Engine.prototype.hideProjectTimer = function(a) {
  var b = this.projectTimer;
  if (b && b.isVisible() && !this.isState("run")) {
    for (var c = Entry.container.getAllObjects(), d = ["get_project_timer_value", "reset_project_timer", "set_visible_project_timer"], e = 0, f = c.length;e < f;e++) {
      for (var g = c[e].script.getElementsByTagName("block"), h = 0, k = g.length;h < k;h++) {
        if (-1 < d.indexOf(g[h].getAttribute("type")) && g[h].getAttribute("id") != a.getAttribute("id")) {
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
Entry.Engine.prototype.startProjectTimer = function() {
  var a = this.projectTimer;
  a && (a.start = (new Date).getTime(), a.isInit = !0, a.pausedTime = 0, a.tick = setInterval(function(a) {
    Entry.engine.updateProjectTimer();
  }, 1E3 / 60));
};
Entry.Engine.prototype.stopProjectTimer = function() {
  var a = this.projectTimer;
  a && (this.updateProjectTimer(0), a.isPaused = !1, a.isInit = !1, a.pausedTime = 0, clearInterval(a.tick));
};
Entry.Engine.prototype.updateProjectTimer = function(a) {
  var b = Entry.engine.projectTimer, c = (new Date).getTime();
  b && ("undefined" == typeof a ? b.isPaused || b.setValue((c - b.start - b.pausedTime) / 1E3) : (b.setValue(a), b.pausedTime = 0, b.start = c));
};
Entry.EntityObject = function(a) {
  this.parent = a;
  this.type = a.objectType;
  this.runningScript = [];
  this.flip = !1;
  this.collision = Entry.Utils.COLLISION.NONE;
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
  if ("sprite" == this.type) {
    this.setImage(a);
  } else {
    if ("textBox" == this.type) {
      var c = this.parent;
      b.text = c.text || c.name;
      this.setFont(b.font);
      this.setBGColour(b.bgColor);
      this.setColour(b.colour);
      this.setUnderLine(b.underLine);
      this.setStrike(b.strike);
    }
  }
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
  Entry.engine.isState("stop") && (this.isCommandValid = !1, Entry.stateManager && Entry.stateManager.addCommand("edit entity", this, this.restoreEntity, this.toJSON()));
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
  Entry.stateManager && Entry.stateManager.addCommand("restore object", this, this.restoreEntity, b);
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
  1 > a && (a = 1);
  a /= this.getSize();
  this.setScaleX(this.getScaleX() * a);
  this.setScaleY(this.getScaleY() * a);
  this.isClone || this.parent.updateCoordinateView();
};
Entry.EntityObject.prototype.getSize = function() {
  return (this.getWidth() * Math.abs(this.getScaleX()) + this.getHeight() * Math.abs(this.getScaleY())) / 2;
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
  "textBox" == this.parent.objectType && (void 0 === a && (a = ""), this.text = a, this.textObject.text = this.text, this.lineBreak || (this.setWidth(this.textObject.getMeasuredWidth()), this.parent.updateCoordinateView()), this.updateBG(), Entry.stage.updateObject());
};
Entry.EntityObject.prototype.getText = function() {
  return this.text;
};
Entry.EntityObject.prototype.setTextAlign = function(a) {
  "textBox" == this.parent.objectType && (void 0 === a && (a = Entry.TEXT_ALIGN_CENTER), this.textAlign = a, this.textObject.textAlign = Entry.TEXT_ALIGNS[this.textAlign], this.alignTextBox(), this.updateBG(), Entry.stage.updateObject());
};
Entry.EntityObject.prototype.getTextAlign = function() {
  return this.textAlign;
};
Entry.EntityObject.prototype.setLineBreak = function(a) {
  if ("textBox" == this.parent.objectType) {
    void 0 === a && (a = !1);
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
  void 0 === a && (a = !0);
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
    a.fileurl ? e.src = a.fileurl : (b = a.filename, e.src = "/uploads/" + b.substring(0, 2) + "/" + b.substring(2, 4) + "/image/" + b + ".png");
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
  b.brightness = b.brightness;
  var e = new createjs.ColorMatrix;
  e.adjustColor(d(b.brightness, -100, 100), 0, 0, 0);
  e = new createjs.ColorMatrixFilter(e);
  c.push(e);
  b.hue = b.hue.mod(360);
  e = new createjs.ColorMatrix;
  e.adjustColor(0, 0, 0, b.hue);
  e = new createjs.ColorMatrixFilter(e);
  c.push(e);
  var e = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], f = 10.8 * b.hsv * Math.PI / 180, g = Math.cos(f), f = Math.sin(f), h = Math.abs(b.hsv / 100);
  1 < h && (h -= Math.floor(h));
  0 < h && .33 >= h ? e = [1, 0, 0, 0, 0, 0, g, f, 0, 0, 0, -1 * f, g, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1] : .66 >= h ? e = [g, 0, f, 0, 0, 0, 1, 0, 0, 0, f, 0, g, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1] : .99 >= h && (e = [g, f, 0, 0, 0, -1 * f, g, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
  e = (new createjs.ColorMatrix).concat(e);
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
  this.collision = Entry.Utils.COLLISION.NONE;
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
  this.effect = {blur:0, hue:0, hsv:0, brightness:0, contrast:0, saturation:0, alpha:1};
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
    c.innerHTML = Lang.Helper.Block_info;
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
  b.innerHTML = Lang.Helper.Block_click_msg;
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
  this.hwModule = this.selectedDevice = null;
  Entry.addEventListener("stop", this.setZero);
  this.hwInfo = {11:Entry.Arduino, 12:Entry.SensorBoard, 13:Entry.CODEino, 24:Entry.Hamster, 25:Entry.Albert, 31:Entry.Bitbrick};
};
Entry.HW.TRIAL_LIMIT = 1;
p = Entry.HW.prototype;
p.initSocket = function() {
  if (this.connectTrial >= Entry.HW.TRIAL_LIMIT) {
    this.isFirstConnect || Entry.toast.alert(Lang.Menus.connect_hw, Lang.Menus.connect_fail, !1), this.isFirstConnect = !1;
  } else {
    var a = this, b = new WebSocket("ws://localhost:23518");
    this.socket = b;
    this.connected = !1;
    b.binaryType = "arraybuffer";
    this.connectTrial++;
    b.onopen = function() {
      a.initHardware();
    };
    b.onmessage = function(b) {
      b = JSON.parse(b.data);
      a.checkDevice(b);
      a.updatePortData(b);
    };
    b.onclose = function() {
      a.initSocket();
    };
    Entry.dispatchEvent("hwChanged");
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
  return void 0 !== this.portData[a] ? this.portData[a] : 0;
};
p.setPortReadable = function(a) {
  this.sendQueue.readablePorts || (this.sendQueue.readablePorts = []);
  this.sendQueue.readablePorts.push(a);
};
p.update = function() {
  this.socket && 1 == this.socket.readyState && (this.socket.send(JSON.stringify(this.sendQueue)), this.sendQueue.readablePorts = []);
};
p.updatePortData = function(a) {
  this.portData = a;
};
p.closeConnection = function() {
  this.socket && this.socket.close();
};
p.downloadConnector = function() {
  window.open("http://play-entry.org/down/Entry_HW_v1.1.2.exe", "_blank").focus();
};
p.downloadSource = function() {
  window.open("http://play-entry.com/down/board.ino", "_blank").focus();
};
p.setZero = function() {
  Entry.hw.hwModule && Entry.hw.hwModule.setZero();
};
p.checkDevice = function(a) {
  void 0 !== a.company && (a = "" + a.company + a.model, a != this.selectedDevice && (this.selectedDevice = a, this.hwModule = this.hwInfo[a], Entry.dispatchEvent("hwChanged"), Entry.toast.success(Lang.Menus.connect_hw, Lang.Menus.connect_message.replace("%1", Lang.Device[Entry.hw.hwModule.name]), !1)));
};
p.banHW = function() {
  var a = this.hwInfo, b;
  for (b in a) {
    Entry.playground.blockMenu.banClass(a[b].name);
  }
};
Entry.init = function(a, b) {
  Entry.assert("object" === typeof b, "Init option is not object");
  this.events_ = {};
  this.interfaceState = {menuWidth:264};
  Entry.Utils.bindGlobalEvent(["mousedown", "mousemove"]);
  this.options = b;
  this.parseOptions(b);
  this.mediaFilePath = (b.libDir ? b.libDir : "/lib") + "/entryjs/images/";
  "workspace" == this.type && this.isPhone() && (this.type = "phone");
  this.initialize_();
  this.view_ = a;
  this.view_.setAttribute("class", "entry");
  Entry.initFonts(b.fonts);
  this.createDom(a, this.type);
  this.loadInterfaceState();
  this.overridePrototype();
  this.maxCloneLimit = 302;
  this.cloudSavable = !0;
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
  "IE" != Entry.getBrowserType().substr(0, 2) || window.flashaudio ? createjs.Sound.registerPlugins([createjs.WebAudioPlugin]) : (createjs.FlashAudioPlugin.swfPath = this.mediaFilePath + "media/", createjs.Sound.registerPlugins([createjs.FlashAudioPlugin]), window.flashaudio = !0);
  Entry.soundQueue = new createjs.LoadQueue;
  Entry.soundQueue.installPlugin(createjs.Sound);
  Entry.loadAudio_([Entry.mediaFilePath + "media/click.mp3", Entry.mediaFilePath + "media/click.wav", Entry.mediaFilePath + "media/click.ogg"], "click");
  Entry.loadAudio_([Entry.mediaFilePath + "media/delete.mp3", Entry.mediaFilePath + "media/delete.ogg", Entry.mediaFilePath + "media/delete.wav"], "delete");
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
  if (Entry.enableActivityLogging) {
    this.reporter = new Entry.Reporter(!1);
  } else {
    if ("workspace" == this.type || "phone" == this.type) {
      this.reporter = new Entry.Reporter(!0);
    }
  }
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
    c.addEventListener("mousewheel", function(a) {
      var b = Entry.variableContainer.getListById(Entry.stage.mouseCoordinate);
      a = 0 < a.wheelDelta ? !0 : !1;
      for (var c = 0;c < b.length;c++) {
        var d = b[c];
        d.scrollButton_.y = a ? 46 <= d.scrollButton_.y ? d.scrollButton_.y - 23 : 23 : d.scrollButton_.y + 23;
        d.updateView();
      }
    });
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
Entry.initFonts = function(a) {
  this.fonts = a;
  a || (this.fonts = []);
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
Entry.Activity = function(a, b) {
  this.name = a;
  this.timestamp = new Date;
  var c = [];
  if (void 0 !== b) {
    for (var d = 0, e = b.length;d < e;d++) {
      var f = b[d];
      c.push({key:f[0], value:f[1]});
    }
  }
  this.data = c;
};
Entry.ActivityReporter = function() {
  this._activities = [];
};
(function(a) {
  a.add = function(a) {
    if (!(a instanceof Entry.Activity)) {
      return console.error("Activity must be an instanceof Entry.MazeActivity");
    }
    this._activities.push(a);
  };
  a.clear = function() {
    this._activities = [];
  };
  a.get = function() {
    return this._activities;
  };
})(Entry.ActivityReporter.prototype);
Entry.EntryObject = function(a) {
  if (a) {
    this.id = a.id;
    this.name = a.name || a.sprite.name;
    this.text = a.text || this.name;
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
      c.fileurl ? d.src = c.fileurl : c.fileurl ? d.src = c.fileurl : (a = c.filename, d.src = "/uploads/" + a.substring(0, 2) + "/" + a.substring(2, 4) + "/image/" + a + ".png");
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
    Entry.Utils.disableContextmenu(a);
    var b = this;
    $(a).on("contextmenu", function(a) {
      Entry.ContextMenu.show([{text:Lang.Workspace.context_rename, callback:function() {
        var a = b;
        a.setLock(!1);
        a.editObjectValues(!0);
        a.nameView_.select();
      }}, {text:Lang.Workspace.context_duplicate, callback:function() {
        Entry.container.addCloneObject(b);
      }}, {text:Lang.Workspace.context_remove, callback:function() {
        Entry.container.removeObject(b);
      }}, {text:Lang.Workspace.copy_file, callback:function() {
        Entry.container.setCopiedObject(b);
      }}, {text:Lang.Blocks.Paste_blocks, callback:function() {
        Entry.container.copiedObject ? Entry.container.addCloneObject(Entry.container.copiedObject) : Entry.toast.alert(Lang.Workspace.add_object_alert, Lang.Workspace.object_not_found_for_paste);
      }}], "workspace-contextmenu");
    });
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
      Entry.playground.reloadPlayground();
    };
    this.nameView_.onkeypress = function(a) {
      13 == a.keyCode && this.entryObject.editObjectValues(tog);
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
    var g = Entry.createElement("span");
    g.addClass("entryObjectCoordinateSpanWorkspace");
    g.innerHTML = "Y:";
    var h = Entry.createElement("input");
    h.addClass("entryObjectCoordinateInputWorkspace entryObjectCoordinateInputWorkspace_right");
    h.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    h.setAttribute("disabled", "disabled");
    var k = Entry.createElement("span");
    k.addClass("entryObjectCoordinateSizeWorkspace");
    k.innerHTML = "\ud06c\uae30 :";
    var l = Entry.createElement("input");
    l.addClass("entryObjectCoordinateInputWorkspace", "entryObjectCoordinateInputWorkspace_size");
    l.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    l.setAttribute("disabled", "disabled");
    d.appendChild(e);
    d.appendChild(f);
    d.appendChild(g);
    d.appendChild(h);
    d.appendChild(k);
    d.appendChild(l);
    d.xInput_ = f;
    d.yInput_ = h;
    d.sizeInput_ = l;
    this.coordinateView_ = d;
    c = this;
    f.onkeypress = function(a) {
      13 == a.keyCode && c.editObjectValues(tog);
    };
    f.onblur = function(a) {
      isNaN(f.value) || c.entity.setX(Number(f.value));
      c.updateCoordinateView();
      Entry.stage.updateObject();
    };
    h.onkeypress = function(a) {
      13 == a.keyCode && c.editObjectValues(tog);
    };
    h.onblur = function(a) {
      isNaN(h.value) || c.entity.setY(Number(h.value));
      c.updateCoordinateView();
      Entry.stage.updateObject();
    };
    l.onkeypress = function(a) {
      13 == a.keyCode && c.editObjectValues(tog);
    };
    l.onblur = function(a) {
      isNaN(l.value) || c.entity.setSize(Number(l.value));
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
    g = Entry.createElement("span");
    g.addClass("entryObjectDirectionSpanWorkspace");
    g.innerHTML = Lang.Workspace.direction + " : ";
    var m = Entry.createElement("input");
    m.addClass("entryObjectDirectionInputWorkspace");
    m.setAttribute("disabled", "disabled");
    m.bindOnClick(function(a) {
      a.stopPropagation();
      this.select();
    });
    this.directionInput_ = m;
    d.appendChild(e);
    d.appendChild(n);
    d.appendChild(g);
    d.appendChild(m);
    d.rotateInput_ = n;
    d.directionInput_ = m;
    c = this;
    n.onkeypress = function(a) {
      13 == a.keyCode && c.editObjectValues(tog);
    };
    n.onblur = function(a) {
      a = n.value;
      -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da")));
      isNaN(a) || c.entity.setRotation(Number(a));
      c.updateRotationView();
      Entry.stage.updateObject();
    };
    m.onkeypress = function(a) {
      13 == a.keyCode && c.editObjectValues(tog);
    };
    m.onblur = function(a) {
      a = m.value;
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
      Entry.playground.reloadPlayground();
    }, this.nameView_.onkeypress = function(a) {
      13 == a.keyCode && this.blur();
    }, this.nameView_.value = this.name, Entry.objectEditable && Entry.objectDeletable && (d = Entry.createElement("div"), d.addClass("entryObjectDeletePhone"), d.object = this, this.deleteView_ = d, this.view_.appendChild(d), d.bindOnClick(function(a) {
      Entry.engine.isState("run") || Entry.container.removeObject(this.object);
    })), d = Entry.createElement("button"), d.addClass("entryObjectEditPhone"), d.object = this, d.bindOnClick(function(a) {
      if (a = Entry.container.getObject(this.id)) {
        Entry.container.selectObject(a.id), Entry.playground.injectObject(a);
      }
    }), this.view_.appendChild(d), d = Entry.createElement("div"), d.addClass("entryObjectInformationWorkspace"), d.object = this, this.isInformationToggle = !1, a.appendChild(d), this.informationView_ = d, d = Entry.createElement("div"), d.addClass("entryObjectRotateLabelWrapperWorkspace"), this.view_.appendChild(d), this.rotateLabelWrapperView_ = d, e = Entry.createElement("span"), e.addClass("entryObjectRotateSpanWorkspace"), e.innerHTML = Lang.Workspace.rotation + " : ", n = Entry.createElement("input"), 
    n.addClass("entryObjectRotateInputWorkspace"), this.rotateSpan_ = e, this.rotateInput_ = n, g = Entry.createElement("span"), g.addClass("entryObjectDirectionSpanWorkspace"), g.innerHTML = Lang.Workspace.direction + " : ", m = Entry.createElement("input"), m.addClass("entryObjectDirectionInputWorkspace"), this.directionInput_ = m, d.appendChild(e), d.appendChild(n), d.appendChild(g), d.appendChild(m), d.rotateInput_ = n, d.directionInput_ = m, c = this, n.onkeypress = function(a) {
      13 == a.keyCode && (a = n.value, -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da"))), isNaN(a) || c.entity.setRotation(Number(a)), c.updateRotationView(), n.blur());
    }, n.onblur = function(a) {
      c.entity.setRotation(c.entity.getRotation());
      Entry.stage.updateObject();
    }, m.onkeypress = function(a) {
      13 == a.keyCode && (a = m.value, -1 != a.indexOf("\u02da") && (a = a.substring(0, a.indexOf("\u02da"))), isNaN(a) || c.entity.setDirection(Number(a)), c.updateRotationView(), m.blur());
    }, m.onblur = function(a) {
      c.entity.setDirection(c.entity.getDirection());
      Entry.stage.updateObject();
    }, a = Entry.createElement("div"), a.addClass("entryObjectRotationWrapperWorkspace"), a.object = this, this.view_.appendChild(a), d = Entry.createElement("span"), d.addClass("entryObjectCoordinateWorkspace"), a.appendChild(d), e = Entry.createElement("span"), e.addClass("entryObjectCoordinateSpanWorkspace"), e.innerHTML = "X:", f = Entry.createElement("input"), f.addClass("entryObjectCoordinateInputWorkspace"), g = Entry.createElement("span"), g.addClass("entryObjectCoordinateSpanWorkspace"), 
    g.innerHTML = "Y:", h = Entry.createElement("input"), h.addClass("entryObjectCoordinateInputWorkspace entryObjectCoordinateInputWorkspace_right"), k = Entry.createElement("span"), k.addClass("entryObjectCoordinateSpanWorkspace"), k.innerHTML = Lang.Workspace.Size, l = Entry.createElement("input"), l.addClass("entryObjectCoordinateInputWorkspace", "entryObjectCoordinateInputWorkspace_size"), d.appendChild(e), d.appendChild(f), d.appendChild(g), d.appendChild(h), d.appendChild(k), d.appendChild(l), 
    d.xInput_ = f, d.yInput_ = h, d.sizeInput_ = l, this.coordinateView_ = d, c = this, f.onkeypress = function(a) {
      13 == a.keyCode && (isNaN(f.value) || c.entity.setX(Number(f.value)), c.updateCoordinateView(), f.blur());
    }, f.onblur = function(a) {
      c.entity.setX(c.entity.getX());
      Entry.stage.updateObject();
    }, h.onkeypress = function(a) {
      13 == a.keyCode && (isNaN(h.value) || c.entity.setY(Number(h.value)), c.updateCoordinateView(), h.blur());
    }, h.onblur = function(a) {
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
Entry.EntryObject.prototype.setText = function(a) {
  Entry.assert("string" == typeof a, "object text must be string");
  this.text = a;
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
    b.scaleX = b.scaleY = "background" == a.sprite.category.main ? Math.max(270 / c.height, 480 / c.width) : "new" == a.sprite.category.main ? 1 : 200 / (c.width + c.height);
    b.width = c.width;
    b.height = c.height;
  } else {
    if ("textBox" == this.objectType) {
      if (b.regX = 25, b.regY = 12, b.scaleX = b.scaleY = 1.5, b.width = 50, b.height = 24, b.text = a.text, a.options) {
        if (a = a.options, c = "", a.bold && (c += "bold "), a.italic && (c += "italic "), b.underline = a.underline, b.strike = a.strike, b.font = c + "20px " + a.font.family, b.colour = a.colour, b.bgColor = a.background, b.lineBreak = a.lineBreak) {
          b.width = 256, b.height = .5625 * b.width, b.regX = b.width / 2, b.regY = b.height / 2;
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
    if (this.entity.picture.fileurl) {
      this.thumbnailView_.style.backgroundImage = 'url("' + this.entity.picture.fileurl + '")';
    } else {
      var a = this.entity.picture.filename;
      this.thumbnailView_.style.backgroundImage = 'url("/uploads/' + a.substring(0, 2) + "/" + a.substring(2, 4) + "/thumb/" + a + '.png")';
    }
  } else {
    "textBox" == this.objectType && (this.thumbnailView_.style.backgroundImage = "url(" + (Entry.mediaFilePath + "/text_icon.png") + ")");
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
  Entry.stateManager && Entry.stateManager.addCommand("add sprite", this, this.removePicture, a.id);
  b || 0 === b ? (this.pictures.splice(b, 0, a), Entry.playground.injectPicture(this)) : this.pictures.push(a);
  return new Entry.State(this, this.removePicture, a.id);
};
Entry.EntryObject.prototype.removePicture = function(a) {
  if (2 > this.pictures.length) {
    return !1;
  }
  a = this.getPicture(a);
  var b = this.pictures.indexOf(a);
  Entry.stateManager && Entry.stateManager.addCommand("remove sprite", this, this.addPicture, a, b);
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
  if ((!1 !== a || "boolean" != typeof a) && c >= a && 0 < a) {
    return b[a - 1];
  }
  throw Error("No picture found");
};
Entry.EntryObject.prototype.setPicture = function(a) {
  for (var b in this.pictures) {
    if (a.id === this.pictures[b].id) {
      this.pictures[b] = a;
      return;
    }
  }
  throw Error("No picture found");
};
Entry.EntryObject.prototype.getPrevPicture = function(a) {
  for (var b = this.pictures, c = b.length, d = 0;d < c;d++) {
    if (b[d].id == a) {
      return b[0 == d ? c - 1 : d - 1];
    }
  }
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
  Entry.stateManager && Entry.stateManager.addCommand("add sound", this, this.removeSound, a.id);
  Entry.initSound(a, b);
  b || 0 === b ? (this.sounds.splice(b, 0, a), Entry.playground.injectSound(this)) : this.sounds.push(a);
  return new Entry.State(this, this.removeSound, a.id);
};
Entry.EntryObject.prototype.removeSound = function(a) {
  var b;
  b = this.getSound(a);
  a = this.sounds.indexOf(b);
  Entry.stateManager && Entry.stateManager.addCommand("remove sound", this, this.addSound, b, a);
  this.sounds.splice(a, 1);
  Entry.playground.reloadPlayground();
  Entry.playground.injectSound(this);
  return new Entry.State(this, this.addSound, b, a);
};
Entry.EntryObject.prototype.getRotateMethod = function() {
  this.rotateMethod || (this.rotateMethod = "free");
  return this.rotateMethod;
};
Entry.EntryObject.prototype.setRotateMethod = function(a) {
  a || (a = "free");
  this.rotateMethod = a;
  this.updateRotateMethodView();
};
Entry.EntryObject.prototype.updateRotateMethodView = function() {
  var a = this.rotateMethod;
  this.rotateModeAView_ && (this.rotateModeAView_.removeClass("selected"), this.rotateModeBView_.removeClass("selected"), this.rotateModeCView_.removeClass("selected"), "free" == a ? this.rotateModeAView_.addClass("selected") : "vertical" == a ? this.rotateModeBView_.addClass("selected") : this.rotateModeCView_.addClass("selected"), this.updateRotationView());
};
Entry.EntryObject.prototype.toggleInformation = function(a) {
  this.setRotateMethod(this.getRotateMethod());
  void 0 === a && (a = this.isInformationToggle = !this.isInformationToggle);
  a ? this.view_.addClass("informationToggle") : this.view_.removeClass("informationToggle");
};
Entry.EntryObject.prototype.addCloneEntity = function(a, b, c) {
  this.clonedEntities.length > Entry.maxCloneLimit || (a = new Entry.EntityObject(this), b ? (a.injectModel(b.picture ? b.picture : null, b.toJSON()), a.snapshot_ = b.snapshot_, b.effect && (a.effect = Entry.cloneSimpleObject(b.effect), a.applyFilter()), b.brush && Entry.setCloneBrush(a, b.brush)) : (a.injectModel(this.entity.picture ? this.entity.picture : null, this.entity.toJSON(a)), a.snapshot_ = this.entity.snapshot_, this.entity.effect && (a.effect = Entry.cloneSimpleObject(this.entity.effect), 
  a.applyFilter()), this.entity.brush && Entry.setCloneBrush(a, this.entity.brush)), Entry.engine.raiseEventOnEntity(a, [a, "when_clone_start"]), a.isClone = !0, a.isStarted = !0, this.addCloneVariables(this, a, b ? b.variables : null, b ? b.lists : null), this.clonedEntities.push(a), Entry.stage.loadEntity(a));
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
  "textBox" == this.objectType && (a.text = this.text);
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
  if ((!1 !== a || "boolean" != typeof a) && c >= a && 0 < a) {
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
  var b = [this.nameView_, this.coordinateView_.xInput_, this.coordinateView_.yInput_, this.rotateInput_, this.directionInput_, this.coordinateView_.sizeInput_];
  if (a && "disabled" != b[0].getAttribute("disabled")) {
    for (a = 0;a < b.length;a++) {
      b[a].setAttribute("disabled", "disabled"), b[a].removeClass("selectedEditingObject"), tog = !0;
    }
  }
};
var tog = !0;
Entry.EntryObject.prototype.editObjectValues = function(a) {
  var b;
  b = this.getLock() ? [this.nameView_] : [this.nameView_, this.coordinateView_.xInput_, this.coordinateView_.yInput_, this.rotateInput_, this.directionInput_, this.coordinateView_.sizeInput_];
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
  this.firstStatement = !1;
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
    "" === a ? (b.inputField.hide(), delete b.inputField) : (b.inputField.hide(), b.drawText(a), b.selectToolbox("cursor"));
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
Entry.Painter.prototype.clearCanvas = function(a) {
  this.clearHandle();
  a || this.initCommand();
  this.objectContainer.removeAllChildren();
  this.stage.update();
  this.colorLayerData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  a = 0;
  for (var b = this.colorLayerData.data.length;a < b;a++) {
    this.colorLayerData.data[a] = 255, this.colorLayerData.data[a + 1] = 255, this.colorLayerData.data[a + 2] = 255, this.colorLayerData.data[a + 3] = 255;
  }
  this.reloadContext();
};
Entry.Painter.prototype.newPicture = function() {
  var a = {dimension:{height:1, width:1}, fileurl:Entry.mediaFilePath + "_1x1.png", name:Lang.Workspace.new_picture};
  a.id = Entry.generateHash();
  Entry.playground.addPicture(a, !0);
};
Entry.Painter.prototype.initPicture = function() {
  var a = this;
  Entry.addEventListener("pictureSelected", function(b) {
    a.selectToolbox("cursor");
    if (a.file.id !== b.id) {
      a.file.modified && confirm("\uc218\uc815\ub41c \ub0b4\uc6a9\uc744 \uc800\uc7a5\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?") && (a.file_ = JSON.parse(JSON.stringify(a.file)), a.file_save(!0));
      a.file.modified = !1;
      a.clearCanvas(!0);
      var c = new Image;
      c.id = b.id ? b.id : Entry.generateHash();
      a.file.id = c.id;
      a.file.name = b.name;
      a.file.mode = "edit";
      c.src = b.fileurl ? b.fileurl : "/uploads/" + b.filename.substring(0, 2) + "/" + b.filename.substring(2, 4) + "/image/" + b.filename + ".png";
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
  Entry.addEventListener("pictureClear", function(b) {
    a.file.modified = !1;
    a.file.id = "";
    a.file.name = "";
    a.clearCanvas();
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
  var f = this.colorLayerData.data[a], g = this.colorLayerData.data[a + 1];
  a = this.colorLayerData.data[a + 2];
  return f >= b - e / 100 * b && f <= b + e / 100 * b && g >= c - e / 100 * c && g <= c + e / 100 * c && a >= d - e / 100 * d && a <= d + e / 100 * d;
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
  a = 4 * (Math.round(a.stageY) * this.canvas.width + Math.round(a.stageX));
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
  if (540 < b.image.height) {
    var c = 540 / b.image.height;
    b.scaleX = c;
    b.scaleY = c;
  }
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
  Entry.stateManager && this.firstStatement && Entry.stateManager.addCommand("edit sprite", this, this.restorePainter, this.colorLayerModel);
  this.firstStatement = !0;
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
  Entry.stateManager && Entry.stateManager.addCommand("restore sprite", this, this.restorePainter, b);
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
    for (var d = 4 * (c.y * a + c.x), e = this.colorLayerData.data[d], f = this.colorLayerData.data[d + 1], g = this.colorLayerData.data[d + 2], h = this.colorLayerData.data[d + 3], k, l, c = [[c.x, c.y]], n = Entry.hex2rgb(this.stroke.lineColor);c.length;) {
      for (var d = c.pop(), m = d[0], q = d[1], d = 4 * (q * a + m);0 <= q && this.matchColor(d, e, f, g, h);) {
        --q, d -= 4 * a;
      }
      d += 4 * a;
      q += 1;
      for (l = k = !1;q < b - 1 && this.matchColor(d, e, f, g, h);) {
        q += 1, this.colorPixel(d, n.r, n.g, n.b), 0 < m && (this.matchColor(d - 4, e, f, g, h) ? k || (c.push([m - 1, q]), k = !0) : k && (k = !1)), m < a - 1 && (this.matchColor(d + 4, e, f, g, h) ? l || (c.push([m + 1, q]), l = !0) : l && (l = !1)), d += 4 * a;
      }
      if (1080 < c.length) {
        break;
      }
    }
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
  this.stroke.fill ? 0 === this.stroke.thickness ? this.brush.graphics.clear().setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawRect(this.oldPt.x, this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawRect(this.oldPt.x, this.oldPt.y, a, b) : 0 === this.stroke.thickness ? this.brush.graphics.clear().setStrokeStyle(this.stroke.thickness, "round").drawRect(this.oldPt.x, 
  this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").drawRect(this.oldPt.x, this.oldPt.y, a, b);
  this.file.modified = !0;
  this.stage.update();
};
Entry.Painter.prototype.move_circle = function() {
  var a = this.stage.mouseX - this.oldPt.x, b = this.stage.mouseY - this.oldPt.y;
  event.shiftKey && (b = a);
  this.stroke.fill ? 0 === this.stroke.thickness ? this.brush.graphics.clear().beginStroke(this.stroke.fillColor).setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawEllipse(this.oldPt.x, this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").beginFill(this.stroke.fillColor).drawEllipse(this.oldPt.x, this.oldPt.y, a, b) : this.stroke.fill || (0 === this.stroke.thickness ? this.brush.graphics.clear().drawEllipse(this.oldPt.x, 
  this.oldPt.y, a, b) : this.brush.graphics.clear().beginStroke(this.stroke.lineColor).setStrokeStyle(this.stroke.thickness, "round").drawEllipse(this.oldPt.x, this.oldPt.y, a, b));
  this.file.modified = !0;
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
  var a = this.canvas.width, b = this.ctx.getImageData(0, 0, a, this.canvas.height), c = b.data.length, d, e = null, f = null, g = null, h = null, k;
  for (d = 0;d < c;d += 4) {
    0 !== b.data[d + 3] && (g = d / 4 % a, k = ~~(d / 4 / a), null === e && (e = k), null === f ? f = g : g < f && (f = g), null === h ? h = k : h < k && (h = k));
  }
  a = h - e;
  b = g - f;
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
  b.src = a.fileurl ? a.fileurl : "/uploads/" + a.filename.substring(0, 2) + "/" + a.filename.substring(2, 4) + "/image/" + a.filename + ".png";
  var c = this;
  b.onload = function(a) {
    c.addImage(a.target);
    c.selectToolbox("cursor");
  };
};
Entry.Painter.prototype.initCoordinator = function() {
  var a = new createjs.Container, b = new createjs.Bitmap(Entry.mediaFilePath + "/workspace_coordinate.png");
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
    var f = c - a, g = d - b;
    e = Math.floor(Math.sqrt(f * f + g * g) / e);
    for (var f = f / e, g = g / e, h = 0;h++ < e;) {
      a += f, b += g, this[0 === h % 2 ? "moveTo" : "lineTo"](a, b);
    }
    this[0 === h % 2 ? "moveTo" : "lineTo"](c, d);
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
    var g = Entry.createElement("div", "entryPainterAttr");
    g.addClass("entryPlaygroundPainterAttr");
    this.view_.appendChild(g);
    this.flipObject = Entry.createElement("div", "entryPictureFlip");
    this.flipObject.addClass("entryPlaygroundPainterFlip");
    g.appendChild(this.flipObject);
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
      g.style.top = d + 30 + "px";
      g.style.height = b - d + "px";
    });
    var h = Entry.createElement("nav", "entryPainterTopMenu");
    h.addClass("entryPlaygroundPainterTopMenu");
    c.appendChild(h);
    e = Entry.createElement("ul");
    h.appendChild(e);
    var k = Entry.createElement("li");
    h.appendChild(k);
    h = Entry.createElement("a", "entryPainterTopMenuFileNew");
    h.bindOnClick(function() {
      b.newPicture();
    });
    h.addClass("entryPlaygroundPainterTopMenuFileNew");
    h.innerHTML = Lang.Workspace.new_picture;
    k.appendChild(h);
    h = Entry.createElement("li", "entryPainterTopMenuFile");
    h.addClass("entryPlaygroundPainterTopMenuFile");
    h.innerHTML = Lang.Workspace.painter_file;
    e.appendChild(h);
    k = Entry.createElement("ul");
    h.appendChild(k);
    h = Entry.createElement("li");
    k.appendChild(h);
    var l = Entry.createElement("a", "entryPainterTopMenuFileSave");
    l.bindOnClick(function() {
      b.file_save(!1);
    });
    l.addClass("entryPainterTopMenuFileSave");
    l.innerHTML = Lang.Workspace.painter_file_save;
    h.appendChild(l);
    h = Entry.createElement("li");
    k.appendChild(h);
    k = Entry.createElement("a", "entryPainterTopMenuFileSaveAs");
    k.bindOnClick(function() {
      b.file.mode = "new";
      b.file_save(!1);
    });
    k.addClass("entryPlaygroundPainterTopMenuFileSaveAs");
    k.innerHTML = Lang.Workspace.painter_file_saveas;
    h.appendChild(k);
    k = Entry.createElement("li", "entryPainterTopMenuEdit");
    k.addClass("entryPlaygroundPainterTopMenuEdit");
    k.innerHTML = Lang.Workspace.painter_edit;
    e.appendChild(k);
    e = Entry.createElement("ul");
    k.appendChild(e);
    k = Entry.createElement("li");
    e.appendChild(k);
    h = Entry.createElement("a", "entryPainterTopMenuEditImportLink");
    h.bindOnClick(function() {
      Entry.dispatchEvent("openPictureImport");
    });
    h.addClass("entryPainterTopMenuEditImport");
    h.innerHTML = Lang.Workspace.get_file;
    k.appendChild(h);
    k = Entry.createElement("li");
    e.appendChild(k);
    h = Entry.createElement("a", "entryPainterTopMenuEditCopy");
    h.bindOnClick(function() {
      b.edit_copy();
    });
    h.addClass("entryPlaygroundPainterTopMenuEditCopy");
    h.innerHTML = Lang.Workspace.copy_file;
    k.appendChild(h);
    k = Entry.createElement("li");
    e.appendChild(k);
    h = Entry.createElement("a", "entryPainterTopMenuEditCut");
    h.bindOnClick(function() {
      b.edit_cut();
    });
    h.addClass("entryPlaygroundPainterTopMenuEditCut");
    h.innerHTML = Lang.Workspace.cut_picture;
    k.appendChild(h);
    k = Entry.createElement("li");
    e.appendChild(k);
    h = Entry.createElement("a", "entryPainterTopMenuEditPaste");
    h.bindOnClick(function() {
      b.edit_paste();
    });
    h.addClass("entryPlaygroundPainterTopMenuEditPaste");
    h.innerHTML = Lang.Workspace.paste_picture;
    k.appendChild(h);
    k = Entry.createElement("li");
    e.appendChild(k);
    e = Entry.createElement("a", "entryPainterTopMenuEditEraseAll");
    e.addClass("entryPlaygroundPainterTopMenuEditEraseAll");
    e.innerHTML = Lang.Workspace.remove_all;
    e.bindOnClick(function() {
      b.clearCanvas();
    });
    k.appendChild(e);
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
    g.appendChild(this.attrResizeArea);
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
    g.appendChild(this.attrRotateArea);
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
    g.appendChild(this.attrColorArea);
    var n = Entry.createElement("div");
    n.addClass("entryPlaygroundPainterAttrColorContainer");
    this.attrColorArea.appendChild(n);
    this.attrCircleArea = Entry.createElement("div");
    this.attrCircleArea.addClass("painterAttrCircleArea");
    g.appendChild(this.attrCircleArea);
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
    g.appendChild(this.attrColorSpoid);
    Entry.getColourCodes().forEach(function(a) {
      var c = Entry.createElement("div");
      c.addClass("entryPlaygroundPainterAttrColorElement");
      "transparent" === a ? c.style.backgroundImage = "url(" + (Entry.mediaFilePath + "/transparent.png") + ")" : c.style.backgroundColor = a;
      c.bindOnClick(function(c) {
        "transparent" === a ? (b.stroke.transparent = !0, b.stroke.lineColor = "#ffffff") : (b.stroke.transparent = !1, r && (document.getElementById("entryPainterShapeBackgroundColor").style.backgroundColor = a, b.stroke.fillColor = a), r || (document.getElementById("entryPainterShapeLineColor").style.backgroundColor = a, b.stroke.lineColor = a));
        document.getElementById("entryPainterAttrCircle").style.backgroundColor = b.stroke.lineColor;
        document.getElementById("entryPainterAttrCircleInput").value = a;
      });
      n.appendChild(c);
    });
    this.attrThickArea = Entry.createElement("div", "painterAttrThickArea");
    this.attrThickArea.addClass("entryPlaygroundentryPlaygroundPainterAttrThickArea");
    g.appendChild(this.attrThickArea);
    d = Entry.createElement("legend");
    d.addClass("painterAttrThickName");
    d.innerHTML = Lang.Workspace.thickness;
    this.attrThickArea.appendChild(d);
    var m = Entry.createElement("fieldset", "entryPainterAttrThick");
    m.addClass("entryPlaygroundPainterAttrThick");
    this.attrThickArea.appendChild(m);
    d = Entry.createElement("div");
    d.addClass("paintAttrThickTop");
    m.appendChild(d);
    e = Entry.createElement("select", "entryPainterAttrThick");
    e.addClass("entryPlaygroundPainterAttrThickInput");
    e.size = "1";
    e.onchange = function(a) {
      b.stroke.thickness = a.target.value;
    };
    for (d = 1;10 >= d;d++) {
      c = Entry.createElement("option"), c.value = d, c.innerHTML = d, e.appendChild(c);
    }
    m.appendChild(e);
    d = Entry.createElement("div", "entryPainterShapeLineColor");
    d.addClass("painterAttrShapeLineColor");
    c = Entry.createElement("div", "entryPainterShapeInnerBackground");
    c.addClass("painterAttrShapeInnerBackground");
    d.appendChild(c);
    m.appendChild(d);
    this.attrThickArea.painterAttrShapeLineColor = d;
    m.bindOnClick(function() {
      q.style.zIndex = "1";
      this.style.zIndex = "10";
      r = !1;
    });
    this.attrBackgroundArea = Entry.createElement("div", "painterAttrBackgroundArea");
    this.attrBackgroundArea.addClass("entryPlaygroundPainterBackgroundArea");
    g.appendChild(this.attrBackgroundArea);
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
    var r = !1;
    q.bindOnClick(function(a) {
      m.style.zIndex = "1";
      this.style.zIndex = "10";
      r = !0;
    });
    this.attrFontArea = Entry.createElement("div", "painterAttrFont");
    this.attrFontArea.addClass("entryPlaygroundPainterAttrFont");
    g.appendChild(this.attrFontArea);
    e = Entry.createElement("div");
    e.addClass("entryPlaygroundPainterAttrTop");
    this.attrFontArea.appendChild(e);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPaintAttrTop_");
    e.appendChild(d);
    d = Entry.createElement("legend");
    d.addClass("panterAttrFontTitle");
    d.innerHTML = Lang.Workspace.textStyle;
    k = Entry.createElement("select", "entryPainterAttrFontName");
    k.addClass("entryPlaygroundPainterAttrFontName");
    k.size = "1";
    k.onchange = function(a) {
      b.font.name = a.target.value;
    };
    for (d = 0;d < Entry.fonts.length;d++) {
      h = Entry.fonts[d], c = Entry.createElement("option"), c.value = h.family, c.innerHTML = h.name, k.appendChild(c);
    }
    e.appendChild(k);
    e = Entry.createElement("div");
    e.addClass("painterAttrFontSizeArea");
    this.attrFontArea.appendChild(e);
    d = Entry.createElement("div");
    d.addClass("painterAttrFontSizeTop");
    e.appendChild(d);
    k = Entry.createElement("select", "entryPainterAttrFontSize");
    k.addClass("entryPlaygroundPainterAttrFontSize");
    k.size = "1";
    k.onchange = function(a) {
      b.font.size = a.target.value;
    };
    for (d = 20;72 >= d;d++) {
      c = Entry.createElement("option"), c.value = d, c.innerHTML = d, k.appendChild(c);
    }
    e.appendChild(k);
    e = Entry.createElement("div");
    e.addClass("entryPlaygroundPainterAttrFontStyleArea");
    this.attrFontArea.appendChild(e);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPainterAttrFontTop");
    e.appendChild(d);
    k = Entry.createElement("select", "entryPainterAttrFontStyle");
    k.addClass("entryPlaygroundPainterAttrFontStyle");
    k.size = "1";
    k.onchange = function(a) {
      b.font.style = a.target.value;
    };
    h = [{label:"\ubcf4\ud1b5", value:"normal"}, {label:"\uad75\uac8c", value:"bold"}, {label:"\uae30\uc6b8\uc784", value:"italic"}];
    for (d = 0;d < h.length;d++) {
      l = h[d], c = Entry.createElement("option"), c.value = l.value, c.innerHTML = l.label, k.appendChild(c);
    }
    e.appendChild(k);
    this.attrLineArea = Entry.createElement("div", "painterAttrLineStyle");
    this.attrLineArea.addClass("entryPlaygroundPainterAttrLineStyle");
    g.appendChild(this.attrLineArea);
    var t = Entry.createElement("div");
    t.addClass("entryPlaygroundPainterAttrLineStyleLine");
    this.attrLineArea.appendChild(t);
    var u = Entry.createElement("div");
    u.addClass("entryPlaygroundPaitnerAttrLineArea");
    this.attrLineArea.appendChild(u);
    d = Entry.createElement("div");
    d.addClass("entryPlaygroundPainterAttrLineStyleLine1");
    u.appendChild(d);
    d.value = "line";
    var v = Entry.createElement("div");
    v.addClass("painterAttrLineStyleBackgroundLine");
    t.bindOnClick(function(a) {
      u.removeClass("entryRemove");
    });
    u.blur = function(a) {
      this.addClass("entryRemove");
    };
    u.onmouseleave = function(a) {
      this.addClass("entryRemove");
    };
    d.bindOnClick(function(a) {
      this.attrLineArea.removeClass(t);
      this.attrLineArea.appendChild(v);
      this.attrLineArea.onchange(a);
      u.blur();
    });
    v.bindOnClick(function(a) {
      u.removeClass("entryRemove");
    });
    this.attrLineArea.onchange = function(a) {
      b.stroke.style = a.target.value;
    };
    u.blur();
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
  Entry.addEventListener("entryBlocklyMouseUp", this.mouseupBlock);
  Entry.addEventListener("hwChanged", this.updateHW);
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
    Blockly.inject(b, {path:".././", toolbox:c, trashcan:!0, blockmenu:this.blockMenuView_, mediaFilePath:Entry.mediaFilePath});
    Blockly.mainWorkspace.flyout_.hide();
    Blockly.mainWorkspace.blockMenu.hide();
    document.addEventListener("blocklyWorkspaceChange", this.syncObjectWithEvent, !1);
    this.blockMenu = Blockly.mainWorkspace.blockMenu;
    Entry.hw.banHW();
    return a;
  }
  if ("phone" == Entry.type) {
    return b = Entry.createElement("div", "entryCategory"), b.addClass("entryCategoryPhone"), a.appendChild(b), this.categoryView_ = b, c = Entry.createElement("ul", "entryCategoryList"), c.addClass("entryCategoryListPhone"), b.appendChild(c), this.categoryListView_ = c, b = this.createVariableView(), a.appendChild(b), this.variableView_ = b, b = Entry.createElement("div", "entryBlockly"), b.addClass("entryBlocklyPhone"), this.blocklyView_ = b, a.appendChild(b), c = Entry.parseTexttoXML("<xml></xml>"), 
    Blockly.inject(b, {path:".././", toolbox:c, trashcan:!0, mediaFilePath:Entry.mediaFilePath}), Blockly.mainWorkspace.flyout_.autoClose = !0, Blockly.mainWorkspace.flyout_.hide(), document.addEventListener("blocklyWorkspaceChange", this.syncObjectWithEvent, !1), this.blockMenu = Blockly.mainWorkspace.flyout_, Entry.hw.banHW(), a;
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
      var c = b.item.data("start_pos"), g = b.item.index();
      Entry.playground.movePicture(c, g);
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
      var c = b.item.data("start_pos"), g = b.item.index();
      Entry.playground.movePicture(c, g);
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
  for (var e = 0;e < Entry.fonts.length;e++) {
    var f = Entry.fonts[e], g = Entry.createElement("option");
    g.value = f.family;
    g.innerHTML = f.name;
    d.appendChild(g);
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
    Entry.playground.object.entity.toggleFontBold() ? h.src = Entry.mediaFilePath + "text_button_bold_true.png" : h.src = Entry.mediaFilePath + "text_button_bold_false.png";
  });
  var h = Entry.createElement("img", "entryPlaygroundText_boldImage");
  d.appendChild(h);
  h.src = Entry.mediaFilePath + "text_button_bold_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    var a = !Entry.playground.object.entity.getUnderLine() || !1;
    k.src = Entry.mediaFilePath + "text_button_underline_" + a + ".png";
    Entry.playground.object.entity.setUnderLine(a);
  });
  var k = Entry.createElement("img", "entryPlaygroundText_underlineImage");
  d.appendChild(k);
  k.src = Entry.mediaFilePath + "text_button_underline_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    Entry.playground.object.entity.toggleFontItalic() ? l.src = Entry.mediaFilePath + "text_button_italic_true.png" : l.src = Entry.mediaFilePath + "/text_button_italic_false.png";
  });
  var l = Entry.createElement("img", "entryPlaygroundText_italicImage");
  d.appendChild(l);
  l.src = Entry.mediaFilePath + "text_button_italic_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  d = Entry.createElement("a");
  c.appendChild(d);
  d.bindOnClick(function() {
    var a = !Entry.playground.object.entity.getStrike() || !1;
    Entry.playground.object.entity.setStrike(a);
    n.src = Entry.mediaFilePath + "text_button_strike_" + a + ".png";
  });
  var n = Entry.createElement("img", "entryPlaygroundText_strikeImage");
  d.appendChild(n);
  n.src = Entry.mediaFilePath + "text_button_strike_false.png";
  d = Entry.createElement("li");
  e.appendChild(d);
  c = Entry.createElement("a");
  d.appendChild(c);
  c.bindOnClick(function() {
    Entry.playground.toggleColourChooser("foreground");
  });
  d = Entry.createElement("img");
  c.appendChild(d);
  d.src = Entry.mediaFilePath + "text_button_color_false.png";
  c = Entry.createElement("li");
  e.appendChild(c);
  e = Entry.createElement("a");
  c.appendChild(e);
  e.bindOnClick(function() {
    Entry.playground.toggleColourChooser("background");
  });
  c = Entry.createElement("img");
  e.appendChild(c);
  c.src = Entry.mediaFilePath + "text_button_background_false.png";
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
    Entry.playground.object.setText(this.value);
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
    Entry.playground.object.setText(this.value);
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
  var m = Entry.createElement("div");
  m.addClass("entryPlaygroundFontSizeSlider");
  a.appendChild(m);
  var q = Entry.createElement("div");
  q.addClass("entryPlaygroundFontSizeIndicator");
  m.appendChild(q);
  this.fontSizeIndiciator = q;
  var r = Entry.createElement("div");
  r.addClass("entryPlaygroundFontSizeKnob");
  m.appendChild(r);
  this.fontSizeKnob = r;
  e = Entry.createElement("div");
  e.addClass("entryPlaygroundFontSizeLabel");
  e.innerHTML = "\uae00\uc790 \ud06c\uae30";
  a.appendChild(e);
  var t = !1, u = 0;
  r.onmousedown = function(a) {
    t = !0;
    u = $(m).offset().left;
  };
  document.addEventListener("mousemove", function(a) {
    t && (a = a.pageX - u, a = Math.max(a, 5), a = Math.min(a, 88), r.style.left = a + "px", a /= .88, q.style.width = a + "%", Entry.playground.object.entity.setFontSize(a));
  });
  document.addEventListener("mouseup", function(a) {
    t = !1;
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
  e.src = Entry.mediaFilePath + "text-linebreak-off-true.png";
  b.appendChild(e);
  this.linebreakOffImage = e;
  e = Entry.createElement("img");
  e.bindOnClick(function() {
    Entry.playground.toggleLineBreak(!0);
  });
  e.src = Entry.mediaFilePath + "text-linebreak-on-false.png";
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
      var c = b.item.data("start_pos"), g = b.item.index();
      Entry.playground.moveSound(c, g);
    }, axis:"y"});
    a.appendChild(b);
    this.soundListView_ = b;
  } else {
    "phone" == Entry.type && (b = Entry.createElement("div", "entryAddSound"), b.addClass("entryPlaygroundAddSoundPhone"), b.bindOnClick(function(a) {
      Entry.dispatchEvent("openSoundManager");
    }), c = Entry.createElement("div", "entryAddSoundInner"), c.addClass("entryPlaygroundAddSoundInnerPhone"), c.innerHTML = Lang.Workspace.sound_add, b.appendChild(c), a.appendChild(b), b = Entry.createElement("ul", "entrySoundList"), b.addClass("entryPlaygroundSoundListPhone"), $ && $(b).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), g = b.item.index();
      Entry.playground.moveSound(c, g);
    }, axis:"y"}), a.appendChild(b), this.soundListView_ = b);
  }
};
Entry.Playground.prototype.injectObject = function(a) {
  if (!a) {
    this.changeViewMode("code"), this.object = null;
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
  var b = 0, c = 0, d = null;
  $(a.script).children("block").each(function(a) {
    var e = Number($(this).attr("x")), f = Number($(this).attr("y"));
    0 == a && (b = e, c = f, d = this);
    e < b && (b = e, d = this);
    f < c && (varyTopY = f);
  });
  if (null != d) {
    var e = Number($(d).attr("x")), a = Number($(d).attr("y")), f = 170;
    a == c && (f = 20);
    var g = Blockly.mainWorkspace.getMetrics(), e = Math.abs(e - g.contentLeft) - 20, a = Math.abs(a - g.contentTop) - f;
    this.adjustScroll(0, 0);
    Blockly.mainWorkspace.scrollbar.set(e, a);
  }
};
Entry.Playground.prototype.adjustScroll = function(a, b) {
  var c = Blockly.mainWorkspace.scrollbar.vScroll;
  Blockly.mainWorkspace.scrollbar.hScroll.svgGroup_.setAttribute("opacity", "1");
  c.svgGroup_.setAttribute("opacity", "1");
  if (Blockly.mainWorkspace.getMetrics()) {
    Blockly.removeAllRanges();
    var c = Blockly.mainWorkspace.getMetrics(), d, e;
    d = Math.min(a, -c.contentLeft);
    e = Math.min(b, -c.contentTop);
    d = Math.max(d, c.viewWidth - c.contentLeft - c.contentWidth);
    e = Math.max(e, c.viewHeight - c.contentTop - c.contentHeight);
    Blockly.mainWorkspace.scrollbar.set(-d - c.contentLeft, -e - c.contentTop);
  }
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
    } else {
      Entry.dispatchEvent("pictureClear");
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
  var b = Entry.container.getPictureElement(a.id), c = $(b);
  if (b) {
    a.view = b;
    b.picture = a;
    b = c.find("#t_" + a.id)[0];
    if (a.fileurl) {
      b.style.backgroundImage = 'url("' + a.fileurl + '")';
    } else {
      var d = a.filename;
      b.style.backgroundImage = 'url("/uploads/' + d.substring(0, 2) + "/" + d.substring(2, 4) + "/thumb/" + d + '.png")';
    }
    c.find("#s_" + a.id)[0].innerHTML = a.dimension.width + " X " + a.dimension.height;
  }
  Entry.container.setPicture(a);
};
Entry.Playground.prototype.clonePicture = function(a) {
  a = Entry.playground.object.getPicture(a);
  this.addPicture(a, !0);
};
Entry.Playground.prototype.selectPicture = function(a) {
  for (var b = this.object.pictures, c = 0, d = b.length;c < d;c++) {
    var e = b[c];
    e.id === a.id ? e.view.addClass("entryPictureSelected") : e.view.removeClass("entryPictureSelected");
  }
  var f;
  a && a.id && (f = Entry.container.selectPicture(a.id));
  this.object.id === f && Entry.dispatchEvent("pictureSelected", a);
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
      $("#entryPlaygroundText_boldImage").attr("src", Entry.mediaFilePath + "text_button_bold_" + a + ".png");
      a = -1 < Entry.playground.object.entity.font.indexOf("italic") || !1;
      $("#entryPlaygroundText_italicImage").attr("src", Entry.mediaFilePath + "text_button_italic_" + a + ".png");
    }
    a = Entry.playground.object.entity.getUnderLine() || !1;
    $("#entryPlaygroundText_underlineImage").attr("src", Entry.mediaFilePath + "text_button_underline_" + a + ".png");
    a = Entry.playground.object.entity.getStrike() || !1;
    $("#entryPlaygroundText_strikeImage").attr("src", Entry.mediaFilePath + "text_button_strike_" + a + ".png");
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
  Entry.stateManager && Entry.stateManager.addCommand("edit block", a, a.restoreBlock, a.object, a.object.getScriptText());
};
Entry.Playground.prototype.mouseupBlock = function() {
  if (Entry.reporter) {
    var a = Entry.playground, b = a.object;
    Entry.reporter.report(new Entry.State("edit block mouseup", a, a.restoreBlock, b, b.getScriptText()));
  }
};
Entry.Playground.prototype.restoreBlock = function(a, b) {
  Entry.container.selectObject(a.id);
  Entry.stateManager && Entry.stateManager.addCommand("restore block", this, this.restoreBlock, this.object, this.object.getScriptText());
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
        var f = [];
        for (d = 0;d < f.length;d++) {
          e = f[d].attributes[0].value, "string" == typeof a && e == a || "number" == typeof a && a == d ? c[d].hasClass("entrySelectedCategory") ? (this.blockMenu.hide(), c[d].removeClass("entrySelectedCategory"), this.menuInjected = !0, this.selectedMenu = e) : (c[d].addClass("entrySelectedCategory"), this.blockMenu.show(f[d].childNodes), this.menuInjected = !0, delete this.selctedMenu) : c[d].removeClass("entrySelectedCategory");
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
Entry.Playground.prototype.refreshPlayground = function() {
  Entry.playground && Entry.playground.view_ && (this.injectPicture(), this.injectSound());
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
      Entry.playground.reloadPlayground();
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
  Entry.Utils.disableContextmenu(a.view);
  $(a.view).on("contextmenu", function() {
    Entry.ContextMenu.show([{text:Lang.Workspace.context_rename, callback:function() {
      f.focus();
    }}, {text:Lang.Workspace.context_duplicate, callback:function() {
      Entry.playground.clonePicture(a.id);
    }}, {text:Lang.Workspace.context_remove, callback:function() {
      Entry.playground.object.removePicture(a.id) ? (Entry.removeElement(c), Entry.toast.success(Lang.Workspace.shape_remove_ok, a.name + " " + Lang.Workspace.shape_remove_ok_msg)) : Entry.toast.alert(Lang.Workspace.shape_remove_fail, Lang.Workspace.shape_remove_fail_msg);
    }}, {divider:!0}, {text:Lang.Workspace.context_download, callback:function() {
      a.fileurl ? window.open(a.fileurl) : window.open("/api/sprite/download/image/" + encodeURIComponent(a.filename) + "/" + encodeURIComponent(a.name) + ".png");
    }}], "workspace-contextmenu");
  });
  var d = Entry.createElement("div");
  d.addClass("entryPlaygroundPictureOrder");
  c.orderHolder = d;
  c.appendChild(d);
  d = Entry.createElement("div", "t_" + a.id);
  d.addClass("entryPlaygroundPictureThumbnail");
  if (a.fileurl) {
    d.style.backgroundImage = 'url("' + a.fileurl + '")';
  } else {
    var e = a.filename;
    d.style.backgroundImage = 'url("/uploads/' + e.substring(0, 2) + "/" + e.substring(2, 4) + "/thumb/" + e + '.png")';
  }
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
  Entry.Utils.disableContextmenu(a.view);
  $(a.view).on("contextmenu", function() {
    Entry.ContextMenu.show([{text:Lang.Workspace.context_rename, callback:function() {
      g.focus();
    }}, {text:Lang.Workspace.context_duplicate, callback:function() {
      Entry.playground.addSound(a, !0);
    }}, {text:Lang.Workspace.context_remove, callback:function() {
      Entry.playground.object.removeSound(a.id) ? (Entry.removeElement(b), Entry.toast.success(Lang.Workspace.sound_remove_ok, a.name + " " + Lang.Workspace.sound_remove_ok_msg)) : Entry.toast.alert(Lang.Workspace.sound_remove_fail, "");
      Entry.removeElement(b);
    }}], "workspace-contextmenu");
  });
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
  var g = Entry.createElement("input");
  g.addClass("entryPlaygroundSoundName");
  g.sound = a;
  g.value = a.name;
  var h = document.getElementsByClassName("entryPlaygroundSoundName");
  g.onblur = function() {
    if ("" === this.value) {
      alert("\uc774\ub984\uc744 \uc785\ub825\ud558\uc5ec \uc8fc\uc138\uc694."), this.focus();
    } else {
      for (var a = 0, b = 0;b < h.length;b++) {
        if (h[b].value == g.value && (a += 1, 1 < a)) {
          alert("\uc774\ub984\uc774 \uc911\ubcf5 \ub418\uc5c8\uc2b5\ub2c8\ub2e4.");
          this.focus();
          return;
        }
      }
      this.sound.name = this.value;
    }
  };
  g.onkeypress = function(a) {
    13 == a.keyCode && this.blur();
  };
  b.appendChild(g);
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
  if (a.blockMenu) {
    var b = Entry.hw;
    b && b.connected ? (a.blockMenu.unbanClass("arduinoConnected"), a.blockMenu.banClass("arduinoDisconnected"), b.banHW(), b.hwModule && a.blockMenu.unbanClass(b.hwModule.name)) : (a.blockMenu.banClass("arduinoConnected"), a.blockMenu.unbanClass("arduinoDisconnected"), Entry.hw.banHW());
    a.object && a.selectMenu(a.lastSelector, !0);
  }
};
Entry.Playground.prototype.toggleLineBreak = function(a) {
  this.object && "textBox" == this.object.objectType && (a ? (Entry.playground.object.entity.setLineBreak(!0), $(".entryPlayground_textArea").css("display", "block"), $(".entryPlayground_textBox").css("display", "none"), this.linebreakOffImage.src = Entry.mediaFilePath + "text-linebreak-off-false.png", this.linebreakOnImage.src = Entry.mediaFilePath + "text-linebreak-on-true.png", this.fontSizeWrapper.removeClass("entryHide")) : (Entry.playground.object.entity.setLineBreak(!1), $(".entryPlayground_textArea").css("display", 
  "none"), $(".entryPlayground_textBox").css("display", "block"), this.linebreakOffImage.src = Entry.mediaFilePath + "text-linebreak-off-true.png", this.linebreakOnImage.src = Entry.mediaFilePath + "text-linebreak-on-false.png", this.fontSizeWrapper.addClass("entryHide")));
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
Entry.getStartProject = function(a) {
  return {category:"\uae30\ud0c0", scenes:[{name:"\uc7a5\uba74 1", id:"7dwq"}], variables:[{name:"\ucd08\uc2dc\uacc4", id:"brih", visible:!1, value:"0", variableType:"timer", x:150, y:-70, array:[], object:null, isCloud:!1}, {name:"\ub300\ub2f5", id:"1vu8", visible:!1, value:"0", variableType:"answer", x:150, y:-100, array:[], object:null, isCloud:!1}], objects:[{id:"7y0y", name:"\uc5d4\ud2b8\ub9ac\ubd07", script:'<xml><block type="when_run_button_click" x="136" y="47"><next><block type="repeat_basic"><value name="VALUE"><block type="number"><field name="NUM">10</field></block></value><statement name="DO"><block type="move_direction"><value name="VALUE"><block type="number"><field name="NUM">10</field></block></value></block></statement></block></next></block></xml>', 
  selectedPictureId:"vx80", objectType:"sprite", rotateMethod:"free", scene:"7dwq", sprite:{sounds:[{duration:1.3, ext:".mp3", id:"8el5", fileurl:a + "media/bark.mp3", name:"\uac15\uc544\uc9c0 \uc9d6\ub294\uc18c\ub9ac"}], pictures:[{id:"vx80", fileurl:a + "media/entrybot1.png", name:"\uc5d4\ud2b8\ub9ac\ubd07_\uac77\uae301", scale:100, dimension:{width:284, height:350}}, {id:"4t48", fileurl:a + "media/entrybot2.png", name:"\uc5d4\ud2b8\ub9ac\ubd07_\uac77\uae302", scale:100, dimension:{width:284, height:350}}]}, 
  entity:{x:0, y:0, regX:142, regY:175, scaleX:.3154574132492113, scaleY:.3154574132492113, rotation:0, direction:90, width:284, height:350, visible:!0}, lock:!1, active:!0}], speed:60};
};
Entry.Reporter = function(a) {
  this.projectId = this.userId = null;
  this.isRealTime = a;
  this.activities = [];
};
Entry.Reporter.prototype.start = function(a, b, c) {
  this.isRealTime && (-1 < window.location.href.indexOf("localhost") ? this.io = io("localhost:7000") : this.io = io("play04.play-entry.com:7000"), this.io.emit("activity", {message:"start", userId:b, projectId:a, time:c}));
  this.userId = b;
  this.projectId = a;
};
Entry.Reporter.prototype.report = function(a) {
  if (!this.isRealTime || this.io) {
    var b = [], c;
    for (c in a.params) {
      var d = a.params[c];
      "object" !== typeof d ? b.push(d) : d.id && b.push(d.id);
    }
    a = {message:a.message, userId:this.userId, projectId:this.projectId, time:a.time, params:b};
    this.isRealTime ? this.io.emit("activity", a) : this.activities.push(a);
  }
};
Entry.Scene = function() {
  var a = this;
  this.scenes_ = [];
  this.selectedScene = null;
  this.maxCount = 20;
  $(window).on("resize", function(b) {
    a.resize();
  });
};
Entry.Scene.viewBasicWidth = 70;
Entry.Scene.prototype.generateView = function(a, b) {
  var c = this;
  this.view_ = a;
  this.view_.addClass("entryScene");
  if (!b || "workspace" == b) {
    this.view_.addClass("entrySceneWorkspace");
    $(this.view_).on("mousedown", function(a) {
      var b = $(this).offset(), d = $(window), h = a.pageX - b.left + d.scrollLeft();
      a = a.pageY - b.top + d.scrollTop();
      a = 40 - a;
      b = -40 / 55;
      d = $(c.selectedScene.view).find(".entrySceneRemoveButtonCoverWorkspace").offset().left;
      !(h < d || h > d + 55) && a > 40 + b * (h - d) && (h = c.getNextScene()) && (h = $(h.view), $(document).trigger("mouseup"), h.trigger("mousedown"));
    });
    var d = Entry.createElement("ul");
    d.addClass("entrySceneListWorkspace");
    Entry.sceneEditable && $ && $(d).sortable({start:function(a, b) {
      b.item.data("start_pos", b.item.index());
      $(b.item[0]).clone(!0);
    }, stop:function(a, b) {
      var c = b.item.data("start_pos"), d = b.item.index();
      Entry.scene.moveScene(c, d);
    }, axis:"x", tolerance:"pointer"});
    this.view_.appendChild(d);
    this.listView_ = d;
    Entry.sceneEditable && (d = Entry.createElement("span"), d.addClass("entrySceneElementWorkspace"), d.addClass("entrySceneAddButtonWorkspace"), d.bindOnClick(function(a) {
      Entry.engine.isState("run") || Entry.scene.addScene();
    }), this.view_.appendChild(d), this.addButton_ = d);
  }
};
Entry.Scene.prototype.generateElement = function(a) {
  var b = this, c = Entry.createElement("li", a.id);
  c.addClass("entrySceneElementWorkspace");
  c.addClass("entrySceneButtonWorkspace");
  c.addClass("minValue");
  $(c).on("mousedown", function(b) {
    Entry.engine.isState("run") ? b.preventDefault() : (document.elementsFromPoint(b.pageX, b.pageY), Entry.scene.selectScene(a));
  });
  var d = Entry.createElement("input");
  d.addClass("entrySceneFieldWorkspace");
  d.value = a.name;
  Entry.sceneEditable || (d.disabled = "disabled");
  var e = Entry.createElement("span");
  e.addClass("entrySceneLeftWorkspace");
  c.appendChild(e);
  var f = Entry.createElement("span");
  f.addClass("entrySceneInputCover");
  f.style.width = Entry.computeInputWidth(a.name);
  c.appendChild(f);
  a.inputWrapper = f;
  d.onkeyup = function(c) {
    c = c.keyCode;
    Entry.isArrowOrBackspace(c) || (a.name = this.value, f.style.width = Entry.computeInputWidth(a.name), b.resize(), 13 == c && this.blur(), 9 < this.value.length && (this.value = this.value.substring(0, 10), this.blur()));
  };
  d.onblur = function(b) {
    d.value = this.value;
    a.name = this.value;
    f.style.width = Entry.computeInputWidth(a.name);
  };
  f.appendChild(d);
  e = Entry.createElement("span");
  e.addClass("entrySceneRemoveButtonCoverWorkspace");
  c.appendChild(e);
  if (Entry.sceneEditable) {
    var g = Entry.createElement("button");
    g.addClass("entrySceneRemoveButtonWorkspace");
    g.innerHTML = "x";
    g.scene = a;
    g.bindOnClick(function(a) {
      a.stopPropagation();
      Entry.engine.isState("run") || confirm(Lang.Workspace.will_you_delete_scene) && Entry.scene.removeScene(this.scene);
    });
    e.appendChild(g);
  }
  Entry.Utils.disableContextmenu(c);
  $(c).on("contextmenu", function() {
    Entry.ContextMenu.show([{text:Lang.Workspace.duplicate_scene, callback:function() {
      Entry.scene.cloneScene(a);
    }}], "workspace-contextmenu");
  });
  return a.view = c;
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
  this.resize();
};
Entry.Scene.prototype.addScenes = function(a) {
  if ((this.scenes_ = a) && 0 !== a.length) {
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
  void 0 === a && (a = this.createScene());
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
    Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.Scene_delete_error, !1);
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
  this.selectedScene && this.selectedScene.id == a.id || (Entry.engine.isState("run") && Entry.container.resetSceneDuringRun(), this.selectedScene = a, Entry.container.setCurrentObjects(), Entry.stage.objectContainers && 0 !== Entry.stage.objectContainers.length && Entry.stage.selectObjectContainer(a), (a = Entry.container.getCurrentObjects()[0]) && "minimize" != Entry.type ? (Entry.container.selectObject(a.id), Entry.playground.refreshPlayground()) : (Entry.stage.selectObject(null), Entry.playground.flushPlayground(), 
  Entry.variableContainer.updateList()), Entry.container.listView_ || Entry.stage.sortZorder(), Entry.container.updateListView(), this.updateView());
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
    Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.Scene_add_error, !1);
  } else {
    var b = {name:a.name + Lang.Workspace.replica_of_object, id:Entry.generateHash()};
    this.generateElement(b);
    this.addScene(b);
    a = Entry.container.getSceneObjects(a);
    for (var c = a.length - 1;0 <= c;c--) {
      Entry.container.addCloneObject(a[c], b.id);
    }
  }
};
Entry.Scene.prototype.resize = function() {
  var a = this.getScenes(), b = this.selectedScene, c = a[0];
  if (0 !== a.length && c) {
    var d = $(c.view).offset().left, c = parseFloat($(b.view).css("margin-left")), e = $(this.view_).width() - d, f = 0, g;
    for (g in a) {
      var d = a[g], h = d.view;
      h.addClass("minValue");
      $(h).removeProp("style");
      $(d.inputWrapper).width(Entry.computeInputWidth(d.name));
      h = $(h);
      f = f + h.width() + c;
    }
    if (f > e) {
      for (g in e -= $(b.view).width(), c = e / (a.length - 1) - (Entry.Scene.viewBasicWidth + c), a) {
        d = a[g], b.id != d.id ? (d.view.removeClass("minValue"), $(d.inputWrapper).width(c)) : d.view.addClass("minValue");
      }
    }
  }
};
Entry.Scene.prototype.getNextScene = function() {
  var a = this.getScenes();
  return a[a.indexOf(this.selectedScene) + 1];
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
  this.previousScript && 0 !== b && (c.previousScript = this.previousScript.clone(a, 1), c.previousScript.previousScript = this);
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
      if (b) {
        var e = Entry.container;
        e.setInputValue(b);
        e.inputValue.complete = !0;
      }
    } catch (f) {
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
    for (var e = a[d], f = e.entity, e = e.clonedEntities, g = 0, h = e.length;g < h;g++) {
      e[g].shape && b.setChildIndex(e[g].shape, c++), b.setChildIndex(e[g].object, c++);
    }
    f.shape && b.setChildIndex(f.shape, c++);
    b.setChildIndex(f.object, c++);
  }
};
Entry.Stage.prototype.initCoordinator = function() {
  var a = new createjs.Container, b = new createjs.Bitmap(Entry.mediaFilePath + "workspace_coordinate_v1.png");
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
      var b, c;
      if ("textBox" == a.type) {
        if (a.getLineBreak()) {
          b = a.regX * a.scaleX, c = -a.regY * a.scaleY;
        } else {
          var d = a.getTextAlign();
          c = -a.regY * a.scaleY;
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
  b.src = Entry.mediaFilePath + "media/bound.png";
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
  b.src = Entry.mediaFilePath + "confirm_button.png";
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
  if (a && 0 !== a.length) {
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
    a.shiftKey && (b = 1);
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
    Entry.dispatchEvent("saveLocalStorageProject");
  }
};
Entry.StateManager.prototype.cancelLastCommand = function() {
  this.canUndo() && (this.undoStack_.pop(), this.updateView(), Entry.dispatchEvent("saveLocalStorageProject"));
};
Entry.StateManager.prototype.undo = function() {
  if (this.canUndo() && !this.isRestoring()) {
    this.addActivity("undo");
    this.startRestore();
    var a = this.undoStack_.pop();
    a.func.apply(a.caller, a.params);
    this.updateView();
    this.endRestore();
    Entry.dispatchEvent("saveLocalStorageProject");
  }
};
Entry.StateManager.prototype.redo = function() {
  if (this.canRedo() && !this.isRestoring()) {
    this.addActivity("redo");
    var a = this.redoStack_.pop();
    a.func.apply(a.caller, a.params);
    this.updateView();
    Entry.dispatchEvent("saveLocalStorageProject");
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
  return 0 === this.undoStack_.length || this.undoStack_[this.undoStack_.length - 1].stamp == this.stamp && "string" == typeof this.stamp;
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
Entry.Toast.prototype.warning = function(a, b, c) {
  var d = Entry.createElement("div", "entryToast");
  d.addClass("entryToast");
  d.addClass("entryToastWarning");
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
Entry.ContextMenu = {};
(function(a) {
  a.createDom = function() {
    this.dom = Entry.Dom("ul", {id:"entry-contextmenu", parent:$("body")});
    Entry.Utils.disableContextmenu(this.dom);
    Entry.documentMousedown.attach(this, function() {
      this.hide();
    });
  };
  a.show = function(a, c) {
    this.dom || this.createDom();
    if (0 !== a.length) {
      void 0 !== c && (this._className = c, this.dom.addClass(c));
      var d = this.dom;
      d.empty();
      for (var e = 0, f = a.length;e < f;e++) {
        var g = a[e], h = g.text, k = !1 !== g.enable, l = Entry.Dom("li", {class:k ? "menuAble" : "menuDisable", parent:d});
        l.text(h);
        k && g.callback && function(a, b) {
          a.mousedown(function(a) {
            a.preventDefault();
            b();
          });
        }(l, g.callback);
      }
      d.removeClass("entryRemove");
      this.position(Entry.mouseCoordinate);
    }
  };
  a.position = function(a) {
    var c = this.dom;
    c.css({left:0, top:0});
    var d = c.width(), e = c.height(), f = $(window), g = f.width(), f = f.height();
    a.x + d > g && (a.x -= d + 3);
    a.y + e > f && (a.y -= e);
    c.css({left:a.x, top:a.y});
  };
  a.hide = function() {
    this.dom.empty();
    this.dom.addClass("entryRemove");
    this._className && (this.dom.removeClass(this._className), delete this._className);
  };
})(Entry.ContextMenu);
Entry.STATIC = {OBJECT:0, ENTITY:1, SPRITE:2, SOUND:3, VARIABLE:4, FUNCTION:5, SCENE:6, MESSAGE:7, BLOCK_MODEL:8, BLOCK_RENDER_MODEL:9, BOX_MODEL:10, THREAD_MODEL:11, DRAG_INSTANCE:12, BLOCK_STATIC:0, BLOCK_MOVE:1, BLOCK_FOLLOW:2, RETURN:0, CONTINUE:1};
Entry.Utils = {};
Entry.overridePrototype = function() {
  Number.prototype.mod = function(a) {
    return (this % a + a) % a;
  };
};
Entry.Utils.generateId = function() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4);
};
Entry.Utils.intersectArray = function(a, b) {
  for (var c = [], d = 0;d < a.length;d++) {
    for (var e = 0;e < b.length;e++) {
      if (a[d] == b[e]) {
        c.push(a[d]);
        break;
      }
    }
  }
  return c;
};
Entry.Utils.isPointInMatrix = function(a, b, c) {
  c = void 0 === c ? 0 : c;
  var d = a.offsetX ? a.x + a.offsetX : a.x, e = a.offsetY ? a.y + a.offsety : a.y;
  return d - c <= b.x && d + a.width + c >= b.x && e - c <= b.y && e + a.height + c >= b.y;
};
Entry.Utils.colorDarken = function(a, b) {
  var c, d, e;
  7 === a.length ? (c = parseInt(a.substr(1, 2), 16), d = parseInt(a.substr(3, 2), 16), e = parseInt(a.substr(5, 2), 16)) : (c = parseInt(a.substr(1, 2), 16), d = parseInt(a.substr(2, 2), 16), e = parseInt(a.substr(3, 2), 16));
  b = void 0 === b ? .7 : b;
  c = Math.floor(c * b).toString(16);
  d = Math.floor(d * b).toString(16);
  e = Math.floor(e * b).toString(16);
  return "#" + c + d + e;
};
Entry.Utils.bindGlobalEvent = function(a) {
  void 0 === a && (a = ["resize", "mousedown", "mousemove", "keydown", "keyup"]);
  !Entry.windowReszied && -1 < a.indexOf("resize") && (Entry.windowResized = new Entry.Event(window), $(window).on("resize", function(a) {
    Entry.windowResized.notify(a);
  }));
  !Entry.documentMousedown && -1 < a.indexOf("mousedown") && (Entry.documentMousedown = new Entry.Event(window), $(document).on("mousedown", function(a) {
    Entry.documentMousedown.notify(a);
  }));
  !Entry.documentMousemove && -1 < a.indexOf("mousemove") && (Entry.mouseCoordinate = {}, Entry.documentMousemove = new Entry.Event(window), $(document).on("mousemove", function(a) {
    Entry.documentMousemove.notify(a);
    Entry.mouseCoordinate.x = a.clientX;
    Entry.mouseCoordinate.y = a.clientY;
  }));
  !Entry.keyPressed && -1 < a.indexOf("keydown") && (Entry.pressedKeys = [], Entry.keyPressed = new Entry.Event(window), $(document).on("keydown", function(a) {
    var c = a.keyCode;
    0 > Entry.pressedKeys.indexOf(c) && Entry.pressedKeys.push(c);
    Entry.keyPressed.notify(a);
  }));
  !Entry.keyUpped && -1 < a.indexOf("keyup") && (Entry.keyUpped = new Entry.Event(window), $(document).on("keyup", function(a) {
    var c = Entry.pressedKeys.indexOf(a.keyCode);
    -1 < c && Entry.pressedKeys.splice(c, 1);
    Entry.keyUpped.notify(a);
  }));
};
Entry.Utils.makeActivityReporter = function() {
  Entry.activityReporter = new Entry.ActivityReporter;
  return Entry.activityReporter;
};
Entry.Utils.initEntryEvent_ = function() {
  Entry.events_ || (Entry.events_ = []);
};
Entry.sampleColours = [];
Entry.assert = function(a, b) {
  if (!a) {
    throw Error(b || "Assert failed");
  }
};
Entry.parseTexttoXML = function(a) {
  var b;
  window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)) : b = (new DOMParser).parseFromString(a, "text/xml");
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
  this.events_ || (this.events_ = {});
  this.events_[a] || (this.events_[a] = []);
  b instanceof Function && this.events_[a].push(b);
  return !0;
};
Entry.dispatchEvent = function(a, b) {
  this.events_ || (this.events_ = {});
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
  this.events_ && this.events_[a] && delete this.events_[a];
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
  if (!b) {
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
  b.innerHTML = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  document.body.appendChild(b);
  a = b.offsetWidth;
  document.body.removeChild(b);
  return Number(a + 10) + "px";
};
Entry.isArrowOrBackspace = function(a) {
  return -1 < [37, 38, 39, 40, 8].indexOf(a);
};
Entry.hexStringToBin = function(a) {
  for (var b = [], c = 0;c < a.length - 1;c += 2) {
    b.push(parseInt(a.substr(c, 2), 16));
  }
  return String.fromCharCode.apply(String, b);
};
Entry.findObjsByKey = function(a, b, c) {
  for (var d = [], e = 0;e < a.length;e++) {
    a[e][b] == c && d.push(a[e]);
  }
  return d;
};
Entry.factorials = [];
Entry.factorial = function(a) {
  return 0 === a || 1 == a ? 1 : 0 < Entry.factorials[a] ? Entry.factorials[a] : Entry.factorials[a] = Entry.factorial(a - 1) * a;
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
  return a * Math.PI / 180;
};
Entry.toDegrees = function(a) {
  return 180 * a / Math.PI;
};
Entry.getPicturesJSON = function(a) {
  for (var b = [], c = 0, d = a.length;c < d;c++) {
    var e = a[c], f = {};
    f._id = e._id;
    f.id = e.id;
    f.dimension = e.dimension;
    f.filename = e.filename;
    f.fileurl = e.fileurl;
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
    f.fileurl = e.fileurl;
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
Entry.setCloneBrush = function(a, b) {
  var c = new createjs.Graphics;
  c.thickness = b.thickness;
  c.rgb = b.rgb;
  c.opacity = b.opacity;
  c.setStrokeStyle(c.thickness);
  c.beginStroke("rgba(" + c.rgb.r + "," + c.rgb.g + "," + c.rgb.b + "," + c.opacity / 100 + ")");
  var d = new createjs.Shape(c);
  Entry.stage.selectedObjectContainer.addChild(d);
  a.brush && (a.brush = null);
  a.brush = c;
  a.shape && (a.shape = null);
  a.shape = d;
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
  for (var d = 0, e = Entry.getStringIndex(a), f = 0, g = b.length;f < g;f++) {
    var h = Entry.getStringIndex(b[f][c]);
    e.string === h.string && h.index > d && (d = h.index);
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
Entry.isEmpty = function(a) {
  if (!a) {
    return !0;
  }
  for (var b in a) {
    if (a.hasOwnProperty(b)) {
      return !1;
    }
  }
  return !0;
};
Entry.Utils.disableContextmenu = function(a) {
  if (a) {
    $(a).on("contextmenu", function(a) {
      a.stopPropagation();
      a.preventDefault();
      return !1;
    });
  }
};
Entry.Utils.isRightButton = function(a) {
  return 2 == a.button || a.ctrlKey;
};
Entry.Utils.COLLISION = {NONE:0, UP:1, RIGHT:2, LEFT:3, DOWN:4};
Entry.Model = function(a, b) {
  var c = Entry.Model;
  c.generateSchema(a);
  c.generateSetter(a);
  c.generateObserve(a);
  (void 0 === b || b) && Object.seal(a);
  return a;
};
(function(a) {
  a.generateSchema = function(a) {
    var c = a.schema;
    if (void 0 !== c) {
      c = JSON.parse(JSON.stringify(c));
      a.data = {};
      for (var d in c) {
        (function(d) {
          a.data[d] = c[d];
          Object.defineProperty(a, d, {get:function() {
            return a.data[d];
          }});
        })(d);
      }
      a._toJSON = this._toJSON;
    }
  };
  a.generateSetter = function(a) {
    a.set = this.set;
  };
  a.set = function(a, c) {
    var d = {}, e;
    for (e in this.data) {
      void 0 !== a[e] && (a[e] === this.data[e] ? delete a[e] : (d[e] = this.data[e], this.data[e] = a[e]));
    }
    c || this.notify(Object.keys(a), d);
  };
  a.generateObserve = function(a) {
    a.observers = [];
    a.observe = this.observe;
    a.unobserve = this.unobserve;
    a.notify = this.notify;
  };
  a.observe = function(a, c, d, e) {
    d = new Entry.Observer(this.observers, a, c, d);
    if (!1 !== e) {
      a[c]([]);
    }
    return d;
  };
  a.unobserve = function(a) {
    a.destroy();
  };
  a.notify = function(a, c) {
    "string" === typeof a && (a = [a]);
    var d = this;
    d.observers.map(function(e) {
      var f = a;
      void 0 !== e.attrs && (f = Entry.Utils.intersectArray(e.attrs, a));
      if (f.length) {
        e.object[e.funcName](f.map(function(a) {
          return {name:a, object:d, oldValue:c[a]};
        }));
      }
    });
  };
  a._toJSON = function() {
    var a = {}, c;
    for (c in this.data) {
      a[c] = this.data[c];
    }
    return a;
  };
})(Entry.Model);
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
Entry.Func.FIELD_BLOCK = '<xml><block type="function_field_label"></block><block type="function_field_string"><value name="PARAM"><block type="function_param_string"><mutation hashid="#1"/></block></value></block><block type="function_field_boolean"><value name="PARAM"><block type="function_param_boolean"><mutation hashid="#2"/></block></value></block></xml>';
Entry.Func.fieldBlocks = Entry.nodeListToArray(Blockly.Xml.textToDom(Entry.Func.FIELD_BLOCK).childNodes);
Entry.Func.CREATE_BLOCK = '<xml><block type="function_create" deletable="false" x="28" y="28"></block></xml>';
Entry.Func.edit = function(a) {
  this.srcFName = "";
  for (var b = $(a.content.innerHTML).find("field"), c = 0;c < b.length;c++) {
    "NAME" === $(b[c]).attr("name") && (this.srcFName += $(b[c]).text(), this.srcFName += " ");
  }
  this.srcFName = this.srcFName.trim();
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
  var a = "";
  this.targetFunc.content = Blockly.Xml.workspaceToDom(this.workspace);
  this.targetFunc.generateBlock(!0);
  Entry.variableContainer.saveFunction(this.targetFunc);
  for (var b = $(this.targetFunc.content.innerHTML).find("field"), c = 0;c < b.length;c++) {
    "NAME" === $(b[c]).attr("name") && (a += $(b[c]).text(), a += " ");
  }
  a = a.trim();
  this.syncFuncName(a);
  this.cancelEdit();
};
Entry.Func.syncFuncName = function(a) {
  var b = 0, c = [], c = a.split(" "), d = "";
  a = [];
  a = Blockly.mainWorkspace.getAllBlocks();
  for (var e = 0;e < a.length;e++) {
    var f = a[e];
    if ("function_general" === f.type) {
      for (var g = [], g = f.inputList, h = 0;h < g.length;h++) {
        f = g[h], 0 < f.fieldRow.length && f.fieldRow[0] instanceof Blockly.FieldLabel && void 0 != f.fieldRow[0].text_ && (d += f.fieldRow[0].text_, d += " ");
      }
      d = d.trim();
      if (d === this.srcFName && this.srcFName.split(" ").length == c.length) {
        for (d = 0;d < g.length;d++) {
          if (f = g[d], 0 < f.fieldRow.length && f.fieldRow[0] instanceof Blockly.FieldLabel && void 0 != f.fieldRow[0].text_) {
            if (void 0 === c[b]) {
              g.splice(d, 1);
              break;
            } else {
              f.fieldRow[0].text_ = c[b];
            }
            b++;
          }
        }
      }
      d = "";
      b = 0;
    }
  }
  b = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, b);
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
    var a = Entry.Func.targetFunc, b = Blockly.Xml.workspaceToDom(Entry.Func.workspace), c = b.getElementsByClassName("function_general"), d = a.id, e, c = Entry.nodeListToArray(c), f = [], g = {};
    c.map(function(a) {
      var b = a.getElementsByTagName("mutation")[0].getAttribute("hashid");
      b == d ? f.push(a) : (g[b] || (g[b] = []), g[b].push(a));
    });
    f.map(function(a) {
      e = Entry.Func.generateWsBlock(b, Blockly.Xml.workspaceToDom(Entry.Func.workspace), d).block;
      for (var c = [], f = !1;a.firstChild;) {
        var g = a.firstChild, h = g.tagName;
        if (f || "NEXT" == h) {
          f = !0, c.push(g);
        }
        a.removeChild(g);
      }
      for (;e.firstChild;) {
        a.appendChild(e.firstChild);
      }
      for (;c.length;) {
        a.appendChild(c.shift());
      }
    });
    for (var h in g) {
      var a = g[h], k = Entry.variableContainer.getFunction(h).content;
      a.map(function(a) {
        e = Entry.Func.generateWsBlock(b, k, h).block;
        for (var c = [], d = !1;a.firstChild;) {
          var f = a.firstChild, g = f.tagName;
          if (d || "NEXT" == g) {
            d = !0, c.push(f);
          }
          a.removeChild(f);
        }
        for (;e.firstChild;) {
          a.appendChild(e.firstChild);
        }
        for (;c.length;) {
          a.appendChild(c.shift());
        }
      });
    }
    Entry.Func.workspace.clear();
    Blockly.Xml.domToWorkspace(Entry.Func.workspace, b);
  }
};
Entry.Func.prototype.edit = function() {
  Entry.Func.isEdit || (Entry.Func.isEdit = !0, Entry.Func.svg ? this.parentView.appendChild(this.svg) : Entry.Func.initEditView());
};
Entry.Func.generateBlock = function(a, b, c) {
  b = Entry.nodeListToArray(b.childNodes);
  var d, e;
  for (e in b) {
    "function_create" == b[e].getAttribute("type") && (d = b[e]);
  }
  e = new Entry.Script;
  e.init(d);
  d = e;
  d.values && (d = e.values.FIELD);
  e = '<mutation hashid="' + c + '">';
  c = b = "";
  var f = 0, g = 0;
  a.stringHash = {};
  for (a.booleanHash = {};;) {
    switch(d.type) {
      case "function_field_label":
        e += '<field type="label" content="' + d.fields.NAME.replace("<", "&lt;").replace(">", "&gt;") + '"></field>';
        c += d.fields.NAME;
        break;
      case "function_field_boolean":
        var h = d.values.PARAM.hashId;
        e += '<field type="boolean" hashid="' + h + '"></field>';
        b += '<value name="' + h + '"><block type="True"></block></value>';
        a.booleanHash[h] = g;
        g++;
        c += "\ub17c\ub9ac\uac12" + g;
        break;
      case "function_field_string":
        h = d.values.PARAM.hashId, e += '<field type="string" hashid="' + h + '"></field>', b += '<value name="' + h + '"><block type="text"><field name="NAME">10</field></block></value>', a.stringHash[h] = f, f++, c += "\ubb38\uc790\uac12" + f;
    }
    if (d.values && d.values.NEXT) {
      d = d.values.NEXT;
    } else {
      break;
    }
    c += " ";
  }
  a = Blockly.Xml.textToDom('<xml><block type="function_general">' + (e + "</mutation>") + b + "</block></xml>").childNodes[0];
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
Entry.Func.generateWsBlock = function(a, b, c) {
  b = b.childNodes;
  var d, e;
  for (e in b) {
    if ("function_create" == b[e].getAttribute("type")) {
      d = b[e];
      break;
    }
  }
  e = new Entry.Script;
  e.init(d);
  d = e;
  d.values && (d = e.values.FIELD);
  e = '<mutation hashid="' + c + '">';
  c = b = "";
  var f = 0, g = 0;
  a.stringHash = {};
  for (a.booleanHash = {};;) {
    switch(d.type) {
      case "function_field_label":
        e += '<field type="label" content="' + d.fields.NAME.replace("<", "&lt;").replace(">", "&gt;") + '"></field>';
        c += d.fields.NAME;
        break;
      case "function_field_boolean":
        var h = d.values.PARAM.hashId;
        e += '<field type="boolean" hashid="' + h + '"></field>';
        b += '<value name="' + h + '"><block type="function_param_boolean"><mutation hashid="' + h + '"></mutation></block></value>';
        a.booleanHash[h] = g;
        g++;
        c += "\ub17c\ub9ac\uac12" + g;
        break;
      case "function_field_string":
        h = d.values.PARAM.hashId, e += '<field type="string" hashid="' + h + '"></field>', b += '<value name="' + h + '"><block type="function_param_string"><mutation hashid="' + h + '"></mutation></block></value>', a.stringHash[h] = f, f++, c += "\ubb38\uc790\uac12" + f;
    }
    if (d.values && d.values.NEXT) {
      d = d.values.NEXT;
    } else {
      break;
    }
    c += " ";
  }
  a = '<xml><block type="function_general">' + (e + "</mutation>") + b + "</block></xml>";
  c || (c = "\ud568\uc218");
  return {block:Blockly.Xml.textToDom(a).childNodes[0], description:c};
};
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
Entry.DragInstance = function(a) {
  Entry.Model(this);
  this.set(a);
};
Entry.DragInstance.prototype.schema = {type:Entry.STATIC.DRAG_INSTANCE, startX:0, startY:0, offsetX:0, offsetY:0, prev:null, height:0, mode:0, isNew:!1};
Entry.ThreadModel = function() {
  Entry.Model(this);
};
Entry.ThreadModel.prototype.schema = {id:0, type:Entry.STATIC.THREAD_MODEL, x:0, y:0, width:0, minWidth:0, height:0};
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
  var b = this.type;
  if ("variable" == b || "timer" == b || "answer" == b) {
    this.view_ = new createjs.Container, this.rect_ = new createjs.Shape, this.view_.addChild(this.rect_), this.view_.variable = this, this.wrapper_ = new createjs.Shape, this.view_.addChild(this.wrapper_), this.textView_ = new createjs.Text("asdf", this.FONT, "#000000"), this.textView_.textBaseline = "alphabetic", this.textView_.x = 4, this.textView_.y = 1, this.view_.addChild(this.textView_), this.valueView_ = new createjs.Text("asdf", "10pt NanumGothic", "#ffffff"), this.valueView_.textBaseline = 
    "alphabetic", b = Entry.variableContainer.variables_.length, this.getX() && this.getY() ? (this.setX(this.getX()), this.setY(this.getY())) : (this.setX(-230 + 80 * Math.floor(b / 11)), this.setY(24 * a + 20 - 135 - 264 * Math.floor(b / 11))), this.view_.visible = this.visible_, this.view_.addChild(this.valueView_), this.view_.on("mousedown", function(a) {
      "workspace" == Entry.type && (this.offset = {x:this.x - (.75 * a.stageX - 240), y:this.y - (.75 * a.stageY - 135)}, this.cursor = "move");
    }), this.view_.on("pressmove", function(a) {
      "workspace" == Entry.type && (this.variable.setX(.75 * a.stageX - 240 + this.offset.x), this.variable.setY(.75 * a.stageY - 135 + this.offset.y), this.variable.updateView());
    });
  } else {
    if ("slide" == b) {
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
      0, 0).s("#1bafea").lt(0, -9).lt(-9, 0).lt(0, 0), this.view_.addChild(this.resizeHandle_), this.resizeHandle_.list = this, this.resizeHandle_.on("mouseover", function(a) {
        this.cursor = "nwse-resize";
      }), this.resizeHandle_.on("mousedown", function(a) {
        this.list.isResizing = !0;
        this.offset = {x:.75 * a.stageX - this.list.getWidth(), y:.75 * a.stageY - this.list.getHeight()};
        this.parent.cursor = "nwse-resize";
      }), this.resizeHandle_.on("pressmove", function(a) {
        this.list.setWidth(.75 * a.stageX - this.offset.x);
        this.list.setHeight(.75 * a.stageY - this.offset.y);
        this.list.updateView();
      }), this.view_.on("mouseover", function(a) {
        this.cursor = "move";
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
        this.offsetY = isNaN(this.offsetY) || 0 > this.offsetY ? a.rawY / 2 : this.offsetY;
      }), this.scrollButton_.on("pressmove", function(a) {
        void 0 === this.moveAmount ? (this.y = a.target.y, this.moveAmount = !0) : this.y = a.rawY / 2 - this.offsetY + this.list.height_ / 100 * 23;
        23 > this.y && (this.y = 23);
        this.y > this.list.getHeight() - 40 && (this.y = this.list.getHeight() - 40);
        this.list.updateView();
      }), this.scrollButton_.on("pressup", function(a) {
        this.moveAmount = void 0;
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
          "answer" == this.type ? (this.view_.x = this.getX(), this.view_.y = this.getY(), this.textView_.text = this.getName(), this.valueView_.x = this.textView_.getMeasuredWidth() + 14, this.valueView_.y = 1, this.isNumber() ? parseInt(this.getValue(), 10) == this.getValue() ? this.valueView_.text = this.getValue() : this.valueView_.text = this.getValue().toFixed(1).replace(".00", "") : this.valueView_.text = this.getValue(), this.rect_.graphics.clear().f("#ffffff").ss(1, 2, 0).s("#A0A1A1").rc(0, 
          -14, this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26, 20, 4, 4, 4, 4), this.wrapper_.graphics.clear().f("#E457DC").ss(1, 2, 0).s("#E457DC").rc(this.textView_.getMeasuredWidth() + 7, -11, this.valueView_.getMeasuredWidth() + 15, 14, 7, 7, 7, 7)) : (this.view_.x = this.getX(), this.view_.y = this.getY(), this.textView_.text = this.getName(), this.valueView_.x = this.textView_.getMeasuredWidth() + 14, this.valueView_.y = 1, this.isNumber() ? this.valueView_.text = 
          this.getValue().toFixed(1).replace(".00", "") : this.valueView_.text = this.getValue(), this.rect_.graphics.clear().f("#ffffff").ss(1, 2, 0).s("#A0A1A1").rc(0, -14, this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26, 20, 4, 4, 4, 4), this.wrapper_.graphics.clear().f("#ffbb14").ss(1, 2, 0).s("orange").rc(this.textView_.getMeasuredWidth() + 7, -11, this.valueView_.getMeasuredWidth() + 15, 14, 7, 7, 7, 7));
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
  this.isCloud_ && Entry.variableContainer.updateCloudVariables();
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
Entry.Variable.prototype.isInList = function(a, b) {
  this.getX();
  this.getY();
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
  this.snapshot_ && !this.isCloud_ && this.syncModel_(this.snapshot_);
};
Entry.Variable.prototype.syncModel_ = function(a) {
  this.setX(a.x);
  this.setY(a.y);
  this.id_ = a.id;
  this.setVisible(a.visible);
  this.setValue(a.value);
  this.setName(a.name);
  this.isCloud_ = a.isCloud;
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
  var b = this.minValue_;
  return Math.abs(this.value_ - b) / Math.abs(this.maxValue_ - b) * a + 10;
};
Entry.Variable.prototype.setSlideCommandX = function(a, b) {
  var c = this.valueSetter_.graphics.command;
  a = "undefined" == typeof a ? 10 : a;
  c.x = b ? a + 10 : c.x + a;
  this.updateSlideValueByView();
};
Entry.Variable.prototype.updateSlideValueByView = function() {
  var a = Math.max(this.valueSetter_.graphics.command.x - 10, 0) / this.maxWidth;
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
  this.selectedVariable = null;
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
    a.isOpen ? c && 0 !== c.length ? b.addVariable() : (a.view.addClass("entryRemove"), a.isOpen = !1) : (a.view.removeClass("entryRemove"), a.view.name.focus(), a.isOpen = !0);
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
    a.isOpen ? c && 0 !== c.length ? b.addList() : (a.view.addClass("entryRemove"), a.isOpen = !1) : (a.view.removeClass("entryRemove"), a.view.name.focus(), a.isOpen = !0);
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
  void 0 === b && (b = !0);
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
  a && (a.listElement.addClass("selected"), this.selected = a, a instanceof Entry.Variable ? (this.renderVariableReference(a), a.object_ && Entry.container.selectObject(a.object_, !0)) : a instanceof Entry.Func ? this.renderFunctionReference(a) : this.renderMessageReference(a));
};
Entry.VariableContainer.prototype.renderMessageReference = function(a) {
  var b = this, c = Entry.container.objects_, d = ["when_message_cast", "message_cast", "message_cast_wait"], e = [], f = Entry.createElement("ul");
  f.addClass("entryVariableListCallerListWorkspace");
  for (var g in c) {
    for (var h = c[g], k = h.script.getElementsByTagName("block"), l = 0;l < k.length;l++) {
      var n = k[l], m = n.getAttribute("type");
      if (-1 < d.indexOf(m)) {
        m = Entry.Xml.getField("VALUE", n), m == a.id && e.push({object:h, block:n});
      } else {
        if ("function_general" == m) {
          var q = n.getElementsByTagName("mutation")[0].getAttribute("hashid");
          if (q = Entry.variableContainer.getFunction(q)) {
            for (var q = q.content, q = q.getElementsByTagName("block"), r = 0;r < q.length;r++) {
              var t = q[r], m = t.getAttribute("type");
              -1 < d.indexOf(m) && (m = Entry.Xml.getField("VALUE", t), m == a.id && e.push({object:h, block:t, funcBlock:n}));
            }
          }
        }
      }
    }
  }
  for (g in e) {
    c = e[g], d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.appendChild(c.object.thumbnailView_.cloneNode()), h = Entry.createElement("div"), h.addClass("entryVariableListCallerNameWorkspace"), h.innerHTML = c.object.name + " : " + Lang.Blocks["START_" + c.block.getAttribute("type")], d.appendChild(h), d.caller = c, d.message = a, d.bindOnClick(function(a) {
      Entry.playground.object != this.caller.object && (Entry.container.selectObject(), Entry.container.selectObject(this.caller.object.id, !0), b.select(null), b.select(this.message));
      a = this.caller;
      a = a.funcBlock ? a.funcBlock.getAttribute("id") : a.block.getAttribute("id");
      Blockly.mainWorkspace.activatePreviousBlock(Number(a));
      Entry.playground.toggleOnVariableView();
      Entry.playground.changeViewMode("variable");
    }), f.appendChild(d);
  }
  0 === e.length && (d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.addClass("entryVariableListCallerNoneWorkspace"), d.innerHTML = Lang.Workspace.no_use, f.appendChild(d));
  a.callerListElement = f;
  this.listView_.insertBefore(f, a.listElement);
  this.listView_.insertBefore(a.listElement, f);
};
Entry.VariableContainer.prototype.renderVariableReference = function(a) {
  var b = this, c = Entry.container.objects_, d = "get_variable change_variable hide_variable set_variable show_variable add_value_to_list remove_value_from_list insert_value_to_list change_value_list_index value_of_index_from_list length_of_list show_list hide_list is_included_in_list".split(" "), e = [], f = Entry.createElement("ul");
  f.addClass("entryVariableListCallerListWorkspace");
  var g, h;
  for (h in c) {
    for (var k = c[h], l = k.script.getElementsByTagName("block"), n = 0;n < l.length;n++) {
      var m = l[n];
      g = m.getAttribute("type");
      if (-1 < d.indexOf(g)) {
        g = Entry.Xml.getField("VARIABLE", m) || Entry.Xml.getField("LIST", m), g == a.id_ && e.push({object:k, block:m});
      } else {
        if ("function_general" == g) {
          var q = m.getElementsByTagName("mutation")[0].getAttribute("hashid");
          if (q = Entry.variableContainer.getFunction(q)) {
            for (var q = q.content, q = q.getElementsByTagName("block"), r = 0;r < q.length;r++) {
              var t = q[r];
              g = t.getAttribute("type");
              -1 < d.indexOf(g) && (g = Entry.Xml.getField("VARIABLE", t) || Entry.Xml.getField("LIST", t), g == a.id_ && e.push({object:k, block:t, funcBlock:m}));
            }
          }
        }
      }
    }
  }
  for (h in e) {
    c = e[h], d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.appendChild(c.object.thumbnailView_.cloneNode()), k = Entry.createElement("div"), k.addClass("entryVariableListCallerNameWorkspace"), k.innerHTML = c.object.name + " : " + Lang.Blocks["VARIABLE_" + c.block.getAttribute("type")], d.appendChild(k), d.caller = c, d.variable = a, d.bindOnClick(function(a) {
      Entry.playground.object != this.caller.object && (Entry.container.selectObject(), Entry.container.selectObject(this.caller.object.id, !0), b.select(null));
      a = this.caller;
      a = a.funcBlock ? a.funcBlock.getAttribute("id") : a.block.getAttribute("id");
      Blockly.mainWorkspace.activatePreviousBlock(Number(a));
      Entry.playground.toggleOnVariableView();
      Entry.playground.changeViewMode("variable");
    }), f.appendChild(d);
  }
  0 === e.length && (d = Entry.createElement("li"), d.addClass("entryVariableListCallerWorkspace"), d.addClass("entryVariableListCallerNoneWorkspace"), d.innerHTML = Lang.Workspace.no_use, f.appendChild(d));
  a.callerListElement = f;
  this.listView_.insertBefore(f, a.listElement);
  this.listView_.insertBefore(a.listElement, f);
};
Entry.VariableContainer.prototype.renderFunctionReference = function(a) {
  var b = this, c = Entry.container.objects_, d = [], e = Entry.createElement("ul");
  e.addClass("entryVariableListCallerListWorkspace");
  for (var f in c) {
    for (var g = c[f], h = g.script.getElementsByTagName("block"), k = 0;k < h.length;k++) {
      var l = h[k];
      "function_general" == l.getAttribute("type") && l.getElementsByTagName("mutation")[0].getAttribute("hashid") == a.id && d.push({object:g, block:l});
    }
  }
  for (f in d) {
    c = d[f], g = Entry.createElement("li"), g.addClass("entryVariableListCallerWorkspace"), g.appendChild(c.object.thumbnailView_.cloneNode()), h = Entry.createElement("div"), h.addClass("entryVariableListCallerNameWorkspace"), h.innerHTML = c.object.name, g.appendChild(h), g.caller = c, g.bindOnClick(function(c) {
      Entry.playground.object != this.caller.object && (Entry.container.selectObject(), Entry.container.selectObject(this.caller.object.id, !0), b.select(null), b.select(a));
      c = this.caller.block.getAttribute("id");
      Blockly.mainWorkspace.activatePreviousBlock(Number(c));
      Entry.playground.toggleOnVariableView();
      Entry.playground.changeViewMode("variable");
    }), e.appendChild(g);
  }
  0 === d.length && (g = Entry.createElement("li"), g.addClass("entryVariableListCallerWorkspace"), g.addClass("entryVariableListCallerNoneWorkspace"), g.innerHTML = Lang.Workspace.no_use, e.appendChild(g));
  a.callerListElement = e;
  this.listView_.insertBefore(e, a.listElement);
  this.listView_.insertBefore(a.listElement, e);
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
        this.variableSplitters.top.innerHTML = Lang.Workspace.List_used_all_objects;
        this.listView_.appendChild(this.variableSplitters.top);
        this.updateVariableAddView("list");
        for (c in this.lists_) {
          d = this.lists_[c], d.object_ || (b.push(d), e = d.listElement, this.listView_.appendChild(e), d.callerListElement && this.listView_.appendChild(d.callerListElement));
        }
        this.variableSplitters.bottom.innerHTML = Lang.Workspace.list_used_specific_objects;
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
    0 !== b.length && this.select(b[0]);
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
    "variable" == d || "slide" == d ? (c.generateView(this.variables_.length), this.createVariableView(c), this.variables_.push(c)) : "list" == d ? (c.generateView(this.lists_.length), this.createListView(c), this.lists_.push(c)) : "timer" == d ? this.generateTimer(c) : "answer" == d && this.generateAnswer(c);
  }
  Entry.isEmpty(Entry.engine.projectTimer) && Entry.variableContainer.generateTimer();
  Entry.isEmpty(Entry.container.inputValue) && Entry.variableContainer.generateAnswer();
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
Entry.VariableContainer.prototype.checkListPosition = function(a, b) {
  var c = a.x_ + a.width_, d = -a.y_, e = -a.y_ + -a.height_;
  return b.x > a.x_ && b.x < c && b.y < d && b.y > e ? !0 : !1;
};
Entry.VariableContainer.prototype.getListById = function(a) {
  var b = this.lists_, c = [];
  if (0 < b.length) {
    for (var d = 0;d < b.length;d++) {
      this.checkListPosition(b[d], a) && c.push(b[d]);
    }
    return c;
  }
  return !1;
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
Entry.VariableContainer.prototype.checkAllVariableName = function(a, b) {
  b = this[b];
  for (var c = 0;c < b.length;c++) {
    if (b[c].name_ == a) {
      return !0;
    }
  }
  return !1;
};
Entry.VariableContainer.prototype.addVariable = function(a) {
  if (!a) {
    var b = this.variableAddPanel;
    a = b.view.name.value.trim();
    a && 0 !== a.length || (a = Lang.Workspace.variable);
    a = this.checkAllVariableName(a, "variables_") ? Entry.getOrderedName(a, this.variables_, "name_") : a;
    var c = b.info;
    a = {name:a, isCloud:c.isCloud, object:c.object, variableType:"variable"};
    b.view.addClass("entryRemove");
    this.resetVariableAddPanel("variable");
  }
  a = new Entry.Variable(a);
  Entry.stateManager && Entry.stateManager.addCommand("add variable", this, this.removeVariable, a);
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
  this.selected == a && this.select(null);
  a.remove();
  this.variables_.splice(b, 1);
  Entry.stateManager && Entry.stateManager.addCommand("remove variable", this, this.addVariable, c);
  Entry.playground.reloadPlayground();
  this.updateList();
  return new Entry.State(this, this.addVariable, c);
};
Entry.VariableContainer.prototype.changeVariableName = function(a, b) {
  a.name_ != b && (Entry.isExist(b, "name_", this.variables_) ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.variable_rename_failed, Lang.Workspace.variable_dup)) : 10 < b.length ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.variable_rename_failed, Lang.Workspace.variable_too_long)) : (a.name_ = b, a.updateView(), Entry.playground.reloadPlayground(), Entry.toast.success(Lang.Workspace.variable_rename, Lang.Workspace.variable_rename_ok)));
};
Entry.VariableContainer.prototype.changeListName = function(a, b) {
  a.name_ != b && (Entry.isExist(b, "name_", this.lists_) ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.list_rename_failed, Lang.Workspace.list_dup)) : 10 < b.length ? (a.listElement.nameField.value = a.name_, Entry.toast.alert(Lang.Workspace.list_rename_failed, Lang.Workspace.list_too_long)) : (a.name_ = b, a.updateView(), Entry.playground.reloadPlayground(), Entry.toast.success(Lang.Workspace.list_rename, Lang.Workspace.list_rename_ok)));
};
Entry.VariableContainer.prototype.removeList = function(a) {
  var b = this.lists_.indexOf(a), c = a.toJSON();
  Entry.stateManager && Entry.stateManager.addCommand("remove list", this, this.addList, c);
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
    h.removeAttribute("disabled");
    g.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.updateSelectedVariable(a);
    h.focus();
  });
  c.editButton = f;
  var g = Entry.createElement("button");
  g.addClass("entryVariableListElementEditWorkspace");
  g.addClass("entryRemove");
  g.bindOnClick(function(a) {
    a.stopPropagation();
    h.blur();
    h.setAttribute("disabled", "disabled");
    f.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.updateSelectedVariable(null, "variable");
  });
  c.editSaveButton = g;
  var h = Entry.createElement("input");
  h.addClass("entryVariableListElementNameWorkspace");
  h.setAttribute("disabled", "disabled");
  h.value = a.name_;
  h.bindOnClick(function(a) {
    a.stopPropagation();
  });
  h.onblur = function(c) {
    (c = this.value.trim()) && 0 !== c.length ? b.changeVariableName(a, this.value) : (Entry.toast.alert(Lang.Msgs.warn, Lang.Workspace.variable_can_not_space), this.value = a.getName());
  };
  h.onkeydown = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.nameField = h;
  d.appendChild(h);
  d.appendChild(f);
  d.appendChild(g);
  d.appendChild(e);
  a.listElement = c;
};
Entry.VariableContainer.prototype.addMessage = function(a) {
  a.id || (a.id = Entry.generateHash());
  Entry.stateManager && Entry.stateManager.addCommand("add message", this, this.removeMessage, a);
  this.createMessageView(a);
  this.messages_.unshift(a);
  Entry.playground.reloadPlayground();
  this.updateList();
  a.listElement.nameField.focus();
  return new Entry.State(this, this.removeMessage, a);
};
Entry.VariableContainer.prototype.removeMessage = function(a) {
  this.selected == a && this.select(null);
  Entry.stateManager && Entry.stateManager.addCommand("remove message", this, this.addMessage, a);
  var b = this.messages_.indexOf(a);
  this.messages_.splice(b, 1);
  this.updateList();
  Entry.playground.reloadPlayground();
  return new Entry.State(this, this.addMessage, a);
};
Entry.VariableContainer.prototype.changeMessageName = function(a, b) {
  a.name != b && (Entry.isExist(b, "name", this.messages_) ? (a.listElement.nameField.value = a.name, Entry.toast.alert(Lang.Workspace.message_rename_failed, Lang.Workspace.message_dup)) : 10 < b.length ? (a.listElement.nameField.value = a.name, Entry.toast.alert(Lang.Workspace.message_rename_failed, Lang.Workspace.message_too_long)) : (a.name = b, Entry.playground.reloadPlayground(), Entry.toast.success(Lang.Workspace.message_rename, Lang.Workspace.message_rename_ok)));
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
    g.removeAttribute("disabled");
    g.focus();
    f.removeClass("entryRemove");
    this.addClass("entryRemove");
  });
  var f = Entry.createElement("button");
  f.addClass("entryVariableListElementEditWorkspace");
  f.addClass("entryRemove");
  f.bindOnClick(function(a) {
    a.stopPropagation();
    g.blur();
    e.removeClass("entryRemove");
    this.addClass("entryRemove");
  });
  var g = Entry.createElement("input");
  g.addClass("entryVariableListElementNameWorkspace");
  g.value = a.name;
  g.bindOnClick(function(a) {
    a.stopPropagation();
  });
  g.onblur = function(c) {
    (c = this.value.trim()) && 0 !== c.length ? (b.changeMessageName(a, this.value), e.removeClass("entryRemove"), f.addClass("entryRemove"), g.setAttribute("disabled", "disabled")) : (Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.sign_can_not_space), this.value = a.name);
  };
  g.onkeydown = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.nameField = g;
  c.appendChild(g);
  c.appendChild(e);
  c.appendChild(f);
  c.appendChild(d);
  a.listElement = c;
};
Entry.VariableContainer.prototype.addList = function(a) {
  if (!a) {
    var b = this.listAddPanel;
    a = b.view.name.value.trim();
    a && 0 !== a.length || (a = Lang.Workspace.list);
    var c = b.info;
    a = this.checkAllVariableName(a, "lists_") ? Entry.getOrderedName(a, this.lists_, "name_") : a;
    a = {name:a, isCloud:c.isCloud, object:c.object, variableType:"list"};
    b.view.addClass("entryRemove");
    this.resetVariableAddPanel("list");
  }
  a = new Entry.Variable(a);
  Entry.stateManager && Entry.stateManager.addCommand("add list", this, this.removeList, a);
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
    h.removeAttribute("disabled");
    g.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.updateSelectedVariable(a);
    h.focus();
  });
  c.editButton = f;
  var g = Entry.createElement("button");
  g.addClass("entryVariableListElementEditWorkspace");
  g.addClass("entryRemove");
  g.bindOnClick(function(c) {
    c.stopPropagation();
    h.blur();
    h.setAttribute("disabled", "disabled");
    f.removeClass("entryRemove");
    this.addClass("entryRemove");
    b.select(a);
    b.updateSelectedVariable(null, "list");
  });
  c.editSaveButton = g;
  var h = Entry.createElement("input");
  h.setAttribute("disabled", "disabled");
  h.addClass("entryVariableListElementNameWorkspace");
  h.value = a.name_;
  h.bindOnClick(function(a) {
    a.stopPropagation();
  });
  h.onblur = function(c) {
    (c = this.value.trim()) && 0 !== c.length ? b.changeListName(a, this.value) : (Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.list_can_not_space), this.value = a.getName());
  };
  h.onkeydown = function(a) {
    13 == a.keyCode && this.blur();
  };
  c.nameField = h;
  d.appendChild(h);
  d.appendChild(f);
  d.appendChild(g);
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
  b = Entry.container.inputValue;
  Entry.isEmpty(b) || a.push(b);
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
  d.innerHTML = Lang.Workspace.Variable_create_cloud;
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
  d.setAttribute("placeholder", Lang.Workspace.list_name);
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
  d.innerHTML = Lang.Workspace.use_all_objects;
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
  d.innerHTML = Lang.Workspace.Variable_use_this_object;
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
  d.innerHTML = Lang.Workspace.List_create_cloud;
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
  b.innerHTML = Lang.Buttons.cancel;
  b.bindOnClick(function(b) {
    a.listAddPanel.view.addClass("entryRemove");
    a.resetVariableAddPanel("list");
  });
  c.appendChild(b);
  b = Entry.createElement("span");
  b.addClass("entryVariableAddSpaceConfirmWorkspace");
  b.addClass("entryVariableAddSpaceButtonWorkspace");
  b.innerHTML = Lang.Buttons.save;
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
  for (var b = [], c = 0 !== this.variables_.length, d = 0 !== this.lists_.length, e, f = 0, g;g = a[f];f++) {
    var h = g.tagName;
    h && "BLOCK" == h.toUpperCase() ? (e = g.getAttribute("bCategory"), !c && "variable" == e || !d && "list" == e || b.push(g)) : !h || "SPLITTER" != h.toUpperCase() && "BTN" != h.toUpperCase() || !c && "variable" == e || (d || "list" != e) && b.push(g);
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
      c.json.script = c.json.script.replace(new RegExp(f.originId, "g"), f.id);
    }
  }, a);
  b.map(function(a) {
    c.addVariable(a);
  });
};
Entry.VariableContainer.prototype.generateTimer = function(a) {
  a || (a = {}, a.id = Entry.generateHash(), a.name = Lang.Workspace.Variable_Timer, a.value = 0, a.variableType = "timer", a.visible = !1, a.x = 150, a.y = -70, a = new Entry.Variable(a));
  a.generateView();
  a.tick = null;
  Entry.engine.projectTimer = a;
  Entry.addEventListener("stop", function() {
    Entry.engine.stopProjectTimer();
  });
};
Entry.VariableContainer.prototype.generateAnswer = function(a) {
  a || (a = new Entry.Variable({id:Entry.generateHash(), name:Lang.Blocks.VARIABLE_get_canvas_input_value, value:0, variableType:"answer", visible:!1, x:150, y:-100}));
  a.generateView();
  Entry.container.inputValue = a;
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
  d.innerHTML = Lang.Workspace.show_variable;
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableSettingCheckWorkspace");
  b.visibleCheck = d;
  c.appendChild(d);
  c = Entry.createElement("div");
  c.addClass("entryVariableSettingInitValueWrapperWorkspace");
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = Lang.Workspace.default_value;
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
  d.innerHTML = Lang.Workspace.slide;
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryVariableSettingCheckWorkspace");
  b.slideCheck = d;
  c.appendChild(d);
  c.bindOnClick(function(b) {
    var c;
    b = a.selectedVariable;
    var d = a.variables_, f = b.getType();
    "variable" == f ? (c = b.toJSON(), c.variableType = "slide", c = new Entry.Variable(c), d.splice(d.indexOf(b), 0, c), 0 > c.getValue() && c.setValue(0), 100 < c.getValue() && c.setValue(100), e.removeAttribute("disabled"), g.removeAttribute("disabled")) : "slide" == f && (c = b.toJSON(), c.variableType = "variable", c = new Entry.Variable(c), d.splice(d.indexOf(b), 0, c), e.setAttribute("disabled", "disabled"), g.setAttribute("disabled", "disabled"));
    a.createVariableView(c);
    a.removeVariable(b);
    a.updateSelectedVariable(c);
    c.generateView();
  });
  c = Entry.createElement("div");
  b.minMaxWrapper = c;
  c.addClass("entryVariableSettingMinMaxWrapperWorkspace");
  b.appendChild(c);
  d = Entry.createElement("span");
  d.innerHTML = Lang.Workspace.min_value;
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
  f.innerHTML = Lang.Workspace.max_value;
  c.appendChild(f);
  var g = Entry.createElement("input");
  g.addClass("entryVariableSettingMaxValueInputWorkspace");
  g.value = d && "slide" == d.type ? d.maxValue_ : 100;
  g.onblur = function(b) {
    isNaN(this.value) || (b = a.selectedVariable, b.setMaxValue(Number(this.value)), a.updateVariableSettingView(b));
  };
  b.maxValueInput = g;
  c.appendChild(g);
};
Entry.VariableContainer.prototype.updateVariableSettingView = function(a) {
  var b = this.variableSettingView, c = b.visibleCheck, d = b.initValueInput, e = b.slideCheck, f = b.minValueInput, g = b.maxValueInput, h = b.minMaxWrapper;
  c.removeClass("entryVariableSettingChecked");
  a.isVisible() && c.addClass("entryVariableSettingChecked");
  e.removeClass("entryVariableSettingChecked");
  "slide" == a.getType() ? (e.addClass("entryVariableSettingChecked"), f.removeAttribute("disabled"), g.removeAttribute("disabled"), f.value = a.getMinValue(), g.value = a.getMaxValue(), h.removeClass("entryVariableMinMaxDisabledWorkspace")) : (h.addClass("entryVariableMinMaxDisabledWorkspace"), f.setAttribute("disabled", "disabled"), g.setAttribute("disabled", "disabled"));
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
  d.innerHTML = Lang.Workspace.show_list_workspace;
  c.appendChild(d);
  d = Entry.createElement("span");
  d.addClass("entryListSettingCheckWorkspace");
  b.visibleCheck = d;
  c.appendChild(d);
  d = Entry.createElement("div");
  d.addClass("entryListSettingLengthWrapperWorkspace");
  c = Entry.createElement("span");
  c.addClass("entryListSettingLengthSpanWorkspace");
  c.innerHTML = Lang.Workspace.number_of_list;
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
  var c = this.listSettingView, d = c.listValues, e = c.visibleCheck, f = c.lengthInput, g = c.seperator;
  e.removeClass("entryListSettingCheckedWorkspace");
  a.isVisible() && e.addClass("entryListSettingCheckedWorkspace");
  f.value = a.array_.length;
  for (a.listElement.appendChild(c);d.firstChild;) {
    d.removeChild(d.firstChild);
  }
  var h = a.array_;
  0 === h.length ? g.addClass("entryRemove") : g.removeClass("entryRemove");
  for (e = 0;e < h.length;e++) {
    (function(c) {
      var e = Entry.createElement("div");
      e.addClass("entryListSettingValueWrapperWorkspace");
      var f = Entry.createElement("span");
      f.addClass("entryListSettingValueNumberSpanWorkspace");
      f.innerHTML = c + 1;
      e.appendChild(f);
      f = Entry.createElement("input");
      f.value = h[c].data;
      f.onblur = function() {
        h[c].data = this.value;
        a.updateView();
      };
      f.onkeypress = function(a) {
        13 == a.keyCode && this.blur();
      };
      f.addClass("entryListSettingEachInputWorkspace");
      e.appendChild(f);
      f = Entry.createElement("span");
      f.bindOnClick(function() {
        h.splice(c, 1);
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
Entry.VariableContainer.prototype.updateCloudVariables = function() {
  var a = Entry.projectId;
  if (Entry.cloudSavable && a) {
    var b = Entry.variableContainer, a = b.variables_.filter(function(a) {
      return a.isCloud_;
    }), a = a.map(function(a) {
      return a.toJSON();
    }), b = b.lists_.filter(function(a) {
      return a.isCloud_;
    }), b = b.map(function(a) {
      return a.toJSON();
    });
    $.ajax({url:"/api/project/variable/" + Entry.projectId, type:"PUT", data:{variables:a, lists:b}}).done(function() {
    });
  }
};
Entry.block.run = {skeleton:"basic", color:"#3BBD70", contents:["this is", "basic block"], func:function() {
}};
Entry.block.jr_start = {skeleton:"pebble_event", event:"start", color:"#3BBD70", contents:[{type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_play_image.png", highlightColor:"#3BBD70", size:22}], func:function() {
  var a = Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT), b;
  for (b in a) {
    this._unit = a[b];
  }
  Ntry.unitComp = Ntry.entityManager.getComponent(this._unit.id, Ntry.STATIC.UNIT);
}};
Entry.block.jr_repeat = {skeleton:"pebble_loop", color:"#127CDB", contents:[{type:"Dropdown", key:"REPEAT", options:[[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10]], value:1}, {type:"Text", text:"\ubc18\ubcf5"}, {type:"Statement", key:"STATEMENT", accept:"pebble_basic"}], func:function() {
  if (void 0 === this.repeatCount) {
    return this.repeatCount = this.block.values.REPEAT, Entry.STATIC.CONTINUE;
  }
  if (0 < this.repeatCount) {
    return console.log(this.repeatCount), this.repeatCount--, this.executor.stepInto(this.block.values.STATEMENT), Entry.STATIC.CONTINUE;
  }
  delete this.repeatCount;
}};
Entry.block.jr_item = {skeleton:"pebble_basic", color:"#F46C6C", contents:[{type:"Text", text:"\uaf43 \ubaa8\uc73c\uae30"}, {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_item_image.png", highlightColor:"#FFF", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM, function() {
      Ntry.dispatchEvent("getItem");
      a.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.cparty_jr_item = {skeleton:"pebble_basic", color:"#8ABC1D", contents:[{type:"Text", text:"\uc5f0\ud544 \uc90d\uae30"}, {type:"Indicator", img:"/img/assets/ntry/bitmap/cpartyjr/pen.png", highlightColor:"#FFF", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM, function() {
      Ntry.dispatchEvent("getItem");
      a.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_north = {skeleton:"pebble_basic", color:"#A751E3", contents:[{type:"Text", text:"  \uc704\ucabd"}, {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_up_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = Ntry.STATIC, b = this, c = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    }, d;
    switch(Ntry.unitComp.direction) {
      case Ntry.STATIC.EAST:
        d = a.TURN_LEFT;
        break;
      case Ntry.STATIC.SOUTH:
        d = a.HALF_ROTATION;
        break;
      case Ntry.STATIC.WEST:
        d = a.TURN_RIGHT;
        break;
      default:
        c();
    }
    d && Ntry.dispatchEvent("unitAction", d, c);
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_east = {skeleton:"pebble_basic", color:"#A751E3", contents:[{type:"Text", text:"\uc624\ub978\ucabd"}, {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_right_image.png", position:{x:83, y:0}, size:22}], func:function() {
  var a = Ntry.STATIC;
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var b = this, c = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", a.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    }, d;
    switch(Ntry.unitComp.direction) {
      case a.SOUTH:
        d = a.TURN_LEFT;
        break;
      case a.WEST:
        d = a.HALF_ROTATION;
        break;
      case a.NORTH:
        d = a.TURN_RIGHT;
        break;
      default:
        c();
    }
    d && Ntry.dispatchEvent("unitAction", d, c);
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_south = {skeleton:"pebble_basic", color:"#A751E3", contents:[{type:"Text", text:"  \uc544\ub798\ucabd"}, {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_down_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = Ntry.STATIC, b = this, c = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    }, d;
    switch(Ntry.unitComp.direction) {
      case a.EAST:
        d = a.TURN_RIGHT;
        break;
      case a.NORTH:
        d = a.HALF_ROTATION;
        break;
      case a.WEST:
        d = a.TURN_LEFT;
        break;
      default:
        c();
    }
    d && Ntry.dispatchEvent("unitAction", d, c);
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_west = {skeleton:"pebble_basic", color:"#A751E3", contents:[{type:"Text", text:"  \uc67c\ucabd"}, {type:"Indicator", img:"/img/assets/ntry/bitmap/jr/block_left_image.png", position:{x:83, y:0}, size:22}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = Ntry.STATIC, b = this, c = function() {
      window.setTimeout(function() {
        Ntry.dispatchEvent("unitAction", a.WALK, function() {
          b.isAction = !1;
        });
      }, 3);
    }, d;
    switch(Ntry.unitComp.direction) {
      case a.SOUTH:
        d = a.TURN_RIGHT;
        break;
      case a.EAST:
        d = a.HALF_ROTATION;
        break;
      case a.NORTH:
        d = a.TURN_LEFT;
        break;
      default:
        c();
    }
    d && Ntry.dispatchEvent("unitAction", d, c);
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_start_basic = {skeleton:"basic_event", event:"start", color:"#3BBD70", contents:[{type:"Indicator", boxMultiplier:1, img:"/img/assets/block_icon/start_icon_play.png", highlightColor:"#3BBD70", size:17, position:{x:0, y:-2}}, "\uc2dc\uc791 \ubc84\ud2bc\uc744 \ub20c\ub800\uc744 \ub54c"], func:function() {
  var a = Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT), b;
  for (b in a) {
    this._unit = a[b];
  }
  Ntry.unitComp = Ntry.entityManager.getComponent(this._unit.id, Ntry.STATIC.UNIT);
}};
Entry.block.jr_go_straight = {skeleton:"basic", color:"#A751E3", contents:["\uc55e\uc73c\ub85c \uac00\uae30", {type:"Image", img:"/img/assets/ntry/bitmap/jr/cparty_go_straight.png", size:24}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
      a.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_turn_left = {skeleton:"basic", color:"#A751E3", contents:["\uc67c\ucabd\uc73c\ub85c \ub3cc\uae30", {type:"Image", img:"/img/assets/ntry/bitmap/jr/cparty_rotate_l.png", size:24}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, function() {
      a.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_turn_right = {skeleton:"basic", color:"#A751E3", contents:["\uc624\ub978\ucabd\uc73c\ub85c \ub3cc\uae30", {type:"Image", img:"/img/assets/ntry/bitmap/jr/cparty_rotate_r.png", size:24}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, function() {
      a.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_go_slow = {skeleton:"basic", color:"#f46c6c", contents:["\ucc9c\ucc9c\ud788 \uac00\uae30", {type:"Image", img:"/img/assets/ntry/bitmap/jr/cparty_go_slow.png", size:24}], func:function() {
  if (this.isContinue) {
    if (this.isAction) {
      return Entry.STATIC.CONTINUE;
    }
    delete this.isAction;
    delete this.isContinue;
  } else {
    this.isAction = this.isContinue = !0;
    var a = this;
    Ntry.dispatchEvent("unitAction", Ntry.STATIC.GO_SLOW, function() {
      a.isAction = !1;
    });
    return Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_repeat_until_dest = {skeleton:"basic_loop", color:"#498DEB", contents:[{type:"Image", img:"/img/assets/ntry/bitmap/jr/jr_goal_image.png", size:18}, "\ub9cc\ub0a0 \ub54c \uae4c\uc9c0 \ubc18\ubcf5\ud558\uae30", {type:"Image", img:"/img/assets/week/blocks/for.png", size:24}, {type:"Statement", key:"STATEMENT", accept:"basic", alignY:15, alignX:2}], func:function() {
  if (1 !== this.block.values.STATEMENT.getBlocks().length) {
    return this.executor.stepInto(this.block.values.STATEMENT), Entry.STATIC.CONTINUE;
  }
}};
Entry.block.jr_if_construction = {skeleton:"basic_loop", color:"#498DEB", contents:["\ub9cc\uc57d", {type:"Image", img:"/img/assets/ntry/bitmap/jr/jr_construction_image.png", size:18}, "\uc55e\uc5d0 \uc788\ub2e4\uba74", {type:"Image", img:"/img/assets/week/blocks/for.png", size:24}, {type:"Statement", key:"STATEMENT", accept:"basic", alignY:15, alignX:2}], func:function() {
  if (!this.isContinue) {
    var a = Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT), b, c;
    for (c in a) {
      b = a[c];
    }
    a = Ntry.entityManager.getComponent(b.id, Ntry.STATIC.UNIT);
    b = Ntry.entityManager.getComponent(b.id, Ntry.STATIC.GRID);
    b = {x:b.x, y:b.y};
    Ntry.addVectorByDirection(b, a.direction, 1);
    b = Ntry.entityManager.find({type:Ntry.STATIC.GRID, x:b.x, y:b.y}, {type:Ntry.STATIC.TILE, tileType:Ntry.STATIC.OBSTACLE_REPAIR});
    this.isContinue = !0;
    a = this.block.values.STATEMENT;
    if (0 !== b.length && 1 !== a.getBlocks().length) {
      return this.executor.stepInto(a), Entry.STATIC.CONTINUE;
    }
  }
}};
Entry.block.jr_if_speed = {skeleton:"basic_loop", color:"#498DEB", contents:["\ub9cc\uc57d", {type:"Image", img:"/img/assets/ntry/bitmap/jr/jr_speed_image.png", size:18}, "\uc55e\uc5d0 \uc788\ub2e4\uba74", {type:"Image", img:"/img/assets/week/blocks/for.png", size:24}, {type:"Statement", key:"STATEMENT", accept:"basic", alignY:15, alignX:2}], func:function() {
  if (!this.isContinue) {
    var a = Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT), b, c;
    for (c in a) {
      b = a[c];
    }
    a = Ntry.entityManager.getComponent(b.id, Ntry.STATIC.UNIT);
    b = Ntry.entityManager.getComponent(b.id, Ntry.STATIC.GRID);
    b = {x:b.x, y:b.y};
    Ntry.addVectorByDirection(b, a.direction, 1);
    b = Ntry.entityManager.find({type:Ntry.STATIC.GRID, x:b.x, y:b.y}, {type:Ntry.STATIC.TILE, tileType:Ntry.STATIC.OBSTACLE_SLOW});
    this.isContinue = !0;
    a = this.block.values.STATEMENT;
    if (0 !== b.length && 1 !== a.getBlocks().length) {
      return this.executor.stepInto(a), Entry.STATIC.CONTINUE;
    }
  }
}};
Entry.BlockMenu = function(a, b) {
  Entry.Model(this, !1);
  this._align = b || "CENTER";
  a = "string" === typeof a ? $("#" + a) : $(a);
  if ("DIV" !== a.prop("tagName")) {
    return console.error("Dom is not div element");
  }
  if ("function" !== typeof window.Snap) {
    return console.error("Snap library is required");
  }
  this.svgDom = Entry.Dom($('<svg id="blockMenu" width="100%" height="100%"version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'), {parent:a});
  this.offset = this.svgDom.offset();
  this._svgWidth = this.svgDom.width();
  this.snap = Snap("#blockMenu");
  this.svgGroup = this.snap.group();
  this.svgThreadGroup = this.svgGroup.group();
  this.svgThreadGroup.board = this;
  this.svgBlockGroup = this.svgGroup.group();
  this.svgBlockGroup.board = this;
  this.changeEvent = new Entry.Event(this);
  this.observe(this, "generateDragBlockObserver", ["dragBlock"]);
  Entry.documentMousedown && Entry.documentMousedown.attach(this, this.setSelectedBlock);
};
(function(a) {
  a.schema = {code:null, dragBlock:null, closeBlock:null, selectedBlockView:null};
  a.changeCode = function(a) {
    if (!(a instanceof Entry.Code)) {
      return console.error("You must inject code instance");
    }
    this.codeListener && this.code.changeEvent.detach(this.codeListener);
    this.set({code:a});
    var c = this;
    this.codeListener = this.code.changeEvent.attach(this, function() {
      c.changeEvent.notify();
    });
    a.createView(this);
    this.align();
  };
  a.bindCodeView = function(a) {
    this.svgBlockGroup.remove();
    this.svgThreadGroup.remove();
    this.svgBlockGroup = a.svgBlockGroup;
    this.svgThreadGroup = a.svgThreadGroup;
    this.svgGroup.append(this.svgThreadGroup);
    this.svgGroup.append(this.svgBlockGroup);
  };
  a.align = function() {
    for (var a = this.code.getThreads(), c = 10, d = "LEFT" == this._align ? 20 : this.svgDom.width() / 2, e = 0, f = a.length;e < f;e++) {
      var g = a[e].getFirstBlock(), h = g.view;
      g.set({x:d, y:c});
      h._moveTo(d, c, !1);
      c += h.height + 15;
    }
    this.changeEvent.notify();
  };
  a.generateDragBlockObserver = function() {
    var a = this.dragBlock;
    a && (this.dragBlockObserver && this.removeDragBlockObserver(), this.dragBlockObserver = a.observe(this, "cloneThread", ["x", "y"], !1));
  };
  a.removeDragBlockObserver = function() {
    var a = this.dragBlockObserver;
    null !== a && (a.destroy(), this.dragBlockObserver = null);
  };
  a.cloneThread = function(a) {
    a = void 0 === a ? !0 : a;
    if (null !== this.dragBlock) {
      this.dragBlockObserver && this.removeDragBlockObserver();
      var c = this._svgWidth, d = this.dragBlock, e = d.block, f = this.code, g = e.getThread();
      e && g && (f.cloneThread(g), a && d.observe(this, "moveBoardBlock", ["x", "y"], !1), d.dominate(), a = this.workspace.getBoard(), this._boardBlockView = a.code.cloneThread(g).getFirstBlock().view, this._boardBlockView.dragInstance = new Entry.DragInstance({height:0, isNew:!0}), a.set({dragBlock:this._boardBlockView}), a.setSelectedBlock(this._boardBlockView), this._boardBlockView.addDragging(), this._boardBlockView.dragMode = Entry.DRAG_MODE_MOUSEDOWN, this._boardBlockView._moveTo(d.x - c, 
      d.y - 0, !1));
      if (this._boardBlockView) {
        return this._boardBlockView.block.id;
      }
    }
  };
  a.terminateDrag = function() {
    if (this._boardBlockView) {
      var a = this._boardBlockView;
      if (a) {
        var c = a.block, d = this.dragBlock, e = d.block, f = this.code, g = this.workspace, h = g.getBoard().code, k = !1;
        a.dragMode = 0;
        a.removeDragging();
        d.x < this._svgWidth ? (k = !0, h.destroyThread(c.getThread(), k)) : c.view.terminateDrag();
        g.getBoard().set({dragBlock:null});
        f.destroyThread(e.getThread(), k);
        delete a.dragInstance;
        this._boardBlockView = null;
      }
    }
  };
  a.dominate = function(a) {
    this.snap.append(a.svgGroup);
  };
  a.getCode = function(a) {
    return this._code;
  };
  a.moveBoardBlock = function() {
    var a = this.workspace.getBoard().offset, c = this.offset, d = a.left - c.left, a = a.top - c.top, e = this.dragBlock, c = this._boardBlockView, f = c.dragInstance, g = Entry.mouseCoordinate;
    f.set({offsetX:g.x, offsetY:g.y});
    if (0 === f.height) {
      for (var g = c.block, h = 0;g;) {
        h += g.view.height, g = g.next;
      }
      f.set({height:h});
    }
    e && c && (f = e.x, e = e.y, c.dragMode = 2, c._moveTo(f - d, e - a, !1));
  };
  a.setMagnetedBlock = function() {
  };
  a.findById = function(a) {
    for (var c = this.code.getThreads(), d = 0, e = c.length;d < e;d++) {
      var f = c[d];
      if (f && (f = f.getFirstBlock()) && f.id == a) {
        return f;
      }
    }
  };
  a.setSelectedBlock = function(a) {
    var c = this.selectedBlockView;
    c && c.removeSelected();
    a instanceof Entry.BlockView ? a.addSelected() : a = null;
    this.set({selectedBlockView:a});
  };
})(Entry.BlockMenu.prototype);
Entry.BlockView = function(a, b) {
  Entry.Model(this, !1);
  this.block = a;
  this._board = b;
  this.set(a);
  this.svgGroup = b.svgBlockGroup.group();
  this.svgGroup.block = this.block;
  this._schema = Entry.block[a.type];
  this._skeleton = Entry.skeleton[this._schema.skeleton];
  this._contents = [];
  this.isInBlockMenu = !(this.getBoard() instanceof Entry.Board);
  this._skeleton.morph && this.block.observe(this, "_renderPath", this._skeleton.morph, !1);
  this.prevObserver = null;
  this._startRender(a);
  this.block.observe(this, "_bindPrev", ["prev"]);
  this.block.observe(this, "_createEmptyBG", ["next"]);
  this.observe(this, "_updateBG", ["magneting"]);
  b.code.observe(this, "_setBoard", ["board"], !1);
  this.dragMode = Entry.DRAG_MODE_NONE;
  Entry.Utils.disableContextmenu(this.svgGroup.node);
};
(function(a) {
  a.schema = {id:0, type:Entry.STATIC.BLOCK_RENDER_MODEL, x:0, y:0, offsetX:0, offsetY:0, width:0, height:0, contentWidth:0, contentHeight:0, magneting:!1, animating:!1};
  a._startRender = function(a) {
    this.svgGroup.attr({class:"block"});
    a = this._skeleton.path(this);
    this._darkenPath = this.svgGroup.path(a);
    this._darkenPath.attr({transform:"t0 1", fill:Entry.Utils.colorDarken(this._schema.color, .7)});
    this._path = this.svgGroup.path(a);
    this._path.attr({strokeWidth:"2", fill:this._schema.color});
    this._moveTo(this.x, this.y, !1);
    this._startContentRender();
    this._addControl();
  };
  a._startContentRender = function() {
    this.contentSvgGroup && this.contentSvgGroup.remove();
    this.contentSvgGroup = this.svgGroup.group();
    var a = this._skeleton.contentPos();
    this.contentSvgGroup.transform("t" + a.x + " " + a.y);
    for (var a = this._schema.contents, c = 0;c < a.length;c++) {
      var d = a[c];
      "string" === typeof d ? this._contents.push(new Entry.FieldText({text:d}, this)) : this._contents.push(new Entry["Field" + d.type](d, this));
    }
    this.alignContent(!1);
  };
  a.alignContent = function(a) {
    !0 !== a && (a = !1);
    for (var c = 0, d = 0, e = 0;e < this._contents.length;e++) {
      d = this._contents[e];
      d.align(c, 0, a);
      e !== this._contents.length - 1 && (c += 5);
      var f = d.box, d = Math.max(f.y + f.height), c = c + f.width;
    }
    this.set({contentWidth:c, contentHeight:d});
    this._render();
  };
  a._bindPrev = function() {
    this.prevObserver && this.prevObserver.destroy();
    this.block.prev ? (this._toLocalCoordinate(this.block.prev.view.svgGroup), this.prevObserver = this.block.prev.view.observe(this, "_align", ["height"])) : (this._toGlobalCoordinate(), delete this.prevObserver);
  };
  a._render = function() {
    this._renderPath();
    this.set(this._skeleton.box(this));
  };
  a._renderPath = function() {
    var a = this._skeleton.path(this);
    this._darkenPath.attr({d:a});
    this._path.attr({d:a});
    this.set({animating:!1});
  };
  a._align = function(a) {
    if (null !== this.block.prev) {
      var c = this.block.prev.view;
      !0 === a && this.set({animating:!0});
      this.set({x:0, y:c.height + 1});
      this._setPosition(!0 === a || this.animating);
    }
  };
  a._setPosition = function(a) {
    a = void 0 === a ? !0 : a;
    var c = "t" + this.x + " " + this.y;
    this.svgGroup.stop();
    a && 0 !== Entry.ANIMATION_DURATION ? this.svgGroup.animate({transform:c}, Entry.ANIMATION_DURATION, mina.easeinout) : $(this.svgGroup.node).attr({transform:"translate(" + this.x + " " + this.y + ")"});
  };
  a._toLocalCoordinate = function(a) {
    var c = a.transform().globalMatrix, d = this.svgGroup.transform().globalMatrix;
    this._moveTo(d.e - c.e, d.f - c.f, !1);
    a.append(this.svgGroup);
  };
  a._toGlobalCoordinate = function() {
    var a = this.svgGroup.transform().globalMatrix;
    this._moveTo(a.e, a.f, !1);
    this._board.svgBlockGroup.append(this.svgGroup);
  };
  a._moveTo = function(a, c, d) {
    this.set({x:a, y:c});
    this._setPosition(d);
  };
  a._moveBy = function(a, c, d) {
    return this._moveTo(this.x + a, this.y + c, d);
  };
  a._addControl = function() {
    var a = this;
    this.svgGroup.mousedown(function() {
      a.onMouseDown.apply(a, arguments);
    });
  };
  a.onMouseDown = function(a) {
    function c(a) {
      var b = k.mouseDownCoordinate;
      if ((k.dragMode == Entry.DRAG_MODE_DRAG || a.pageX !== b.x || a.pageY !== b.y) && k.block.isMovable()) {
        k.block.prev && (k.block.prev.setNext(null), k.block.setPrev(null), k.block.thread.changeEvent.notify());
        this.animating && this.set({animating:!1});
        if (0 === k.dragInstance.height) {
          for (var b = k.block, c = -1;b;) {
            c += b.view.height + 1, b = b.next;
          }
          k.dragInstance.set({height:c});
        }
        a.originalEvent.touches && (a = a.originalEvent.touches[0]);
        b = k.dragInstance;
        k._moveBy(a.pageX - b.offsetX, a.pageY - b.offsetY, !1);
        b.set({offsetX:a.pageX, offsetY:a.pageY});
        k.dragMode = Entry.DRAG_MODE_DRAG;
        (a = k._getCloseBlock()) ? (l = a.view.getBoard(), l.setMagnetedBlock(a.view)) : l.setMagnetedBlock(null);
      }
    }
    function d(a) {
      $(document).unbind(".block");
      delete this.mouseDownCoordinate;
      k.terminateDrag();
      l && l.set({dragBlock:null});
      delete k.dragInstance;
    }
    a.stopPropagation();
    a.preventDefault();
    Entry.documentMousedown && Entry.documentMousedown.notify();
    this.getBoard().setSelectedBlock(this);
    this.dominate();
    if (0 === a.button || a instanceof Touch) {
      this.mouseDownCoordinate = {x:a.pageX, y:a.pageY};
      var e = $(document);
      e.bind("mousemove.block", c);
      e.bind("mouseup.block", d);
      e.bind("touchmove.block", c);
      e.bind("touchend.block", d);
      this.getBoard().set({dragBlock:this});
      this.dragInstance = new Entry.DragInstance({startX:a.pageX, startY:a.pageY, offsetX:a.pageX, offsetY:a.pageY, prev:this.block.prev, height:0, mode:!0});
      this.addDragging();
      this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
    } else {
      if (Entry.Utils.isRightButton(a)) {
        var f = this, g = f.block;
        if (this.isInBlockMenu || g.isReadOnly()) {
          return;
        }
        var e = [], h = {text:"\ube14\ub85d \uc0ad\uc81c", enable:g.isDeletable(), callback:function() {
          f.block.doDestroyAlone(!0);
        }};
        e.push({text:"\ube14\ub85d \ubcf5\uc0ac & \ubd99\uc5ec\ub123\uae30", callback:function() {
          for (var a = g.getThread(), b = a.getBlocks().indexOf(g), c = a.toJSON(!0, b), b = [], d = new Entry.Thread([], g.getCode()), e = 0;e < c.length;e++) {
            b.push(new Entry.Block(c[e], d));
          }
          c = f.svgGroup.transform().globalMatrix;
          b[0].set({x:c.e + 20, y:c.f + 20});
          b[0].doAdd();
          a.getCode().createThread(b);
        }});
        e.push(h);
        Entry.ContextMenu.show(e);
      }
    }
    var k = this, l = this.getBoard();
    a.stopPropagation();
  };
  a.terminateDrag = function() {
    var a = this.getBoard(), c = this.dragMode, d = this.block;
    this.removeDragging();
    if (a instanceof Entry.BlockMenu) {
      a.terminateDrag();
    } else {
      if (c !== Entry.DRAG_MODE_MOUSEDOWN) {
        this.dragInstance && this.dragInstance.isNew && d.doAdd();
        var e = this.dragInstance && this.dragInstance.prev, f = this._getCloseBlock();
        e || f ? f ? (this.set({animating:!0}), f.next && f.next.view.set({animating:!0}), d.doInsert(f), createjs.Sound.play("entryMagneting")) : d.doSeparate() : c == Entry.DRAG_MODE_DRAG && d.doMove();
        a.setMagnetedBlock(null);
      }
    }
    this.dragMode = Entry.DRAG_MODE_NONE;
    this.destroyShadow();
  };
  a._getCloseBlock = function() {
    var a = this.getBoard(), c = a instanceof Entry.BlockMenu, d = this.x, e = this.y;
    c && (d -= a._svgWidth, a = a.workspace.getBoard());
    var f = a.relativeOffset, d = Snap.getElementByPoint(d + f.left, e + f.top);
    if (null !== d) {
      for (e = d.block;!e && d.parent() && "svg" !== d.type && "BODY" !== d.type;) {
        d = d.parent(), e = d.block;
      }
      return void 0 === e || e === this.block ? null : c ? e : e.view.getBoard() == a ? e : null;
    }
  };
  a._inheritAnimate = function() {
    var a = this.block.prev.view;
    a && this.set({animating:a.animating});
  };
  a.dominate = function() {
    for (var a = this.getBoard().svgBlockGroup, c = this.svgGroup;c.parent() !== a;) {
      c = c.parent();
    }
    a.append(c);
  };
  a.getBoard = function() {
    return this._board;
  };
  a._setBoard = function() {
    this._board = this._board.code.board;
  };
  a.destroy = function(a) {
    var c = this.svgGroup;
    a ? c.animate({opacity:0}, 100, null, function() {
      this.remove();
    }) : c.remove();
  };
  a.getShadow = function() {
    this._shadow || (this._shadow = this.svgGroup.clone(), this._shadow.attr({opacity:.5}));
    return this._shadow;
  };
  a.destroyShadow = function() {
    delete this._shadow;
  };
  a._updateBG = function() {
    if (this._board.dragBlock && this._board.dragBlock.dragInstance) {
      var a = this._board.dragBlock.dragInstance.height, c = this, d = c.svgGroup;
      if (c.magneting) {
        var e = this._board.dragBlock.getShadow();
        $(e.node).attr({transform:"translate(0 " + (this.height + 1) + ")"});
        this.svgGroup.prepend(e);
        this._clonedShadow = e;
        c.background && (c.background.remove(), c.nextBackground.remove(), delete c.background, delete c.nextBackground);
        a = c.height + a;
        e = d.rect(0 - c.width / 2, 1.5 * c.height + 1, c.width, Math.max(0, a - 1.5 * c.height));
        e.block = c.block.next;
        c.nextBackground = e;
        e.attr({fill:"transparent"});
        d.prepend(e);
        e = d.rect(0 - c.width / 2, 0, c.width, a);
        c.background = e;
        e.attr({fill:"transparent"});
        d.prepend(e);
        c.originalHeight = c.height;
        c.set({height:a});
      } else {
        if (this._clonedShadow && (this._clonedShadow.remove(), delete this._clonedShadow), a = c.originalHeight) {
          setTimeout(function() {
            c.background && (c.background.remove(), c.nextBackground.remove(), delete c.background, delete c.nextBackground);
          }, Entry.ANIMATION_DURATION), c.set({height:a}), delete c.originalHeight;
        }
      }
      c.block.thread.changeEvent.notify();
    }
  };
  a._createEmptyBG = function() {
    if (this.block.next) {
      this.emptyBackground && (this.emptyBackground.remove(), delete this.emptyBackground);
    } else {
      var a = this.svgGroup.rect(0 + this.offsetX, this.height, this.width, 20);
      this.emptyBackground = a;
      a.attr({fill:"transparent"});
      this.svgGroup.prepend(a);
    }
  };
  a.addDragging = function() {
    this.svgGroup.addClass("dragging");
  };
  a.removeDragging = function() {
    this.svgGroup.removeClass("dragging");
  };
  a.addSelected = function() {
    this.svgGroup.addClass("selected");
  };
  a.removeSelected = function() {
    this.svgGroup.removeClass("selected");
  };
  a.getSkeleton = function() {
    return this._skeleton;
  };
})(Entry.BlockView.prototype);
Entry.Code = function(a) {
  Entry.Model(this, !1);
  this._data = new Entry.Collection;
  this._eventMap = {};
  this.executors = [];
  this.executeEndEvent = new Entry.Event(this);
  this.changeEvent = new Entry.Event(this);
  this.load(a);
};
(function(a) {
  a.schema = {view:null, board:null};
  a.load = function(a) {
    if (!(a instanceof Array)) {
      return console.error("code must be array");
    }
    for (var c = 0;c < a.length;c++) {
      this._data.push(new Entry.Thread(a[c], this));
    }
  };
  a.createView = function(a) {
    null === this.view ? this.set({view:new Entry.CodeView(this, a), board:a}) : (this.set({board:a}), a.bindCodeView(this.view));
  };
  a.registerEvent = function(a, c) {
    this._eventMap[c] || (this._eventMap[c] = []);
    this._eventMap[c].push(a);
  };
  a.raiseEvent = function(a) {
    a = this._eventMap[a];
    if (void 0 !== a) {
      for (var c = 0;c < a.length;c++) {
        this.executors.push(new Entry.Executor(a[c]));
      }
    }
  };
  a.getEventMap = function(a) {
    return this._eventMap;
  };
  a.map = function(a) {
    this._data.map(a);
  };
  a.tick = function() {
    for (var a = this.executors, c = 0;c < a.length;c++) {
      var d = a[c];
      d.execute();
      null === d.scope.block && (a.splice(c, 1), c--, 0 === a.length && this.executeEndEvent.notify());
    }
  };
  a.clearExecutors = function() {
    this.executors = [];
  };
  a.createThread = function(a) {
    if (!(a instanceof Array)) {
      return console.error("blocks must be array");
    }
    this._data.push(new Entry.Thread(a, this));
  };
  a.cloneThread = function(a) {
    a = a.clone(this);
    this._data.push(a);
    return a;
  };
  a.destroyThread = function(a, c) {
    var d = this._data, e = d.indexOf(a);
    0 > e || (d.splice(e, 1), (d = a.getFirstBlock()) && d.destroy(c));
  };
  a.doDestroyThread = function(a, c) {
    var d = this._data, e = d.indexOf(a);
    0 > e || (d.splice(e, 1), (d = a.getFirstBlock()) && d.doDestroy(c));
  };
  a.getThreads = function() {
    return this._data;
  };
  a.toJSON = function() {
    for (var a = this.getThreads(), c = [], d = 0, e = a.length;d < e;d++) {
      c.push(a[d].toJSON());
    }
    return c;
  };
  a.countBlock = function() {
    for (var a = this.getThreads(), c = 0, d = 0;d < a.length;d++) {
      c += a[d].countBlock();
    }
    return c;
  };
  a.moveBy = function(a, c) {
    for (var d = this.getThreads(), e = 0, f = d.length;e < f;e++) {
      var g = d[e].getFirstBlock();
      g && g.view._moveBy(a, c, !1);
    }
  };
  a.stringify = function() {
    return JSON.stringify(this.toJSON());
  };
})(Entry.Code.prototype);
Entry.CodeView = function(a, b) {
  Entry.Model(this, !1);
  this.code = a;
  this.set({board:b});
  this.svgThreadGroup = b.svgGroup.group();
  this.svgThreadGroup.attr({class:"svgThreadGroup"});
  this.svgThreadGroup.board = b;
  this.svgBlockGroup = b.svgGroup.group();
  this.svgBlockGroup.attr({class:"svgBlockGroup"});
  this.svgBlockGroup.board = b;
  b.bindCodeView(this);
  this.code.map(function(a) {
    a.createView(b);
  });
  a.observe(this, "_setBoard", ["board"]);
};
(function(a) {
  a.schema = {board:null, scrollX:0, scrollY:0};
  a._setBoard = function() {
    this.set({board:this.code.board});
  };
})(Entry.CodeView.prototype);
Entry.Executor = function(a) {
  this.scope = {block:a, executor:this};
  this._callStack = [];
};
(function(a) {
  a.execute = function() {
    void 0 === this.scope.block._schema.func.call(this.scope) && (this.scope = {block:this.scope.block.next, executor:this});
    null === this.scope.block && this._callStack.length && (this.scope = this._callStack.pop());
  };
  a.stepInto = function(a) {
    a instanceof Entry.Thread || console.error("Must step in to thread");
    this._callStack.push(this.scope);
    a = a.getFirstBlock();
    a instanceof Entry.DummyBlock && (a = a.next);
    this.scope = {block:a, executor:this};
  };
})(Entry.Executor.prototype);
Entry.FieldDropdown = function(a, b) {
  this._block = b.block;
  this.box = new Entry.BoxModel;
  this.svgGroup = null;
  this._contents = a;
  this.key = a.key;
  this.value = this._block.values[this.key];
  this.renderStart(b);
};
(function(a) {
  a.renderStart = function(a) {
    var c = this;
    this.svgGroup = a.contentSvgGroup.group();
    this.svgGroup.attr({class:"entry-field-dropdown"});
    this.textElement = this.svgGroup.text(2, 3, this.getTextByValue(this.value));
    a = this.textElement.node.getComputedTextLength() + 18;
    this._header = this.svgGroup.rect(0, -12, a, 23, 3).attr({fill:"#80cbf8"});
    this.svgGroup.append(this.textElement);
    this._arrow = this.svgGroup.polygon(0, -2, 6, -2, 3, 2).attr({fill:"#127cbd", stroke:"#127cbd", transform:"t" + (a - 11) + " 0"});
    this.svgGroup.mouseup(function(a) {
      c._block.view.dragMode == Entry.DRAG_MODE_MOUSEDOWN && c.renderOptions();
    });
    this.box.set({x:0, y:0, width:a, height:23});
  };
  a.resize = function() {
    var a = this.textElement.node.getComputedTextLength() + 18;
    this._header.attr({width:a});
    this._arrow.attr({transform:"t" + (a - 11) + " 0"});
    this.box.set({width:a});
    this._block.view.alignContent();
  };
  a.renderOptions = function() {
    var a = this;
    this.destroyOption();
    var c = this._block.view;
    this.documentDownEvent = Entry.documentMousedown.attach(this, function() {
      Entry.documentMousedown.detach(this.documentDownEvent);
      a.optionGroup.remove();
    });
    this.optionGroup = c.getBoard().svgGroup.group();
    var d = c.svgGroup.transform().globalMatrix, c = this._contents.options;
    this.optionGroup.attr({class:"entry-field-dropdown", transform:"t" + (d.e - 60) + " " + (d.f + 35)});
    var d = [], e = 0;
    d.push(this.optionGroup.rect(0, 0, 0, 23 * c.length).attr({fill:"white"}));
    for (var f = 0, g = c.length;f < g;f++) {
      var h = c[f], k = h[0], h = h[1], l = this.optionGroup.group().attr({class:"rect", transform:"t0 " + 23 * f});
      d.push(l.rect(0, 0, 0, 23));
      this.value == h && l.text(5, 13, "\u2713").attr({"alignment-baseline":"central"});
      k = l.text(20, 13, k).attr({"alignment-baseline":"central"});
      e = Math.max(k.node.getComputedTextLength() + 50, e);
      (function(c, d) {
        c.mousedown(function() {
          a.applyValue(d);
          a.destroyOption();
        });
      })(l, h);
    }
    var n = {width:e};
    d.forEach(function(a) {
      a.attr(n);
    });
  };
  a.align = function(a, c, d) {
    var e = this.svgGroup, f = "t" + a + " " + c;
    void 0 === d || d ? e.animate({transform:f}, 300, mina.easeinout) : e.attr({transform:f});
    this.box.set({x:a, y:c});
  };
  a.applyValue = function(a) {
    this.value != a && (this.value = this._block.values[this.key] = a, this.textElement.node.textContent = this.getTextByValue(a), this.resize());
  };
  a.destroyOption = function() {
    this.documentDownEvent && (Entry.documentMousedown.detach(this.documentDownEvent), delete this.documentDownEvent);
    this.optionGroup && (this.optionGroup.remove(), delete this.optionGroup);
  };
  a.getTextByValue = function(a) {
    for (var c = this._contents.options, d = 0, e = c.length;d < e;d++) {
      var f = c[d];
      if (f[1] == a) {
        return f[0];
      }
    }
    return a;
  };
})(Entry.FieldDropdown.prototype);
Entry.FieldImage = function(a, b) {
  this._block = b;
  this.box = new Entry.BoxModel;
  this._size = a.size;
  this._imgUrl = a.img;
  this._highlightColor = a.highlightColor ? a.highlightColor : "#F59900";
  this._position = a.position;
  this._imgElement = this._path = this.svgGroup = null;
  this.renderStart();
};
(function(a) {
  a.renderStart = function() {
    this.svgGroup = this._block.contentSvgGroup.group();
    this._imgElement = this.svgGroup.image(this._imgUrl, 0, -.5 * this._size, this._size, this._size);
    this.box.set({x:this._size, y:0, width:this._size, height:this._size});
  };
  a.align = function(a, c, d) {
    var e = this.svgGroup;
    this._position && (a = this._position.x);
    var f = "t" + a + " " + c;
    void 0 === d || d ? e.animate({transform:f}, 300, mina.easeinout) : e.attr({transform:f});
    this.box.set({x:a, y:c});
  };
  a.enableHighlight = function() {
    var a = this._path.getTotalLength(), c = this._path;
    this._path.attr({stroke:this._highlightColor, strokeWidth:2, "stroke-linecap":"round", "stroke-dasharray":a + " " + a, "stroke-dashoffset":a});
    setInterval(function() {
      c.attr({"stroke-dashoffset":a}).animate({"stroke-dashoffset":0}, 300);
    }, 1400, mina.easeout);
    setTimeout(function() {
      setInterval(function() {
        c.animate({"stroke-dashoffset":-a}, 300);
      }, 1400, mina.easeout);
    }, 500);
  };
})(Entry.FieldImage.prototype);
Entry.FieldIndicator = function(a, b) {
  this._block = b;
  this.box = new Entry.BoxModel;
  this._size = a.size;
  this._imgUrl = a.img;
  this._boxMultiplier = a.boxMultiplier || 2;
  this._highlightColor = a.highlightColor ? a.highlightColor : "#F59900";
  this._position = a.position;
  this._imgElement = this._path = this.svgGroup = null;
  this.renderStart();
};
(function(a) {
  a.renderStart = function() {
    this.svgGroup = this._block.contentSvgGroup.group();
    this._imgElement = this.svgGroup.image(this._imgUrl, -1 * this._size, -1 * this._size, 2 * this._size, 2 * this._size);
    var a = "m 0,-%s a %s,%s 0 1,1 -0.1,0 z".replace(/%s/gi, this._size);
    this._path = this.svgGroup.path(a);
    this._path.attr({stroke:"none", fill:"none"});
    this.box.set({x:this._size, y:0, width:this._size * this._boxMultiplier, height:this._size * this._boxMultiplier});
  };
  a.align = function(a, c, d) {
    var e = this.svgGroup;
    this._position && (a = this._position.x, c = this._position.y);
    var f = "t" + a + " " + c;
    void 0 === d || d ? e.animate({transform:f}, 300, mina.easeinout) : e.attr({transform:f});
    this.box.set({x:a, y:c});
  };
  a.enableHighlight = function() {
    var a = this._path.getTotalLength(), c = this._path;
    this._path.attr({stroke:this._highlightColor, strokeWidth:2, "stroke-linecap":"round", "stroke-dasharray":a + " " + a, "stroke-dashoffset":a});
    setInterval(function() {
      c.attr({"stroke-dashoffset":a}).animate({"stroke-dashoffset":0}, 300);
    }, 1400, mina.easeout);
    setTimeout(function() {
      setInterval(function() {
        c.animate({"stroke-dashoffset":-a}, 300);
      }, 1400, mina.easeout);
    }, 500);
  };
})(Entry.FieldIndicator.prototype);
Entry.FieldStatement = function(a, b) {
  this._blockView = b;
  this.block = b.block;
  this.key = a.key;
  this.box = new Entry.BoxModel;
  this.acceptType = a.accept;
  this.dummyBlock = this.svgGroup = null;
  a.alignX && (this._alignX = a.alignX);
  a.alignY && (this._alignY = a.alignY);
  this.box.observe(b, "alignContent", ["height"]);
  this.renderStart(b.getBoard());
  this.block.observe(this, "_updateThread", ["thread"]);
};
(function(a) {
  a.renderStart = function(a) {
    this.svgGroup = this._blockView.contentSvgGroup.group();
    this.box.set({x:46, y:0, width:20, height:20});
    this._thread = this._blockView.block.values[this.key];
    this.dummyBlock = new Entry.DummyBlock(this, this._blockView);
    this._thread.insertDummyBlock(this.dummyBlock);
    this._thread.createView(a);
    this._thread.changeEvent.attach(this, this.calcHeight);
    this.calcHeight();
  };
  a.calcHeight = function() {
    for (var a = this.dummyBlock, c = -1;a;) {
      c += a.view.height + 1, a = a.next;
    }
    this.box.set({height:c});
  };
  a.align = function(a, c, d) {
    var e = this.svgGroup;
    a = this._alignX || 46;
    c = this._alignY || 14;
    a = "t" + a + " " + c;
    void 0 === d || d ? e.animate({transform:a}, 300, mina.easeinout) : e.attr({transform:a});
  };
  a._updateThread = function() {
    this._threadChangeEvent && this._thread.changeEvent.detach(this._threadChangeEvent);
    var a = this.block.thread;
    this._threadChangeEvent = this._thread.changeEvent.attach(this, function() {
      a.changeEvent.notify();
    });
  };
})(Entry.FieldStatement.prototype);
Entry.DummyBlock = function(a, b) {
  Entry.Model(this, !1);
  this.view = this;
  this.originBlockView = b;
  this._schema = {};
  this._thread = a._thread;
  this.statementField = a;
  this.svgGroup = a.svgGroup.group();
  this.svgGroup.block = this;
  var c = Entry.skeleton[a.acceptType].box();
  this.path = this.svgGroup.rect(c.offsetX, c.offsetY - 10, c.width, c.height);
  this.path.attr({fill:"transparent"});
  this.prevObserver = b.observe(this, "_align", ["x", "y"]);
  this.prevAnimatingObserver = b.observe(this, "_inheritAnimate", ["animating"]);
  this.observe(this, "_updateBG", ["magneting"]);
  this._align();
};
(function(a) {
  a.schema = {x:0, y:0, width:0, height:0, animating:!1, magneting:!1};
  a._align = function(a) {
    this.set({x:this.originBlockView.x, y:this.originBlockView.y});
  };
  a.insertAfter = function(a) {
    this._thread.insertByBlock(this, a);
    this.statementField.calcHeight();
  };
  a.createView = function() {
  };
  a.setThread = function() {
  };
  a.setPrev = function() {
  };
  a.setNext = function(a) {
    this.next = a;
  };
  a.getBoard = function() {
    return this.originBlockView.getBoard();
  };
  a._inheritAnimate = function() {
    this.set({animating:this.originBlockView.animating});
  };
  a._updateBG = function() {
    if (this.magneting) {
      var a = this.getBoard().dragBlock.dragInstance.height;
      this.set({height:a});
      a = this.getBoard().dragBlock.getShadow();
      a.attr({transform:"t0 0"});
      this.svgGroup.prepend(a);
      this._clonedShadow = a;
    } else {
      this._clonedShadow && (this._clonedShadow.remove(), delete this._clonedShadow), this.set({height:0});
    }
    this._thread.changeEvent.notify();
  };
  a.dominate = function() {
    this.originBlockView.dominate();
  };
})(Entry.DummyBlock.prototype);
Entry.FieldText = function(a, b) {
  this._block = b;
  this.box = new Entry.BoxModel;
  this._fontSize = a.fontSize || b.getSkeleton().fontSize || 12;
  this._text = a.text;
  this.textElement = null;
  this.renderStart();
};
(function(a) {
  a.renderStart = function() {
    this.textElement = this._block.contentSvgGroup.text(0, 0, this._text);
    this.textElement.attr({style:"white-space: pre; font-size:" + this._fontSize + "px", "class":"dragNone", fill:"white"});
    var a = this.textElement.getBBox();
    this.textElement.attr({y:.25 * a.height});
    this.box.set({x:0, y:0, width:this.textElement.node.getComputedTextLength(), height:a.height});
  };
  a.align = function(a, c, d) {
    !0 !== d && (d = !1);
    var e = this.textElement, f = {x:a};
    d ? e.animate(f, 300, mina.easeinout) : e.attr(f);
    this.box.set({x:a, width:this.textElement.node.getComputedTextLength(), y:c});
  };
})(Entry.FieldText.prototype);
Entry.Scroller = function(a, b, c) {
  this._horizontal = void 0 === b ? !0 : b;
  this._vertical = void 0 === c ? !0 : c;
  this.board = a;
  this.board.changeEvent.attach(this, this.resizeScrollBar);
  this.svgGroup = null;
  this.vRatio = this.vY = this.vWidth = this.hRatio = this.hX = this.hWidth = 0;
  this._visible = !0;
  this.createScrollBar();
  Entry.windowResized && Entry.windowResized.attach(this, this.resizeScrollBar);
};
Entry.Scroller.RADIUS = 7;
(function(a) {
  a.createScrollBar = function() {
    var a = Entry.Scroller.RADIUS, c = this;
    this.svgGroup = this.board.snap.group().attr({class:"boardScrollbar"});
    this._horizontal && (this.hScrollbar = this.svgGroup.rect(0, 0, 0, 2 * a, a), this.hScrollbar.mousedown(function(a) {
      function b(a) {
        a.stopPropagation();
        a.preventDefault();
        a.originalEvent.touches && (a = a.originalEvent.touches[0]);
        var d = c.dragInstance;
        c.scroll((a.pageX - d.offsetX) / c.hRatio, 0);
        d.set({offsetX:a.pageX, offsetY:a.pageY});
      }
      function f(a) {
        $(document).unbind(".scroll");
        delete c.dragInstance;
      }
      if (0 === a.button || a instanceof Touch) {
        Entry.documentMousedown && Entry.documentMousedown.notify(a);
        var g = $(document);
        g.bind("mousemove.scroll", b);
        g.bind("mouseup.scroll", f);
        g.bind("touchmove.scroll", b);
        g.bind("touchend.scroll", f);
        c.dragInstance = new Entry.DragInstance({startX:a.pageX, startY:a.pageY, offsetX:a.pageX, offsetY:a.pageY});
      }
      a.stopPropagation();
    }));
    this._vertical && (this.vScrollbar = this.svgGroup.rect(0, 0, 2 * a, 0, a), this.vScrollbar.mousedown(function(a) {
      function b(a) {
        a.stopPropagation();
        a.preventDefault();
        a.originalEvent.touches && (a = a.originalEvent.touches[0]);
        var d = c.dragInstance;
        c.scroll(0, (a.pageY - d.offsetY) / c.vRatio);
        d.set({offsetX:a.pageX, offsetY:a.pageY});
      }
      function f(a) {
        $(document).unbind(".scroll");
        delete c.dragInstance;
      }
      if (0 === a.button || a instanceof Touch) {
        Entry.documentMousedown && Entry.documentMousedown.notify(a);
        var g = $(document);
        g.bind("mousemove.scroll", b);
        g.bind("mouseup.scroll", f);
        g.bind("touchmove.scroll", b);
        g.bind("touchend.scroll", f);
        c.dragInstance = new Entry.DragInstance({startX:a.pageX, startY:a.pageY, offsetX:a.pageX, offsetY:a.pageY});
      }
      a.stopPropagation();
    }));
    this.resizeScrollBar();
  };
  a.resizeScrollBar = function() {
    var a = this.board.svgBlockGroup.getBBox(), c = this.board.svgDom, d = c.width(), c = c.height();
    this.setVisible(!0);
    if (this._horizontal) {
      var e = -a.width + Entry.BOARD_PADDING, f = d - Entry.BOARD_PADDING, g = (d + 2 * Entry.Scroller.RADIUS) * a.width / (f - e + a.width);
      isNaN(g) && (g = 0);
      this.hX = (a.x - e) / (f - e) * (d - g - 2 * Entry.Scroller.RADIUS);
      this.hScrollbar.attr({width:g, x:this.hX, y:c - 2 * Entry.Scroller.RADIUS});
      this.hRatio = (d - g - 2 * Entry.Scroller.RADIUS) / (f - e);
    }
    this._vertical && (e = -a.height + Entry.BOARD_PADDING, f = c - Entry.BOARD_PADDING, g = (c + 2 * Entry.Scroller.RADIUS) * a.height / (f - e + a.height), this.vY = (a.y - e) / (f - e) * (c - g - 2 * Entry.Scroller.RADIUS), this.vScrollbar.attr({height:g, y:this.vY, x:d - 2 * Entry.Scroller.RADIUS}), this.vRatio = (c - g - 2 * Entry.Scroller.RADIUS) / (f - e));
  };
  a.updateScrollBar = function(a, c) {
    this._horizontal && (this.hX += a * this.hRatio, this.hScrollbar.attr({x:this.hX}));
    this._vertical && (this.vY += c * this.vRatio, this.vScrollbar.attr({y:this.vY}));
  };
  a.scroll = function(a, c) {
    var d = this.board.svgBlockGroup.getBBox(), e = this.board.svgDom;
    a = Math.max(-d.width + Entry.BOARD_PADDING - d.x, a);
    c = Math.max(-d.height + Entry.BOARD_PADDING - d.y, c);
    a = Math.min(e.width() - Entry.BOARD_PADDING - d.x, a);
    c = Math.min(e.height() - Entry.BOARD_PADDING - d.y, c);
    this.board.code.moveBy(a, c);
    this.updateScrollBar(a, c);
  };
  a.setVisible = function(a) {
    a != this.isVisible() && (this._visible = a, this.svgGroup.attr({display:!0 === a ? "block" : "none"}));
  };
  a.isVisible = function() {
    return this._visible;
  };
})(Entry.Scroller.prototype);
Entry.skeleton = function() {
};
Entry.skeleton.basic = {path:function(a) {
  a = a.contentWidth;
  a = Math.max(0, a - 6);
  return "m -8,0 l 8,8 8,-8 h %w a 15,15 0 0,1 0,30 h -%w l -8,8 -8,-8 v -30 z".replace(/%w/gi, a);
}, box:function(a) {
  return {offsetX:0, offsetY:0, width:(a ? a.contentWidth : 150) + 30, height:30, marginBottom:0};
}, magnets:{previous:{}, next:{x:0, y:31}}, contentPos:function(a) {
  return {x:14, y:15};
}};
Entry.skeleton.basic_event = {path:function(a) {
  a = a.contentWidth;
  a = Math.max(0, a);
  return "m -8,0 m 0,-5 a 19.5,19.5 0, 0,1 16,0 c 10,5 15,5 20,5 h %w a 15,15 0 0,1 0,30 H 8 l -8,8 -8,-8 l 0,0.5 a 19.5,19.5 0, 0,1 0,-35 z".replace(/%w/gi, a - 30);
}, box:function(a) {
  return {offsetX:0, offsetY:0, width:a.contentWidth + 30, height:30, marginBottom:0};
}, magnets:{previous:{}, next:{x:0, y:31}}, contentPos:function(a) {
  return {x:1, y:15};
}};
Entry.skeleton.basic_loop = {path:function(a) {
  var b = Math.max(a.contentHeight, 25);
  return "m -8,0 l 8,8 8,-8 h %cw a 15,15 0 0,1 0,30 H 24 l -8,8 -8,-8 h -0.4 v %ch h 0.4 l 8,8 8,-8 h %cw h -8 a 8,8 0 0,1 0,16 H 8 l -8,8 -8,-8 z".replace(/%cw/gi, Math.max(0, a.contentWidth - 31)).replace(/%ch/gi, b);
}, magnets:function() {
  return {previous:{x:0, y:0}, next:{x:0, y:105}};
}, box:function(a) {
  return {offsetX:0, offsetY:0, width:a.contentWidth, height:Math.max(a.contentHeight, 25) + 46, marginBottom:0};
}, contentPos:function() {
  return {x:14, y:15};
}};
Entry.skeleton.pebble_event = {path:function(a) {
  return "m 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z";
}, box:function(a) {
  return {offsetX:-25, offsetY:0, width:50, height:48.3, marginBottom:0};
}, magnets:function(a) {
  return {next:{x:0, y:49.3}};
}, contentPos:function() {
  return {x:0, y:25};
}};
Entry.skeleton.pebble_loop = {fontSize:16, path:function(a) {
  a = Math.max(a.contentHeight, 50);
  return "M 0,9 a 9,9 0 0,0 9,-9 h %cw q 25,0 25,25 v %ch q 0,25 -25,25 h -%cw a 9,9 0 0,1 -18,0 h -%cw q -25,0 -25,-25 v -%ch q 0,-25 25,-25 h %cw a 9,9 0 0,0 9,9 M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v %cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z".replace(/%cw/gi, 41).replace(/%ch/gi, a + 4).replace(/%cih/gi, a - 50);
}, magnets:function() {
  return {previous:{x:0, y:0}, next:{x:0, y:105}};
}, box:function(a) {
  return {offsetX:-75, offsetY:0, width:150, height:Math.max(a.contentHeight, 50) + 54, marginBottom:0};
}, contentPos:function() {
  return {x:-46, y:25};
}};
Entry.skeleton.pebble_basic = {fontSize:16, morph:["prev", "next"], path:function(a) {
  var b = a.block;
  a = b.prev && "pebble_basic" === b.prev._schema.skeleton;
  b = b.next && "pebble_basic" === b.next._schema.skeleton;
  return "m 0,9 a 9,9 0 0,0 9,-9 h 28 " + (a ? "l 25,0 0,25" : "q 25,0 25,25") + (b ? "l 0,25 -25,0" : "q 0,25 -25,25") + "h -28 a 9,9 0 0,1 -18,0 h -28 " + (b ? "l -25,0 0,-25" : "q -25,0 -25,-25") + (a ? "l 0,-25 25,0" : "q 0,-25 25,-25") + "h 28 a 9,9 0 0,0 9,9 z";
}, magnets:function() {
  return {previous:{x:0, y:0}, next:{x:0, y:51}};
}, box:function() {
  return {offsetX:-62, offsetY:0, width:124, height:50, marginBottom:0};
}, contentPos:function() {
  return {x:-46, y:25};
}};
Entry.Block = function(a, b) {
  Entry.Model(this, !1);
  this._schema = null;
  this.setThread(b);
  this.load(a);
};
Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = .4;
(function(a) {
  a.schema = {id:null, name:null, x:0, y:0, type:null, values:{}, prev:null, next:null, view:null, thread:null, movable:!0, deletable:!0, readOnly:!1};
  a.load = function(a) {
    a.id || (a.id = Entry.Utils.generateId());
    this.set(a);
    this.getSchema();
  };
  a.getSchema = function() {
    this._schema = Entry.block[this.type];
    this._schema.event && this.thread.registerEvent(this, this._schema.event);
    for (var a = this._schema.contents, c = 0;c < a.length;c++) {
      var d = a[c];
      !this.values[d.key] && d.value && (this.values[d.key] = d.value);
      "Statement" == d.type && (this.values[d.key] = new Entry.Thread(this.values[d.key], this.getCode()));
    }
  };
  a.setThread = function(a) {
    this.set({thread:a});
  };
  a.getThread = function() {
    return this.thread;
  };
  a.setPrev = function(a) {
    a !== this && this.set({prev:a});
  };
  a.setNext = function(a) {
    a !== this && this.set({next:a});
  };
  a.next = function() {
    return this.next;
  };
  a.insertAfter = function(a) {
    this.thread.insertByBlock(this, a);
  };
  a._updatePos = function() {
    this.view && this.set({x:this.view.x, y:this.view.y});
    this.next && this.next._updatePos();
  };
  a.createView = function(a) {
    this.view || (this.set({view:new Entry.BlockView(this, a)}), this._updatePos());
  };
  a.clone = function(a) {
    return new Entry.Block(this.toJSON(!0), a);
  };
  a.toJSON = function(a) {
    var c = this._toJSON();
    delete c.prev;
    delete c.next;
    delete c.view;
    delete c.thread;
    a && delete c.id;
    var d = {}, e;
    for (e in c.values) {
      d[e] = c.values[e];
    }
    c.values = d;
    d = this._schema.contents;
    for (e = 0;e < d.length;e++) {
      var f = d[e];
      "Statement" == f.type && (c.values[f.key] = this.values[f.key].toJSON(a));
    }
    return c;
  };
  a.destroy = function(a) {
    this.view && this.view.destroy(a);
    (!this.prev || this.prev instanceof Entry.DummyBlock) && this.thread.destroy();
    var c = this.values.STATEMENT;
    c && (c = c.getFirstBlock(), c instanceof Entry.DummyBlock && (c = c.next), c && c.destroy(a));
    this.next && this.next.destroy(a);
  };
  a.destroyAlone = function(a) {
    this.view && this.view.destroy(a);
    this.getThread().spliceBlock(this);
  };
  a.getView = function() {
    return this.view;
  };
  a.setMovable = function(a) {
    this.movable != a && this.set({movable:a});
  };
  a.isMovable = function() {
    return this.movable;
  };
  a.setDeletable = function(a) {
    this.deletable != a && this.set({deletable:a});
  };
  a.isDeletable = function() {
    return this.deletable;
  };
  a.isReadOnly = function() {
    return this.readOnly;
  };
  a.getCode = function() {
    return this.thread.getCode();
  };
  a.doAdd = function() {
    var a = this.id;
    console.log("doAdd", a);
    Entry.activityReporter && (a = [["blockId", a], ["code", this.getCode().stringify()]], Entry.activityReporter.add(new Entry.Activity("addBlock", a)));
    this.getCode().changeEvent.notify();
  };
  a.doMove = function() {
    var a = this.id, c = this.view.x - this.x, d = this.view.y - this.y;
    console.log("doMove", a, c, d);
    this._updatePos();
    this.getCode().changeEvent.notify();
    Entry.activityReporter && (a = [["blockId", a], ["moveX", c], ["moveY", d], ["code", this.getCode().stringify()]], Entry.activityReporter.add(new Entry.Activity("moveBlock", a)));
  };
  a.doSeparate = function() {
    var a = this.id, c = this.x, d = this.y;
    console.log("separate", a, c, d);
    this.thread.separate(this);
    this._updatePos();
    this.getCode().changeEvent.notify();
    Entry.activityReporter && (a = [["blockId", a], ["positionX", c], ["positionY", d], ["code", this.getCode().stringify()]], Entry.activityReporter.add(new Entry.Activity("seperateBlock", a)));
  };
  a.doInsert = function(a) {
    var c = this.id, d = a.id, e = this.x, f = this.y;
    console.log("insert", c, d, e, f);
    var g = this.thread.cut(this);
    a.insertAfter(g);
    this._updatePos();
    this.getCode().changeEvent.notify();
    Entry.activityReporter && (a = [["targetBlockId", d], ["blockId", c], ["positionX", e], ["positionY", f], ["code", this.getCode().stringify()]], Entry.activityReporter.add(new Entry.Activity("insertBlock", a)));
  };
  a.doDestroy = function(a) {
    var c = this.id, d = this.x, e = this.y;
    console.log("destroy", c, d, e);
    this.destroy(a);
    this.getCode().changeEvent.notify();
    Entry.activityReporter && (a = [["blockId", c], ["positionX", d], ["positionY", e], ["code", this.getCode().stringify()]], Entry.activityReporter.add(new Entry.Activity("destroyBlock", a)));
  };
  a.doDestroyAlone = function(a) {
    if (this.isDeletable()) {
      var c = this.id, d = this.x, e = this.y;
      console.log("destroy alone", c, d, e);
      this.destroyAlone(a);
      this.getCode().changeEvent.notify();
      Entry.activityReporter && (a = [["blockId", c], ["positionX", d], ["positionY", e], ["code", this.getCode().stringify()]], Entry.activityReporter.add(new Entry.Activity("destroyBlockAlone", a)));
      return !0;
    }
  };
})(Entry.Block.prototype);
Entry.Thread = function(a, b) {
  this._data = new Entry.Collection;
  this._code = b;
  this.changeEvent = new Entry.Event(this);
  this.changeEvent.attach(this, this.inspectExist);
  this.load(a);
};
(function(a) {
  a.load = function(a) {
    void 0 === a && (a = []);
    if (!(a instanceof Array)) {
      return console.error("thread must be array");
    }
    for (var c = 0;c < a.length;c++) {
      var d = a[c];
      d instanceof Entry.Block || d instanceof Entry.DummyBlock ? (d.setThread(this), this._data.push(d)) : this._data.push(new Entry.Block(d, this));
    }
    this._setRelation();
    (a = this._code.view) && this.createView(a.board);
  };
  a._setRelation = function() {
    var a = this._data.getAll();
    if (0 !== a.length) {
      var c = a[0];
      c.setPrev(null);
      a[a.length - 1].setNext(null);
      for (var d = 1;d < a.length;d++) {
        var e = a[d];
        e.setPrev(c);
        c.setNext(e);
        c = e;
      }
    }
  };
  a.registerEvent = function(a, c) {
    this._code.registerEvent(a, c);
  };
  a.createView = function(a) {
    this.view || (this.view = new Entry.ThreadView(this, a));
    this._data.map(function(c) {
      c.createView(a);
    });
  };
  a.separate = function(a) {
    this._data.has(a.id) && (a.prev && (a.prev.setNext(null), a.setPrev(null)), a = this._data.splice(this._data.indexOf(a)), this._code.createThread(a), this.changeEvent.notify());
  };
  a.cut = function(a) {
    a = this._data.indexOf(a);
    var c = this._data.splice(a);
    this._data[a - 1] && this._data[a - 1].setNext(null);
    this.changeEvent.notify();
    return c;
  };
  a.insertDummyBlock = function(a) {
    this._data.unshift(a);
    this._data[1] && (this._data[1].setPrev(a), a.setNext(this._data[1]));
  };
  a.insertByBlock = function(a, c) {
    var d = this._data.indexOf(a);
    a.setNext(c[0]);
    c[0].setPrev(a);
    for (var e in c) {
      c[e].setThread(this);
    }
    this._data.splice.apply(this._data, [d + 1, 0].concat(c));
    this._setRelation();
    this.changeEvent.notify();
  };
  a.clone = function(a) {
    a = a || this._code;
    a = new Entry.Thread([], a);
    for (var c = this._data, d = [], e = 0, f = c.length;e < f;e++) {
      d.push(c[e].clone(a));
    }
    a.load(d);
    return a;
  };
  a.toJSON = function(a, c) {
    for (var d = [], e = void 0 === c ? 0 : c;e < this._data.length;e++) {
      this._data[e] instanceof Entry.Block && d.push(this._data[e].toJSON(a));
    }
    return d;
  };
  a.destroy = function(a) {
    this._code.destroyThread(this, !1);
    this.view && this.view.destroy(a);
  };
  a.getFirstBlock = function() {
    return this._data[0];
  };
  a.getBlocks = function() {
    return this._data;
  };
  a.countBlock = function() {
    for (var a = 0, c = 0;c < this._data.length;c++) {
      var d = this._data[c];
      if (d.type) {
        a++;
        for (var e = Entry.block[d.type].contents, f = 0;f < e.length;f++) {
          var g = e[f];
          "Statement" == g.type && (a += d.values[g.key].countBlock());
        }
      }
    }
    return a;
  };
  a.inspectExist = function() {
  };
  a.getCode = function() {
    return this._code;
  };
  a.setCode = function(a) {
    this._code = a;
  };
  a.spliceBlock = function(a) {
    var c = this.getBlocks();
    c.remove(a);
    0 !== c.length ? (null === a.prev ? a.next.setPrev(null) : null === a.next ? a.prev.setNext(null) : (a.prev.setNext(a.next), a.next.setPrev(a.prev)), this._setRelation()) : this.destroy();
    this.changeEvent.notify();
  };
})(Entry.Thread.prototype);
Entry.ThreadView = function(a, b) {
  Entry.Model(this, !1);
  this.thread = a;
  this.svgGroup = b.svgThreadGroup.group();
};
(function(a) {
  a.schema = {scrollX:0, scrollY:0};
  a.destroy = function() {
    this.svgGroup.remove();
  };
})(Entry.ThreadView.prototype);
Entry.FieldTrashcan = function(a) {
  this.board = a;
  this.svgGroup = a.snap.group();
  this.renderStart();
  this.dragBlockObserver = this.dragBlock = null;
  this.isOver = !1;
  a.observe(this, "updateDragBlock", ["dragBlock"]);
  this.setPosition();
  Entry.windowResized && Entry.windowResized.attach(this, this.setPosition);
};
(function(a) {
  a.renderStart = function() {
    var a = Entry.mediaFilePath + "delete_";
    this.trashcanTop = this.svgGroup.image(a + "cover.png", 0, 0, 60, 20);
    this.trashcan = this.svgGroup.image(a + "body.png", 0, 20, 60, 60);
    a = this.svgGroup.filter(Snap.filter.shadow(1, 1, 2));
    this.svgGroup.attr({filter:a});
  };
  a.updateDragBlock = function() {
    var a = this.board.dragBlock, c = this.dragBlockObserver;
    a ? a.observe(this, "checkBlock", ["x", "y"]) : (c && c.destroy(), this.isOver && this.dragBlock && (this.dragBlock.block.doDestroy(!0), createjs.Sound.play("entryDelete")), this.tAnimation(!1));
    this.dragBlock = a;
  };
  a.checkBlock = function() {
    var a = this.dragBlock;
    if (a && a.block.isDeletable()) {
      var c = this.board.offset, d = this.getPosition(), e = d.x + c.left, c = d.y + c.top, f, g;
      if (a = a.dragInstance) {
        f = a.offsetX, g = a.offsetY;
      }
      this.tAnimation(f >= e && g >= c);
    }
  };
  a.align = function() {
    var a = this.getPosition();
    this.svgGroup.attr({transform:"t" + a.x + " " + a.y});
  };
  a.setPosition = function() {
    var a = this.board.svgDom;
    this._x = a.width() - 110;
    this._y = a.height() - 110;
    this.align();
  };
  a.getPosition = function() {
    return {x:this._x, y:this._y};
  };
  a.tAnimation = function(a) {
    if (a !== this.isOver) {
      a = void 0 === a ? !0 : a;
      var c = this.trashcanTop;
      a ? c.animate({transform:"t5 -20 r30"}, 50) : c.animate({transform:"r0"}, 50);
      this.isOver = a;
    }
  };
})(Entry.FieldTrashcan.prototype);
Entry.Board = function(a) {
  function b(a) {
    var b = $(window);
    a = b.scrollTop();
    var b = b.scrollLeft(), f = c.offset;
    c.relativeOffset = {top:f.top - a, left:f.left - b};
    console.log("update");
  }
  a = "string" === typeof a ? $("#" + a) : $(a);
  if ("DIV" !== a.prop("tagName")) {
    return console.error("Dom is not div element");
  }
  if ("function" !== typeof window.Snap) {
    return console.error("Snap library is required");
  }
  Entry.Model(this, !1);
  this.svgDom = Entry.Dom($('<svg id="play" class="entryBoard" width="100%" height="100%"version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'), {parent:a});
  this.offset = this.svgDom.offset();
  this.offset.top = 130;
  this.offset.left -= $(window).scrollLeft();
  this.relativeOffset = this.offset;
  var c = this;
  $(window).scroll(b);
  Entry.windowResized.attach(this, b);
  this.snap = Snap("#play");
  this._blockViews = [];
  this.trashcan = new Entry.FieldTrashcan(this);
  this.svgGroup = this.snap.group();
  this.svgThreadGroup = this.svgGroup.group();
  this.svgThreadGroup.board = this;
  this.svgBlockGroup = this.svgGroup.group();
  this.svgBlockGroup.board = this;
  Entry.ANIMATION_DURATION = 200;
  Entry.BOARD_PADDING = 100;
  this.changeEvent = new Entry.Event(this);
  this.scroller = new Entry.Scroller(this, !0, !0);
  this._addControl(a);
  Entry.documentMousedown && Entry.documentMousedown.attach(this, this.setSelectedBlock);
  Entry.keyPressed && Entry.keyPressed.attach(this, this._keyboardControl);
};
(function(a) {
  a.schema = {code:null, dragBlock:null, magnetedBlockView:null, selectedBlockView:null};
  a.changeCode = function(a) {
    this.codeListener && this.code.changeEvent.detach(this.codeListener);
    this.set({code:a});
    var c = this;
    this.codeListener = this.code.changeEvent.attach(this, function() {
      c.changeEvent.notify();
    });
    a.createView(this);
    this.changeEvent.notify();
  };
  a.bindCodeView = function(a) {
    this.svgBlockGroup.remove();
    this.svgThreadGroup.remove();
    this.svgBlockGroup = a.svgBlockGroup;
    this.svgThreadGroup = a.svgThreadGroup;
    this.svgGroup.append(this.svgThreadGroup);
    this.svgGroup.append(this.svgBlockGroup);
  };
  a.setMagnetedBlock = function(a) {
    if (this.magnetedBlockView) {
      if (this.magnetedBlockView === a) {
        return;
      }
      this.magnetedBlockView.set({magneting:!1});
    }
    this.set({magnetedBlockView:a});
    a && (a.set({magneting:!0, animating:!0}), a.dominate(), this.dragBlock.dominate());
  };
  a.getCode = function() {
    return this.code;
  };
  a.findById = function(a) {
    for (var c = this.code.getThreads(), d = 0, e = c.length;d < e;d++) {
      var f = c[d];
      if (f) {
        for (var f = f.getBlocks(), g = 0, e = f.length;g < e;g++) {
          if (f[g] && f[g].id == a) {
            return f[g];
          }
        }
      }
    }
  };
  a._addControl = function(a) {
    var c = this;
    a.mousedown(function() {
      c.onMouseDown.apply(c, arguments);
    });
    a.bind("touchstart", function() {
      c.onMouseDown.apply(c, arguments);
    });
    a.on("mousewheel", function() {
      c.mouseWheel.apply(c, arguments);
    });
  };
  a.onMouseDown = function(a) {
    function c(a) {
      a.stopPropagation();
      a.preventDefault();
      a.originalEvent.touches && (a = a.originalEvent.touches[0]);
      var b = f.dragInstance;
      f.scroller.scroll(a.pageX - b.offsetX, a.pageY - b.offsetY);
      b.set({offsetX:a.pageX, offsetY:a.pageY});
    }
    function d(a) {
      $(document).unbind(".entryBoard");
      delete f.dragInstance;
    }
    a.originalEvent.touches && (a = a.originalEvent.touches[0]);
    if (0 === a.button || a instanceof Touch) {
      Entry.documentMousedown && Entry.documentMousedown.notify(a);
      var e = $(document);
      e.bind("mousemove.entryBoard", c);
      e.bind("mouseup.entryBoard", d);
      e.bind("touchmove.entryBoard", c);
      e.bind("touchend.entryBoard", d);
      this.dragInstance = new Entry.DragInstance({startX:a.pageX, startY:a.pageY, offsetX:a.pageX, offsetY:a.pageY});
    }
    var f = this;
    a.stopPropagation();
  };
  a.mouseWheel = function(a) {
    a = a.originalEvent;
    this.scroller.scroll(a.wheelDeltaX || -a.deltaX, a.wheelDeltaY || -a.deltaY);
  };
  a.setSelectedBlock = function(a) {
    var c = this.selectedBlockView;
    c && c.removeSelected();
    a instanceof Entry.BlockView ? a.addSelected() : a = null;
    this.set({selectedBlockView:a});
  };
  a._keyboardControl = function(a, c) {
    var d = this.selectedBlockView;
    d && 46 == c.keyCode && d.block.doDestroyAlone(!0) && this.set({selectedBlockView:null});
  };
})(Entry.Board.prototype);
Entry.Workspace = function(a, b) {
  Entry.Model(this, !1);
  a.workspace = this;
  b.workspace = this;
  this._blockMenu = a;
  this._board = b;
  this.svgGroup = a.snap.group();
  this._stopEvent = new Entry.Event(this);
};
(function(a) {
  a.getBoard = function() {
    return this._board;
  };
  a.getBlockMenu = function() {
    return this._blockMenu;
  };
  a.playAddBlock = function(a) {
    var c = this, d;
    a.cloneId ? (d = this._blockMenu.findById(a.cloneId)) || (d = this._board.findById(a.cloneId)) : d = this._blockMenu.findById(a.target);
    if (d) {
      if (a.dest.id) {
        var e = this._board.findById(a.dest.id);
        a.dest.x = this.getBlockMenu()._svgWidth + e.view.x;
        a.dest.y = e.view.y + e.view.height;
      }
      var f = d.view, g = f.getBoard();
      g.set({dragBlock:f});
      d = g.cloneThread();
      a.cloneId = d;
      (d = f.moveBoardBlockObserver) && d.destroy();
      d = a.dest.x;
      e = a.dest.y;
      f._moveTo(d, e, !0, a.duration - 300);
      var h = this.getBoard().offset, k = this.getBlockMenu().offset, l = h.left - k.left, h = h.top - k.top;
      this.getBoard().dragBlock._moveTo(d - l, e - h, !0, a.duration - 300);
      setTimeout(function() {
        f._align(!0);
        var d = f._getCloseBlock();
        d ? g.setMagnetedBlock(d.view) : g.setMagnetedBlock(null);
        f.terminateDrag();
        g && g.set({dragBoard:null});
        c._stopEvent.notify(a);
      }, a.duration - 300);
    }
  };
  a.playMoveBlock = function(a) {
    var c = this, d;
    console.log("cloneId=", a.cloneId);
    d = a.cloneId ? this._board.findById(a.cloneId) : this._board.findById(a.target);
    if (a.dest.id) {
      var e = this._board.findById(a.dest.id);
      a.dest.x = this.getBlockMenu()._svgWidth + e.view.x;
      a.dest.y = e.view.y + e.view.height;
    }
    var f = d.view, g = f.getBoard();
    g.set({dragBlock:f});
    (d = f.moveBoardBlockObserver) && d.destroy();
    d = a.dest.x;
    e = a.dest.y;
    f._moveTo(d, e, !0, a.duration - 300);
    var h = this.getBoard().offset, k = this.getBlockMenu().offset;
    f._moveTo(d - (h.left - k.left), e - (h.top - k.top), !0, a.duration - 300);
    setTimeout(function() {
      f._align(!0);
      var d = f._getCloseBlock();
      d ? g.setMagnetedBlock(d.view) : g.setMagnetedBlock(null);
      f.terminateDrag();
      g && g.set({dragBoard:null});
      c._stopEvent.notify(a);
    }, a.duration - 300);
  };
  a.moveMouse = function(a, c) {
  };
  a.generateImage = function(a) {
    var c = this.getBoard().svgDom[0], d = c.clientWidth / 2, c = c.clientHeight / 2;
    this.svgGroup = this._board.snap.group();
    this.image = this.svgGroup.image(a, d, c, 30, 30);
  };
})(Entry.Workspace.prototype);
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

