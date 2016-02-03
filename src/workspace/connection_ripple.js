"use strict";

goog.provide("Entry.ConnectionRipple");

(function(cr) {
    cr.createDom = function(blockView) {
        if (this.svgDom) return;
        if (typeof window.Snap !== "function")
            return console.error("Snap library is required");

        var svgGroup = blockView.getBoard().svgGroup;
        this._ripple = svgGroup.circle(0, 0, 0);
        this._ripple.attr({
            'stroke': '#888',
            'stroke-width': 10
        });
    };

    cr.setView = function(blockView) {
        if (!this._ripple) this.createDom(blockView);
        console.log('ripple', this._ripple);

    };
})(Entry.ConnectionRipple);
