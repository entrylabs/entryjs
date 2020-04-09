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
 * @fileoverview Text input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldKeydownInput');

goog.require('Blockly.Field');
goog.require('Blockly.Msg');
goog.require('goog.asserts');
goog.require('goog.userAgent');


/**
 * Class for an editable text field.
 * @param {string} text The initial content of the field.
 * @param {Function} opt_changeHandler An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldKeydownInput = function(value) {
  this.arrow_ = Blockly.createSvgElement('tspan', {}, null);
  var keyMap = Entry.getKeyCodeMap();
  this.value_ = value;
  Blockly.FieldKeydownInput.superClass_.constructor.call(this, keyMap[value]);
};
goog.inherits(Blockly.FieldKeydownInput, Blockly.Field);

var fkip = Blockly.FieldKeydownInput.prototype;


/**
 * Clone this FieldKeydownInput.
 * @return {!Blockly.FieldTextInput} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
fkip.clone = function() {
  return new Blockly.FieldKeydownInput(this.getText(), this.changeHandler_);
};

/**
 * Create the dropdown field's elements.  Only needs to be called once.
 * @return {!Element} The field's SVG group.
 */
Blockly.FieldKeydownInput.createDom = function() {
  var url = Blockly.mediaFilePath + 'media/keyboard_workspace.png';
  var svgGroup = Blockly.createSvgElement('g',
      {'class': 'blocklyHelperDiv blocklyHidden'}, null);
  var helpImg = Blockly.createSvgElement('image',
      {'class': 'blocklyHelperImg',
       'width': '249',
       'height': '106'
      }, svgGroup);
  helpImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      url);

  Blockly.FieldKeydownInput.helperSvgGroup_ = svgGroup;
  return svgGroup;
};

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
fkip.CURSOR = 'pointer';

/**
 * Dispose of all DOM objects belonging to this editable field.
 */
fkip.dispose = function() {
  Blockly.WidgetDiv.hideIfField(this);
  Blockly.FieldTextInput.superClass_.dispose.call(this);
};

/**
 * Set the text in this field.
 * @param {?string} keycode New text.
 * @override
 */
fkip.setText = function(text) {
  if (text === null)
    return;
  if (!text)
      Blockly.Field.prototype.setText.call(this, '   ');
  else
      Blockly.Field.prototype.setText.call(this, text);
};


/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
fkip.showEditor_ = function() {
  Blockly.WidgetDiv.show(this, this.dispose_());
  var div = Blockly.WidgetDiv.DIV;
  // Create the input.
  var htmlInput = goog.dom.createDom('input', 'blocklyHtmlInput');
  Blockly.FieldTextInput.htmlInput_ = htmlInput;
  div.appendChild(htmlInput);

  htmlInput.value = htmlInput.defaultValue = this.text_;
  htmlInput.oldValue_ = null;
  this.resizeEditor_();
  htmlInput.focus();
  htmlInput.select();

  // Bind to keyup -- trap Enter and Esc; resize after every keystroke.
  htmlInput.onKeyUpWrapper_ =
      Blockly.bindEvent_(htmlInput, 'keyup', this, this.onHtmlInputChange_);
  // Bind to keyPress -- repeatedly resize when holding down a key.
  //htmlInput.onKeyPressWrapper_ =
      //Blockly.bindEvent_(htmlInput, 'keypress', this, this.onHtmlInputChange_);
  htmlInput.onBlurWrapper_ =
      Blockly.bindEvent_(htmlInput, 'blur', this, Blockly.WidgetDiv.hide);
  htmlInput.onBlurWrapper_ =
      Blockly.bindEvent_(htmlInput, 'blur', this, Blockly.FieldKeydownInput.hide);
  var workspaceSvg = this.sourceBlock_.workspace.getCanvas();

  var helperSvgGroup = Blockly.FieldKeydownInput.helperSvgGroup_;
  Blockly.removeClass_(helperSvgGroup, 'blocklyHidden');
  var xy = Blockly.getSvgXY_(/** @type {!Element} */ (this.borderRect_));
  var borderBBox = this.borderRect_.getBBox();
  helperSvgGroup.setAttribute('transform',
      'translate(' + (xy.x - 15 + borderBBox.width/2) + ', ' + (xy.y + 19) + ')');
};


/**
 * Handle a change to the editor.
 * @param {!Event} e Keyboard event.
 * @private
 */
fkip.onHtmlInputChange_ = function(e) {
  var htmlInput = Blockly.FieldTextInput.htmlInput_;
  htmlInput.value = '';
  var c = e.keyCode;
  if ((c>=65 && c<=90) || (c>=37 && c<=40) ||
      (c>=48 && c<=57) ||  c == 32 || c == 13) {
      Blockly.WidgetDiv.hide();
   	  Blockly.FieldKeydownInput.hide();
      this.setValue(c);
  }
};

/**
 * Close the editor, save the results, and dispose of the editable
 * text field's elements.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
fkip.dispose_ = function() {
  var thisField = this;
  return function() {
    var htmlInput = Blockly.FieldTextInput.htmlInput_;
    var text;
    // Save the edit (if it validates).
    text = htmlInput.value;
    // thisField.setText(text);
    thisField.sourceBlock_.render();
    Blockly.unbindEvent_(htmlInput.onKeyUpWrapper_);
    //Blockly.unbindEvent_(htmlInput.onKeyPressWrapper_);
    Blockly.FieldTextInput.htmlInput_ = null;
  };
};

/**
 * Hide the dropdown menu.
 */
Blockly.FieldKeydownInput.hide = function() {
  var helperSvgGroup = Blockly.FieldKeydownInput.helperSvgGroup_;
  if (helperSvgGroup) {
    Blockly.addClass_(helperSvgGroup, 'blocklyHidden');
  }
};

/**
 * Set the language-neutral value for this dropdown menu.
 * @param {string} value New value to set.
 */
fkip.setValue = function(value) {
  this.value_ = value;
  var keyMap = Entry.getKeyCodeMap();
  var text = keyMap[value];
  if (text) {
      this.setText(String(text));
      return;
  } else {
      this.setText(Lang.Blocks.no_target);
      return;
  }
};

/**
 * Get the language-neutral value from this dropdown menu.
 * @return {string} Current text.
 */
fkip.getValue = function() {
  return String(this.value_);
};

/**
 * Resize the editor and the underlying block to fit the text.
 * @private
 */
fkip.resizeEditor_ = function() {
  var div = Blockly.WidgetDiv.DIV;
  var bBox = this.fieldGroup_.getBBox();
  div.style.width = bBox.width + 'px';
  var xy = Blockly.getAbsoluteXY_(/** @type {!Element} */ (this.borderRect_),
                                 this.sourceBlock_.workspace.svgGroup_.parentNode);
  // In RTL mode block fields and LTR input fields the left edge moves,
  // whereas the right edge is fixed.  Reposition the editor.
  if (Blockly.RTL) {
    var borderBBox = this.borderRect_.getBBox();
    xy.x += borderBBox.width;
    xy.x -= div.offsetWidth;
  }
  // Shift by a few pixels to line up exactly.
  xy.y += 1;
  if (goog.userAgent.WEBKIT) {
    xy.y -= 3;
  }
  div.style.left = xy.x + 'px';
  div.style.top = xy.y + 'px';
};
