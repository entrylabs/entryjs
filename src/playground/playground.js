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

Entry.Playground.MAGNET_RANGE = 20;

(function(p) {
    p.schema = {
        dragBlock: null,
        closeMagnet: null
    };

    p.selectCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must select code instance");

        code.bindPlayground(this);

        this.code = code;
    };

    p.updateMagnet = function(magnet) {
    };

    p.terminateDrag = function(block) {
        var di = block.dragInstance;
        delete block.dragInstance;

        if (this.closeMagnet) {

        } else {

            var distance = Math.sqrt(
                Math.pow(di.startX - di.offsetX, 2) +
                Math.pow(di.startY - di.offsetY, 2)
            );

            if (distance < Entry.Playground.MAGNET_RANGE)
                block.thread.align();
            else {
                var newThread = block.thread.cut(block);
                this.code.createThread(newThread);
            }
        }
    };

})(Entry.Playground.prototype);
