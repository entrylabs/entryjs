"use strict";

goog.provide("Entry.BlockMenu");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.BlockMenu = function(dom, align) {
    Entry.Model(this, false);
    this._align = align || "CENTER";

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    if (typeof window.Snap !== "function")
        return console.error("Snap library is required");

    this.svgDom = Entry.Dom(
        $('<svg id="blockMenu" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: dom }
    );

    this.offset = this.svgDom.offset();
    this._svgWidth = this.svgDom.width();

    this.snap = Snap('#blockMenu');

    this.svgGroup = this.snap.group();

    this.svgThreadGroup = this.svgGroup.group();
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.group();
    this.svgBlockGroup.board = this;

    this.changeEvent = new Entry.Event(this);
    //TODO scroller should be attached
    //this.scroller = new Entry.Scroller(this, false, true);

    this.observe(this, "generateDragBlockObserver", ['dragBlock']);
    if (Entry.documentMousedown)
        Entry.documentMousedown.attach(this, this.setSelectedBlock);
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null
    };

    p.changeCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        if (this.codeListener)
            this.code.changeEvent.detach(this.codeListener);
        this.set({code: code});
        var that = this;
        this.codeListener = this.code.changeEvent.attach(
            this,
            function() {that.changeEvent.notify();}
        );
        code.createView(this);
        this.align();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.append(this.svgThreadGroup);
        this.svgGroup.append(this.svgBlockGroup);
    };

    p.align = function() {
        var threads = this.code.getThreads();
        var vPadding = 15,
            marginFromTop = 10,
            hPadding = this._align == 'LEFT' ? 20 : this.svgDom.width()/2;

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
        this.changeEvent.notify();
    };

    p.generateDragBlockObserver = function() {
        var block = this.dragBlock;
        if (!block) return;

        if (this.dragBlockObserver)
            this.removeDragBlockObserver();
        this.dragBlockObserver =
            block.observe(this, "cloneThread", ['x', 'y'], false);
    };

    p.removeDragBlockObserver = function() {
        var observer = this.dragBlockObserver;
        if (observer === null) return;
        observer.destroy();
        this.dragBlockObserver = null;
    };

    p.cloneThread = function(forMouseMove) {
        forMouseMove = forMouseMove === undefined ?
            true : forMouseMove;
        if (this.dragBlock === null) return;
        if (this.dragBlockObserver)
            this.removeDragBlockObserver();

        var svgWidth = this._svgWidth;
        var blockView = this.dragBlock;
        var block = blockView.block;
        var clonedThread;
        var code = this.code;
        var currentThread = block.getThread();
        if (block && currentThread) {
            clonedThread = code.cloneThread(currentThread);
            if (forMouseMove)
                blockView.observe(
                    this,
                    "moveBoardBlock",
                    ['x', 'y'],
                    false
                );
                //original block should be top of svg
                blockView.dominate();

                var workspaceBoard = this.workspace.getBoard();
                this._boardBlockView = workspaceBoard.code.
                    cloneThread(currentThread).
                    getFirstBlock().view;
                this._boardBlockView.dragInstance =
                    new Entry.DragInstance({
                        height: 0,
                        isNew: true
                    });

                workspaceBoard.set({
                    dragBlock : this._boardBlockView
                });
                workspaceBoard.setSelectedBlock(this._boardBlockView);
                this._boardBlockView.addDragging();
                this._boardBlockView.dragMode = Entry.DRAG_MODE_MOUSEDOWN;

                this._boardBlockView._moveTo(
                    blockView.x-svgWidth,
                    blockView.y-0,
                    false
                );
        }

        if (this._boardBlockView)
            return this._boardBlockView.block.id;

    };

    p.terminateDrag = function() {
        if (!this._boardBlockView) return;

        var boardBlockView = this._boardBlockView;
        if (!boardBlockView) return;
        var boardBlock = boardBlockView.block;
        var dragBlockView = this.dragBlock;
        var dragBlock = dragBlockView.block;
        var thisCode = this.code;
        var workspace = this.workspace;
        var boardCode = workspace.getBoard().code;

        //destroy boardBlock below the range
        var animate = false;
        boardBlockView.dragMode = 0;
        boardBlockView.removeDragging();
        if (dragBlockView.x < this._svgWidth) {
            animate = true;
            boardCode.destroyThread(boardBlock.getThread(), animate);
        } else boardBlock.view.terminateDrag();

        workspace.getBoard().set({dragBlock:null});
        thisCode.destroyThread(dragBlock.getThread(), animate);
        delete boardBlockView.dragInstance;
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

        var instance = boardBlockView.dragInstance;

        var mouse = Entry.mouseCoordinate;
        instance.set({
            offsetX: mouse.x,
            offsetY: mouse.y
        });
        if (instance.height === 0) {
            var block = boardBlockView.block;
            var height = 0;
            while (block) {
                height += block.view.height;
                block = block.next;
            }
            instance.set({
                height: height
            });
        }

        if (dragBlockView && boardBlockView) {
            var x = dragBlockView.x;
            var y = dragBlockView.y;
            boardBlockView.dragMode = 2;
            boardBlockView._moveTo(
                x-offsetX,
                y-offsetY,
                false
            );
        }
    };

    p.setMagnetedBlock = function() {
    };

    p.findById = function(id) {
        var code = this.code;
        var threads = code.getThreads();
        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            if (!thread)
                continue;

            var block = thread.getFirstBlock();
            if (block && block.id == id) {
                return block;
            }
        }
    };

    p.setSelectedBlock = function(blockView) {
        var old = this.selectedBlockView;

        if (old) old.removeSelected();

        if (blockView instanceof Entry.BlockView) {
            this.set({selectedBlockView:blockView});
            blockView.addSelected();
        }
    };

})(Entry.BlockMenu.prototype);
