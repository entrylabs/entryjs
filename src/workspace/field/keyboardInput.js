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

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    this.setValue(this.getValue());

    this._optionVisible = false;

    this.renderStart(blockView);
    if (Entry.keyPressed)
        this.keyPressed = Entry.keyPressed.attach(this, this._keyboardControl);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldKeyboard);

(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        CONTENT_HEIGHT = 16;

    p.renderStart = function(blockView) {
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

        this.svgGroup.onmouseup = function(e) {
            if (that._isEditable()) that.renderOptions();
        };

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT
        });
    };

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();
        this._optionVisible = true;

        var blockView = this._block.view;
        this.documentDownEvent = Entry.documentMousedown.attach(
            this, function(){
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.destroyOption();
            }
        );

        var pos = this.getAbsolutePosFromBoard();
        pos.x -= 5;
        pos.y += this.box.height/2;

        this.optionGroup = this.appendSvgOptionGroup();
        this.optionGroup.elem('image', {
            href: Entry.mediaFilePath + '/media/keyboard_workspace.png',
            x: -5, y: 0, width: 249, height: 106,
            class: 'entry-field-keyboard',
            transform: "translate(" + pos.x + "," + pos.y + ')'
        });
    };

    p.destroyOption = function() {
        if (this.documentDownEvent) {
            Entry.documentMousedown.detach(this.documentDownEvent);
            delete this.documentDownEvent;
        }

        if (this.optionGroup) {
            this.optionGroup.remove();
            delete this.optionGroup;
        }

        this._optionVisible = false;
    };

    p._keyboardControl = function(event) {
        event.stopPropagation();
        if (!this._optionVisible) return;

        var value = event.keyCode;
        var text = Entry.getKeyCodeMap()[value];
        if (text !== undefined) this.applyValue(text, value);
    };

    p.applyValue = function(text, value) {
        this.destroyOption();
        if (this.getValue() == value) return;
        this.setValue(value);
        this.textElement.textContent = text;
        this.resize();
    };

    p.resize = function() {
        var width = this.getTextWidth();

        this._header.attr({width: width});

        this.box.set({width: width});
        this._block.view.alignContent();
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
