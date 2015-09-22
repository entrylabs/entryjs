/*
 *
 */
"use strict";

goog.provide("Entry.Code");

goog.require("Entry.Collection");

/*
 *
 */
Entry.Code = function(code) {
    if (!(code instanceof Array))
        return console.error("code must be array");

    this._threads = new Entry.Collection();

    this.playground = null;

    this.set(code);
};

(function(p) {
    p.set = function(code) {
        var that = this;

        var threads = code.map(function(t) {
            return new Entry.Thread(t, that);
        });

        this._threads.set(threads);
    };

    p.bindPlayground = function(playground) {
        this.playground = playground;

        this._threads.map(function(t) {
            t.renderStart();
        });
    };

})(Entry.Code.prototype);
