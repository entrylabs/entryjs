/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a UI block menu.
 * @author kyumin92@gmail.com
 */
'use strict';

goog.provide('Blockly.BlockMenu');

goog.require('Blockly.Workspace');


/**
 * Class for UI Block Menu
 * @param {!Element} element HTML div for block menu.
 * @constructor
 */
Blockly.BlockMenu = function(element) {

  /**
   * List of background buttons that lurk behind each block to catch clicks
   * landing in the blocks' lakes and bays.
   * @type {!Array.<!Element>}
   * @private
   */
  this.buttons_ = [];

  /**
   * List of split line.
   */
  this.splitters_ = [];

  /**
   * List of buttons.
   */
  this.buttons_ = [];

  /**
   * List of event listeners.
   * @type {!Array.<!Array>}
   * @private
   */
  this.listeners_ = [];

  this.isViewOnly = false;

  this.isCenterAlign = false;

  this.targetWorkspace = Blockly.mainWorkspace;

  this.bannedClass = [];

  this.view_ = element;
  this.menuView_ = Blockly.createSvgElement('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'class': 'blocklySvg'
  }, this.view_);
  var blockMenu = this;
  this.workspace_ = new Blockly.Workspace(
      function() {return blockMenu.getMetrics_();},
      function(ratio) {return blockMenu.setMetrics_(ratio);});
  this.menuView_.appendChild(this.workspace_.createDom());
  this.scrollbar_ = new Blockly.Scrollbar(this.workspace_, false, false);
  this.onResizeWrapper_ = Blockly.bindEvent_(window,
      goog.events.EventType.RESIZE, this, this.syncViewSize_);

  Blockly.bindEvent_(window, 'resize', this, this.updateSplitters);

  var width = Blockly.BlockMenu.BTN_WIDTH;
  var height = Blockly.BlockMenu.BTN_HEIGHT;
  var round = Blockly.BlockMenu.BTN_ROUND;
  var paths = [];
  paths.push('m ' + round + ',0');
  paths.push('h', width - 2 * round);
  paths.push('a', round + ',' + round + ' 0, 0,1 ' + round + ',' + round);
  paths.push('v', height - 2 * round);
  paths.push('a', round + ',' + round + ' 0, 0,1 -' + round + ',' + round);
  paths.push('h', - width + 2 * round);
  paths.push('a', round + ',' + round + ' 0, 0,1 -' + round + ',-' + round);
  paths.push('v', - height + 2 * round);
  paths.push('a', round + ',' + round + ' 0, 0,1 ' + round + ',-' + round);
  paths.push('z');
  this.btnPath = paths.join(' ');
};

Blockly.BlockMenu.BTN_HEIGHT = 30;
Blockly.BlockMenu.BTN_WIDTH = 140;
Blockly.BlockMenu.BTN_ROUND = 6;
Blockly.BlockMenu.BTN_FONT_SIZE = '9pt';

/**
 * how and populate the blockmenu.
 * @param {!Array|string} xmlList List of blocks to show.
 *     Variables and procedures have a custom set of blocks.
 */
