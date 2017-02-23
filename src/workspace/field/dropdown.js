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

    this._CONTENT_HEIGHT = this.getContentHeight(content.dropdownHeight);

    this._FONT_SIZE = this.getFontSize(content.fontSize);

    this._ROUND = content.roundValue || 3;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldDropdown);

(function(p) {
    p.renderStart = function() {
        if (this.svgGroup) $(this.svgGroup).remove();
        //should update value dynamically
        if (this instanceof Entry.FieldDropdownDynamic)
            this._updateValue();

        var blockView = this._blockView;
        var isBig = Entry.isMobile();
        var X_PADDING = isBig ? 33 : 20;
        var X_PADDING_SUBT = isBig ? 24 : 10;
        var that = this;
        var contents = this._contents;


        this.svgGroup = blockView.contentSvgGroup.elem(
            "g", { class: 'entry-field-dropdown' });

        this.textElement =
            this.svgGroup.elem("text", { x: 5 });
        this._setTextValue();

        var bBox = this.textElement.getBBox();
        this.textElement.attr({
            'style': 'white-space: pre;',
            'font-size': + that._FONT_SIZE + 'px',
            'y': bBox.height * 0.23
        });

        var width =
            this.textElement.getBoundingClientRect().width + X_PADDING;

        if (this._noArrow) width -= X_PADDING_SUBT;


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
            var arrowInfo = this.getArrow();
            this._arrow = this.svgGroup.elem("polygon",{
                points: arrowInfo.points,
                fill: arrowInfo.color,
                stroke: arrowInfo.color,
                transform: "translate("+ (width - arrowInfo.width - 5) + ","
                    + (-arrowInfo.height/2) +")"
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
        var isBig  = Entry.isMobile();
        var X_PADDING = isBig ? 33 : 20;
        var X_PADDING_SUBT = isBig ? 24 : 10;
        var width =
            this.textElement.getBoundingClientRect().width + X_PADDING;

        if (!this._noArrow) {
            var arrowInfo = this.getArrow();
            this._arrow.attr({
                transform: "translate("+ (width - arrowInfo.width - 5) + ","
                    + (-arrowInfo.height/2) +")"
            });
        } else width -= X_PADDING_SUBT;

        this._header.attr({
            width: width
        });

        this.box.set({width: width});
        this._block.view.dAlignContent();
    };

    p.renderOptions = function() {
        var that = this;

        var blockView = this._block.view;

        this._attachDisposeEvent();

        this.optionGroup = Entry.Dom('ul', {
            class:'entry-widget-dropdown',
            parent: $('body')
        });

        this.optionGroup.bind('mousedown touchstart', function(e) {
            e.stopPropagation();
        });

        var OPTION_X_PADDING = 30;
        var maxWidth = 0;
        var options = this._contents.options;

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT + 4;

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option[0] = this._convert(option[0], option[1]);
            var value = option[1];
            var element = Entry.Dom('li', {
                class: 'rect',
                parent: this.optionGroup
            });

            var left = Entry.Dom('span', {
                class: 'left',
                parent: element
            });

            Entry.Dom('span', {
                class: 'right',
                parent: element
            }).text(text);

            if (this.getValue() == value) left.text('\u2713');

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
        var optionGroupWidth = this.optionGroup.width() + 30;

        //not enough space below
        if (documentHeight < pos.y + optionGroupHeight + 30) {
            var domHeight = this._blockView.getBoard().svgDom.height();
            var relPos = this.getAbsolutePosFromBoard();
            //above the half of dom
            if (this._blockView.y < domHeight/2) {
                pos.x += this.box.width/2 - optionGroupWidth/2;

                domHeight -= relPos.y + 30;
                this.optionGroup.height(domHeight)
            } else {
                pos.x += this.box.width + 1;

                domHeight -=  domHeight - relPos.y;

                if (domHeight - 30 < optionGroupHeight) {
                    domHeight -= domHeight % 30;
                    this.optionGroup.height(domHeight)
                }

                pos.y -= this.optionGroup.height();

            }
        } else pos.x += this.box.width/2 - optionGroupWidth/2;

        this.optionGroup.addClass('rendered');
        this.optionGroup.css({
            left: pos.x, top: pos.y,
            width: optionGroupWidth
        });
        var rights = this.optionGroup.find('.right');
        rights.width(optionGroupWidth-20);
    };

    p.applyValue = function(value) {
        if (this.value != value)
            this.setValue(value);
        this._setTextValue();
        this.resize();
    };

    p.getTextByValue = function(value) {
        var reg = /&value/gm;
        if (reg.test(value))
            return value.replace(reg, '');

        if ((!value && typeof value !== 'number') || value === 'null')
            return Lang.Blocks.no_target;

        var options = this._contents.options;
        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            if (option[1] == value)
                return option[0];
        }
        //no match found
        //check should return value as it is
        if (this._shouldReturnValue(value)) return value;
        return Lang.Blocks.no_target;
    };

    p.getContentHeight = function(height) {
        height =
            height || this._blockView.getSkeleton().dropdownHeight ||
            (Entry.isMobile() ? 22: 16);
        return height;
    };

    p.getArrow = function() {
        var isBig = Entry.isMobile();
        var color = this._arrowColor || this._blockView._schema.color;
        var points = isBig ?
                    '0,0 19,0 9.5,13' :
                    "0,0 6.4,0 3.2,4.2";
        var height = isBig ? 13 : 4.2;
        var width = isBig ? 19 : 6.4;
        return {
            color: color,
            points: points,
            height: height,
            width: width
        };
    };

    p._setTextValue = function() {
        var textValue = this.getTextByValue(this.getValue());
        this.textElement.textContent =
            this._convert(textValue, this.getValue());
    };
})(Entry.FieldDropdown.prototype);
