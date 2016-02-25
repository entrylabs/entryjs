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
    return;
    this.board = board;
    this.board.changeEvent.attach(this, this.resizeScrollBar);

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
        this._checkVisible();
        if (!this._visible) return;

        var board = this.board,
            bRect = board.svgBlockGroup.getBoundingClientRect(),
            svgDom = board.svgDom,
            realHeight = svgDom.height(),

            bBox = {
                x: bRect.left - board.offset.left,
                y: bRect.top - board.offset.top,
                height: bRect.height
            };

        var vRatio = bBox.height/realHeight;
        if (vRatio === 0) return;
        this.vScrollbar.attr({
            width: 9,
            height: realHeight / vRatio,
            x: svgDom.width() - 9
        });

        this.vRatio = vRatio;
    };

    p.updateScrollBar = function(dy) {
        var clientRect = this.board.svgBlockGroup.getBoundingClientRect(),
            svgDom = this.board.svgDom,
            bBox = {
                x: clientRect.left - this.board.offset.left,
                y: clientRect.top - this.board.offset.top,
                width: clientRect.width,
                height: clientRect.height
            };

        var limitBottom = svgDom.height() - svgDom.height() / this.vRatio;
        this.vY += dy;
        this.vY = Math.max(this.vY, 0);
        this.vY = Math.min(this.vY, limitBottom);
        this.vScrollbar.attr({
            y: this.vY
        });
    };

    p.scroll = function(dy) {
        this.board.code.moveBy(0, dy);
        this.updateScrollBar(dy);
    };

    p.setVisible = function(visible) {
        if (visible == this.isVisible()) return;
        this._visible = visible;
        this.svgGroup.attr({
            display: visible === true ? 'block' : 'none'
        });

    };

    p.isVisible = function() {
        return this._visible;
    };

    p._checkVisible = function() {
        return;
        //TODO check boundary and set visibility
        var visible = true;
        var blockGroupHeight = this.svgBlockGroup.node.getBoundingClientRect().height;
        if (blockGroupHeight + 10 < this.svgDom.height())
            visible = false;

        if (this._scroll !== visible) {
            this._scroll = visible;
            this._scroller.setVisible(visible);
        }

        if (this._scroll) this._scroller.resizeScrollBar();

    };
})(Entry.BlockMenuScroller.prototype);
