/*
 *
 */
"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");
goog.require("Entry.FieldTrashcan");

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

    Entry.Model(this, false);

    this.svgDom = Entry.Dom(
        $('<svg id="play" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: dom }
    );

    this.offset = this.svgDom.offset();

    this.snap = Snap('#play');

    this._blockViews = [];

    this.trashcan = new Entry.FieldTrashcan(this);
    this.svgGroup = this.snap.group();

    this.svgThreadGroup = this.svgGroup.group();
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.group();
    this.svgBlockGroup.board = this;

};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        magnetedBlockView: null
    };

    p.changeCode = function(code) {
        this.set({code: code});
        code.createView(this);
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
    };

    p.setMagnetedBlock = function(block) {
        if (this.magnetedBlockView) {
            if (this.magnetedBlockView === block)
                return;
            else
                this.magnetedBlockView.set({magneting: false});
        }
        this.set({magnetedBlockView: block});
        if (block)
            block.set({magneting: true, animating: true});
    };

    p.dominate = function(thread) {
        this.snap.append(thread.svgGroup);
    };

    p.getCode = function() {
        return this.code;
    };

    p.findById = function(id) {
        console.log('board.findBy=',id);
        var code = this.code;
        var threads = code.getThreads();
        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            if (!thread)
                continue;

            /*
            var block = thread.getFirstBlock();
            if (block && block.id == id) {
                return block;
            }
            */

            var blocks = thread.getBlocks();
            for (var j=0,len=blocks.length; j<len; j++) {
                if (blocks[j] && blocks[j].id == id) {
                    return blocks[j];
                }
            }

        }
        return;
    };


})(Entry.Board.prototype);
