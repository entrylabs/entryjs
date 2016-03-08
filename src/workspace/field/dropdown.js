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


        this.svgGroup = blockView.contentSvgGroup.elem("g", {
            class: 'entry-field-dropdown'
        });

        this.textElement =
            this.svgGroup.elem("text", {
                x: 2
            });
        this.textElement.innerHTML = this.getTextByValue(this.getValue());

        var bBox = this.textElement.getBBox();
        this.textElement.attr({
            'style': 'white-space: pre; font-size:' + that._FONT_SIZE + 'px',
            'y': bBox.height * 0.25
        });

        var width =
            this.textElement.getComputedTextLength() + X_PADDING;

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT;

        this._header = this.svgGroup.elem("rect", {
            width: width,
            height: CONTENT_HEIGHT,
            y: -CONTENT_HEIGHT/2,
            rx: that._ROUND,
            ry: that._ROUND,
            fill: "#fff",
            'fill-opacity': 0.4
        });

        this.svgGroup.appendChild(this.textElement);

        this._arrow = this.svgGroup.elem("polygon",{
            points: "0,-2 6,-2 3,2",
            fill: blockView._schema.color,
            stroke: blockView._schema.color,
            transform: "translate("+ (width-11) + ",0)"
        });

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

    p.resize = function() {
        var width =
            this.textElement.getComputedTextLength() + X_PADDING;

        this._header.attr({
            width: width
        });

        this._arrow.attr({
            transform: "translate("+ (width-11) + ",0)"
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

        var options = this._contents.options;

        var resizeList = [];
        var OPTION_X_PADDING = 50;
        var maxWidth = 0;

        var CONTENT_HEIGHT = 23;
        resizeList.push(this.optionGroup.elem("rect" , {
            height: CONTENT_HEIGHT * options.length,
            fill:'white'
        }));

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option[0];
            var value = option[1];
            var element = this.optionGroup.elem("g", {
                class: 'rect',
                transform: "translate(0," + i * CONTENT_HEIGHT + ")"
            });

            resizeList.push(element.elem("rect", {
                 height: CONTENT_HEIGHT
            }));


            if (this.getValue() == value) {
                element.elem("text", {
                    x: 5,
                    y: 13,
                    "alignment-baseline": "central"
                }).innerHTML = '\u2713';
            }

            var textElement = element.elem("text", {
                x: 20,
                y: 13,
                "alignment-baseline": "central"
            });
            textElement.innerHTML = text;

            maxWidth = Math.max(
                textElement.getComputedTextLength() + OPTION_X_PADDING,
                maxWidth
            );

            (function(elem, value) {
                //prevent propagation to document
                elem.onmousedown = function(e){e.stopPropagation();};

                elem.onmouseup = function(e) {
                    e.stopPropagation();
                    that.applyValue(value);
                    that.destroyOption();
                };
            })(element, value);
        }

        var x = - maxWidth/2 + this.box.width/2;
        var y = this.box.height/2;

        var pos = this.getAbsolutePosFromBoard();
        pos.x += x;
        pos.y += y;

        this.optionGroup.attr({
            class: 'entry-field-dropdown',
            transform: "translate(" + pos.x + "," + pos.y + ")"
        });

        var attr = {width:maxWidth};
        resizeList.forEach(function(elem){
            elem.attr(attr);
        });
    };

    p.applyValue = function(value) {
        if (this.value == value) return;
        this.setValue(value);
        this.textElement.textContent = this.getTextByValue(value);
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
