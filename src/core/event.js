'use strict';

Entry.Event = class Event {
    constructor(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    attach(obj, fn) {
        const that = this;
        const listener = {
            obj,
            fn,
            destroy() {
                that.detach(this);
            },
        };
        this._listeners.push(listener);
        return listener;
    }

    detach(listener) {
        const listeners = this._listeners || [];
        const index = listeners.indexOf(listener);
        if (index > -1) {
            return listeners.splice(index, 1);
        }
    }

    clear() {
        const listeners = this._listeners;
        while (listeners.length) {
            listeners.pop().destroy();
        }
    }

    notify() {
        const args = arguments;
        this._listeners.slice().forEach(function(listener) {
            try {
                listener.fn.apply(listener.obj, args);
            } catch (e) {
                console.warn(e, listener, listener.fn);
            }
        });
    }

    hasListeners() {
        return !!this._listeners.length;
    }
};
