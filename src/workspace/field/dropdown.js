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
    this._blockView = blockView;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;
    this._noArrow = content.noArrow;
    this._arrowColor = content.arrowColor;
    this._index = index;
    this.setValue(this.getValue());

    this._CONTENT_HEIGHT =
        content.dropdownHeight || blockView.getSkeleton().dropdownHeight || 16;

    this._FONT_SIZE =
        content.fontSize || blockView.getSkeleton().fontSize || 12;

    this._ROUND = content.roundValue || 0;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldDropdown);

(function(p) {

    p.renderStart = function() {
        if (this.svgGroup) $(this.svgGroup).remove();
        //should update value dynamically
        if (this instanceof Entry.FieldDropdownDynamic) this._updateValue();

        var blockView = this._blockView;
        var X_PADDING = 18;
        var that = this;
        var contents = this._contents;


        this.svgGroup = blockView.contentSvgGroup.elem("g", {
            class: 'entry-field-dropdown'
        });

        this.textElement =
            this.svgGroup.elem("text", {
                x: 2
            });
        this.textElement.textContent = this.getTextByValue(this.getValue());

        var bBox = this.textElement.getBBox();
        this.textElement.attr({
            'style': 'white-space: pre; font-size:' + that._FONT_SIZE + 'px',
            'y': bBox.height * 0.25
        });

        var width =
            this.textElement.getComputedTextLength() + X_PADDING;



        if (this._noArrow) width -= 14;


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

        if (!this._noArrow) {
            var fillColor = this._arrowColor || blockView._schema.color;
            this._arrow = this.svgGroup.elem("polygon",{
                points: "0,-2.1 6.4,-2.1 3.2,2.1",
                fill: fillColor,
                stroke: fillColor,
                transform: "translate("+ (width-11) + ",0)"
            });
        }

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT
        });
    };

    p.resize = function() {
        var X_PADDING = 18;
        var width =
            this.textElement.getComputedTextLength() + X_PADDING;

        if (!this._noArrow) {
            this._arrow.attr({
                transform: "translate("+ (width-11) + ",0)"
            });
        } else width -= 14;

        this._header.attr({
            width: width
        });

        this.box.set({width: width});
        this._block.view.alignContent();
    };

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();

        var blockView = this._block.view;

        this._attachDisposeEvent();

        this.optionGroup = Entry.Dom('ul', {
            class:'entry-widget-dropdown',
            parent: $('body')
        });

        var options = this._contents.options;

        var OPTION_X_PADDING = 30;
        var maxWidth = 0;
        var options = this._contents.options;

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT + 4;

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option[0];
            var value = option[1];
            var element = Entry.Dom('li', {
                class: 'rect',
                parent: this.optionGroup
            });

            var str = '';
            if (this.getValue() == value) str += '\u2713  ';

            element.text(str += text);

            (function(elem, value) {
                //prevent propagation to document
                elem.bind('mousedown touchstart', function(e) {
                    e.stopPropagation();
                });

                elem.bind('mouseup touchend', function(e){
                    e.stopPropagation();
                    that.applyValue(value);
                    that.destroyOption();
                    that._selectBlockView();
                });
            })(element, value);
        }

        this._position();
    };

    p._position = function() {
        //inspect enough space below
        var pos = this.getAbsolutePosFromDocument();
        pos.y += this.box.height/2;

        var documentHeight = $(document).height();
        var optionGroupHeight = this.optionGroup.height();

        //not enough space below
        if (documentHeight < pos.y + optionGroupHeight) {
            pos.x += this.box.width + 1;

            var relPos = this.getAbsolutePosFromBoard();
            var domHeight = this._blockView.getBoard().svgDom.height();
            domHeight -=  domHeight - relPos.y;

            if (domHeight - 20 < optionGroupHeight) {
                domHeight -= domHeight % 20;
                this.optionGroup.height(domHeight)
            }

            pos.y -= this.optionGroup.height();
        } else pos.x += this.box.width/2 - this.optionGroup.width()/2;

        this.optionGroup.css({left: pos.x, top: pos.y});
    };

    p.applyValue = function(value) {
        if (this.value == value) return;
        this.setValue(value);
        this.textElement.textContent = this.getTextByValue(value);
        this.resize();
    };

    p.getTextByValue = function(value) {
        if (!value || value === 'null') return Lang.Blocks.no_target;

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
