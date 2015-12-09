/*
 */
"use strict";

goog.provide("Entry.FieldDropdown");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldDropdown = function(content, blockView) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;
    this.key = content.key;
    this.value = this._block.values[this.key];

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldDropdown);

(function(p) {
    var X_PADDING = 18,
        TEXT_Y_PADDING = 3,
        CONTENT_HEIGHT = 23;

    p.renderStart = function(blockView) {
        var that = this;
        var contents = this._contents;

        this.svgGroup = blockView.contentSvgGroup.group();
        this.svgGroup.attr({
            class: 'entry-field-dropdown'
        });

        this.textElement =
            this.svgGroup.text(
                2, TEXT_Y_PADDING,
                this.getTextByValue(this.value)
            );

        var width =
            this.textElement.node.getComputedTextLength() + X_PADDING;

        this._header = this.svgGroup.rect(
                0, -12,
                width,
                CONTENT_HEIGHT,
            3).attr({fill: "#80cbf8"});

        this.svgGroup.append(this.textElement);

        this._arrow = this.svgGroup.polygon(
            0, -2, 6, -2, 3, 2).
            attr({
                fill: "#127cbd",
                stroke: "#127cbd",
                transform: "t"+ (width-11) + " 0",
            });

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

    p.resize = function() {
        var width =
            this.textElement.node.getComputedTextLength() + X_PADDING;

        this._header.attr({
            width: width
        });

        this._arrow.attr({
            transform: "t"+ (width-11) + " 0"
        });

        this.box.set({width: width});
        this._block.view.alignContent();
    };

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();

        var blockView = this._block.view;

        this.documentDownEvent = Entry.documentMousedown.attach(
            this, function(){
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.optionGroup.remove();
            }
        );

        this.optionGroup = blockView.getBoard().svgGroup.group();

        var matrix = blockView.svgGroup.transform().globalMatrix;
        var x = matrix.e;
        var y = matrix.f;

        var options = this._contents.options;
        this.optionGroup.attr({
            class: 'entry-field-dropdown',
            transform: "t" + (x -60) + " " + (y + 35)
        });

        var resizeList = [];
        var OPTION_X_PADDING = 50;
        var maxWidth = 0;

        resizeList.push(this.optionGroup.rect(
            0, 0,
            0, CONTENT_HEIGHT * options.length
            ).attr({fill:'white'}));

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option[0];
            var value = option[1];
            var element = this.optionGroup.group().attr({
                class: 'rect',
                transform: "t" + 0 + " " + i * CONTENT_HEIGHT
            });

            resizeList.push(element.rect(
                0, 0,
                0, CONTENT_HEIGHT
            ));


            if (this.value == value) {
                element.text(
                    5, 13,
                    '\u2713'
                ).attr({"alignment-baseline": "central"});
            }

            var text = element.text(
                20, 13,
                text
            ).attr({"alignment-baseline": "central"});

            maxWidth = Math.max(
                text.node.getComputedTextLength() + OPTION_X_PADDING,
                maxWidth
            );

            (function(elem, value) {
                elem.mousedown(function(){
                    that.applyValue(value);
                    that.destroyOption();
                });
            })(element, value);
        }

        var attr = {width:maxWidth};
        resizeList.forEach(function(elem){
            elem.attr(attr);
        });
    };

    p.applyValue = function(value) {
        if (this.value == value) return;
        this._block.values[this.key] = value;
        this.value = value;
        this.textElement.node.textContent = this.getTextByValue(value);
        this.resize();
    };

    p.getTextByValue = function(value) {
        var options = this._contents.options;
        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            if (option[1] == value)
                return option[0];
        }
        return value;
    };
})(Entry.FieldDropdown.prototype);
