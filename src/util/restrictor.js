"use strict";

goog.provide("Entry.Restrictor");

goog.require("Entry.Utils");

Entry.Restrictor = function() {
    this.endEvent = new Entry.Event(this);

    this.currentTooltip = null;
};

(function(p) {
    p.restrict = function(data) {
        data = data.concat();
        var commandType = data.shift();
        var command = Entry.Command[commandType];
        var domQuery = command.dom;
        if (!domQuery)
            return;
        domQuery = domQuery.map(function(q) {
            if (q[0] === "&")
                return data[Number(q.substr(1))][1];
            else
                return q;
        });

        if (command.restrict) {
            this.currentTooltip = command.restrict(
                data, domQuery, this.restrictEnd.bind(this));
            return;
        } else {
            this.currentTooltip = new Entry.Tooltip([{
                content: "asdf",
                target: domQuery,
                direction: "down"
            }], {
                restrict: true,
                dimmed: true,
                callBack: this.restrictEnd.bind(this)
            });
        }
    };

    p.end = function() {
        if (this.currentTooltip) {
            this.currentTooltip.dispose();
            this.currentTooltip = null;
        }
    };

    p.restrictEnd = function() {
        this.endEvent.notify();
        this.currentTooltip = null;
    };

    p.align = function() {
        if (this.currentTooltip)
            this.currentTooltip.alignTooltips();
    };
})(Entry.Restrictor.prototype);
