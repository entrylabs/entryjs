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
    }

    this.show = function(datum) {
        datum = {
            top: 400, left: 130, width: 64, height: 56
        };
        !this._doms && this._createDom();

        this._position(datum);

        for (var key in this._doms)
            this._doms[key].removeClass('entryRemove');
    }

    this._position = function(datum) {
        var $win = $(window);
        var winWith = $win.width();
        var winHeight = $win.height();

        //this._doms.top.css({});
    }

    this.hide = function() {
        if (!this._doms) return;

        for (var key in this._doms)
            this._doms[key].addClass('entryRemove');
    }

    this._createDom();

}.bind(Entry.Curtain))();
