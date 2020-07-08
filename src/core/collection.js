'use strict';

/*
 * Entry Collection object constructor.
 */

Entry.Collection = class Collection {
    constructor(data) {
        this.length = 0;

        /*
         * object for hashing data with id
         * @private
         */
        this._hashMap = {};

        /*
         * observers
         */
        this._observers = [];
        this.set(data);
    }

    /* setters */
    set(data) {
        while (this.length) {
            Array.prototype.pop.call(this);
        }

        const hashMap = this._hashMap;
        for (const key in hashMap) {
            delete hashMap[key];
        }

        if (data !== undefined) {
            for (let i = 0, len = data.length; i < len; i++) {
                const datum = data[i];
                hashMap[datum.id] = datum;
                Array.prototype.push.call(this, datum);
            }
        }
    }

    push(elem) {
        this._hashMap[elem.id] = elem;
        Array.prototype.push.call(this, elem);
    }

    unshift() {
        const args = Array.prototype.slice.call(arguments, 0);
        const hashMap = this._hashMap;
        for (let i = args.length - 1; i >= 0; i--) {
            const datum = args[i];
            Array.prototype.unshift.call(this, datum);
            hashMap[datum.id] = datum;
        }
    }

    insert(datum, index) {
        Array.prototype.splice.call(this, index, 0, datum);
        this._hashMap[datum.id] = datum;
    }

    has(id) {
        return !!this._hashMap[id];
    }

    get(id) {
        return this._hashMap[id];
    }

    at(index) {
        return this[index];
    }

    getAll() {
        const len = this.length;
        const ret = [];
        for (let i = 0; i < len; i++) {
            ret.push(this[i]);
        }
        return ret;
    }

    indexOf(obj) {
        return Array.prototype.indexOf.call(this, obj);
    }

    find(cond) {
        const ret = [];
        let flag;

        for (let i = 0, len = this.length; i < len; i++) {
            flag = true;
            const datum = this[i];
            for (const key in cond) {
                if (cond[key] != datum[key]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                ret.push(datum);
            }
        }
        return ret;
    }

    pop() {
        const datum = Array.prototype.pop.call(this);
        delete this._hashMap[datum.id];
        return datum;
    }

    shift() {
        const datum = Array.prototype.shift.call(this);
        delete this._hashMap[datum.id];
        return datum;
    }

    slice(index, amount) {
        const data = Array.prototype.slice.call(this, index, amount);
        const hashMap = this._hashMap;
        for (const i in data) {
            delete hashMap[data[i].id];
        }
        return data;
    }

    remove = function(datum) {
        const index = this.indexOf(datum);
        if (index > -1) {
            delete this._hashMap[datum.id];
            this.splice(index, 1);
        }
    };

    splice(index, amount) {
        const args = Array.prototype.slice.call(arguments, 2);
        const hashMap = this._hashMap;
        amount = amount === undefined ? this.length - index : amount;

        const splicedData = Array.prototype.splice.call(this, index, amount);

        for (let i = 0, len = splicedData.length; i < len; i++) {
            delete hashMap[splicedData[i].id];
        }

        for (let i = 0, len = args.length; i < len; i++) {
            const datum = args[i];
            Array.prototype.splice.call(this, index++, 0, datum);
            this._hashMap[datum.id] = datum;
        }

        return splicedData;
    }

    clear() {
        while (this.length) {
            Array.prototype.pop.call(this);
        }
        this._hashMap = {};
    }

    map(fn, param) {
        const array = [];
        for (let i = 0, len = this.length; i < len; i++) {
            array.push(fn(this[i], param));
        }
        return array;
    }

    moveFromTo(from, to) {
        const max = this.length - 1;
        if (from < 0 || to < 0 || from > max || to > max) {
            return;
        }
        Array.prototype.splice.call(this, to, 0, Array.prototype.splice.call(this, from, 1)[0]);
    }

    sort() {}

    /* import & export */
    fromJSON() {}

    toJSON() {
        const json = [];
        for (let i = 0, len = this.length; i < len; i++) {
            json.push(this[i].toJSON());
        }
        return json;
    }

    /* observe methods */
    observe() {}

    unobserve() {}

    notify() {}

    /* end function */
    destroy() {}
};
