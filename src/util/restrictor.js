"use strict";

goog.provide("Entry.Restrictor");

goog.require("Entry.Utils");

Entry.Restrictor = function() {
    this.endEvent = new Entry.Event(this);
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

        new Entry.Tooltip([{
            content: "asdf",
            target: domQuery,
            direction: "down",
        }], { restrict: true, dimmed: true });
    };
})(Entry.Restrictor.prototype);
