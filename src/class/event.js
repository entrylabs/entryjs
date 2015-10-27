'use strict';

goog.provide("Entry.Event");

Entry.Event = function(sender) {
    this._sender = sender;
    this._listeners = [];
};

(function(p) {
    p.attach = function (listener) {
        this._listeners.push(listener);
    };

    p.notify = function (args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    };
})(Entry.Event.prototype);
