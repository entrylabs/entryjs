/*
 */
"use strict";

goog.provide("Entry.Keyboard");

/*
 *
 */
Entry.FieldKeyboard = function(content, blockView) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this.key = content.key;
    this.value = this._block.values[this.key];

    this._optionVisible = false;

    this.renderStart(blockView);
    if (Entry.keyPressed)
        this.keyPressed = Entry.keyPressed.attach(this, this._keyboardControl);
};

(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        CONTENT_HEIGHT = 16;

    p.renderStart = function(blockView) {
        var that = this;
        var contents = this._contents;

        this.svgGroup = blockView.contentSvgGroup.group();
        this.svgGroup.attr({
            class: 'entry-input-field'
        });

        this.textElement =
            this.svgGroup.text(
                X_PADDING/2, TEXT_Y_PADDING,
                Entry.getKeyCodeMap()[this.value]
            );
        this.textElement.attr({'font-size' : '9pt'});

        var width = this.getWidth();

        var y = this.position && this.position.y ? this.position.y : 0;
        this._header = this.svgGroup.rect(
                0, y,
                width,
                CONTENT_HEIGHT,
            3).attr({
                fill: "#fff",
                'fill-opacity': 0.4
                });

        this.svgGroup.append(this.textElement);

        this.svgGroup.mouseup(function(e) {
            if (that._block.view.dragMode == Entry.DRAG_MODE_MOUSEDOWN)
                that.renderOptions();
        });

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT
        });
    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var svgGroup = this.svgGroup;

        var transform = "t" + x + " " + y;

        if (animate)
            svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        else
            svgGroup.attr({
                transform: transform
            });

        this.box.set({
            x: x,
            y: y
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
                that.optionGroup.remove();
            }
        );

        this.optionGroup = blockView.getBoard().svgGroup.group();
        this.optionGroup.image(
            Entry.mediaFilePath + '/media/keyboard_workspace.png',
            0,
            0,
            249,
            106
        );

        var matrix = blockView.svgGroup.transform().globalMatrix;
        var x = matrix.e;
        var y = matrix.f;

        this.optionGroup.attr({
            class: 'entry-field-keyboard',
            transform: "t" + (x + 14) + " " + (y + 26)
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

    p._keyboardControl = function(sender, event) {
        event.stopPropagation();
        if (!this._optionVisible) return;

        var value = event.keyCode;
        var text = Entry.getKeyCodeMap()[value];
        if (text !== undefined) this.applyValue(text, value);
    };

    p.applyValue = function(text, value) {
        this.destroyOption();
        if (this.value == value) return;
        this._block.values[this.key] = value;
        this.value = value;
        this.textElement.node.textContent = text;
        this.resize();
    };

    p.resize = function() {
        var width = this.getWidth();

        this._header.attr({width: width});

        this.box.set({width: width});
        this._block.view.alignContent();
    };

    p.getWidth = function() {
         return this.textElement.node.getComputedTextLength() + X_PADDING;
    };

    p.destroy = function() {
        this.destroyOption();

        if (Entry.keyPressed && this.keyPressed)
            Entry.keyPressed.detach(this.keyPressed);
    };
})(Entry.FieldKeyboard.prototype);
