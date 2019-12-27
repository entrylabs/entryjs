'use strict';

import { ContextMenu } from '@entrylabs/tool';
import DomUtils from './domUtils';

Entry.ContextMenu = {};

(function(ctx) {
    const ATTR_KEY = 'data-option-index';

    ctx.visible = false;
    ctx._hideEvent = null;

    ctx.createDom = function() {
        this.dom = Entry.Dom('div', {
            id: 'entry-contextmenu',
            parent: $('body'),
        });

        _bindEvent.call(this);
    };

    ctx.show = function(options, className, coordinate) {
        if (!options.length) {
            return;
        }

        this._options = options;

        this.createDom();

        if (this._hideEvent) {
            this._hideEvent.destroy();
        }

        if (className !== undefined) {
            this._className = className;
            this.dom.addClass(className);
        }

        this._hideEvent = Entry.documentMousedown.attach(this, this.hide);
        this.mouseCoordinate = coordinate || Entry.mouseCoordinate;
        this.contextMenu = new ContextMenu({
            type: 'contextMenu',
            data: {
                items: options,
                coordinate: this.mouseCoordinate,
                onOutsideClick: () => {
                    this.hide();
                },
            },
            container: this.dom[0],
        });

        this.visible = true;
    };

    ctx.position = function(pos) {
        const dom = this.dom;
        dom.css({
            left: 0,
            top: 0,
        });
        const width = dom.width();
        const height = dom.height();

        const win = $(window);
        const winWidth = win.width();
        const winHeight = win.height();

        if (pos.x + width > winWidth) {
            pos.x -= width + 3;
        }
        if (pos.y + height > winHeight) {
            pos.y -= height;
        }

        dom.css({
            left: pos.x,
            top: pos.y,
        });
    };

    ctx.hide = function() {
        this.visible = false;
        const dom = this.dom;
        dom.addClass('entryRemove');

        if (this._className) {
            dom.removeClass(this._className);
            delete this._className;
        }
        if (this._hideEvent) {
            this._hideEvent.destroy();
            this._hideEvent = null;
        }
        if (this.contextMenu) {
            this.contextMenu.isShow && this.contextMenu.hide();
            this.contextMenu.remove();
            this.contextMenu = null;
        }
    };

    ctx.onContextmenu = function(target, callback) {
        const longPressEvent = (e) => {
            const startEvent = Entry.Utils.convertMouseEvent(e);
            this.coordi = {
                x: startEvent.clientX,
                y: startEvent.clientY,
            };

            if (this.longTouchEvent) {
                clearTimeout(this.longTouchEvent);
                this.longTouchEvent = null;
            }

            this.longTouchEvent = setTimeout(() => {
                callback(this.coordi);
                this.longTouchEvent = undefined;
            }, 900);
        };

        DomUtils.addEventListenerMultiple(
            target,
            'touchstart touchmove touchend mousemove mouseup mousedown',
            (e) => {
                switch (e.type) {
                    case 'touchstart': {
                        longPressEvent(e);
                        break;
                    }
                    case 'mousemove':
                    case 'touchmove': {
                        const startEvent = Entry.Utils.convertMouseEvent(e);
                        if (!this.coordi) {
                            return;
                        }
                        const diff = Math.sqrt(
                            Math.pow(startEvent.pageX - this.coordi.x, 2) +
                                Math.pow(startEvent.pageY - this.coordi.y, 2)
                        );

                        if (diff > 5 && this.longTouchEvent) {
                            clearTimeout(this.longTouchEvent);
                            this.longTouchEvent = undefined;
                        }
                        break;
                    }
                    case 'mouseup':
                    case 'touchend':
                        // e.stopPropagation();
                        if (this.longTouchEvent) {
                            clearTimeout(this.longTouchEvent);
                            this.longTouchEvent = undefined;
                        }
                        break;
                    case 'mousedown':
                        if (Entry.Utils.isRightButton(e)) {
                            e.stopPropagation();

                            this.coordi = {
                                x: e.clientX,
                                y: e.clientY,
                            };

                            clearTimeout(this.longTouchEvent);
                            this.longTouchEvent = undefined;
                            callback(this.coordi);
                        }

                        if (Entry.isMobile()) {
                            longPressEvent(e);
                        }
                        break;
                }
            }
        );
    };

    function _bindEvent() {
        const that = this;
        this.dom.on('mousedown touchstart', (e) => {
            e.stopPropagation();
        });

        //event delegation
        this.dom.on('mousedown touchstart', 'li', function(e) {
            e.stopPropagation();
            const options = that._options;

            if (_.isEmpty(options)) {
                return that.hide();
            }

            const { enable, callback } = options[this.getAttribute(ATTR_KEY)];

            if (enable && callback) {
                e.preventDefault();
                that.hide();
                callback(e);
            }
        });

        Entry.Utils.disableContextmenu(this.dom);
    }
})(Entry.ContextMenu);
