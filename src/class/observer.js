"use strict";

goog.provide("Entry.ObserverModel");

goog.require("Entry.Model");

Entry.ObserverModel = function() {
    this.base = Entry.Model;
    this.base();
};

Entry.ObserverModel.prototype = new Entry.Model;

(function (p) {

    p.set = function(data) {
        this.base.prototype.set.call(this, data);

        this.notify();
    };

    p.observe = function() {

    };

    p.unobserve = function() {

    };

    p.notify = function() {

    };

})(Entry.ObserverModel.prototype);
