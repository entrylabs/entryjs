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
    var that = this;
    this.board = board;
    this.board.changeEvent.attach(this, this._reset);

    this.svgGroup = null;

    this.hX = 0;
    this.vWidth = 0;
    this.vY = 0;
    this.vRatio = 0;
    this._visible = true;
    this._opacity = -1;

    this.mouseHandler = function() {
        that.onMouseDown.apply(that, arguments);
    };

    this.createScrollBar();
    this.setOpacity(0);
    this._addControl();

    this._domHeight = 0;
    this._dResizeScrollBar = Entry.Utils.debounce(this.resizeScrollBar, 50);
    if (Entry.windowResized)
        Entry.windowResized.attach(this, this._dResizeScrollBar);
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
    };

    p.resizeScrollBar = function() {
        this._updateRatio();

        var dom = this.board.blockMenuContainer;
        var newHeight = dom.height();
        if (newHeight !== this._domHeight) {
            this._domHeight = newHeight;
            return this.board.align();
        }
        if (!this._visible || this.vRatio === 0) return;
        var that = this;

        this.vScrollbar.attr({
            width: 9,
            height: dom.height() / that.vRatio,
            x: dom.width() - 9
        });
    };

    p.updateScrollBar = function(dy) {
        this.vY += dy;
        this.vScrollbar.attr({y: this.vY});
    };

    p.scroll = function(dy) {
        if (!this.isVisible()) return;
        var dest = this._adjustValue(dy);

        dy = dest - this.vY;
        if (dy === 0) return;

        this.board.code.moveBy(0, -dy * this.vRatio);
        this.updateScrollBar(dy);
    };

    //adjust value by dy for min/max value
    p._adjustValue = function(dy) {
        var domHeight = this.board.svgDom.height();
        var limitBottom = domHeight - domHeight/this.vRatio;
        var newY = this.vY + dy;

        newY = Math.max(0, newY);
        newY = Math.min(limitBottom, newY);

        return newY;
    };

    p.setVisible = function(visible) {
        if (visible == this.isVisible()) return;
        this._visible = visible;
        this.svgGroup.attr({
            display: visible === true ? 'block' : 'none'
        });
    };

    p.setOpacity = function(value) {
        if (this._opacity == value) return;
        this.vScrollbar.attr({
            opacity: value
        });
        this._opacity = value;
    };

    p.isVisible = function() {return this._visible;};

    p._updateRatio = function() {
        var board = this.board,
            bRect = board.svgBlockGroup.getBBox(),
            svgDom = board.svgDom,
            realHeight = board.blockMenuContainer.height();

        var vRatio = (bRect.height + 20)/realHeight;
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


    p.onMouseDown = function(e) {
        var that = this;
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            if (Entry.documentMousedown)
                Entry.documentMousedown.notify(e);

            var mouseEvent;
            if (e.originalEvent && e.originalEvent.touches) {
                mouseEvent = e.originalEvent.touches[0];
            } else mouseEvent = e;


            var doc = $(document);
            doc.bind('mousemove.scroll', onMouseMove);
            doc.bind('mouseup.scroll', onMouseUp);
            doc.bind('touchmove.scroll', onMouseMove);
            doc.bind('touchend.scroll', onMouseUp);
            that.dragInstance = new Entry.DragInstance({
                startY: mouseEvent.pageY,
                offsetY: mouseEvent.pageY
            });
        }

        function onMouseMove(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            var mouseEvent;
            if (e.originalEvent && e.originalEvent.touches) {
                mouseEvent = e.originalEvent.touches[0];
            } else mouseEvent = e;

            var dragInstance = that.dragInstance;
            that.scroll(mouseEvent.pageY - dragInstance.offsetY);

            dragInstance.set({
                offsetY: mouseEvent.pageY
            });
        }

        function onMouseUp(e) {
            $(document).unbind('.scroll');
            delete that.dragInstance;
        }
        e.stopPropagation();
    };

    p._addControl = function() {
        var that = this;
        $(this.vScrollbar).bind(
            'mousedown touchstart',
            that.mouseHandler
        );
    };



})(Entry.BlockMenuScroller.prototype);
