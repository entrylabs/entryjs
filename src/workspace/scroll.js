/*
 *
 */
"use strict";

goog.provide("Entry.Scroller");

/*
 *
 * @param {object} board
 */
Entry.Scroller = function(board, horizontal, vertical) {
    this._horizontal = horizontal === undefined ? true : horizontal;
    this._vertical = vertical === undefined ? true : vertical;

    this.board = board;
    this.board.changeEvent.attach(this, this.resizeScrollBar);

    this.svgGroup = null;

    this.hWidth = 0;
    this.hX = 0;
    this.hRatio = 0;
    this.vWidth = 0;
    this.vY = 0;
    this.vRatio = 0;
    this._visible = true;

    this.createScrollBar();

    if (Entry.windowResized)
        Entry.windowResized.attach(this, this.resizeScrollBar);
};

Entry.Scroller.RADIUS = 7;

(function(p) {
    p.createScrollBar = function() {
        var r = Entry.Scroller.RADIUS;
        var scroller = this;

        this.svgGroup = this.board.svg.elem("g")
                            .attr({class: "boardScrollbar"});


        if (this._horizontal) {
            this.hScrollbar = this.svgGroup.elem(
                "rect",
                {
                    height: 2 * r,
                    rx: r,
                    ry: r
                }
            );
            this.hScrollbar.mousedown = function(e) {
                if (e.button === 0 || e instanceof Touch) {
                    if (Entry.documentMousedown)
                        Entry.documentMousedown.notify(e);
                    var doc = $(document);
                    doc.bind('mousemove.scroll', onMouseMove);
                    doc.bind('mouseup.scroll', onMouseUp);
                    doc.bind('touchmove.scroll', onMouseMove);
                    doc.bind('touchend.scroll', onMouseUp);
                    scroller.dragInstance = new Entry.DragInstance({
                        startX: e.pageX,
                        startY: e.pageY,
                        offsetX: e.pageX,
                        offsetY: e.pageY
                    });
                }

                function onMouseMove(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (e.originalEvent.touches) {
                        e = e.originalEvent.touches[0];
                    }
                    var dragInstance = scroller.dragInstance;
                    scroller.scroll(
                        (e.pageX - dragInstance.offsetX) / scroller.hRatio,
                        0
                    );
                    dragInstance.set({
                        offsetX: e.pageX,
                        offsetY: e.pageY
                    });
                }

                function onMouseUp(e) {
                    $(document).unbind('.scroll');
                    delete scroller.dragInstance;
                }
                e.stopPropagation();
            };
        }

        if (this._vertical) {
            this.vScrollbar = this.svgGroup.elem(
                "rect",
                {
                    width: 2 * r,
                    rx: r,
                    ry: r
                }
            );
            this.vScrollbar.mousedown = function(e) {
                if (e.button === 0 || e instanceof Touch) {
                    if (Entry.documentMousedown)
                        Entry.documentMousedown.notify(e);
                    var doc = $(document);
                    doc.bind('mousemove.scroll', onMouseMove);
                    doc.bind('mouseup.scroll', onMouseUp);
                    doc.bind('touchmove.scroll', onMouseMove);
                    doc.bind('touchend.scroll', onMouseUp);
                    scroller.dragInstance = new Entry.DragInstance({
                        startX: e.pageX,
                        startY: e.pageY,
                        offsetX: e.pageX,
                        offsetY: e.pageY
                    });
                }

                function onMouseMove(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (e.originalEvent.touches) {
                        e = e.originalEvent.touches[0];
                    }
                    var dragInstance = scroller.dragInstance;
                    scroller.scroll(
                        0,
                        (e.pageY - dragInstance.offsetY) / scroller.vRatio
                    );
                    dragInstance.set({
                        offsetX: e.pageX,
                        offsetY: e.pageY
                    });
                }

                function onMouseUp(e) {
                    $(document).unbind('.scroll');
                    delete scroller.dragInstance;
                }
                e.stopPropagation();
            };
        }

        this.resizeScrollBar();
    };

    p.resizeScrollBar = function() {
        if (!this._visible) return;

        var board = this.board,
            bRect = board.svgBlockGroup.getBoundingClientRect(),
            svgDom = board.svgDom,
            bWidth = svgDom.width(),
            bHeight = svgDom.height(),
            bBox = {
                x: bRect.left - board.offset.left,
                y: bRect.top - board.offset.top,
                width: bRect.width,
                height: bRect.height
            };

        // hScroll
        if (this._horizontal) {
            var hLimitA = - bBox.width + Entry.BOARD_PADDING,
                hLimitB = bWidth - Entry.BOARD_PADDING;

            var hWidth = (bWidth + 2 * Entry.Scroller.RADIUS) * bBox.width /
                (hLimitB - hLimitA + bBox.width);
            if (isNaN(hWidth)) hWidth = 0;
            this.hX = (bBox.x - hLimitA) / (hLimitB - hLimitA) *
                (bWidth - hWidth - 2 * Entry.Scroller.RADIUS);
            this.hScrollbar.attr({
                width: hWidth,
                x: this.hX,
                y: bHeight - 2 * Entry.Scroller.RADIUS
            });

            this.hRatio = (bWidth - hWidth - 2 * Entry.Scroller.RADIUS)/ (hLimitB - hLimitA);
        }

        // vScroll
        if (this._vertical) {
            var vLimitA = - bBox.height + Entry.BOARD_PADDING,
                vLimitB = bHeight - Entry.BOARD_PADDING;

            var vWidth = (bHeight + 2 * Entry.Scroller.RADIUS) * bBox.height /
                (vLimitB - vLimitA + bBox.height);
            this.vY = (bBox.y - vLimitA) / (vLimitB - vLimitA) *
                (bHeight - vWidth - 2 * Entry.Scroller.RADIUS);
            this.vScrollbar.attr({
                height: vWidth,
                y: this.vY,
                x: bWidth - 2 * Entry.Scroller.RADIUS
            });

            this.vRatio = (bHeight - vWidth - 2 * Entry.Scroller.RADIUS)/ (vLimitB - vLimitA);
        }
    };

    p.updateScrollBar = function(dx, dy) {
        if (this._horizontal) {
            this.hX += dx * this.hRatio;
            this.hScrollbar.attr({
                x: this.hX
            });
        }

        if (this._vertical) {
            this.vY += dy * this.vRatio;
            this.vScrollbar.attr({
                y: this.vY
            });
        }

    };

    p.scroll = function(x, y) {
        if (!this.board.code) return;
        var clientRect = this.board.svgBlockGroup.getBoundingClientRect(),
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
        this.board.generateCodeMagnetMap();
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
})(Entry.Scroller.prototype);
