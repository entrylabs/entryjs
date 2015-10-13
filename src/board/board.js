/*
 *
 */
"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");

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

    this.snap = Snap('#play');

    Entry.Model(this, false);
};

Entry.Board.dragBlock = null;

Entry.Board.MAGNET_RANGE = 20;

(function(p) {
    p.schema = {
        dragBlock: null,
        closeMagnet: null
    };

    p.selectCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must select code instance");

        code.bindBoard(this);

        this.code = code;
    };

    p.updateCloseMagnet = function(targetBlock) {
        var threads = this.code.threads;
        for (var i = 0; i < threads.length; i++) {
            var thread = threads.at(i);
            if (Entry.Utils.isPointInMatrix(
                thread.model, targetBlock.model, Entry.Board.MAGNET_RANGE
            )) {
                var blocks = thread._blocks;
                for (var j = 0; j < blocks.length; j++) {
                    var block = blocks.at(j);
                    if (Entry.Utils.isPointInMatrix(
                        block.model, targetBlock.model, Entry.Board.MAGNET_RANGE
                    )) {
                        console.log(block);
                        return;
                    }
                }
            }
        }
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

    p.dominate = function(thread) {
        this.snap.append(thread.svgGroup);
    };

})(Entry.Board.prototype);
