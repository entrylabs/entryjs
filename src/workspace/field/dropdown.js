/*
 */
"use strict";

goog.provide("Entry.FieldDropdown");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldDropdown = function(content, blockView, index) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;
    this._index = index;
    this.setValue(this.getValue());

    this._CONTENT_HEIGHT =
        content.dropdownHeight || blockView.getSkeleton().dropdownHeight || 16;

    this._FONT_SIZE =
        content.fontSize || blockView.getSkeleton().fontSize || 12;

    this._ROUND = content.roundValue || 0;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldDropdown);

(function(p) {
    var X_PADDING = 18;

    p.renderStart = function(blockView) {
        var that = this;
        var contents = this._contents;


        this.svgGroup = blockView.contentSvgGroup.group();
        this.svgGroup.attr({
            class: 'entry-field-dropdown'
        });

        this.textElement =
            this.svgGroup.text(
                2, 0,
                this.getTextByValue(this.getValue())
            );

        var bBox = this.textElement.getBBox();
        this.textElement.attr({
            'style': 'white-space: pre; font-size:' + that._FONT_SIZE + 'px',
            'y': bBox.height * 0.25
        });

        var width =
            this.textElement.node.getComputedTextLength() + X_PADDING;

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT;

        this._header = this.svgGroup.rect(
                0, -CONTENT_HEIGHT/2,
                width,
                CONTENT_HEIGHT, that._ROUND).
                    attr({
                        fill: "#fff",
                        'fill-opacity': 0.4
                    });

        this.svgGroup.append(this.textElement);

        this._arrow = this.svgGroup.polygon(
            0, -2, 6, -2, 3, 2).
            attr({
                fill: blockView._schema.color,
                stroke: blockView._schema.color,
                transform: "t"+ (width-11) + " 0",
            });

        this.svgGroup.mouseup(function(e) {
            if (that._isEditable()) that.renderOptions();
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
            this, function() {
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.optionGroup.remove();
            }
        );

        this.optionGroup = this.appendSvgOptionGroup();

        var matrix = blockView.svgGroup.transform().globalMatrix;
        var x = matrix.e;
        var y = matrix.f;

        var options = this._contents.options;

        var resizeList = [];
        var OPTION_X_PADDING = 50;
        var maxWidth = 0;

        var CONTENT_HEIGHT = 23;
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


            if (this.getValue() == value) {
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
                //prevent propagation to document
                elem.mousedown(function(e){e.stopPropagation();});

                elem.mouseup(function(){
                    that.applyValue(value);
                    that.destroyOption();
                });
            })(element, value);
        }

        var pos = this.getRelativePos();
        pos.y += this.box.height/2;
        pos.x = pos.x - maxWidth/2 + this.box.width/2;

        this.optionGroup.attr({
            class: 'entry-field-dropdown',
            transform: "t" + pos.x + " " + pos.y
        });

        var attr = {width:maxWidth};
        resizeList.forEach(function(elem){
            elem.attr(attr);
        });
    };

    p.applyValue = function(value) {
        if (this.value == value) return;
        this.setValue(value);
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
        //no match found
        return value;
    };
})(Entry.FieldDropdown.prototype);
