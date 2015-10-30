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
        var dropdownHeight = 22 + options.length * height;

        this.svgGroup = this._block.contentSvgGroup.group();

        this.topGroup = this.svgGroup.group();
        this.bottomGroup = this.svgGroup.group();
        this.bottomGroup.remove();
        this.bottomGroup.collapse = true;

        var input = this.topGroup.rect(-20,-12, 39, 22);
        input.attr({
            fill: "#80cbf8",
            stroke: "#127cdb"
        });

        var clickTopGroup = function(event) {
            if (self.bottomGroup.collapse == true) {
                self.svgGroup.append(self.bottomGroup);
                self.bottomGroup.collapse = false;
            } else {
                self.bottomGroup.remove();
                self.bottomGroup.collapse = true;
            }
        };

        this.textElement = this.topGroup.text(-15,3,options[value]);
        var button = this.topGroup.polygon(8,-2,14,-2,11,2);
        button.attr({
            fill: "#127cbd",
            stroke: "#127cbd"
        });
        this.topGroup.mousedown(clickTopGroup);

        for (var i in options) {
            var element = this.bottomGroup.group();

            var x = Number(i)+1;
            var rect = element.rect(-20, -12+(x*22), 39, 22).attr({
                fill: "white"
            });
            element.text(-13,3+(x*22), options[i]);

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
                    hoverOut();
                    self.bottomGroup.remove();
                    self.bottomGroup.collapse = true;
                };

                elem.mouseover(hoverIn).mouseout(hoverOut).mousedown(selectValue);

            })(element, options[i]);
        }

        this.box.set({
            x: 0,
            y: 0,
            width: 39,
            height: 22
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
