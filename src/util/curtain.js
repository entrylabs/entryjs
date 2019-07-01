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
        var $body = $('body');
        var option = {
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

        for (var key in this._doms) {
            var dom = this._doms[key];
            dom.addClass(key);
            dom.bind('mousedown', function(e) {
                e.stopPropagation();
                Entry.disposeEvent.notify(undefined, true);
            });
        }
    };

    this.show = function(datum) {
        !this._doms && this._createDom();

        if (datum instanceof Array) datum = Entry.getDom(datum);

        datum = $(datum);
        this._targetDom = datum;

        this.align();

        for (var key in this._doms) this._doms[key].removeClass('entryRemove');
        this._closeBtn && this._closeBtn.removeClass('entryRemove');
        this._visible = true;
    };

    this.align = function() {
        var dom = this._targetDom;
        if (!dom) return;
        var $win = $(window);
        var bodyRect = $('body')[0].getBoundingClientRect();
        var bodyWidth = bodyRect.width;
        var bodyHeight = bodyRect.height;

        var winWidth = $win.width();
        var winHeight = $win.height();

        if (winWidth < Math.round(bodyWidth)) bodyWidth = winWidth;

        if (winHeight < Math.round(bodyHeight)) bodyHeight = winHeight;

        var doms = this._doms;

        if (!dom.get(0)) return;

        var rect = dom.get(0).getBoundingClientRect();

        var topPos = Math.round(rect.top);
        var rightPos = Math.round(rect.right);
        var bottom = Math.round(rect.bottom);

        doms.top.css({
            height: topPos,
        });
        doms.left.css({
            top: topPos,
            right: bodyWidth - rightPos + rect.width,
            bottom: Math.round(bodyHeight - bottom),
        });
        var leftLect = doms.left[0].getBoundingClientRect();
        var bottomTop =
            doms.top[0].getBoundingClientRect().height + leftLect.height;
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
        if (!this._doms) return;

        for (var key in this._doms) this._doms[key].addClass('entryRemove');
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
