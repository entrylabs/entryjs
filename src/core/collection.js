'use strict';

/*
 * Entry Collection object constructor.
 */

Entry.Collection = function(data) {
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
};

(function(p, ap) {
    /* setters */
    p.set = function(data) {
        while (this.length) {
            ap.pop.call(this);
        }

        const hashMap = this._hashMap;
        for (const key in hashMap) {
            delete hashMap[key];
        }

        if (data !== undefined) {
            for (let i = 0, len = data.length; i < len; i++) {
                const datum = data[i];
                hashMap[datum.id] = datum;
                ap.push.call(this, datum);
            }
        }
    };

    p.push = function(elem) {
        this._hashMap[elem.id] = elem;
        ap.push.call(this, elem);
    };

    p.unshift = function() {
        const args = Array.prototype.slice.call(arguments, 0);
        const hashMap = this._hashMap;
        for (let i = args.length - 1; i >= 0; i--) {
            const datum = args[i];
            ap.unshift.call(this, datum);
            hashMap[datum.id] = datum;
        }
    };

    p.insert = function(datum, index) {
        ap.splice.call(this, index, 0, datum);
        this._hashMap[datum.id] = datum;
    };

    p.has = function(id) {
        return !!this._hashMap[id];
    };

    p.get = function(id) {
        return this._hashMap[id];
    };

    p.at = function(index) {
        return this[index];
    };

    p.getAll = function() {
        const len = this.length;
        const ret = [];
        for (let i = 0; i < len; i++) {
            ret.push(this[i]);
        }
        return ret;
    };

    p.indexOf = function(obj) {
        return ap.indexOf.call(this, obj);
    };

    p.find = function(cond) {
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
    };

    p.pop = function() {
        const datum = ap.pop.call(this);
        delete this._hashMap[datum.id];
        return datum;
    };

    p.shift = function() {
        const datum = ap.shift.call(this);
        delete this._hashMap[datum.id];
        return datum;
    };

    p.slice = function(index, amount) {
        const data = ap.slice.call(this, index, amount);
        const hashMap = this._hashMap;
        for (const i in data) {
            delete hashMap[data[i].id];
        }
        return data;
    };

    p.remove = function(datum) {
        const index = this.indexOf(datum);
        if (index > -1) {
            delete this._hashMap[datum.id];
            this.splice(index, 1);
        }
    };

    p.splice = function(index, amount) {
        const args = ap.slice.call(arguments, 2);
        const hashMap = this._hashMap;
        amount = amount === undefined ? this.length - index : amount;

        const splicedData = ap.splice.call(this, index, amount);

        for (let i = 0, len = splicedData.length; i < len; i++) {
            delete hashMap[splicedData[i].id];
        }

        for (let i = 0, len = args.length; i < len; i++) {
            const datum = args[i];
            ap.splice.call(this, index++, 0, datum);
            this._hashMap[datum.id] = datum;
        }

        return splicedData;
    };

    p.clear = function() {
        while (this.length) {
            ap.pop.call(this);
        }
        this._hashMap = {};
    };

    p.map = function(fn, param) {
        const array = [];
        for (let i = 0, len = this.length; i < len; i++) {
            array.push(fn(this[i], param));
        }
        return array;
    };

    p.moveFromTo = function(from, to) {
        const max = this.length - 1;
        if (from < 0 || to < 0 || from > max || to > max) {
            return;
        }
        ap.splice.call(this, to, 0, ap.splice.call(this, from, 1)[0]);
    };

    p.sort = function() {};

    /* import & export */
    p.fromJSON = function() {};

    p.toJSON = function() {
        const json = [];
        for (let i = 0, len = this.length; i < len; i++) {
            json.push(this[i].toJSON());
        }
        return json;
    };

    /* observe methods */
    p.observe = function() {};

    p.unobserve = function() {};

    p.notify = function() {};

    /* end function */
    p.destroy = function() {};
})(Entry.Collection.prototype, Array.prototype);
