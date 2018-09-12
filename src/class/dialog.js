"use strict";

/**
 * @fileoverview Show dialog on canvas
 */
 
import PIXIHelper from './PIXIHelper';

/**
 * Construct dialog
 * @param {!Entry.EntityObject} entity parent entity
 * @param {!string} message to show on canvas
 * @param {!string} mode is 'speak' or 'think'
 * @constructor
 */
Entry.Dialog = function(entity, message, mode, isStamp) {
    if (entity.dialog)
        entity.dialog.remove();
    entity.dialog = this;
    this.parent = entity;
    this.padding = 10;
    this.border = 2;
    if (typeof message == 'number')
        message = String(message);
    if (Entry.console)
        Entry.console.print(message, mode);
    var messageChunks = message.match(/.{1,15}/g);
    message = messageChunks.join('\n');
    this.message_ = message;
    this.mode_ = mode;
    console.log("mode", mode);
    if (mode === 'speak' || mode === 'ask')
        this.generateSpeak();
    if (!isStamp)
        Entry.stage.loadDialog(this);
    window.dialog = this;
};

/**
 * Generate speak dialog box
 */

Entry.Dialog.prototype.generateSpeak = function() {
    /** @type {PIXI.Container} object */
    this.object = new PIXI.Container();
    var text = PIXIHelper.text(this.message_,"15px NanumGothic", 0x0, "", "" );
    var height = text.height;
    var width = text.width >= 10 ? text.width : 17;
    var rect = new PIXI.Graphics();

    const PAD = this.padding;
    const DPAD = PAD * 2;

    rect
        .lineStyle(2, 0x6FC0DD)
        .beginFill(0xf5f5f5)
        .drawRoundedRect(-PAD, -PAD, width + DPAD, height + DPAD, PAD);

    this.object.addChild(rect);

    this.object.pivot.x = width/2;
    this.object.pivot.y = height/2;

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

    var parentObj = this.parent.object;
    var calcParentBound = function() {
        return PIXIHelper.getTransformBound(parentObj);
    };

    var bound = calcParentBound();

    if (!bound && this.parent.type === 'textBox') {
        if (!this._isNoContentTried) {
            this.parent.setText(' ');
            bound = calcParentBound();
            this._isNoContentTried = true;
        } else {
            delete this._isNoContentTried;
            return;
        }
    }

    var notchType = '';

    if (bound.y -20 - this.border> -135) {
        this.object.y = Math.max(
            bound.y - this.height/2 -20 - this.padding,
            -135 + this.height/2 + this.padding
        );
        notchType += 'n';
    } else {
        this.object.y = Math.min(
            bound.y + bound.height + this.height/2 + 20 + this.padding,
            135 - this.height/2 - this.padding
        );
        notchType += 's';
    }
    if (bound.x + bound.width / 2 < 0) {
        this.object.x = Math.min(
            bound.x + bound.width + this.width/2,
            240 - this.width / 2 - this.padding
        );
        notchType += 'e';
    } else {
        this.object.x = Math.max(
            bound.x - this.width/2,
            -240 + this.width / 2 + this.padding
        );
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
 * @return {PIXI.Graphics}
 */
Entry.Dialog.prototype.createSpeakNotch = function(type) {
    var notch = new PIXI.Graphics();
    notch.type = type;

    notch.beginFill(0xf5f5f5).lineStyle(2, 0x6FC0DD);

    if (type == 'ne')
        notch
            .moveTo(0,this.height+this.padding-1.5)
            .lineTo(-10,this.height+this.padding+20)
            .lineTo(20,this.height+this.padding-1.5);
    else if (type == 'nw')
        notch
            .moveTo(this.width,this.height+this.padding-1.5)
            .lineTo(this.width+10,this.height+this.padding+20)
            .lineTo(this.width-20,this.height+this.padding-1.5);
    else if (type == 'se')
        notch
            .moveTo(0,-this.padding+1.5)
            .lineTo(-10,-this.padding-20)
            .lineTo(20,-this.padding+1.5);
    else if (type == 'sw')
        notch
            .moveTo(this.width,-this.padding+1.5)
            .lineTo(this.width+10,-this.padding-20)
            .lineTo(this.width-20,-this.padding+1.5);
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
