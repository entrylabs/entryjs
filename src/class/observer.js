"use strict";

goog.provide("Entry.ObserverModel");

goog.require("Entry.Model");

Entry.ObserverModel = function() {
    this.base();

    this._observers = [];
};

Entry.ObserverModel.prototype = new Entry.Model;

(function (p) {

    p.base = Entry.Model;

    p.set = function(data) {
        this.base.prototype.set.call(this, data);

        this.notify();
    };

    p.observe = function(obj) {
        this._observers.push(obj);
    };

    p.unobserve = function(obj) {
        for (var i in this._observers) {
            if (this._observers[i] === obj) {
                this._observers.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    p.notify = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        for (var i in this._observers) {
            this._observers[i].update.apply(null, args);
        }
    };

})(Entry.ObserverModel.prototype);
