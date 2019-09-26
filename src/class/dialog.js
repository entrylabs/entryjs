'use strict';

/**
 * @fileoverview Show dialog on canvas
 */

import { GEHelper } from '../graphicEngine/GEHelper';

/**
 * Construct dialog
 * @param {!Entry.EntityObject} entity parent entity
 * @param {!string} message to show on canvas
 * @param {!string} mode is 'speak' or 'think'
 * @constructor
 */
Entry.Dialog = function(entity, message, mode, isStamp) {
    if (entity.isEngineStop) return;
    if (entity.dialog) entity.dialog.remove();
    entity.dialog = this;
    this.parent = entity;
    this.padding = 10;
    this.border = 2;
    if (typeof message == 'number') message = String(message);
    if (Entry.console) Entry.console.print(message, mode);
    var messageChunks = message.match(/.{1,15}/g);
    message = messageChunks.join('\n');
    this.message_ = message;
    this.mode_ = mode;
    if (mode === 'speak' || mode === 'ask') this.generateSpeak();
    if (!isStamp) Entry.stage.loadDialog(this);
};

/**
 * Generate speak dialog box
 */
Entry.Dialog.prototype.generateSpeak = function() {
    this.object = GEHelper.newContainer('[dialog] container');
    const fontFamily = EntryStatic.fontFamily || 'NanumGothic';
    var text = GEHelper.textHelper.newText(
        this.message_,
        `15px ${fontFamily}`,
        '#000000',
        'top',
        'left'
    );

    let bound;
    if (GEHelper.isWebGL) {
        bound = text;
    } else {
        bound = text.getTransformedBounds();
    }

    var height = bound.height;
    var width = bound.width >= 10 ? bound.width : 17;
    var rect = GEHelper.newGraphic();
    const colorSet = EntryStatic.colorSet.canvas || {};
    rect.graphics
        .f(colorSet.dialogBG || '#f5f5f5')
        .ss(2, 'round')
        .s(colorSet.dialog || '#6FC0DD')
        .rr(
            -this.padding,
            -this.padding,
            width + 2 * this.padding,
            height + 2 * this.padding,
            this.padding
        );
    this.object.addChild(rect);
    this.object.regX = width / 2;
    this.object.regY = height / 2;
    this.width = width;
    this.height = height;
    this.notch = this.createSpeakNotch('ne');
    this.update();
    this.object.addChild(this.notch);
    this.object.addChild(text);
    Entry.requestUpdate = true;
};

/**
 * Set position
 */
Entry.Dialog.prototype.update = function() {
    const parentObj = this.parent.object;
    var bound = GEHelper.calcParentBound(parentObj);
    if (!bound && this.parent.type === 'textBox') {
        if (!this._isNoContentTried) {
            this.parent.setText(' ');
            bound = GEHelper.calcParentBound(parentObj);
            this._isNoContentTried = true;
        } else {
            delete this._isNoContentTried;
            return;
        }
    }
    var notchType = '';

    if (bound.y - 20 - this.border > -135) {
        this.object.y = Math.max(
            bound.y - this.height / 2 - 20 - this.padding,
            -135 + this.height / 2 + this.padding
        );
        notchType += 'n';
    } else {
        this.object.y = Math.min(
            bound.y + bound.height + this.height / 2 + 20 + this.padding,
            135 - this.height / 2 - this.padding
        );
        notchType += 's';
    }
    if (bound.x + bound.width / 2 < 0) {
        this.object.x = Math.min(
            bound.x + bound.width + this.width / 2,
            240 - this.width / 2 - this.padding
        );
        notchType += 'e';
    } else {
        this.object.x = Math.max(bound.x - this.width / 2, -240 + this.width / 2 + this.padding);
        notchType += 'w';
    }
    if (this.notch.type != notchType) {
        this.object.removeChild(this.notch);
        this.notch = this.createSpeakNotch(notchType);
        this.object.addChild(this.notch);
    }

    this._isNoContentTried && this.parent.setText('');
    Entry.requestUpdate = true;
};

/**
 * Generate speak notch
 * @param {!string} type can be 'ne', 'nw', 'se', 'sw'
 * @return {createjs.Shape}
 */
Entry.Dialog.prototype.createSpeakNotch = function(type) {
    var notch = GEHelper.newGraphic();
    notch.type = type;
    const colorSet = EntryStatic.colorSet.canvas || {};
    if (type == 'ne')
        notch.graphics
            .f('#f5f5f5')
            .ss(2, 'round')
            .s(colorSet.dialog || '#6FC0DD')
            .mt(0, this.height + this.padding - 1.5)
            .lt(-10, this.height + this.padding + 20)
            .lt(20, this.height + this.padding - 1.5);
    else if (type == 'nw')
        notch.graphics
            .f('#f5f5f5')
            .ss(2, 'round')
            .s(colorSet.dialog || '#6FC0DD')
            .mt(this.width, this.height + this.padding - 1.5)
            .lt(this.width + 10, this.height + this.padding + 20)
            .lt(this.width - 20, this.height + this.padding - 1.5);
    else if (type == 'se')
        notch.graphics
            .f('#f5f5f5')
            .ss(2, 'round')
            .s(colorSet.dialog || '#6FC0DD')
            .mt(0, -this.padding + 1.5)
            .lt(-10, -this.padding - 20)
            .lt(20, -this.padding + 1.5);
    else if (type == 'sw')
        notch.graphics
            .f('#f5f5f5')
            .ss(2, 'round')
            .s(colorSet.dialog || '#6FC0DD')
            .mt(this.width, -this.padding + 1.5)
            .lt(this.width + 10, -this.padding - 20)
            .lt(this.width - 20, -this.padding + 1.5);
    return notch;
};

/**
 * Remove self
 */
Entry.Dialog.prototype.remove = function() {
    Entry.stage.unloadDialog(this);
    this.parent.dialog = null;
    Entry.requestUpdate = true;
};
