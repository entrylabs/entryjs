'use strict';

goog.provide("Entry.Event");

Entry.Event = function(sender) {
    this._sender = sender;
    this._listeners = [];
};

(function(p) {
    p.attach = function (obj, fn) {
        var listener = {
            obj: obj,
            fn: fn
        }
        this._listeners.push(listener);
        return listener;
    };

    p.deAttach = function (listener) {
        var ls = this._listeners;
        var index = ls.indexOf(listener);
        this._listeners.splice(index, 1);
    };

    p.notify = function (args) {
        var index;
        var listeners = this._listeners;
        var sender = this._sender;

        for (index = 0; index < listeners.length; index += 1) {
            var ls = listeners[index];
            ls.fn.call(
                ls.obj,
                sender,
                args
            );
        }
    };
})(Entry.Event.prototype);
