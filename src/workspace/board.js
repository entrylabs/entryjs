/*
 *
 */
"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");
goog.require("Entry.FieldTrashcan");
goog.require("Entry.Scroller");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.Board = function(option) {
    var dom = option.dom;
    if (typeof dom === "string")
        dom = $('#' + dom);
    else
        dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    if (typeof window.Snap !== "function")
        return console.error("Snap library is required");

    Entry.Model(this, false);

    this.view = dom;

    this.workspace = option.workspace;

    this.wrapper = Entry.Dom('div', {
        parent: dom,
        class: 'entryBoardWrapper'
    });

    this.svgDom = Entry.Dom(
        $('<svg id="play" class="entryBoard" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: this.wrapper }
    );

    var zoom = document.documentElement.clientWidth / window.innerWidth;
    this.offset = this.svgDom.offset();
    this.offset.left -= $(window).scrollLeft();
    this.relativeOffset = this.offset;

    this.visible = true;
    var that = this;
    $(window).scroll(updateOffset);
    Entry.windowResized.attach(this, updateOffset);
    function updateOffset(e) {
        that.offset = that.svgDom.offset();
        var w = $(window),
            scrollTop = w.scrollTop(),
            scrollLeft = w.scrollLeft(),
            offset = that.offset;

        that.relativeOffset = {
            top: offset.top - scrollTop,
            left: offset.left - scrollLeft
        };
    }

    this.snap = Snap('#play');

    this._blockViews = [];

    this.trashcan = new Entry.FieldTrashcan(this);
    this.svgGroup = this.snap.group();

    this.svgThreadGroup = this.svgGroup.group();
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.group();
    this.svgBlockGroup.board = this;

    Entry.ANIMATION_DURATION = 200;
    Entry.BOARD_PADDING = 100;

    this.changeEvent = new Entry.Event(this);
    this.scroller = new Entry.Scroller(this, true, true);

    Entry.Utils.disableContextmenu(this.svgDom);

    this._addControl(dom);
    if (Entry.documentMousedown)
        Entry.documentMousedown.attach(this, this.setSelectedBlock);
    if (Entry.keyPressed)
        Entry.keyPressed.attach(this, this._keyboardControl);
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        magnetedBlockView: null,
        selectedBlockView: null
    };

    p.changeCode = function(code) {
        if (this.codeListener)
            this.code.changeEvent.detach(this.codeListener);
        this.set({code: code});
        var that = this;
        this.codeListener = this.code.changeEvent.attach(
            this,
            function() {that.changeEvent.notify();}
        );
        code.createView(this);
        this.changeEvent.notify();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.append(this.svgThreadGroup);
        this.svgGroup.append(this.svgBlockGroup);
    };

    p.setMagnetedBlock = function(block) {
        if (this.magnetedBlockView) {
            if (this.magnetedBlockView === block)
                return;
            else
                this.magnetedBlockView.set({magneting: false});
        }
        this.set({magnetedBlockView: block});
        if (block) {
            block.set({magneting: true});
            block.dominate();
            this.dragBlock.dominate();
        }
    };

    p.getCode = function() {
        return this.code;
    };

    p.findById = function(id) {
        var code = this.code;
        var threads = code.getThreads();
        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            if (!thread) continue;

            var blocks = thread.getBlocks();
            for (var j=0,len=blocks.length; j<len; j++) {
                if (blocks[j] && blocks[j].id == id) {
                    return blocks[j];
                }
            }
        }
    };

    p._addControl = function(dom) {
        var that = this;
        dom.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
        dom.bind('touchstart', function() {
            that.onMouseDown.apply(that, arguments);
        });
        dom.on('mousewheel', function(){
            that.mouseWheel.apply(that, arguments);
        });
    };

    p.onMouseDown = function(e) {
        if (this.workspace.getMode() == Entry.Workspace.MODE_VIMBOARD)
            return;
        if (e.originalEvent.touches)
            e = e.originalEvent.touches[0];

        if (e.button === 0 || e instanceof Touch) {
            if (Entry.documentMousedown)
                Entry.documentMousedown.notify(e);
            var doc = $(document);
            doc.bind('mousemove.entryBoard', onMouseMove);
            doc.bind('mouseup.entryBoard', onMouseUp);
            doc.bind('touchmove.entryBoard', onMouseMove);
            doc.bind('touchend.entryBoard', onMouseUp);
            this.dragInstance = new Entry.DragInstance({
                startX: e.pageX,
                startY: e.pageY,
                offsetX: e.pageX,
                offsetY: e.pageY
            });
        } else if (Entry.Utils.isRightButton(e)) {
            if (!this.visible) return;
            var that = this;

            var options = [];

            var paste = {
                text: '붙여넣기',
                enable: !!Entry.clipboard,
                callback: function(){
                    that.code.createThread(Entry.clipboard)
                        .getFirstBlock().copyToClipboard();
                }
            };

            var align = {
                text: '블록 정리하기',
                callback: function(){
                    that.alignThreads();
                }
            };

            options.push(paste);
            options.push(align);

            Entry.ContextMenu.show(options);
        }

        var board = this;
        function onMouseMove(e) {
            e.stopPropagation();
            e.preventDefault();

            if (e.originalEvent.touches) {
                e = e.originalEvent.touches[0];
            }
            var dragInstance = board.dragInstance;
            board.scroller.scroll(
                e.pageX - dragInstance.offsetX,
                e.pageY - dragInstance.offsetY
            );
            dragInstance.set({
                offsetX: e.pageX,
                offsetY: e.pageY
            });
        }

        function onMouseUp(e) {
            $(document).unbind('.entryBoard');
            delete board.dragInstance;
        }
        e.stopPropagation();
    };

    p.mouseWheel = function(e) {
        e = e.originalEvent;

        this.scroller.scroll(
            e.wheelDeltaX || -e.deltaX,
            e.wheelDeltaY || -e.deltaY
        );
    };

    p.setSelectedBlock = function(blockView) {
        var old = this.selectedBlockView;

        if (old) old.removeSelected();

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else blockView = null;

        this.set({selectedBlockView:blockView});
    };

    p._keyboardControl = function(sender, event) {
        var selected = this.selectedBlockView;
        if (!selected) return;

        if (event.keyCode == 46) {
            if (selected.block.doDestroyAlone(true))
                this.set({selectedBlockView:null});
        }
    };

    p.hide = function() {
        this.wrapper.addClass('entryRemove');
       // this.wrapper.css('opacity', '0');
        this.visible = false;
    };

    p.show = function() {
        this.wrapper.removeClass('entryRemove');
        //this.wrapper.css('opacity', '1');
        this.visible = true;
        this.trashcan.setPosition();
    };

    p.alignThreads = function() {
        var domHeight = this.svgDom.height();
        var threads = this.code.getThreads();

        var verticalGap = 15;
        var acculmulatedTop = 15;
        var columWidth = 0;
        var limitTopPosition = domHeight - 30;
        var left = 50;

        for (var i =0; i < threads.length; i++) {
            var block = threads[i].getFirstBlock();
            var blockView = block.view;
            var bBox = blockView.svgGroup.getBBox();
            var top = acculmulatedTop + verticalGap;
            if (top > limitTopPosition) {
                left = left + columWidth + 10;
                columWidth = 0;
                acculmulatedTop = 15;
            }
            columWidth = Math.max(columWidth, bBox.width);
            top = acculmulatedTop + verticalGap;
            blockView._moveTo(left, top, false);
            acculmulatedTop = acculmulatedTop + bBox.height + verticalGap;
        }
        this.scroller.resizeScrollBar();
    };

    p.clear = function() {
        var node = this.svgBlockGroup.node;
        while (node.firstChild)
            node.removeChild(node.firstChild);
    };

})(Entry.Board.prototype);
