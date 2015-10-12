/*
 *
 */
"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.Board = function(dom) {
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

    this._magnetMap = null;

    this.snap = Snap('#play');

    Entry.Model(this, false);
};

Entry.Baard.dragBlock = null;

Entry.Board.MAGNET_RANGE = 20;

(function(p) {
    p.schema = {
        dragBlock: null,
        closeMagnet: null
    };

    p.selectCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must select code instance");

        this.initMagnetMap();

        code.bindBoard(this);

        this.code = code;
    };

    p.initMagnetMap = function() {
        this._magnetMap = {
            previous: [],
            next: []
        };
    };

    p.updateCloseMagnet = function(block) {
    };

    p.getMagnetMap = function() {
        return this._magnetMap;
    };

    p.terminateDrag = function(block) {
        var di = block.dragInstance;
        delete block.dragInstance;

        if (this.closeMagnet) {

        } else if (block.thread.indexOf(block) !== 0) {
            var distance = Math.sqrt(
                Math.pow(di.startX - di.offsetX, 2) +
                Math.pow(di.startY - di.offsetY, 2)
            );

            if (distance < Entry.Board.MAGNET_RANGE) {
                block.thread.align();
                return;
            }
            else {
                var newThread = block.thread.cut(block);
                this.code.createThread(newThread);
            }
        } else {
            block.thread.align();
        }
        //this.updateMagnetMap(block);
    };

})(Entry.Board.prototype);
