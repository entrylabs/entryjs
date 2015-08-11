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
        this._data = data;
    };

    p.push = function(datum) {
        this._data.push(datum);
        this._hashMap[datum.id] = datum;
    };

    p.unshift = function() {
    };

    p.insert = function() {
    };

    /* getters */
    p.has = function() {
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
    };

    p.shift= function() {
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
