/*
 */
"use strict";

goog.provide("Entry.Keyboard");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldKeyboard = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    this.setValue(String(this.getValue()));

    this._optionVisible = false;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldKeyboard);

(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        CONTENT_HEIGHT = 16;

    p.renderStart = function() {
        if (this.svgGroup) $(this.svgGroup).remove();
        var blockView = this._blockView;
        var that = this;
        var contents = this._contents;

        this.svgGroup = blockView.contentSvgGroup.elem("g", {
            class: 'entry-input-field'
        });

        this.textElement =
            this.svgGroup.elem('text').attr({
                x: X_PADDING/2,
                y: TEXT_Y_PADDING,
                'font-size' : '9pt'
            });

        this.textElement.textContent = Entry.getKeyCodeMap()[this.getValue()];

        var width = this.getTextWidth();

        var y = this.position && this.position.y ? this.position.y : 0;
        y -= CONTENT_HEIGHT/2;
        this._header = this.svgGroup.elem('rect', {
                x: 0, y: y,
                width: width,
                height: CONTENT_HEIGHT,
                rx: 3, ry: 3,
                fill: "#fff",
                'fill-opacity': 0.4
            });

        this.svgGroup.appendChild(this.textElement);

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT
        });
    };

    p.renderOptions = function() {
        if (Entry.keyPressed)
            this.keyPressed = Entry.keyPressed.attach(this, this._keyboardControl);
        var that = this;
        this._optionVisible = true;

        var blockView = this._blockView;
        this._attachDisposeEvent();

        var pos = this.getAbsolutePosFromDocument();
        pos.x -= this.box.width/2;
        pos.y += this.box.height/2 + 1;

        this.optionGroup = Entry.Dom('img', {
            class:'entry-widget-keyboard-input',
            src: Entry.mediaFilePath + '/media/keyboard_workspace.png',
            parent: $('body')
        });

        this.optionGroup.css({
            left: pos.x, top: pos.y
        });
    };

    p.destroyOption = function() {
        if (this.disposeEvent) {
            Entry.disposeEvent.detach(this.disposeEvent);
            delete this.disposeEvent;
        }

        if (this.optionGroup) {
            this.optionGroup.remove();
            delete this.optionGroup;
        }

        this._optionVisible = false;
        this.command();
        if (this.keyPressed) {
            Entry.keyPressed.detach(this.keyPressed);
            delete this.keyPressed;
        }
    };

    p._keyboardControl = function(event) {
        event.stopPropagation();
        if (!this._optionVisible) return;

        var value = event.keyCode;
        var text = Entry.getKeyCodeMap()[value];
        if (text !== undefined) this.applyValue(text, value);
    };

    p.applyValue = function(text, value) {
        this.setValue(String(value));
        this.destroyOption();
        this.textElement.textContent = text;
        this.resize();
    };

    p.resize = function() {
        var width = this.getTextWidth();

        this._header.attr({width: width});

        this.box.set({width: width});
        this._blockView.alignContent();
    };

    p.getTextWidth = function() {
        return this.textElement.getComputedTextLength() + X_PADDING;
    };

    p.destroy = function() {
        this.destroyOption();

        if (Entry.keyPressed && this.keyPressed)
           Entry.keyPressed.detach(this.keyPressed);
    };

})(Entry.FieldKeyboard.prototype);
