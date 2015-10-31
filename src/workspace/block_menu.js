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
    this._svgWidth = this._svgDom.width();

    this.snap = Snap('#blockMenu');

    this.svgGroup = this.snap.group();

    this.svgThreadGroup = this.svgGroup.group();
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.group();
    this.svgBlockGroup.board = this;

    this.observe(this, "cloneThread", ['dragBlock']);
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null
    };

    p.changeCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        code.createView(this);
        this.set({code: code});
        this.align();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
    };

    p.align = function() {
        var threads = this.code.getThreads();
        var vPadding = 10,
            marginFromTop = 10,
            hPadding = this._svgDom.width()/2;

        for (var i=0,len=threads.length; i<len; i++) {
            var block = threads[i].getFirstBlock();
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
        if (this.dragBlock === null)
            return;
        var svgWidth = this._svgWidth;
        var blockView = this.dragBlock;
        var block = blockView.block;
        var clonedThread;
        var code = this.code;
        var currentThread = block.getThread();
        if (block && currentThread) {
            blockView.observe(this, "moveBoardBlock", ['x', 'y']);
            code.cloneThread(currentThread);

            this._boardBlockView = this.workspace.getBoard().code.
                cloneThread(currentThread).getFirstBlock().view;
            this._boardBlockView._moveTo(
                -(svgWidth - blockView.x),
                blockView.y,
                false
            );
        }

    };

    p.terminateDrag = function() {
        var boardBlockView = this._boardBlockView;
        var boardBlock = boardBlockView.block;
        var dragBlockView = this.dragBlock;
        var dragBlock = dragBlockView.block;
        var thisCode = this.code;
        var boardCode = this.workspace.getBoard().code;

        //destory boardBlock below the range
        var animate = false;
        if (dragBlockView.x < this._svgWidth) {
            animate = true;
            boardCode.destroyThread(boardBlock.getThread(), animate);
        } else boardBlock.view.terminateDrag();

        thisCode.destroyThread(dragBlock.getThread(), animate);
        this._boardBlockView = null;
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

        var dragBlockView = this.dragBlock;
        var boardBlockView = this._boardBlockView;
        if (dragBlockView && boardBlockView) {
            var x = dragBlockView.x;
            var y = dragBlockView.y;
            boardBlockView._moveTo(
                x-offsetX,
                y-offsetY,
                false
            );
        }
    };
})(Entry.BlockMenu.prototype);
