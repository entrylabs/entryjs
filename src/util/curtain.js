'use strict';

goog.provide('Entry.Curtain');

goog.require('Entry.Dom');

(function() {
    this._visible = false;
    this._doms = null;
    this._targetDom = null;

    this._createDom = function() {
        var option = {
            parent: $('body'),
            class: 'entryCurtainElem entryRemove'
        };

        this._doms = {
            top: Entry.Dom('div', option),
            right: Entry.Dom('div', option),
            bottom: Entry.Dom('div', option),
            left: Entry.Dom('div', option)
        };

        for (var key in this._doms) {
            var dom = this._doms[key];
            dom.addClass(key);
            dom.bind("mousedown", function(e) {
                e.stopPropagation();
            });
        }
    };

    this.show = function(datum) {
        !this._doms && this._createDom();

        if (datum instanceof Array)
            datum = Entry.getDom(datum);

        datum = $(datum);
        this._targetDom = datum;

        this.align();

        for (var key in this._doms)
            this._doms[key].removeClass('entryRemove');
        this._visible = true;
    };

    this.align = function() {
        var dom = this._targetDom;
        if (!dom) return;
        var $win = $(window);
        var winWidth = $win.width();
        var winHeight = $win.height();
        var doms = this._doms;

        if (!dom.get(0))
            return;

        var rect = dom.get(0).getBoundingClientRect();

        var topPos = Math.round(rect.top);
        var rightPos = Math.round(rect.right);

        doms.top.css({
            height: topPos
        });
        doms.right.css({
            top: topPos,
            left: rightPos
        });
        doms.bottom.css({
            top: rect.bottom,
            right: winWidth - rightPos
        });
        doms.left.css({
            top: topPos,
            right: winWidth - rightPos + rect.width,
            bottom: winHeight - rect.bottom
        });
    };

    this.hide = function() {
        if (!this._doms) return;

        for (var key in this._doms)
            this._doms[key].addClass('entryRemove');
        this._visible = false;
        this._targetDom = null;
    };

    this.isVisible = function() {
        return this._visible;
    };
}.bind(Entry.Curtain))();
