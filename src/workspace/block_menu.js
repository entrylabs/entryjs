"use strict";

goog.provide("Entry.BlockMenu");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.BlockMenu = function(dom, align, categoryData) {
    Entry.Model(this, false);
    this._align = align || "CENTER";

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    if (typeof window.Snap !== "function")
        return console.error("Snap library is required");

    this.view = dom;

    this._generateView(categoryData);

    this.offset = this.svgDom.offset();
    this._splitters = [];
    this._setWidth();

    this.snap = Snap('#blockMenu');

    this.svgGroup = this.snap.group();

    this.svgThreadGroup = this.svgGroup.group();
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.group();
    this.svgBlockGroup.board = this;


    this.changeEvent = new Entry.Event(this);
    //TODO scroller should be attached
    //this.scroller = new Entry.Scroller(this, false, true);

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

    p._generateView = function(categoryData) {
        var parent = this.view;

        if (categoryData) {
            var categoryCol = Entry.Dom('div', {
                class: 'entryCategoryWorkspace',
                parent: parent
            });
        }

        this.svgDom = Entry.Dom(
            $('<svg id="blockMenu"' + 'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: parent }
        );


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

            //TODO splitter generate condition needed
            if (i !== 0) {
                this._createSplitter(marginFromTop);
                marginFromTop += vPadding;
            }
            blockView._moveTo(hPadding, marginFromTop, false);
            marginFromTop += blockView.height + vPadding;
        }
        this.changeEvent.notify();
    };

    p.cloneToBoard = function(e) {
        if (this.dragBlock === null) return;
        if (this._boardBlockView) return;

        var svgWidth = this._svgWidth;
        var blockView = this.dragBlock;
        var block = blockView.block;
        var clonedThread;
        var code = this.code;
        var currentThread = block.getThread();
        if (block && currentThread) {
            var workspaceBoard = this.workspace.getBoard();
            var mode = this.workspace.getMode();
            this._boardBlockView = workspaceBoard.code.
                cloneThread(currentThread, mode).getFirstBlock().view;

            this._boardBlockView._moveTo(
                blockView.x-svgWidth,
                blockView.y-0,
                false
            );
            this._boardBlockView.onMouseDown.call(this._boardBlockView, e);
            this._dragObserver =
                this._boardBlockView.observe(this, "_editDragInstance", ['x', 'y'], false);
        }
    };

    p._editDragInstance = function() {
        if (this._boardBlockView)
            this._boardBlockView.dragInstance.set({isNew:true});
        if (this._dragObserver)
            this._dragObserver.destroy();
    };

    p.terminateDrag = function() {
        if (!this._boardBlockView) return;

        var boardBlockView = this._boardBlockView;
        if (!boardBlockView) return;
        var thisCode = this.code;
        var workspace = this.workspace;
        var boardCode = workspace.getBoard().code;

        this._boardBlockView = null;

        //board block should be removed below the amount of range
        var blockLeft = Entry.GlobalSvg.left;
        var width = Entry.GlobalSvg.width/2;
        var boardLeft = boardBlockView.getBoard().offset.left;
        return blockLeft < boardLeft - width;
    };

    p.getCode = function(thread) {return this._code;};

    p.setSelectedBlock = function(blockView) {
        var old = this.selectedBlockView;

        if (old) old.removeSelected();

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else blockView = null;

        this.set({selectedBlockView:blockView});
    };

    p.hide = function() {this.view.addClass('entryRemove');};

    p.show = function() {this.view.removeClass('entryRemove');};

    p.renderText = function() {
        var threads = this.code.getThreads();
        for (var i=0; i<threads.length; i++)
            threads[i].view.renderText();
    };

    p.renderBlock = function() {
        var threads = this.code.getThreads();
        for (var i=0; i<threads.length; i++)
            threads[i].view.renderBlock();
    };

    p._createSplitter = function(topPos) {
        var width = this._svgWidth;
        var hPadding = 30;
        var svgBlockGroup = this.svgBlockGroup;
        var line = svgBlockGroup.line(hPadding, topPos, width-hPadding, topPos);
        line.attr({'stroke' : '#b5b5b5'});
        this._splitters.push(line);
    };

    p._updateSplitters = function() {
        var splitters = this._splitters;
        var width = this._svgWidth;
        var hPadding = 30;
        var dest = width - hPadding;
        splitters.forEach(function(line) {
            line.attr({x2: dest});
        });
    };

    p._clearSplitters = function() {
        var splitters = this._splitters;
        for (var i = splitters.length-1; i>=0; i--) {
            splitters[i].remove();
            splitters.pop();
        }
    };

    p._setWidth = function() {
        this._svgWidth = this.svgDom.width();
        this._updateSplitters();
    };

})(Entry.BlockMenu.prototype);
