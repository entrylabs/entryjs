'use strict';

Entry.Curtain = {};

(function() {
    this._visible = false;
    this._doms = null;
    this._targetDom = null;

    this.init = function(isCloseable) {
        this._createDom(isCloseable);
    };

    this._createDom = function(isCloseable) {
        const $body = $('body');
        const option = {
            parent: $body,
            class: 'entryCurtainElem entryRemove',
        };

        this._doms = {
            top: Entry.Dom('div', option),
            right: Entry.Dom('div', option),
            bottom: Entry.Dom('div', option),
            left: Entry.Dom('div', option),
        };

        if (isCloseable) {
            this._closeBtn = Entry.Dom('button', {
                parent: $body,
                class: 'entryCurtainCloseBtn entryRemove',
            });

            this._closeBtn.on(
                'click',
                function() {
                    this._closeBtn.off('click');
                    entrylms.emit('ExitStudy');
                }.bind(this)
            );
        }

        for (const key in this._doms) {
            const dom = this._doms[key];
            dom.addClass(key);
            dom.bind('mousedown', function(e) {
                e.stopPropagation();
                Entry.disposeEvent.notify(undefined, true);
            });
        }
    };

    this.show = function(datum) {
        !this._doms && this._createDom();

        if (datum instanceof Array) {
            datum = Entry.getDom(datum);
        }

        datum = $(datum);
        this._targetDom = datum;

        this.align();

        for (const key in this._doms) {
            this._doms[key].removeClass('entryRemove');
        }
        this._closeBtn && this._closeBtn.removeClass('entryRemove');
        this._visible = true;
    };

    this.align = function() {
        const dom = this._targetDom;
        if (!dom) {
            return;
        }
        const $win = $(window);
        const bodyRect = $('body')[0].getBoundingClientRect();
        let bodyWidth = bodyRect.width;
        let bodyHeight = bodyRect.height;

        const winWidth = $win.width();
        const winHeight = $win.height();

        if (winWidth < Math.round(bodyWidth)) {
            bodyWidth = winWidth;
        }

        if (winHeight < Math.round(bodyHeight)) {
            bodyHeight = winHeight;
        }

        const doms = this._doms;

        if (!dom.get(0)) {
            return;
        }

        const rect = dom.get(0).getBoundingClientRect();

        const topPos = Math.round(rect.top);
        const rightPos = Math.round(rect.right);
        const bottom = Math.round(rect.bottom);

        doms.top.css({
            height: topPos,
        });
        doms.left.css({
            top: topPos,
            right: bodyWidth - rightPos + rect.width,
            bottom: Math.round(bodyHeight - bottom),
        });
        const leftLect = doms.left[0].getBoundingClientRect();
        const bottomTop = doms.top[0].getBoundingClientRect().height + leftLect.height;
        doms.bottom.css({
            top: bottomTop || bottom,
            right: bodyWidth - rightPos,
        });
        doms.right.css({
            top: topPos,
            left: doms.bottom[0].getBoundingClientRect().width || rightPos,
        });
    };

    this.hide = function() {
        if (!this._doms) {
            return;
        }

        for (const key in this._doms) {
            this._doms[key].addClass('entryRemove');
        }
        this._closeBtn && this._closeBtn.addClass('entryRemove');
        this._visible = false;
        this._targetDom = null;
    };

    this.isVisible = function() {
        return this._visible;
    };

    this.setVisible = function(value) {
        this._visible = value;
    };
}.bind(Entry.Curtain)());