Blockly.BlockMenu.prototype.show = function(xmlList) {
  this.hide();
  var margin = 0;
  this.menuView_.style.display = 'block';

  // Create the blocks to be shown in this blockMenu.
  var blocks = [];
  var gaps = [];
  if (xmlList == Blockly.Variables.NAME_TYPE) {
    // Special category for variables.
    Blockly.Variables.blockMenuCategory(blocks, gaps, margin,
        /** @type {!Blockly.Workspace} */ (this.workspace_));
  } else if (xmlList == Blockly.Procedures.NAME_TYPE) {
    // Special category for procedures.
    Blockly.Procedures.blockMenuCategory(blocks, gaps, margin,
        /** @type {!Blockly.Workspace} */ (this.workspace_));
  } else {
    for (var i = 0, xml; xml = xmlList[i]; i++) {
      if (xml.tagName && xml.tagName.toUpperCase() == 'BLOCK') {
        var block = Blockly.Xml.domToBlock(
            /** @type {!Blockly.Workspace} */ (this.workspace_), xml);
        block.isInFlyout = true;
        blocks.push(block);
        gaps.push(margin);
      } else if (xml.tagName && xml.tagName.toUpperCase() == 'SPLITTER') {
        blocks.push('splitter');
        gaps.push(0);
      } else if (xml.tagName && xml.tagName.toUpperCase() == 'BTN') {
        blocks.push(xml);
        gaps.push(margin);
      }
    }
  }

  // Lay out the blocks vertically.
  var cursorY = 10;
  for (var i = 0, block; block = blocks[i]; i++) {
    if (block == 'splitter') {
      var previousBlock = blocks[i - 1];
      var y = previousBlock.outputConnection ? cursorY : cursorY + 5;
      var splitter = this.createSplitter(64, y,
        this.view_.style.width.substr(0,3));
      this.workspace_.svgBlockCanvas_.appendChild(splitter);
      this.splitters_.push(splitter);
      cursorY += 10;
      continue;
    } else if (block.tagName && block.tagName.toUpperCase() == 'BTN') {
      var height = Number(block.getAttribute('height'));
      var button = Blockly.createSvgElement('g', {
                      'transform': 'translate(' + (10) + ', ' + cursorY + ')',
                      'class': 'blocklyBlockMenuBtn'
                    }, null);
      if (height) {
        var image = Blockly.createSvgElement('image',
            {'x': 0, 'y': 0,
            'width': block.getAttribute('width') + 'px',
            'height': height + 'px'
            }, button);
        image.setAttributeNS("http://www.w3.org/1999/xlink",
          'xlink:href', block.getAttribute('src'));
        var highlightImage = Blockly.createSvgElement('image',
            {'x': 0, 'y': 0,
            'width': block.getAttribute('width') + 'px',
            'height': height + 'px',
            'class': 'blocklyBlockMenuBtnHighlight'
            }, button);
        highlightImage.setAttributeNS("http://www.w3.org/1999/xlink",
          'xlink:href', block.getAttribute('highlightSrc'));
        cursorY += height + 15;
      } else {
        var text = block.getAttribute('text');
        var width = Blockly.BlockMenu.BTN_WIDTH;
        var height = Blockly.BlockMenu.BTN_HEIGHT;
        Blockly.createSvgElement('path', {
          'transform': 'translate(1,1)', 'd': this.btnPath, 'fill': '#aaa'
        }, button);
        Blockly.createSvgElement('path', {
          'd': this.btnPath, 'fill': '#eee',
          'class': 'blocklyBlockMenuBtnPath'
        }, button);
        var textElement = Blockly.createSvgElement('text', {
          'x': width/2 + 'px', 'y': (height/2 + 4) + 'px',
          'font-family': 'ng',
          'font-size': Blockly.BlockMenu.BTN_FONT_SIZE,
          'text-anchor': 'middle'
          }, button);
        var textNode = document.createTextNode(eval(text));
        textElement.appendChild(textNode);
        cursorY += height + 13;
      }
      var onclickFunc = block.getAttribute('onclick');
      if (onclickFunc && !this.isViewOnly) {
          button.onclick = (function (func){
            return function () {eval(func)};
          })(onclickFunc);
      }
      this.workspace_.svgBlockCanvas_.appendChild(button);
      this.buttons_.push(button);
      continue;
    } else {
      var allBlocks = block.getDescendants();
      for (var j = 0, child; child = allBlocks[j]; j++) {
        // Mark blocks as being inside a blockMenu.  This is used to detect and
        // prevent the closure of the blockMenu if the user right-clicks on such a
        // block.
        child.isInFlyout = true;
        // There is no good way to handle comment bubbles inside the blockMenu.
        // Blocks shouldn't come with predefined comments, but someone will
        // try this, I'm sure.  Kill the comment.
        Blockly.Comment && child.setCommentText(null);
      }
      block.render();
      var root = block.getSvgRoot();
      var blockHW = block.getHeightWidth();
      var x = 10;
      if (this.isCenterAlign) {
        x = 200 - blockHW.width/2;
      } else if (block.outputConnection) {
        x += blockHW.height/2;
        var bType = block.type;
          if (bType == 'get_variable' || bType == 'get_canvas_input_value'
             || bType == 'value_of_index_from_list' || bType == 'length_of_list') {
              cursorY += 12;
          }
        if (block.outputConnection.check_[0].toUpperCase() == "PARAM") {
          x += 9;
          cursorY += 4;
        }
      } else if (!block.previousConnection && block.nextConnection){
        x += 10;
        cursorY += 10;
      } else {
        cursorY += 7;
      }
      block.moveBy(x, cursorY);
      if (!block.previousConnection && !block.nextConnection){
        cursorY += 10;
      }

      cursorY += blockHW.height + gaps[i];

      if (block.isAddable() && !this.isViewOnly) {
        this.listeners_.push(Blockly.bindEvent_(root, 'mousedown', null,
            this.blockMouseDown_(block)));
      }
    }
  }
  this.width_ = 0;
  //if (block && block.svg_ && block.svg_.svgGroup_)
      //console.log(block.svg_.svgGroup_);

  this.reflow();

  //this.filterForCapacity_();

  // Fire a resize event to update the blockMenu's scrollbar.
  Blockly.fireUiEvent(window, 'resize');
  this.reflowWrapper_ = Blockly.bindEvent_(this.workspace_.getCanvas(),
      'blocklyWorkspaceChange', this, this.reflow);
  this.workspace_.fireChangeEvent();
  return cursorY;
};

