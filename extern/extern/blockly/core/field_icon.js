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
 * @fileoverview Image field.  Used for titles, labels, etc.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldIcon');

goog.require('Blockly.Field');
goog.require('goog.userAgent');


/**
 * Class for an image.
 * @param {string} src The URL of the image.
 * @param {?string} opt_alt Optional alt text for when block is collapsed.
 * @param {?string} type type of icon.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldIcon = function(src, opt_alt, type) {
  this.sourceBlock_ = null;
  this.type = type ? type : "endOrigin";
  if (this.type == "end") {
    // Ensure height and width are numbers.  Strings are bad at math.
    var height = 24;
    var width = 24;
    this.height_ = Number(height);
    this.width_ = Number(width);
    this.iconSize = 0.7;
  } else if ( this.type == "endOrigin" ) {
    var height = 24;
    var width = 24;
    this.height_ = Number(height);
    this.width_ = Number(width);
  } else if ( this.type == "start" ) {
    var height = 34;
    var width = 34;
    this.height_ = Number(height);
    this.width_ = Number(width);
  }
  this.size_ = {height: this.height_, width: this.width_};
  this.text_ = opt_alt || '';
  // Build the DOM.
  var offsetY = 0;
  if (this.type == "end") {
    this.fieldGroup_ = Blockly.createSvgElement('g', {}, null);
    this.circleElement_ = Blockly.createSvgElement('circle',
        {'cx': this.width_/2, 'cy': this.height_/2,
         'r': this.width_/2,
         'y': offsetY}, this.fieldGroup_);
    this.imageElement_ = Blockly.createSvgElement('image',
        {'height': this.height_*this.iconSize + 'px',
         'width': this.width_*this.iconSize + 'px',
         'x': this.width_ * (1 - this.iconSize) / 2,
         'y': this.height_ * (1 - this.iconSize) / 2}, this.fieldGroup_);
    this.setValue(src);
  } else if ( this.type == "endOrigin" ) {
    this.fieldGroup_ = Blockly.createSvgElement('g', {}, null);
    this.imageElement_ = Blockly.createSvgElement('image',
        {'height': this.height_ + 'px',
         'width': this.width_ + 'px',
         'x': 0,
         'y': 0}, this.fieldGroup_);
    this.setValue(src);
  } else if ( this.type == "start" ) {
    this.fieldGroup_ = Blockly.createSvgElement('g', {}, null);
    this.imageElement_ = Blockly.createSvgElement('image',
        {'height': this.height_ + 'px',
         'width': this.width_ + 'px',
         'x': 0,
         'y': -2}, this.fieldGroup_);
    this.setValue(src);
  }
    if (goog.userAgent.GECKO) {
    // Due to a Firefox bug which eats mouse events on image elements,
    // a transparent rectangle needs to be placed on top of the image.
    this.rectElement_ = Blockly.createSvgElement('rect',
        {'height': this.height_ + 'px',
         'width': this.width_ + 'px',
         'y': offsetY,
         'fill-opacity': 0}, this.fieldGroup_);
  }
};
goog.inherits(Blockly.FieldIcon, Blockly.Field);

/**
 * Clone this FieldIcon.
 * @return {!Blockly.FieldIcon} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.FieldIcon.prototype.clone = function() {
  return new Blockly.FieldIcon(this.getSrc(), this.width_, this.height_,
      this.getText());
};

/**
 * Rectangular mask used by Firefox.
 * @type {Element}
 * @private
 */
Blockly.FieldIcon.prototype.rectElement_ = null;

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
Blockly.FieldIcon.prototype.EDITABLE = false;

/**
 * Install this text on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldIcon.prototype.init = function(block) {
  if (this.sourceBlock_) {
    throw 'Image has already been initialized once.';
  }
  this.sourceBlock_ = block;
  block.getSvgRoot().appendChild(this.fieldGroup_);

  // Configure the field to be transparent with respect to tooltips.
  if (!this.type || this.type == "end") {
    var topElement = this.rectElement_ || this.imageElement_;
    topElement.tooltip = this.sourceBlock_;
    var rgb = goog.color.hexToRgb(block.getColour());
    var c = goog.color.darken(rgb, 0.2);
    c = goog.color.rgbToHex(c[0], c[1], c[2]);
    this.circleElement_.style.fill = c;
  } else if ( this.type == "endOrigin" ) {
    var topElement = this.imageElement_;
    topElement.tooltip = this.sourceBlock_;
  } else if ( this.type == "start" ) {
    var topElement = this.imageElement_;
    topElement.tooltip = this.sourceBlock_;
  }

  Blockly.Tooltip && Blockly.Tooltip.bindMouseEvents(topElement);
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
Blockly.FieldIcon.prototype.dispose = function() {
  goog.dom.removeNode(this.fieldGroup_);
  this.fieldGroup_ = null;
  this.imageElement_ = null;
  this.rectElement_ = null;
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
Blockly.FieldIcon.prototype.setTooltip = function(newTip) {
  var topElement = this.rectElement_ || this.imageElement_;
  topElement.tooltip = newTip;
};

/**
 * Get the source URL of this image.
 * @return {string} Current text.
 * @override
 */
Blockly.FieldIcon.prototype.getValue = function() {
  return this.src_;
};

/**
 * Set the source URL of this image.
 * @param {?string} src New source.
 * @override
 */
Blockly.FieldIcon.prototype.setValue = function(src) {
  if (src === null) {
    // No change if null.
    return;
  }
  this.src_ = src;
  this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
      'xlink:href', goog.isString(src) ? src : '');
};

/**
 * Set the alt text of this image.
 * @param {?string} alt New alt text.
 * @override
 */
Blockly.FieldIcon.prototype.setText = function(alt) {
  if (alt === null) {
    // No change if null.
    return;
  }
  this.text_ = alt;
};
