import { debounce } from 'lodash';

Entry.Tooltip = function(data, opts) {
    this.init(data, opts);
};

(function(p) {
    p.usedClasses = 'up down left right edge_up edge_down edge_left edge_right';

    p.init = function(data, opts) {
        if (this._rendered) {
            this.dispose();
        }

        this.data = Array.isArray(data) ? data : [data];
        this.opts = opts ||
            this.opts || {
                dimmed: true,
                restirct: false,
            };
        this._rendered = false;
        this._noDispose = !!this.opts.noDispose;
        this._faded = false;
        this._tooltips = [];
        this._indicators = [];

        if (data.length > 1 || opts.indicator) {
            this.isIndicator = true;
        }

        if (opts.render !== false) {
            this.render();
        }

        this._resizeEventFunc = debounce(this.alignTooltips.bind(this, 200));

        Entry.addEventListener('windowResized', this._resizeEventFunc);
    };

    p.render = function() {
        if (this._rendered) {
            return;
        }
        this.fadeIn();

        this._convertDoms();

        if (this.opts.dimmed) {
            this.renderBG();
        }

        const datum = this.data[0].targetDom;
        if (datum && typeof datum !== 'string' && datum.length) {
            this.opts.restrict && this.opts.dimmed && Entry.Curtain.show(datum.get(0));
            this.renderTooltips();
            this._rendered = true;
            if (this.opts.restrict) {
                this.restrictAction();
            }
        }
    };

    p._convertDoms = function() {
        this.data.map((d) => {
            let findedDom = d.target;
            if (d.target instanceof Array) {
                findedDom = Entry.getDom(d.target);
            }
            const targetDom = $(findedDom);
            if (targetDom.length) {
                d.targetDom = targetDom;
            }
        });
    };

    p.renderBG = function() {
        if (this.opts.restrict) {
            this._bg = Entry.Dom('div', {
                classes: [],
                parent: $(document.body),
            });
        } else {
            this._bg = Entry.Dom('div', {
                classes: ['entryDimmed', 'entryTooltipBG'],
                parent: $(document.body),
            });

            this._bg.bindOnClick(this.dispose.bind(this));
        }
    };

    p.renderTooltips = function() {
        this.data.forEach(this._renderTooltip.bind(this));
    };

    p.alignTooltips = function() {
        if (!this._rendered) {
            return;
        }

        this.data.map(this._alignTooltip.bind(this));
        this.opts.dimmed && Entry.Curtain.align();
    };

    p._renderTooltip = function(data) {
        if (!data.content) {
            return;
        }
        const tooltipWrapper = Entry.Dom('div', {
            classes: ['entryTooltipWrapper'],
            parent: $(document.body),
        });
        const tooltipDom = Entry.Dom('div', {
            classes: ['entryTooltip', data.direction, data.style],
            parent: tooltipWrapper,
        });

        if (this.isIndicator) {
            data.indicator = this.renderIndicator();
        }

        tooltipDom.bind('mousedown', (e) => {
            e.stopPropagation();
            setTimeout(() => Entry.disposeEvent.notify(undefined, true), 150);
        });
        tooltipDom.bind('mouseup', (e) => {
            e.stopPropagation();
        });

        tooltipDom.html(data.content);
        this._tooltips.push(tooltipWrapper);
        data.wrapper = tooltipWrapper;
        data.dom = tooltipDom;
        this._alignTooltip(data);
    };

    p._alignTooltip = function(data) {
        let rect;
        if (data.targetDom instanceof $) {
            rect = data.targetDom.get(0).getBoundingClientRect();
        } else {
            rect = data.targetDom.getBoundingClientRect();
        }
        const tooltipRect = data.dom[0].getBoundingClientRect();

        const { clientWidth, clientHeight } = document.body;

        if (this.isIndicator) {
            data.indicator.css({
                left: rect.left + rect.width / 2,
                top: rect.top + rect.height / 2,
            });
        }

        if (tooltipRect.width > 450) {
            data.dom.addClass('shrink');
        } else {
            data.dom.removeClass('shrink');
        }

        let direction = data.direction;

        if (!direction) {
            let margin = rect.left - tooltipRect.width;
            let newMargin = clientWidth - rect.left - rect.width - tooltipRect.width;
            direction = 'left';
            if (margin < newMargin) {
                margin = newMargin;
                direction = 'right';
            }
            newMargin = rect.top - tooltipRect.height;
            if (margin < newMargin) {
                margin = newMargin;
                direction = 'up';
            }
            newMargin = clientHeight - rect.top - rect.height - tooltipRect.height;
            if (margin < newMargin) {
                margin = newMargin;
                direction = 'down';
            }
        }
        data.dom.removeClass(this.usedClasses).addClass(direction);

        const pos = { top: rect.top, left: rect.left };
        let edgeStyle;
        switch (direction) {
            case 'down':
                pos.top += rect.height;
            case 'up':
                pos.left += rect.width / 2;
                if (pos.left < tooltipRect.width / 2) {
                    edgeStyle = 'edge_left';
                }
                if (clientWidth - pos.left < tooltipRect.width / 2) {
                    edgeStyle = 'edge_right';
                }
                break;
            case 'right':
                pos.left += rect.width;
            case 'left':
                pos.top += rect.height / 2;
                if (pos.top < tooltipRect.height / 2) {
                    edgeStyle = 'edge_up';
                }
                if (clientHeight - pos.top < tooltipRect.height / 2) {
                    edgeStyle = 'edge_down';
                }
                break;
            default:
                break;
        }
        if (edgeStyle) {
            data.dom.addClass(edgeStyle);
        }

        data.wrapper.css(pos);
    };

    p.renderIndicator = function(left, top) {
        const indicator = Entry.Dom('div', {
            classes: ['entryTooltipIndicator'],
            parent: $(document.body),
        });
        indicator.html('<div></div><div></div><div></div>');
        this._indicators.push(indicator);
        return indicator;
    };

    p.dispose = function(e) {
        // click event object when call from restrict
        if (this._bg) {
            this._bg.remove();
        }
        if (this.opts.restrict) {
            Entry.Utils.allowAction();
            this.opts.dimmed && Entry.Curtain.hide();
        }
        while (this._tooltips.length) {
            this._tooltips.pop().remove();
        }
        while (this._indicators.length) {
            this._indicators.pop().remove();
        }
        if (this.opts.callBack) {
            this.opts.callBack.call(this, e);
        }
        Entry.removeEventListener('windowResized', this._resizeEventFunc);
    };

    p.restrictAction = function() {
        const doms = this.data.map((d) => d.targetDom);
        if (this._noDispose && this.opts.callBack) {
            this.opts.callBack.call(this);
        }
        Entry.Utils.restrictAction(doms, this.dispose.bind(this), this._noDispose);
    };

    p.fadeOut = function() {
        $(document.body).addClass('hideTooltip');
        this._faded = true;
    };

    p.fadeIn = function() {
        $(document.body).removeClass('hideTooltip');
        this._faded = false;
    };

    p.isFaded = function() {
        return this._faded;
    };
})(Entry.Tooltip.prototype);
