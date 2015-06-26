"use strict";

goog.provide("Entry.Model");

Entry.Model = function() {

};

(function (p) {
    p.get = function(key) {
        return this[key];
    };

    p.set = function(data) {
        for (var key in data) {
            var value = data[key];
            this[key] = value;
        }
    };

    p.observe = function() {

    };

    p.unobserve = function() {

    };

    p.notify = function() {

    };

})(Entry.Model.prototype);