Blockly.BlockMenu.prototype.banClass = function(className) {
    var index = this.bannedClass.indexOf(className);
    if (index < 0)
        this.bannedClass.push(className);
}

Blockly.BlockMenu.prototype.unbanClass = function(className) {
    var index = this.bannedClass.indexOf(className);
    if (index > -1)
        this.bannedClass.splice(index, 1);
}

Blockly.BlockMenu.prototype.checkBanClass = function(blockInfo) {
    var isNotFor = blockInfo.isNotFor;
    for (var i in this.bannedClass) {
        if (isNotFor && isNotFor.indexOf(this.bannedClass[i]) > -1)
            return true;
    }
    return false;
}


/**
 * Show category and populate the blockmenu.
 * @param {object} categoryObject to show.
 */
Blockly.BlockMenu.prototype.showCategory = function(categoryObject) {
  this.hide();
  var margin = 0;
  this.menuView_.style.display = 'block';

  var objectType = Entry.playground.object.objectType;

  // Create the blocks to be shown in this blockMenu.
  var blocks = [];
  var blockNames = categoryObject.blocks;
  var gaps = [];
  var blockClass = "";
  for (var i in blockNames) {
    var blockInfo = EntryStatic.blockInfo[blockNames[i]];
    if (this.checkBanClass(blockInfo))
      continue;
    if (blockClass && blockClass != blockInfo.class) {
      blocks.push('splitter');
      gaps.push(0);
    }

    var xmlText = blockInfo.xml;
    if (blockInfo.xmls)
      var xmls = blockInfo.xmls;
    else
      var xmls = [blockInfo.xml];
    for (var j in xmls) {
      xmlText = xmls[j];
      var xml = jQuery.parseXML(xmlText).childNodes[0];
      if (xml.tagName && xml.tagName.toUpperCase() == 'BTN') {
          blocks.push(xml);
      } else {
          var block = Blockly.Xml.domToBlock(
              /** @type {!Blockly.Workspace} */ (this.workspace_), xml);
          block.isInFlyout = true;
          blocks.push(block);
      }
      gaps.push(margin);
    }
    blockClass = blockInfo.class;
  }

  // Lay out the blocks vertically.
  var cursorY = 10;
  for (var i = 0, block; block = blocks[i]; i++) {
    if (block == 'splitter') {
      var previousBlock = blocks[i - 1];
      var y = previousBlock.outputConnection ? cursorY : cursorY + 5;
      var splitter = this.createSplitter(64, y,
        this.view_.style.width.substr(0,3));
      this.workspace_.svgBlockCanvas_.appendChild(splitter);
      this.splitters_.push(splitter);
      cursorY += 10;
      continue;
    } else if (block.tagName && block.tagName.toUpperCase() == 'BTN') {
      var height = Number(block.getAttribute('height'));
      var button = Blockly.createSvgElement('g', {
                      'transform': 'translate(' + (10) + ', ' + cursorY + ')',
                      'class': 'blocklyBlockMenuBtn'
                    }, null);
      if (height) {
        var image = Blockly.createSvgElement('image',
            {'x': 0, 'y': 0,
            'width': block.getAttribute('width') + 'px',
            'height': height + 'px'
            }, button);
        image.setAttributeNS("http://www.w3.org/1999/xlink",
          'xlink:href', block.getAttribute('src'));
        var highlightImage = Blockly.createSvgElement('image',
            {'x': 0, 'y': 0,
            'width': block.getAttribute('width') + 'px',
            'height': height + 'px',
            'class': 'blocklyBlockMenuBtnHighlight'
            }, button);
        highlightImage.setAttributeNS("http://www.w3.org/1999/xlink",
          'xlink:href', block.getAttribute('highlightSrc'));
        cursorY += height + 10;
      } else {
        var text = block.getAttribute('text');
        var width = Blockly.BlockMenu.BTN_WIDTH;
        var height = Blockly.BlockMenu.BTN_HEIGHT;
        Blockly.createSvgElement('path', {
          'transform': 'translate(1,1)', 'd': this.btnPath, 'fill': '#aaa'
        }, button);
        Blockly.createSvgElement('path', {
          'd': this.btnPath, 'fill': '#eee',
          'class': 'blocklyBlockMenuBtnPath'
        }, button);
        var textElement = Blockly.createSvgElement('text', {
          'x': width/2 + 'px', 'y': (height/2 + 4) + 'px',
          'font-family': 'ng',
          'font-size': Blockly.BlockMenu.BTN_FONT_SIZE,
          'text-anchor': 'middle'
          }, button);
        var textNode = document.createTextNode(eval(text));
        textElement.appendChild(textNode);
        cursorY += height + 13;
      }
      var onclickFunc = block.getAttribute('onclick');
      if (onclickFunc) {
          button.onclick = (function (func){
            return function () {eval(func)};
          })(onclickFunc);
      }
      this.workspace_.svgBlockCanvas_.appendChild(button);
      this.buttons_.push(button);
      continue;
    } else {
      var allBlocks = block.getDescendants();
      for (var j = 0, child; child = allBlocks[j]; j++) {
        // Mark blocks as being inside a blockMenu.  This is used to detect and
        // prevent the closure of the blockMenu if the user right-clicks on such a
        // block.
        child.isInFlyout = true;
        // There is no good way to handle comment bubbles inside the blockMenu.
        // Blocks shouldn't come with predefined comments, but someone will
        // try this, I'm sure.  Kill the comment.
        Blockly.Comment && child.setCommentText(null);
      }
      block.render();
      var root = block.getSvgRoot();
      var blockHW = block.getHeightWidth();
      var x = 10;
      if (this.isCenterAlign) {
        x = 200 - blockHW.width/2;
      } else if (block.outputConnection) {
        x += blockHW.height/2;
        var bType = block.type;
          if (bType == 'get_variable' || bType == 'get_canvas_input_value'
             || bType == 'value_of_index_from_list' || bType == 'length_of_list') {
              cursorY += 12;
          }
        if (block.outputConnection.check_[0].toUpperCase() == "PARAM") {
          x += 9;
          cursorY += 4;
        }
      } else if (!block.previousConnection && block.nextConnection){
        x += 10;
        cursorY += 10;
      } else {
        cursorY += 7;
      }
      block.moveBy(x, cursorY);
      if (!block.previousConnection && !block.nextConnection){
        cursorY += 10;
      }

      cursorY += blockHW.height + gaps[i];

      if (block.isAddable() && !this.isViewOnly) {
        this.listeners_.push(Blockly.bindEvent_(root, 'mousedown', null,
            this.blockMouseDown_(block)));
      }
    }
  }
  this.width_ = 0;
  //if (block && block.svg_ && block.svg_.svgGroup_)
      //console.log(block.svg_.svgGroup_);

  this.reflow();

  //this.filterForCapacity_();

  // Fire a resize event to update the blockMenu's scrollbar.
  Blockly.fireUiEvent(window, 'resize');
  this.reflowWrapper_ = Blockly.bindEvent_(this.workspace_.getCanvas(),
      'blocklyWorkspaceChange', this, this.reflow);
  this.workspace_.fireChangeEvent();
  return cursorY;
};

