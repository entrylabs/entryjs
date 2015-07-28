"use strict";

goog.provide("Entry.db");

Entry.db = {
    data: {},
    typeMap: {}
};

(function(db){
    db.add = function(datum) {
        this.data[datum.id] = datum;

        var type = datum.type;
        if (this.typeMap[type] === undefined)
            this.typeMap[type] = {};
        this.typeMap[type][datum.id] = datum;
    };

    db.has = function() {

    };

    db.remove = function() {

    };

    db.get = function() {

    };

    db.find = function() {

    };

    db.clear = function() {

    };

})(Entry.db);
