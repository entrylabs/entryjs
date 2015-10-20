"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.BlockMenu = function(dom) {
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

    this.offset = this.svgDom.offset();

    this.snap = Snap('#play');
    this.snap.block = "null";

    Entry.Model(this, false);
};

(function(p) {
    p.schema = {
    };

})(Entry.Board.prototype);
