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
        };
        this._listeners.push(listener);
        return listener;
    };

    p.detach = function (listener) {
        var listeners = this._listeners;
        var index = listeners.indexOf(listener);
        if (index > -1)
            return listeners.splice(index, 1);
    };

    p.clear = function () {
        var listeners = this._listeners;
        while(listeners.length) listeners.pop();
    };

    p.notify = function (args) {
        var listeners = this._listeners;
        var sender = this._sender;

        for (var i=listeners.length-1; i>=0; i--) {
            var listener = listeners[i];
            listener.fn.call(
                listener.obj,
                sender,
                args
            );
        }
    };
})(Entry.Event.prototype);
