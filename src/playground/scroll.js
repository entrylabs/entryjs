/*
 *
 */
'use strict';

/*
 *
 * @param {object} board
 */
Entry.Scroller = class Scroller {
    get SCROLL_WIDTH() {
        return 8;
    }
    get RADIUS() {
        return 2.5;
    }
    get MARGIN() {
        return 40;
    }
    constructor(board, horizontal, vertical) {
        this._horizontal = horizontal === undefined ? true : horizontal;
        this._vertical = vertical === undefined ? true : vertical;

        this.board = board;
        this.canRAF = true;

        this.svgGroup = null;

        this.hWidth = 0;
        this.hX = 0;
        this.hRatio = 0;
        this.vWidth = 0;
        this.vY = 0;
        this.vRatio = 0;
        this._visible = true;
        this._opacity = -1;

        this.createScrollBar();
        this.setOpacity(0);

        this._bindEvent();

        this._scrollCommand = Entry.Utils.debounce(Entry.do, 200);
    }

    onMouseMove = (e) => {
        console.log('onMouseMove');
        e.stopPropagation();
        e.preventDefault();

        if (window.TouchEvent && e instanceof window.TouchEvent) {
            e = e.changedTouches[0];
        }
        const dragInstance = this.dragInstance;
        if (this.scrollType === 'horizontal') {
            this.scroll((-e.pageX + dragInstance.offsetX) / this.hRatio, 0);
        } else {
            this.scroll(0, (-e.pageY + dragInstance.offsetY) / this.vRatio);
        }
        dragInstance.set({
            offsetX: e.pageX,
            offsetY: e.pageY,
        });
    };

    onMouseUp = (e) => {
        console.log('onMouseUp');
        this.removeEventListener(document, ['mousemove', 'touchmove'], this.onMouseMove);
        this.removeEventListener(document, ['mouseup', 'touchend'], this.onMouseUp);
        delete this.dragInstance;
        delete this.scrollType;
    };

    onMouseDown = (e) => {
        console.log('onMouseDown', e.button, e);
        if (e.button === 0 || e instanceof window.TouchEvent) {
            console.log('go into add event');
            this.scrollType = e.target.type;
            if (Entry.documentMousedown) {
                Entry.documentMousedown.notify(e);
            }
            this.addEventListener(document, ['mousemove', 'touchmove'], this.onMouseMove, {
                passive: false,
            });
            this.addEventListener(document, ['mouseup', 'touchend'], this.onMouseUp);
            this.dragInstance = new Entry.DragInstance({
                startX: e.pageX,
                startY: e.pageY,
                offsetX: e.pageX,
                offsetY: e.pageY,
            });
        }
        e.stopPropagation();
    };

    addEventListener(dom, event = [], func, option) {
        event.forEach((e) => {
            dom.addEventListener(e, func, option);
        });
    }
    removeEventListener(dom, event = [], func) {
        event.forEach((e) => {
            dom.removeEventListener(e, func);
        });
    }

    createScrollBar() {
        const r = this.RADIUS;
        const { common = {} } = EntryStatic.colorSet || {};
        this.svgGroup = this.board.svg.elem('g').attr({ class: 'boardScrollbar' });

        if (this._horizontal) {
            this.hScrollbar = this.svgGroup.elem('rect', {
                height: this.SCROLL_WIDTH,
                rx: r,
                ry: r,
                fill: common.SCROLL_BAR || '#aac5d5',
                class: 'scrollbar horizontal',
            });
            this.hScrollbar.type = 'horizontal';
            this.addEventListener(this.hScrollbar, ['touchstart', 'mousedown'], this.onMouseDown);
        }

        if (this._vertical) {
            this.vScrollbar = this.svgGroup.elem('rect', {
                width: this.SCROLL_WIDTH,
                rx: r,
                ry: r,
                fill: common.SCROLL_BAR || '#aac5d5',
                class: 'scrollbar vertical',
            });
            this.vScrollbar.type = 'vertical';
            this.addEventListener(this.vScrollbar, ['touchstart', 'mousedown'], this.onMouseDown);
        }
    }

    updateScrollBar(dx, dy) {
        if (this._horizontal) {
            this.hX -= dx * this.hRatio;
            this.hScrollbar.attr({
                x: this.hX || 0,
            });
        }

        if (this._vertical) {
            this.vY -= dy * this.vRatio;
            this.vScrollbar.attr({
                y: this.vY,
            });
        }
    }

    scroll(x, y, skipCommand) {
        if (!this.board.code) {
            return;
        }

        const board = this.board;
        const svgRect = board.getSvgDomRect();
        const clientRect = board.svgBlockGroup.getBoundingClientRect();
        const bBox = {
            x: clientRect.left - this.board.offset().left,
            y: clientRect.top - this.board.offset().top,
            width: clientRect.width,
            height: clientRect.height,
        };

        const sWidth = svgRect.width;
        const sHeight = svgRect.height;

        if (bBox.width && bBox.height) {
            if (sWidth / 2 > bBox.width) {
                x = Math.max(-bBox.x + 1, x);
                x = Math.min(sWidth - bBox.width - bBox.x - 1, x);
            } else {
                x = Math.max(sWidth / 2 - bBox.x - bBox.width, x);
                x = Math.min(sWidth / 2 - bBox.x, x);
            }
            if (sHeight / 2 > bBox.height) {
                y = Math.max(-bBox.y + 1, y);
                y = Math.min(sHeight - bBox.height - bBox.y - 1, y);
            } else {
                y = Math.max(sHeight / 2 - bBox.y - bBox.height, y);
                y = Math.min(sHeight / 2 - bBox.y, y);
            }
        }

        this._scroll(x, y);
        if (skipCommand !== true) {
            if (!this._diffs) {
                this._diffs = [0, 0];
            }

            this._diffs[0] += x;
            this._diffs[1] += y;

            this._scrollCommand('scrollBoard', this._diffs[0], this._diffs[1], true);
        }

        this.canRAF = true;
    }

    _scroll(x, y) {
        this.board.code.moveBy(x, y);
        this.updateScrollBar(x, y);
    }

    setVisible(visible) {
        if (visible == this.isVisible()) {
            return;
        }
        this._visible = visible;
        this.svgGroup.attr({
            display: visible === true ? 'block' : 'none',
        });
    }

    isVisible() {
        return this._visible;
    }

    setOpacity(value) {
        if (this._opacity == value) {
            return;
        }
        this.hScrollbar.attr({ opacity: value });
        this.vScrollbar.attr({ opacity: value });

        this._opacity = value;
    }

    resizeScrollBar() {
        if (!this._visible) {
            return;
        }

        const board = this.board;
        const offset = board.offset();
        const svgRect = board.getSvgDomRect();
        const bRect = board.svgBlockGroup.getBoundingClientRect();
        const width = svgRect.width;
        const height = svgRect.height;
        const bBox = {
            x: bRect.left - offset.left,
            y: bRect.top - offset.top,
            width: bRect.width,
            height: bRect.height,
        };

        // hScroll
        if (this._horizontal) {
            const sWidth = svgRect.width;
            const marginSWitdh = svgRect.width - this.MARGIN;
            let limit = sWidth;
            let ratio = 0.6;
            let hWidth = 0;
            if (sWidth / 2 > bBox.width) {
                limit = sWidth - bBox.width;
                ratio = Math.min(limit / marginSWitdh, ratio);
                hWidth = marginSWitdh * ratio;
                this.hRatio = (marginSWitdh - hWidth) / limit;
                this.hX = marginSWitdh + this.MARGIN / 2 - hWidth - bBox.x * this.hRatio;
            } else {
                limit = bBox.width;
                ratio = Math.min(marginSWitdh / limit, ratio);
                hWidth = marginSWitdh * ratio;
                this.hRatio = (marginSWitdh - hWidth) / limit;
                this.hX = (sWidth / 2 - bBox.x) * this.hRatio + this.MARGIN / 2;
            }
            this.hScrollbar.attr({
                width: hWidth,
                x: this.hX,
                y: height - 2 * this.SCROLL_WIDTH,
            });
        }

        // vScroll
        if (this._vertical) {
            const sHeight = svgRect.height;
            const marginSHeight = svgRect.height - this.MARGIN;
            let limit = height;
            let ratio = 0.6;
            let vHeight = 0;
            if (sHeight / 2 > bBox.height) {
                limit = sHeight - bBox.height;
                ratio = Math.min(limit / marginSHeight, ratio);
                vHeight = marginSHeight * ratio;
                this.vRatio = (marginSHeight - vHeight) / limit;
                this.vY = marginSHeight + this.MARGIN / 2 - vHeight - bBox.y * this.vRatio;
            } else {
                limit = bBox.height;
                ratio = Math.min(marginSHeight / limit, ratio);
                vHeight = marginSHeight * ratio;
                this.vRatio = (marginSHeight - vHeight) / limit;
                this.vY = (sHeight / 2 - bBox.y) * this.vRatio + this.MARGIN / 2;
            }

            this.vScrollbar.attr({
                height: vHeight,
                y: this.vY,
                x: width - 2 * this.SCROLL_WIDTH,
            });
        }
    }

    _bindEvent() {
        const dResizeScrollBar = Entry.Utils.debounce(this.resizeScrollBar, 250);
        this.board.changeEvent.attach(this, dResizeScrollBar);
        if (Entry.windowResized) {
            Entry.windowResized.attach(this, dResizeScrollBar);
        }
    }
};
