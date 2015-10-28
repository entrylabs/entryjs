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
        parent.splice(parent.indexOf(this), 1);
        return this;
    };
})(Entry.Observer.prototype);

