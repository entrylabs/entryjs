'use strict';

goog.provide("Entry.Event");

Entry.Event = function(sender) {
    this._sender = sender;
    this._listeners = [];
};

(function(p) {
    p.attach = function (obj, fn) {
        var that = this;
        var listener = {
            obj: obj,
            fn: fn,
            destroy: function() {
                that.detach(this);
            }
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

    p.notify = function () {
        var args = arguments;
        this._listeners.slice().forEach(function(listener){
            listener.fn.apply(
                listener.obj,
                args
            );
        });
    };
})(Entry.Event.prototype);
