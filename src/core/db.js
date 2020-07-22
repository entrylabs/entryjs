'use strict';

Entry.db = class DB {
    constructor() {
        this.data = {};
        this.typeMap = {};
    }
    add(datum) {
        this.data[datum.id] = datum;

        const type = datum.type;
        if (this.typeMap[type] === undefined) {
            this.typeMap[type] = {};
        }
        this.typeMap[type][datum.id] = datum;
    }

    has(id) {
        return this.data.hasOwnProperty(id);
    }

    remove(id) {
        if (!this.has(id)) {
            return;
        }

        const datum = this.data[id];
        delete this.typeMap[datum.type][id];
        delete this.data[id];
    }

    get(id) {
        return this.data[id];
    }

    find() {}

    clear() {
        this.data = {};
        this.typeMap = {};
    }
};
