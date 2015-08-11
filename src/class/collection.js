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
        this._hashMap = {};
        for (var i = 0, len = data.length; i<len; i++) {
            var datum = data[i];
            this._hashMap[datum.id] = datum;
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

    p.at = function(index) {
        return this._data[index];
    };

    p.find = function() {
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
    };

    p.toArray = function() {
        return this._data;
    };

    /* removers */
    p.splice = function() {
    };

    p.clear = function() {
    };

    /* help methods */
    p.map = function() {
    };

    p.moveTo = function(i, j) {
    };

    p.sort = function() {
    };

    /* import & export */
    p.fromJSON = function() {
    };

    p.toJSON = function() {
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
