"use strict";

goog.provide("Entry.Model");

Entry.Model = function() {
    this.data = this.schema;
};

(function (p) {
    p.schema = {
        id: null
    };

    p.get = function(key) {
        return this.data[key];
    };

    p.set = function(data) {
        for (var key in data) {
            var value = data[key];
            this.data[key] = value;
        }
    };

})(Entry.Model.prototype);
