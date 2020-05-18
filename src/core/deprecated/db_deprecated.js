'use strict';

Entry.db = {
    data: {},
    typeMap: {},
};

(function(db) {
    db.add = function(datum) {
        this.data[datum.id] = datum;

        const type = datum.type;
        if (this.typeMap[type] === undefined) {
            this.typeMap[type] = {};
        }
        this.typeMap[type][datum.id] = datum;
    };

    db.has = function(id) {
        return this.data.hasOwnProperty(id);
    };

    db.remove = function(id) {
        if (!this.has(id)) {
            return;
        }

        const datum = this.data[id];
        delete this.typeMap[datum.type][id];
        delete this.data[id];
    };

    db.get = function(id) {
        return this.data[id];
    };

    db.find = function() {};

    db.clear = function() {
        this.data = {};
        this.typeMap = {};
    };
})(Entry.db);
