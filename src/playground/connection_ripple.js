'use strict';

Entry.ConnectionRipple = {};

(function(cr) {
    cr.createDom = function(blockView) {
        if (this.svgDom) return;

        var svgGroup = blockView.getBoard().svgGroup;
        this._ripple = svgGroup.elem('circle', {
            cx: 0,
            cy: 0,
            r: 0,
            stroke: '#888',
            'stroke-width': 10,
        });
    };

    cr.setView = function(blockView) {
        if (!this._ripple) this.createDom(blockView);
        var ripple = this._ripple;
        var svgGroup = blockView.getBoard().svgGroup;
        ripple.remove();

        var pos = blockView.getAbsoluteCoordinate();
        ripple.attr({ cx: pos.scaleX, cy: pos.scaleY });

        svgGroup.appendChild(ripple);
        ripple._startTime = new Date();
        return this;
    };

    cr.dispose = function() {
        var that = this;
        var ripple = this._ripple;
        var ms = new Date() - ripple._startTime;
        var percent = ms / 150;
        if (percent > 1) ripple.remove();
        else {
            ripple.attr({
                r: percent * 25,
                opacity: 1 - percent,
            });
            window.setTimeout(function() {
                that.dispose();
            }, 10);
        }
    };
})(Entry.ConnectionRipple);