/**
 * Hide and empty the blockMenu.
 */
Blockly.BlockMenu.prototype.hide = function() {
  // Delete all the event listeners.
  for (var x = 0, listen; listen = this.listeners_[x]; x++) {
    Blockly.unbindEvent_(listen);
  }
  this.listeners_.splice(0);
  if (this.reflowWrapper_) {
    Blockly.unbindEvent_(this.reflowWrapper_);
    this.reflowWrapper_ = null;
  }
  // Delete all the blocks.
  var blocks = this.workspace_.getTopBlocks(false);
  for (var x = 0, block; block = blocks[x]; x++) {
    if (block.workspace == this.workspace_) {
      block.dispose(false, false);
    }
  }
  for (var i in this.splitters_) {
    goog.dom.removeNode(this.splitters_[i]);
  }
  this.splitters_ = [];
  for (var i in this.buttons_) {
    goog.dom.removeNode(this.buttons_[i]);
  }
  this.buttons_ = [];
  // Delete all the background buttons.
  //for (var x = 0, rect; rect = this.buttons_[x]; x++) {
    //goog.dom.removeNode(rect);
  //}
  //this.buttons_.splice(0);
};

/**
 * Hide and empty the blockMenu.
 */
Blockly.BlockMenu.prototype.hide = function() {
  // Delete all the event listeners.
  for (var x = 0, listen; listen = this.listeners_[x]; x++) {
    Blockly.unbindEvent_(listen);
  }
  this.listeners_.splice(0);
  if (this.reflowWrapper_) {
    Blockly.unbindEvent_(this.reflowWrapper_);
    this.reflowWrapper_ = null;
  }
  // Delete all the blocks.
  var blocks = this.workspace_.getTopBlocks(false);
  for (var x = 0, block; block = blocks[x]; x++) {
    if (block.workspace == this.workspace_) {
      block.dispose(false, false);
    }
  }
  for (var i in this.splitters_) {
    goog.dom.removeNode(this.splitters_[i]);
  }
  this.splitters_ = [];
  for (var i in this.buttons_) {
    goog.dom.removeNode(this.buttons_[i]);
  }
  this.buttons_ = [];
  // Delete all the background buttons.
  //for (var x = 0, rect; rect = this.buttons_[x]; x++) {
    //goog.dom.removeNode(rect);
  //}
  //this.buttons_.splice(0);
};

