/*
 */
"use strict";

goog.provide("Entry.FieldDropdown");

/*
 *
 */
Entry.FieldDropdown = function(content, blockView) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;

    this.renderStart(blockView);
};

(function(p) {
    p.renderStart = function(blockView) {
        var self = this;

        this.options = this._contents.options;
        this.key = this._contents.key;
        this.value = this._block.values[this.key];
        this.width = 39;
        this.height = 22;

        this.svgGroup = blockView.contentSvgGroup.group();
        this.topGroup = this.svgGroup.group();
        this.topGroup.attr({
            class: 'entry-field-dropdown'
        });
        var input = this.topGroup.rect(0, -12, 39, 22, 3);
        input.attr({
            fill: "#80cbf8"
        });

        var clickTopGroup = function(e) {
            self.renderOptions();
            e.stopPropagation();
         };

        this.textElement = this.topGroup.text(5, 3, this.value);
        var button = this.topGroup.polygon(28, -2, 34, -2, 31, 2);
        button.attr({
            fill: "#127cbd",
            stroke: "#127cbd"
        });
        this.topGroup.mousedown(clickTopGroup);

        this.box.set({
            x: 0,
            y: 0,
            width: 39,
            height: 22
        });
    };

    p.renderOptions = function() {
        var self = this;
        var blockView = this._block.view;
        this.px = blockView.x;
        this.py = blockView.y;

        if (this.optionGroup && this.optionGroup.expand) {
            this.optionGroup.remove();
            this.optionGroup.expand = false;
            return;
        }

        if (this.optionGroup)
            delete this.optionGroup;

        this.optionGroup = blockView.getBoard().svgGroup.group()
        this.optionGroup.attr({
            class: 'entry-field-dropdown'
        });
        this.optionGroup.expand = true;
        $(document).bind('mousedown', function(e) {
            self.optionGroup.remove();
            self.optionGroup.expand = false;
        });

        for (var i in this.options) {
            var element = this.optionGroup.group();

            var x = Number(i)+1;
            var rect = element.rect(this.px - 46,
                                    this.py + 14 + (x * 22), 38, 23).attr({
                fill: "white"
            });

            element.text(this.px - 43,this.py + 29 + (x * 22), this.options[i]);
            (function(elem, value) {
                var hoverIn = function() {
                    elem.select("rect:nth-child(1)").attr({ fill: "#127cdb" });
                    elem.select("text:nth-child(2)").attr({ fill: "white" });
                };

                var hoverOut = function() {
                    elem.select("rect:nth-child(1)").attr({ fill: "white" });
                    elem.select("text:nth-child(2)").attr({ fill: "black" });
                };

                var selectValue = function() {
                    self.applyValue(value);
                    self.optionGroup.remove();
                    self.optionGroup.expand = false;
                };

                elem.mouseover(hoverIn).mouseout(hoverOut).mousedown(selectValue);

            })(element, this.options[i]);
        }

    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var svgGroup = this.svgGroup;
        if (this._position) x = this._position.x;
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

    p.applyValue = function(value) {
        this._block.values[this.key] = value;
        this.textElement.node.textContent = value;
    };

})(Entry.FieldDropdown.prototype);
