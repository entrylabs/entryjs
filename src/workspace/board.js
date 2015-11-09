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

    /*
    p.updateCloseMagnet = function(targetBlock) {
        if (targetBlock.magnets.previous === undefined)
            return;
        var targetElement = Snap.getElementByPoint(
            targetBlock.x + this.offset.left, targetBlock.y + this.offset.top
        ), targetBlock = targetElement.block;
        while (!targetBlock) {
            targetElement = targetElement.parent();
            targetBlock = targetElement.block;
        }
        if (targetBlock instanceof Entry.Block) {
            if (this.closeBlock !== targetBlock) {
                if (this.closeBlock !== null)
                    this.closeBlock.magneting = false;
                this.closeBlock = targetBlock;
                this.closeBlock.magneting = true;
                this.closeBlock.thread.align(true);
            }
        } else if (targetBlock instanceof Entry.Thread) {
            var thread = targetBlock,
                blocks = thread._blocks,
                cursorY = blocks[0].y;
            for (var j = 0; j < blocks.length; j++) {
                var block = blocks[j];
                if (this.dragBlock === block)
                    continue;
                if (this.dragBlock.y > cursorY && this.dragBlock.y < cursorY + block.height) {
                    if (this.closeBlock !== block) {
                        if (this.closeBlock !== null)
                            this.closeBlock.magneting = false;
                        this.closeBlock = block;
                        this.closeBlock.magneting = true;
                        this.closeBlock.thread.align(true);
                        break;
                    }
                }
                cursorY += block.height;
            }
        } else if (this.closeBlock) {
            this.closeBlock.magneting = false;
            this.closeBlock.thread.align(true);
            this.closeBlock = null;
        }
        return;
    };

    p.terminateDrag = function(block) {
        var di = block.dragInstance;

        if (this.closeBlock) {
            var separatedBlocks = block.thread.cut(block),
                oldThread = block.thread,
                thread = this.closeBlock.thread,
                index = thread.indexOf(this.closeBlock) + 1;
            this.closeBlock.magneting = false;
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
    */

    p.dominate = function(thread) {
        this.snap.append(thread.svgGroup);
    };

    p.getCode = function() {
        return this.code;
    };

    p.findByName = function(name) {
        console.log('find ', name);
        var code = this.code;
        var threads = code.getThreads();
        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            if (!thread)
                continue;

            var block = thread.getFirstBlock();
            if (block && block.name == name) {
                return block;
            }
        }
    };


})(Entry.Board.prototype);