/**
 */
Blockly.BlockMenu.prototype.createSplitter = function(x, y, width) {
  var width = Number(width) - 119;
  var svgGroup = Blockly.createSvgElement('g', {
    'transform': 'translate(' + (x-34) + ', ' + y + ')'
  }, null);
  Blockly.createSvgElement('path',
      {'stroke': '#b5b5b5', 'transform': 'translate(0, 1)',
      'd': 'M0 0 l' + width + ' 0'},
      svgGroup);
  return svgGroup;
};

Blockly.BlockMenu.prototype.updateSplitters = function() {
  var width = Number(this.view_.style.width.substr(0,3)) - 119 + 64;
  for (var i in this.splitters_) {
    var splitter = this.splitters_[i];
    splitter.childNodes[0].setAttribute('d', 'M0 0 l' + width + ' 0');
  }
}

/**
 * Handle a mouse-down on an SVG block in a non-closing blockMenu.
 * @param {!Blockly.Block} originBlock The blockMenu block to copy.
 * @return {!Function} Function to call when block is clicked.
 * @private
 */
Blockly.BlockMenu.prototype.blockMouseDown_ = function(block) {
  var blockMenu = this;
  return function(e) {
    Blockly.terminateDrag_();
    Blockly.hideChaff();
    if (Blockly.isRightButton(e)) {
      // Right-click.
      if (Blockly.ContextMenu) {
        block.showContextMenu_(Blockly.mouseToSvg(e));
      }
    } else {
      // Left-click (or middle click)
      Blockly.removeAllRanges();
      Blockly.setCursorHand_(true);
      // Record the current mouse position.
      Blockly.BlockMenu.startDownEvent_ = e;
      Blockly.BlockMenu.startBlock_ = block;
      Blockly.BlockMenu.startblockMenu_ = blockMenu;
      Blockly.BlockMenu.onMouseUpWrapper_ = Blockly.bindEvent_(document,
          'mouseup', this, Blockly.terminateDrag_);
      Blockly.BlockMenu.onMouseMoveWrapper_ = Blockly.bindEvent_(document,
          'mousemove', this, blockMenu.onMouseMove_);
    }
    // This event has been handled.  No need to bubble up to the document.
    e.stopPropagation();
  };
};

/**
 * Mouse button is down on a block in a non-closing blockMenu.  Create the block
 * if the mouse moves beyond a small radius.  This allows one to play with
 * fields without instantiating blocks that instantly self-destruct.
 * @param {!Event} e Mouse move event.
 * @private
 */
