"use strict";

goog.provide("Entry.ConnectionRipple");

(function(cr) {
    cr.createDom = function(blockView) {
        if (this.svgDom) return;
        if (typeof window.Snap !== "function")
            return console.error("Snap library is required");

        var svgGroup = blockView.svgGroup;
        this._ripple = svgGroup.circle(0, 0, 0);
        this._ripple.attr({
            'stroke': '#888',
            'stroke-width': 10
        });
    };

    cr.setView = function(blockView) {
        if (!this._ripple) this.createDom(blockView);
        var ripple = this._ripple;
        var svgGroup = blockView.svgGroup;
        ripple.remove();
        var cy = blockView.svgGroup.getBBox().height;
        var block = blockView.block;
        if (block) cy -= block.next.view.svgGroup.getBBox().height;
        ripple.attr({cy: cy});
        svgGroup.append(ripple);
        ripple._startTime = new Date();
        return this;
    };

    cr.dispose = function() {
        var that = this;
        var ripple = this._ripple;
        var ms = (new Date()) - ripple._startTime;
        var percent = ms / 150;
        if (percent > 1) ripple.remove();
        else {
            ripple.attr({
                'r': percent * 25,
                'opacity': 1 - percent
            });
            window.setTimeout(function(){
                that.dispose();
            }, 10);
        }
    };
})(Entry.ConnectionRipple);
