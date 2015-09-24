/*
 *
 */
"use strict";

goog.provide("Entry.Playground");

goog.require("Entry.Dom");
goog.require("Entry.Model");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.Playground = function(dom) {
    if (typeof dom === "string")
        dom = $('#' + dom);
    else
        dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    if (typeof window.Snap !== "function")
        return console.error("Snap library is required");

    this.svgDom = Entry.Dom(
        $('<svg id="play" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: dom }
    );

    this.snap = Snap('#play');

    this._magnetDB = {
        previous: [],
        next: []
    };

    Entry.Model(this, false);
};

Entry.Playground.dragBlock = null;

(function(p) {
    p.schema = {
        dragBlock: null,
        magnetOn: null
    };

    p.selectCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must select code instance");

        code.bindPlayground(this);

        this.code = code;
    };

    p.updateMagnet = function(magnet) {
    };

})(Entry.Playground.prototype);