Blockly.BlockMenu.prototype.onMouseMove_ = function(e) {
  if (e.type == 'mousemove' && e.clientX <= 1 && e.clientY == 0 &&
      e.button == 0) {
    /* HACK:
     Safari Mobile 6.0 and Chrome for Android 18.0 fire rogue mousemove events
     on certain touch actions. Ignore events with these signatures.
     This may result in a one-pixel blind spot in other browsers,
     but this shouldn't be noticable. */
    e.stopPropagation();
    return;
  }
  Blockly.removeAllRanges();
  var dx = e.clientX - Blockly.BlockMenu.startDownEvent_.clientX;
  var dy = e.clientY - Blockly.BlockMenu.startDownEvent_.clientY;
  // Still dragging within the sticky DRAG_RADIUS.
  var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  if (dr > Blockly.DRAG_RADIUS) {
    // Create the block.
    Blockly.BlockMenu.startblockMenu_.createBlockFunc_(Blockly.BlockMenu.startBlock_)
        (Blockly.BlockMenu.startDownEvent_);
  }
};

/**
 * Create a copy of this block on the workspace.
 * @param {!Blockly.Block} originBlock The blockMenu block to copy.
 * @return {!Function} Function to call when block is clicked.
 * @private
 */
Blockly.BlockMenu.prototype.createBlockFunc_ = function(originBlock) {
  var blockMenu = this;
  return function(e) {
    Blockly.scrollBarOff = true;
    if (Blockly.isRightButton(e)) {
      // Right-click.  Don't create a block, let the context menu show.
      return;
    }
    if (originBlock.disabled) {
      // Beyond capacity.
      return;
    }

    // Create the new block by cloning the block in the blockMenu (via XML).
    if (typeof(Entry) == "object") {
        Entry.dispatchEvent("entryBlocklyChanged");
    }
    var xml = Blockly.Xml.blockToDom_(originBlock);
    var block = Blockly.Xml.domToBlock(blockMenu.workspace_, xml);
    block.isInBlockMenu = true;
    // Place it in the same spot as the blockMenu copy.
    var svgRootOld = originBlock.getSvgRoot();
    if (!svgRootOld) {
      throw 'originBlock is not rendered.';
    }
    var xyOld = Blockly.getSvgXY_(svgRootOld);
    var svgRootNew = block.getSvgRoot();
    if (!svgRootNew) {
      throw 'block is not rendered.';
    }
    var xyNew = Blockly.getSvgXY_(svgRootNew);
    block.setDragging_(true);
    block.svg_.addSelect();
    block.moveBy(xyOld.x - xyNew.x, xyOld.y - xyNew.y);
    block.startDragX = xyOld.x - xyNew.x;
    block.startDragY = xyOld.y - xyNew.y;

    var workspaceBlock = Blockly.Xml.domToBlock(blockMenu.targetWorkspace, xml);

    var svgRootNewWorkspace = workspaceBlock.getSvgRoot();
    if (!svgRootNewWorkspace) {
      throw 'block is not rendered.';
    }
    var xyNewWorkspace = Blockly.getSvgXY_(svgRootNewWorkspace);

    var workspace = Blockly.mainWorkspace;
    var borderWidth = $(workspace.svgGroup_.parentNode.parentNode).css('border-width');
    borderWidth = borderWidth.substring(0, borderWidth.length-2);
    var blockMenuWorkspace = $(workspace.blockMenu.view_).position();
    var playgroundBlockly = $(workspace.svgGroup_.parentNode.parentNode).eq(0).position();
    var stalkerX = xyOld.x - xyNewWorkspace.x
                   - playgroundBlockly.left
                   + blockMenuWorkspace.left;
    var stalkerY = xyOld.y - xyNewWorkspace.y + blockMenuWorkspace.top
        - playgroundBlockly.top - borderWidth;
    workspaceBlock.moveBy(stalkerX, stalkerY);

    // Start a dragging operation on the new block.
    workspaceBlock.isInBlockMenu = true;
    workspaceBlock.setStalkerBlock(block);
    block.setStalkerBlock(workspaceBlock);
    workspaceBlock.onMouseDown_(e);
  };
};

/**
 * Compute width of flyout.  Position button under each block.
 */
