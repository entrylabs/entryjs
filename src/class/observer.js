"use strict";

goog.provide("Entry.ObserverModel");

goog.require("Entry.Model");

Entry.ObserverModel = function() {
};

Entry.ObserverModel.prototype = Entry.Model.prototype;

(function (p) {

    p.set = function(data) {
        for (var key in data) {
            var value = data[key];
            this[key] = value;
        }
        this.notify();
    };

    p.observe = function() {

    };

    p.unobserve = function() {

    };

    p.notify = function() {

    };

})(Entry.ObserverModel.prototype);
