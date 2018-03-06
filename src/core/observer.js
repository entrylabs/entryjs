"use strict";

goog.provide("Entry.Observer");

/*
 * Entry Observer object Constructor
 * @param {object} obj
 */
Entry.Observer = function(parent, object, funcName, attrs) {
    this.parent = parent;
    this.object = object;
    this.funcName = funcName;
    this.attrs = attrs;
    parent.push(this);
};

(function (p) {
    p.destroy = function() {
        var parent = this.parent;
        var index = parent.indexOf(this);
        if (index > -1)
            parent.splice(index, 1);
        return this;
    };
})(Entry.Observer.prototype);