Blockly.BlockMenu.prototype.reflow = function() {
  var blockMenuWidth = 0;
  var margin = this.CORNER_RADIUS;
  var blocks = this.workspace_.getTopBlocks(false);
  for (var x = 0, block; block = blocks[x]; x++) {
    var root = block.getSvgRoot();
    var blockHW = block.getHeightWidth();
    blockMenuWidth = Math.max(blockMenuWidth, blockHW.width);
  }
  this.blockMenuWidth = blockMenuWidth;
  blockMenuWidth += margin + Blockly.BlockSvg.TAB_WIDTH + margin / 2 +
                 Blockly.Scrollbar.scrollbarThickness;
  if (this.width_ != blockMenuWidth) {
    for (var x = 0, block; block = blocks[x]; x++) {
      var blockHW = block.getHeightWidth();
      var blockXY = block.getRelativeToSurfaceXY();
      if (Blockly.RTL) {
        // With the blockMenuWidth known, right-align the blocks.
        var dx = blockMenuWidth - margin - Blockly.BlockSvg.TAB_WIDTH - blockXY.x;
        block.moveBy(dx, 0);
        blockXY.x += dx;
      }
      //if (block.blockMenuRect_) {
        //block.blockMenuRect_.setAttribute('width', blockHW.width);
        //block.blockMenuRect_.setAttribute('height', blockHW.height);
        //block.blockMenuRect_.setAttribute('x',
            //Blockly.RTL ? blockXY.x - blockHW.width : blockXY.x);
        //block.blockMenuRect_.setAttribute('y', blockXY.y);
      //}
    }
    // Record the width for .getMetrics_ and .position_.
    this.width_ = blockMenuWidth;
    // Fire a resize event to update the blockMenu's scrollbar.
    Blockly.fireUiEvent(window, 'resize');
  }
};

/**
 * return metrices for workspace
 * @private
 */
Blockly.BlockMenu.prototype.getMetrics_ = function() {
  var rect = this.view_.getBoundingClientRect();
  try {
    var optionBox = this.workspace_.getCanvas().getBBox();
  } catch (e) {
    // Firefox has trouble with hidden elements (Bug 528969).
    var optionBox = {height: 0, y: 0};
  }
  var metrics = {
    viewHeight: rect.height,
    viewWidth: rect.width,
    contentHeight: optionBox.height + optionBox.y,
    viewTop: -this.workspace_.scrollY,
    contentTop: 0,
    absoluteTop: 0,
    absoluteLeft: 0
  };
  return metrics;
};

/**
 * Sets the Y translation of the flyout to match the scrollbars.
 * @param {!Object} yRatio Contains a y property which is a float
 *     between 0 and 1 specifying the degree of scrolling.
 * @private
 */
Blockly.BlockMenu.prototype.setMetrics_ = function(yRatio) {
  var metrics = this.getMetrics_();
  // This is a fix to an apparent race condition.
  if (!metrics) {
    return;
  }
  if (goog.isNumber(yRatio.y)) {
    this.workspace_.scrollY =
        -metrics.contentHeight * yRatio.y - metrics.contentTop;
  }
  var y = this.workspace_.scrollY + metrics.absoluteTop;
  this.workspace_.getCanvas().setAttribute('transform',
                                           'translate(0,' + y + ')');
};

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Blockly.BlockMenu.terminateDrag_ = function() {
  if (Blockly.BlockMenu.onMouseUpWrapper_) {
    Blockly.unbindEvent_(Blockly.BlockMenu.onMouseUpWrapper_);
    Blockly.BlockMenu.onMouseUpWrapper_ = null;
  }
  if (Blockly.BlockMenu.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.BlockMenu.onMouseMoveWrapper_);
    Blockly.BlockMenu.onMouseMoveWrapper_ = null;
  }
  Blockly.BlockMenu.startDownEvent_ = null;
  Blockly.BlockMenu.startBlock_ = null;
  Blockly.BlockMenu.startFlyout_ = null;
};

/**
 * Update view when window resizing
 * @private
 */
Blockly.BlockMenu.prototype.syncViewSize_ = function() {
  var rect = this.view_.getBoundingClientRect();
  this.menuView_.style.width = rect.width + 'px';
  this.menuView_.style.height = rect.height + 'px';
  this.scrollbar_.resize();
};
