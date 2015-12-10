/*
 */
"use strict";

goog.provide("Entry.TextInput");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldTextInput = function(content, blockView) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this.key = content.key;
    this.value = this._block.values[this.key]  || '';

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldTextInput);

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
                this.truncate()
            );
        this.textElement.attr({'font-size' : '9pt'});

        var width = this.getTextWidth();

        var y = this.position && this.position.y ? this.position.y : 0;
        y -= CONTENT_HEIGHT/2;
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

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();

        var blockView = this._block.view;
        this.documentDownEvent = Entry.documentMousedown.attach(
            this, function(){
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.applyValue();
                that.destroyOption();
            }
        );

        this.optionGroup = Entry.Dom('input', {
            class:'entry-widget-input-field',
            parent: $('body')
        });

        this.optionGroup.val(this.value);

        this.optionGroup.on('mousedown', function(e) {
            e.stopPropagation();
        });

        this.optionGroup.on('keyup', function(e){
            var exitKeys = [13, 27];
            var keyCode = e.keyCode || e.which;
            that.applyValue(e);

            if (exitKeys.indexOf(keyCode) > -1)
                that.destroyOption();
        });

        var pos = this.getAbsolutePos();
        pos.y -= this.box.height/2;
        this.optionGroup.css({
            height: CONTENT_HEIGHT,
            left:pos.x,
            top:pos.y,
            width: that.box.width
        });

        this.optionGroup.focus();

    };

    p.applyValue = function(event) {
        var value = this.optionGroup.val();
        this._block.values[this.key] = value;
        this.value = value;
        this.textElement.node.textContent = this.truncate();
        this.resize();
    };

    p.resize = function() {
        var width = this.getTextWidth();

        this._header.attr({width: width});
        this.optionGroup.css({width: width});

        this.box.set({width: width});
        this._block.view.alignContent();
    };

    p.getTextWidth = function() {
         return this.textElement.node.getComputedTextLength() + X_PADDING;
    };

})(Entry.FieldTextInput.prototype);
