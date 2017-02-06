"use strict";

goog.provide("Entry.Tooltip");

goog.require("Entry.Dom");
goog.require("Entry.Utils");

Entry.Tooltip = function(data, opts) {
    this.data = data instanceof Array ? data : [data];
    this.data.map(function(d) {
        if (d.target instanceof Array)
            d.target = Entry.getDom(d.target);
        d.target = $(d.target);
    });
    this.opts = opts || {
        dimmed: true,
        restirct: false
    };
    this._tooltips = [];
    this._indicators = [];

    if (data.length > 1)
        this.isIndicator = true;

    this.render();
    if (this.opts.restrict)
        this.restrictAction();

    this._resizeEventFunc =Entry.Utils.debounce(function() {
        this.alignTooltips();
    }.bind(this), 200);
    Entry.addEventListener('windowResized', this._resizeEventFunc);
};

(function(p) {
    p.render = function() {
        if (this.opts.dimmed)
            this.renderBG();

        this.renderTooltips();
    };

    p.renderBG = function() {
        if (this.opts.restrict) {
            this._bg = Entry.Dom("div", {
                classes: [
                ],
                parent: $(document.body)
            });
            var bound = this.data[0].target.get(0).getBoundingClientRect();

        } else {
            this._bg = Entry.Dom("div", {
                classes: [
                    "entryDimmed",
                    "entryTooltipBG"
                ],
                parent: $(document.body)
            });

            this._bg.bindOnClick(this.dispose.bind(this))
        }
    };

    p.renderTooltips = function() {
        this.data.map(this._renderTooltip.bind(this));
    };

    p.alignTooltips = function() {
        this.data.map(this._alignTooltip.bind(this));
    };

    p._renderTooltip = function(data) {
        if (!data.content)
            return;
        var tooltipWrapper = Entry.Dom("div", {
            classes: [
                "entryTooltipWrapper"
            ],
            parent: $(document.body)
        });
        var tooltipDom = Entry.Dom("div", {
            classes: [
                "entryTooltip",
                data.direction,
                data.style
            ],
            parent: tooltipWrapper
        });

        if (this.isIndicator)
            data.indicator = this.renderIndicator();

        tooltipDom.html(data.content.replace(/\n/gi, "<br>"));
        this._tooltips.push(tooltipWrapper);
        data.wrapper = tooltipWrapper;
        data.dom = tooltipDom;
        this._alignTooltip(data);
    };

    p._alignTooltip = function(data) {
        var pos = data.target.offset()
        var bound = data.target.get(0).getBoundingClientRect();
        if (this.isIndicator) {
            data.indicator.css({
                left: pos.left + bound.width / 2,
                top: pos.top + bound.height / 2
            });
        }
        switch(data.direction) {
            case "up":
                pos.left += bound.width / 2;
                pos.top -= 11;
                break;
            case "down":
                pos.left += bound.width / 2;
                pos.top += bound.height;
                break;
            case "left":
                pos.top += bound.height / 2;
                pos.left -= 11;
                break;
            case "right":
                pos.left += bound.width;
                pos.top += bound.height / 2;
                break;
            default:
                break;
        }

        data.wrapper.css(pos);
    };

    p.renderIndicator = function(left, top) {
        var indicator = Entry.Dom("div", {
            classes: [
                 "entryTooltipIndicator"
            ],
            parent: $(document.body)
        });
        indicator.html("<div></div><div></div><div></div>");
        this._indicators.push(indicator);
        return indicator;
    };

    p.dispose = function() {
        if (this._bg)
            this._bg.remove();
        if (this.opts.restrict)
            Entry.Utils.allowAction();
        if (this.opts.callBack)
            this.opts.callBack.call();
        while (this._tooltips.length)
            this._tooltips.pop().remove();
        while (this._indicators.length)
            this._indicators.pop().remove();
        Entry.removeEventListener('windowResized', this._resizeEventFunc);
    };

    p.restrictAction = function() {
        var targets = this.data.map(function(d) {return d.target});
        Entry.Utils.restrictAction(targets, this.dispose.bind(this));
    };
})(Entry.Tooltip.prototype);
