'use strict';

goog.provide("Entry.Collection");

/*
 * Entry Collection object constructor.
 */
Entry.Collection = function(data) {
    /*
     * array for store data
     * @private
     */
    this._data = [];

    /*
     * object for hashing data with id
     * @private
     */
    this._hashMap = {};

    /*
     * observers
     */
    this._observers = [];

    Object.defineProperty(this, 'length', {
        get: function() {
            return this._data.length;
        }
    });

    this.set(data);
};

(function(p) {
    /* setters */
    p.set = function(data) {
        if (!data)
            data = [];
        var hashMap = this._hashMap;
        for (var key in hashMap)
            delete hashMap[key];
        for (var i = 0, len = data.length; i<len; i++) {
            var datum = data[i];
            hashMap[datum.id] = datum;
        }
        this._data = data;
    };

    p.push = function(datum) {
        this._data.push(datum);
        this._hashMap[datum.id] = datum;
    };

    p.unshift = function() {
        var args = Array.prototype.slice.call(arguments,0);
        for (var i=args.length-1; i>=0; i--) {
            var datum = args[i];
            this._data.unshift(datum);
            this._hashMap[datum.id] = datum;
        }
    };

    p.insert = function(datum, index) {
        this._data.splice(index, 0, datum);
        this._hashMap[datum.id] = datum;
    };

    /* getters */
    p.has = function(id) {
        return !!this._hashMap[id];
    };

    p.get = function(id) {
        return this._hashMap[id];
    };

    p.getAll = function() {
        return this._data;
    };

    p.at = function(index) {
        return this._data[index];
    };

    p.indexOf = function(obj) {
        return this._data.indexOf(obj);
    };

    p.find = function(cond) {
        var data = this._data;
        var ret = [];
        var flag;

        for (var i=0,len=this.length; i<len; i++) {
            flag = true;
            var datum = data[i];
            for(var key in cond) {
                if (cond[key] != datum[key]) {
                    flag = false;
                    break;
                }
            }
            if (flag)
                ret.push(datum);
        }
        return ret;
    };

    p.pop = function() {
        if (this.length === 0)
            return undefined;
        var data = this._data;
        var datum = data.splice(data.length-1, 1)[0];
        delete this._hashMap[datum.id];
        return datum;
    };

    p.shift = function() {
        if (this.length === 0)
            return undefined;
        var data = this._data;
        var datum = data.shift();
        delete this._hashMap[datum.id];
        return datum;
    };

    p.slice = function(index, amount) {
        if (index < 0 || index > this.length)
            return undefined;

        var data = this._data;

        var slicedData = data.slice(index, amount);

        return slicedData;
    };

    /* removers */
    p.remove = function(datum) {
        var index = this.indexOf(datum);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    p.splice = function(index, amount) {
        var args = Array.prototype.slice.call(arguments,2);

        if (index < 0 || index > this.length)
            return undefined;

        var data = this._data;
        var hashMap = this._hashMap;

        amount = amount === undefined ? this.length - index: amount;

        var splicedData = data.splice(index, amount);

        for (var i=0,len=splicedData.length; i<len; i++)
            delete hashMap[splicedData[i].id];

        for (i=0,len=args.length; i<len; i++) {
            var datum = args[i];
            data.splice(index++, 0, datum);
            hashMap[datum.id] = datum;
        }

        return splicedData;
    };

    p.clear = function() {
        var data = this._data;
        var hashMap = this._hashMap;
        while(this.length)
            data.pop();
        for (var key in hashMap)
            delete hashMap[key];
    };

    /* help methods */
    p.map = function(fn, param) {
        var data = this._data;
        for (var i=0, len=this.length; i<len; i++)
            fn(data[i], param);
    };

    p.moveFromTo = function(from, to) {
        var limit = this.length-1;
        if (from< 0 || to<0 || from>limit || to>limit)
            return;

        var data = this._data;
        data.splice(to, 0, data.splice(from, 1)[0]);
    };

    p.sort = function() {
    };

    /* import & export */
    p.fromJSON = function() {
    };

    p.toJSON = function() {
        var json = [];
        var data = this._data;
        for (var i=0, len=this.length; i<len; i++)
            json.push(data[i].toJSON());
        return json;
    };

    /* observe methods */
    p.observe = function() {
    };

    p.unobserve = function() {
    };

    p.notify = function() {
    };

    /* end function */
    p.destroy = function() {
    };

})(Entry.Collection.prototype);
