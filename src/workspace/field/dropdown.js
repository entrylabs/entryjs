/*
 */
"use strict";

goog.provide("Entry.FieldDropdown");

/*
 *
 */
Entry.FieldDropdown = function(content, block) {
    this._block = block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;

    this.renderStart();
};

(function(p) {
    p.renderStart = function() {
        var self = this;

        var options = this._contents.options;
        var value = this._contents.value;
        var width = 39;
        var height = 22;
        var dropdownHeight = options.length * height;

        this.svgGroup = this._block.contentSvgGroup.group();

        this.topGroup = this.svgGroup.group();
        this.bottomGroup = this.svgGroup.group();
        this.bottomGroup.remove();

        var input = this.topGroup.rect(0,-12, 39, 22);
        input.attr({
            fill: "#80cbf8",
            stroke: "#127cdb"
        });

        var clickTopGroup = function(event) {
            self.svgGroup.append(self.bottomGroup);
        };

        this.textElement = this.topGroup.text(10,3,options[value]);
        var button = this.topGroup.polygon(28,-2,34,-2,31,2);
        button.attr({
            fill: "#127cbd",
            stroke: "#127cbd"
        });
        this.topGroup.mousedown(clickTopGroup);

        var elements = [];
        for (var i in options) {
            elements.push(this.bottomGroup.group());

            var x = Number(i)+1;
            var rect = elements[i].rect(0, -12+(x*22), 39, 22).attr({
                fill: "white"
            });
            elements[i].text(10,3+(x*22), options[i]);

            (function(elem, rect, value) {
                var hoverIn = function() {
                    rect.attr({
                        fill: "#ccc"
                    });
                };

                var hoverOut = function() {
                    rect.attr({
                        fill: "white"
                    });
                };

                var selectValue = function() {
                    self.applyValue(value);
                    hoverOut();
                    self.bottomGroup.remove();
                };

                elem.hover(
                    hoverIn, hoverOut
                );
                elem.mousedown(selectValue);

            })(elements[i], rect, options[i]);
        }

        this.box.set({
            x: 0,
            y: 0,
            width: 39,
            height: dropdownHeight
        });
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
        this.textElement.node.textContent = value;
    };

})(Entry.FieldDropdown.prototype);
