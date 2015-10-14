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
        closeBlock: null
    };

    p.selectCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must select code instance");

        code.bindBoard(this);

        this.code = code;
    };

    p.updateCloseMagnet = function(targetBlock) {
        var threads = this.code.threads;
        var targetThread = targetBlock.thread
        for (var i = 0; i < threads.length; i++) {
            var thread = threads.at(i);
            if (Entry.Utils.isPointInMatrix(
                thread, targetBlock, Entry.Board.MAGNET_RANGE
            )) {
                var blocks = thread._blocks;
                for (var j = 0; j < blocks.length; j++) {
                    var block = blocks.at(j);
                    var matrix = {
                        x: block.x,
                        y: block.y + block.height,
                        width: block.width,
                        height: 0
                    }
                    if (Entry.Utils.isPointInMatrix(
                        matrix, targetBlock, Entry.Board.MAGNET_RANGE
                    )) {
                        if (this.closeBlock !== block) {
                            if (this.closeBlock !== null)
                                this.closeBlock.magnets.next.y = 31;
                            var movingBlocks = targetThread._blocks.slice(targetThread._blocks.indexOf(targetBlock));
                            var targetHeight = block.magnets.next.y;
                            movingBlocks.map(function(b) {targetHeight += b.height})
                            block.magnets.next.y = targetHeight;
                            block.thread.align(true);
                            this.closeBlock = block;
                        }
                        return;
                    }
                }
            }
        }
        if (this.closeBlock) {
            this.closeBlock.magnets.next.y = 31;
            this.closeBlock.thread.align(true);
            this.closeBlock = null;
        }
    };

    p.terminateDrag = function(block) {
        var di = block.dragInstance;
        delete block.dragInstance;

        if (this.closeBlock) {
            var separatedBlocks = block.thread.cut(block),
                oldThread = block.thread,
                thread = this.closeBlock.thread,
                index = thread.indexOf(this.closeBlock) + 1;
            this.closeBlock.magnets.next.y = 31;
            for (var i = separatedBlocks.length - 1; i >=0; i--) {
                separatedBlocks[i].thread = thread;
                 thread._blocks.insert(separatedBlocks[i], index);
            }
            thread.align();
            if (oldThread._blocks.length === 0) {
                oldThread.destroy();
            } else {
                oldThread.align();
            }
            this.closeBlock = null;
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
