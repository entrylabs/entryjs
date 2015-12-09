/*
 *
 */
"use strict";

goog.provide("Entry.Field");

/*
 *
 */
Entry.Field = function() {};

(function(p) {
    p.destroy = function() {
         this.destroyOption();
    };

    p.destroyOption = function() {
        if (this.documentDownEvent) {
            Entry.documentMousedown.detach(this.documentDownEvent);
            delete this.documentDownEvent;
        }

        if (this.optionGroup) {
            this.optionGroup.remove();
            delete this.optionGroup;
        }
    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var svgGroup = this.svgGroup;
        if (this._position) {
            if (this._position.x)
                x = this._position.x;
            if (this._position.y)
                y = this._position.y;
        }

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

})(Entry.Field.prototype);
