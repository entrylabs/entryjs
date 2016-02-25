/*
 *
 */
"use strict";

goog.provide("Entry.BlockMenuScroller");

/*
 *
 * @param {object} board
 */
Entry.BlockMenuScroller = function(board) {
    this.board = board;
    this.board.changeEvent.attach(this, this._reset);

    this.svgGroup = null;

    this.hX = 0;
    this.vWidth = 0;
    this.vY = 0;
    this.vRatio = 0;
    this._visible = true;

    this.createScrollBar();

    if (Entry.windowResized)
        Entry.windowResized.attach(this, this.resizeScrollBar);
};

Entry.BlockMenuScroller.RADIUS = 7;

(function(p) {
    p.createScrollBar = function() {
        var r = Entry.Scroller.RADIUS;
        var that = this;

        this.svgGroup =
            this.board.svgGroup.elem('g',{class: "boardScrollbar"});

            this.vScrollbar = this.svgGroup.elem('rect', {
                rx: 4, ry:4
            });

        this.vScrollbar.onmousedown = function(e) {
            if (e.button === 0 || e instanceof Touch) {
                if (Entry.documentMousedown)
                    Entry.documentMousedown.notify(e);
                var doc = $(document);
                doc.bind('mousemove.scroll', onMouseMove);
                doc.bind('mouseup.scroll', onMouseUp);
                doc.bind('touchmove.scroll', onMouseMove);
                doc.bind('touchend.scroll', onMouseUp);
                that.dragInstance = new Entry.DragInstance({
                    startY: e.pageY,
                    offsetY: e.pageY
                });
            }

            function onMouseMove(e) {
                e.stopPropagation();
                e.preventDefault();

                if (e.originalEvent.touches) e = e.originalEvent.touches[0];

                var dragInstance = that.dragInstance;
                that.scroll(e.pageY - dragInstance.offsetY);

                dragInstance.set({
                    offsetY: e.pageY
                });
            }

            function onMouseUp(e) {
                $(document).unbind('.scroll');
                delete that.dragInstance;
            }
            e.stopPropagation();
        };

        this.resizeScrollBar();
    };

    p.resizeScrollBar = function() {
        this._updateRatio();
        if (!this._visible || this.vRatio === 0) return;
        var that = this;
        var dom = this.board.blockMenuContainer;

        this.vScrollbar.attr({
            width: 9,
            height: dom.height() / that.vRatio,
            x: dom.width() - 9
        });
    };

    p.updateScrollBar = function(dy) {
        this.vY += dy;
        this.vScrollbar.attr({
            y: this.vY
        });
    };

    p.scroll = function(dy) {
        if (this._inspectLimit(dy)) return;

        this.board.code.moveBy(0, -dy * this.vRatio);
        this.updateScrollBar(dy);
    };


    //return true when newY is out of range
    p._inspectLimit = function(dy) {
        var domHeight = this.board.svgDom.height();
        var limitBottom = domHeight - domHeight/this.vRatio;
        var newY = this.vY + dy;

        return newY <= 0 || newY >= limitBottom;
    };

    p.setVisible = function(visible) {
        if (visible == this.isVisible()) return;
        this._visible = visible;
        this.svgGroup.attr({
            display: visible === true ? 'block' : 'none'
        });

    };

    p.isVisible = function() {return this._visible;};

    p._updateRatio = function() {
        var board = this.board,
            bRect = board.svgBlockGroup.getBoundingClientRect(),
            svgDom = board.svgDom,
            realHeight = board.blockMenuContainer.height(),

            bBox = {
                x: bRect.left - board.offset.left,
                y: bRect.top - board.offset.top,
                height: bRect.height
            };

        var vRatio = (bBox.height + bBox.y + 10)/realHeight;
        this.vRatio = vRatio;
        if (vRatio <= 1)
            this.setVisible(false);
        else
            this.setVisible(true);
    };

    p._reset = function() {
        this.vY = 0;
        this.vScrollbar.attr({
            y: this.vY
        });
        this.resizeScrollBar();
    };
})(Entry.BlockMenuScroller.prototype);
