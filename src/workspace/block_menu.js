"use strict";

goog.provide("Entry.BlockMenu");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.BlockMenu = function(dom) {
    Entry.Model(this, false);

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    if (typeof window.Snap !== "function")
        return console.error("Snap library is required");

    this._svgDom = Entry.Dom(
        $('<svg id="blockMenu" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: dom }
    );

    this.offset = this._svgDom.offset();

    this.snap = Snap('#blockMenu');
    this.svgBlockGroup = this.snap.group();
    this.snap.block = "null";

    this.observe(this, "_changeCode", ['code']);
    //this.observe(this, "cloneThread", ['dragBlock']);
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null
    };

    p.changeCode = function(code) {
        /*
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        this.set({code: code});
        this.align();
        */
    };

    p._changeCode = function() {
    };

    p.align = function() {
        var threads = this.code._data;
        var vPadding = 10,
            marginFromTop = 10,
            hPadding = this._svgDom.width()/2;

        for (var i=0,len=threads.length; i<len; i++) {
            var block = threads[i]._data[0];
            var blockView = block.view;
            block.set({
                 x: hPadding,
                 y: marginFromTop,
            });
            blockView._moveTo(hPadding, marginFromTop, false);
            marginFromTop += blockView.height + vPadding;
        }
    };

    p.cloneThread = function() {
        var block = this.dragBlock;
        var clonedThread;
        var code = this.getCode();
        if (block && block.thread) {
            block.observe(this, "moveBoardBlock", ['x', 'y']);
            clonedThread = block.getThread().clone(code);
                //clone thread at blockMenu
            var threads = code.getThreads();
            threads.splice(
                threads.indexOf(block.getThread()),
                1,
                clonedThread
            );
            clonedThread.renderStart(this, false);

            //clone thread at Workspace
            var board = this.workspace.getBoard();
            var boardCode = board.getCode();
            var boardThread = block.getThread().clone(boardCode);
            this._boardBlock = boardThread.getBlocks()[0];
            board.dragBlock = this._boardBlock;
            boardCode.addThread(boardThread, false);
            this.moveBoardBlock();
        }
    };


    p.updateCloseMagnet = function(targetBlock) {
    };

    p.terminateDrag = function(block) {
        var boardBlock = this._boardBlock;
        this._boardBlock._board.terminateDrag(boardBlock);

        //remove dragging thread
        var originBlock = this.dragBlock;
        if (originBlock && originBlock.getThread()) {
            //destory boardBlock below the range
            if (originBlock.x < this._svgDom.width())
                destroyThread(boardBlock.getThread());
            destroyThread(originBlock.getThread());
            this._boardBlock = null;
        }
        function destroyThread(thread) {
            thread.destroy();
        }
    };

    p.dominate = function(thread) {
        this.snap.append(thread.svgGroup);
    };

    p.getCode = function(thread) {
        return this._code;
    };

    p.moveBoardBlock = function() {
        var boardOffset = this.workspace.getBoard().offset;
        var thisOffset = this.offset;
        var offsetX = boardOffset.left - thisOffset.left,
            offsetY = boardOffset.top - thisOffset.top;

        var dragBlock = this.dragBlock;
        var boardBlock = this._boardBlock;
        if (boardBlock && dragBlock) {
            var x = dragBlock.x;
            var y = dragBlock.y;
            boardBlock.moveTo(
                x-offsetX,
                y-offsetY,
                false
            );
            boardBlock.getBoard().updateCloseMagnet(boardBlock);
        }
    };
})(Entry.BlockMenu.prototype);
