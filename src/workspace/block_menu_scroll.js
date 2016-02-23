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

        this.svgGroup = this.board.snap.group()
                            .attr({class: "boardScrollbar"});

        this.vScrollbar = this.svgGroup.rect(0, 0, 2 * r, 0, r);

        this.vScrollbar.mousedown(function(e) {
            if (e.button === 0 || e instanceof Touch) {
                if (Entry.documentMousedown)
                    Entry.documentMousedown.notify(e);
                var doc = $(document);
                doc.bind('mousemove.scroll', onMouseMove);
                doc.bind('mouseup.scroll', onMouseUp);
                doc.bind('touchmove.scroll', onMouseMove);
                doc.bind('touchend.scroll', onMouseUp);
                that.dragInstance = new Entry.DragInstance({
                    startX: e.pageX,
                    startY: e.pageY,
                    offsetX: e.pageX,
                    offsetY: e.pageY
                });
            }

            function onMouseMove(e) {
                e.stopPropagation();
                e.preventDefault();

                if (e.originalEvent.touches) e = e.originalEvent.touches[0];

                var dragInstance = that.dragInstance;
                that.scroll(
                    0,
                    (e.pageY - dragInstance.offsetY) / that.vRatio
                );

                dragInstance.set({
                    offsetX: e.pageX,
                    offsetY: e.pageY
                });
            }

            function onMouseUp(e) {
                $(document).unbind('.scroll');
                delete that.dragInstance;
            }
            e.stopPropagation();
        });

        this.resizeScrollBar();
    };

    p.resizeScrollBar = function() {
        if (!this._visible) return;

        var board = this.board,
            bRect = board.svgBlockGroup.node.getBoundingClientRect(),
            svgDom = board.svgDom,
            realHeight = svgDom.height(),

            bBox = {
                x: bRect.left - board.offset.left,
                y: bRect.top - board.offset.top,
                height: bRect.height
            };

        var vRatio =bBox.height/realHeight;
        console.log('vRatio', vRatio);
        //this.vY = (bBox.y - vLimitA) / (vLimitB - vLimitA) *
            //(bHeight - vWidth - 2 * Entry.Scroller.RADIUS);
        //this.vScrollbar.attr({
            //height: vWidth,
            //y: this.vY,
            //x: bWidth - 2 * Entry.Scroller.RADIUS
        //});

        //this.vRatio = (bHeight - vWidth - 2 * Entry.Scroller.RADIUS)/ (vLimitB - vLimitA);
    };

    p.updateScrollBar = function(dx, dy) {
        this.vY += dy * this.vRatio;
        this.vScrollbar.attr({
            y: this.vY
        });
    };

    p.scroll = function(x, y) {
        var clientRect = this.board.svgBlockGroup.node.getBoundingClientRect(),
            svgDom = this.board.svgDom,
            bBox = {
                x: clientRect.left - this.board.offset.left,
                y: clientRect.top - this.board.offset.top,
                width: clientRect.width,
                height: clientRect.height
            };
        x = Math.max(-bBox.width + Entry.BOARD_PADDING - bBox.x, x);
        y = Math.max(-bBox.height + Entry.BOARD_PADDING - bBox.y, y);
        x = Math.min(
            svgDom.width() - Entry.BOARD_PADDING - bBox.x,
            x
        );
        y = Math.min(
            svgDom.height() - Entry.BOARD_PADDING - bBox.y,
            y
        );
        this.board.code.moveBy(x, y);
        this.updateScrollBar(x, y);
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
})(Entry.BlockMenuScroller.prototype);
