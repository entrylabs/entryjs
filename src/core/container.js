"use strict";

goog.provide("Entry.db");

Entry.db = {
    data: {},
    typeMap: {}
};

(function(c){
    c.add = function(datum) {
        this.data[datum.id] = datum;

        var type = datum.type;
        if (this.typeMap[type] === undefined)
            this.typeMap[type] = {};
        this.typeMap[type][datum.id] = datum;
    };

    c.has = function() {

    };

    c.remove = function() {

    };

    c.get = function() {

    };

    c.find = function() {

    };

    c.clear = function() {

    };

})(Entry.container);
