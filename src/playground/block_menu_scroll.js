/*
 *
 */
'use strict';

/*
 *
 * @param {object} board
 */

class BlockMenuScroller {
    get SCROLL_WIDTH() {
        return 8;
    }
    get RADIUS() {
        return 2.5;
    }
    constructor(board) {
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
        if (Entry.windowResized) Entry.windowResized.attach(this, this._dResizeScrollBar);
    }

    createScrollBar() {
        const r = this.RADIUS;
        const width = this.SCROLL_WIDTH;
        const { common = {} } = EntryStatic.colorSet || {};

        this.svgGroup = this.board.svgGroup.elem('g', {
            class: 'boardScrollbar',
        });

        this.vScrollbar = this.svgGroup.elem('rect', {
            width,
            rx: r,
            ry: r,
            fill: common.SCROLL_BAR || '#aac5d5',
            class: 'scrollbar',
        });
    }

    resizeScrollBar() {
        this._updateRatio();

        var dom = this.board.blockMenuContainer;
        var newHeight = dom.height();
        if (newHeight !== this._domHeight) {
            this._domHeight = newHeight;
            return this.board.align();
        }
        if (!this._visible || this.vRatio === 0) return;

        if (this.vRatio === 0) return;
        var that = this;

        const width = this.SCROLL_WIDTH;
        this.vScrollbar.attr({
            width,
            height: dom.height() / that.vRatio,
            x: dom.width() - 13,
        });
    }

    updateScrollBar(dy) {
        this.vY += dy;
        this.vScrollbar.attr({ y: this.vY });
    }

    scroll(dy) {
        if (!this.isVisible()) return;
        var dest = this._adjustValue(dy);

        dy = dest - this.vY;
        if (dy === 0) return;

        this.board.code.moveBy(0, -dy * this.vRatio);
        this.updateScrollBar(dy);
    }

    scrollByPx(px) {
        if (!this.vRatio) this._updateRatio();
        this.scroll(px / this.vRatio);
    }

    //adjust value by dy for min/max value
    _adjustValue(dy) {
        var domHeight = this.board.svgDom.height();
        var limitBottom = domHeight - domHeight / this.vRatio;
        var newY = this.vY + dy;

        newY = Math.max(0, newY);
        newY = Math.min(limitBottom, newY);

        return newY;
    }

    setVisible(visible) {
        if (visible == this.isVisible()) return;
        this._visible = visible;
        this.svgGroup.attr({
            display: visible === true ? 'block' : 'none',
        });
    }

    getOpacity() {
        return this._opacity;
    }

    setOpacity(value) {
        if (this._opacity == value) return;
        this.vScrollbar.attr({
            opacity: value,
        });
        this._opacity = value;
    }

    isVisible() {
        return this._visible;
    }

    _updateRatio() {
        var board = this.board,
            bRect = board.svgBlockGroup.getBBox(),
            svgDom = board.svgDom,
            realHeight = board.blockMenuContainer.height();

        var vRatio = (bRect.height + 20) / realHeight;
        this.vRatio = vRatio;
        if (vRatio <= 1) this.setVisible(false);
        else this.setVisible(true);
    }

    _reset() {
        this.vY = 0;
        this.vScrollbar.attr({
            y: this.vY,
        });
        this._dResizeScrollBar();
    }

    onMouseDown(e) {
        var that = this;
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            if (Entry.documentMousedown) Entry.documentMousedown.notify(e);

            var mouseEvent;
            if (e.originalEvent && e.originalEvent.touches) {
                mouseEvent = e.originalEvent.touches[0];
            } else mouseEvent = e;

            var doc = $(document);
            doc.bind('mousemove.scroll', onMouseMove);
            doc.bind('mouseup.scroll', onMouseUp);
            that.dragInstance = new Entry.DragInstance({
                startY: mouseEvent.pageY,
                offsetY: mouseEvent.pageY,
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
                offsetY: mouseEvent.pageY,
            });
        }

        function onMouseUp(e) {
            $(document).unbind('.scroll');
            delete that.dragInstance;
        }
        e.stopPropagation();
    }

    _addControl() {
        var that = this;
        $(this.vScrollbar).bind('mousedown', that.mouseHandler);
    }
}
Entry.BlockMenuScroller = BlockMenuScroller;

(function(p) {})(Entry.BlockMenuScroller.prototype);
