'use strict';

goog.provide('Entry.Curtain');

goog.require('Entry.Dom');

(function() {
    this._visible = false;
    this._doms = null;

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

        for (var key in this._doms)
            this._doms[key].addClass(key);
    };

    this.show = function(datum) {
        !this._doms && this._createDom();

        if (datum instanceof Array)
            datum = Entry.getDom(datum);

        datum = $(datum);

        this._position(datum);

        for (var key in this._doms)
            this._doms[key].removeClass('entryRemove');
        this._visible = true;
    };

    this._position = function(dom) {
        var $win = $(window);
        var winWidth = $win.width();
        var winHeight = $win.height();
        var doms = this._doms;

        if (!dom.get(0))
            return;

        var rect = dom.get(0).getBoundingClientRect();

        doms.top.css({
            height: rect.top
        });
        doms.right.css({
            top: rect.top,
            left: rect.right
        });
        doms.bottom.css({
            top: rect.bottom,
            right: winWidth - rect.right
        });
        doms.left.css({
            top: rect.top,
            right: winWidth - rect.right + rect.width,
            bottom: winHeight - rect.bottom
        });
    };

    this.hide = function() {
        if (!this._doms) return;

        for (var key in this._doms)
            this._doms[key].addClass('entryRemove');
        this._visible = false;
    };

    this.isVisible = function() {
        return this._visible;
    };
}.bind(Entry.Curtain))();
