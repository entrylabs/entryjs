/*
 */
"use strict";

goog.provide("Entry.FieldTextInput");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldTextInput = function(content, blockView, index) {
    this._blockView = blockView;
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    this.value = this.getValue()  || '';
    this._CONTENT_HEIGHT = this.getContentHeight();

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldTextInput);

(function(p) {
    var X_PADDING = 6,
        TEXT_Y_PADDING = 4;

    p.renderStart = function() {
        if (this.svgGroup) $(this.svgGroup).remove();
        var blockView = this._blockView;
        var that = this;
        var contents = this._contents;

        this.svgGroup = blockView.contentSvgGroup.elem("g");
        this.svgGroup.attr({
            class: 'entry-input-field'
        });

        this.textElement = this.svgGroup.elem("text", {
            x: X_PADDING/2,
            y: TEXT_Y_PADDING,
            'font-size' : '12px'
        });

        this._setTextValue();

        var width = this.getTextWidth();

        var y = this.position && this.position.y ? this.position.y : 0;
        var CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        y -= CONTENT_HEIGHT/2;
        this._header = this.svgGroup.elem("rect", {
            width: width,
            height: CONTENT_HEIGHT,
            y: y,
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
        var that = this;

        var blockView = this._blockView;

        var func = function() {
            that.applyValue();
            that.destroyOption();
        };

        this._attachDisposeEvent(func);

        this.optionGroup = Entry.Dom('input', {
            class:'entry-widget-input-field',
            parent: $('body')
        });

        this.optionGroup.val(this.getValue());

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

        var pos = this.getAbsolutePosFromDocument();
        pos.y -= this.box.height/2;
        this.optionGroup.css({
            height: this._CONTENT_HEIGHT,
            left:pos.x,
            top:pos.y,
            width: that.box.width
        });

        this.optionGroup.focus();
        var optionGroup = this.optionGroup[0];
        optionGroup.setSelectionRange(0, optionGroup.value.length, "backward");
    };

    p.applyValue = function(event) {
        var value = this.optionGroup.val();
        this.setValue(value);
        this._setTextValue();
        this.resize();
    };

    p.resize = function() {
        var width = this.getTextWidth();

        this._header.attr({width: width});
        this.optionGroup.css({width: width});

        this.box.set({width: width});
        this._blockView.alignContent();
    };

    p.getTextWidth = function() {
        return this.textElement.getBoundingClientRect().width + X_PADDING + 2;
    };

    p._setTextValue = function() {
        this.textElement.textContent = this._convert(this.getValue(), this.getValue());
    };

})(Entry.FieldTextInput.prototype);
