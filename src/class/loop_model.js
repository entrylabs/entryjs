"use strict";

goog.provide("Entry.LoopModel");

goog.require("Entry.Model");

Entry.LoopModel = function() {
    Entry.Model.call(this);

    this._observers = [];
};

Entry.LoopModel.prototype = new Entry.Model;

(function (p) {

    p.base = Entry.Model;

    p.bind = function(obj) {
        this._observers.push(obj);
    };

    p.unbind = function(obj) {
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

})(Entry.LoopModel.prototype);
