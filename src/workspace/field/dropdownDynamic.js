/*
 */
"use strict";

goog.provide("Entry.FieldDropdownDynamic");

goog.require("Entry.FieldDropdown");
/*
 *
 */
Entry.FieldDropdownDynamic = function(content, blockView, index) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;
    this._index = index;
    var options = Entry.container.getDropdownList(this._contents.menuName);
    this._contents.options = options;
    var value = this.getValue() ||
        options.length !== 0 ? options[0][1] : null;
    this.setValue(value);

    this._CONTENT_HEIGHT =
        content.dropdownHeight || blockView.getSkeleton().dropdownHeight || 16;

    this._FONT_SIZE =
        content.fontSize || blockView.getSkeleton().fontSize || 12;

    this._ROUND = content.roundValue || 0;
    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.FieldDropdown, Entry.FieldDropdownDynamic);

(function(p) {
    p.constructor = Entry.FieldDropDownDynamic;

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

        var options = Entry.container.getDropdownList(this._contents.menuName);

        var resizeList = [];
        var OPTION_X_PADDING = 30;
        var maxWidth = 0;

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT + 4;
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
                }).textContent = '\u2713';
            }

            var textElement = element.elem("text", {
                x: 20,
                "alignment-baseline": "central"
            });
            textElement.textContent = text;
            var bBox = textElement.getBoundingClientRect();
            textElement.attr({
                y: (CONTENT_HEIGHT)/2
            });

            maxWidth = Math.max(
                bBox.width + OPTION_X_PADDING,
                maxWidth
            );

            (function(elem, value) {
                //prevent propagation to document
                var $elem = $(elem);
                $elem.bind('mousedown touchstart', function(e) {
                    e.stopPropagation();
                });

                $elem.bind('mouseup touchend', function(e){
                    e.stopPropagation();
                    that.applyValue(value);
                    that.destroyOption();
                    that._selectBlockView();
                });
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

})(Entry.FieldDropdownDynamic.prototype);
