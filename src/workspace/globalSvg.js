'use strict';

goog.provide('Entry.GlobalSvg');

(function(gs) {
    gs.createDom = function() {
        if (typeof window.Snap !== "function")
            return console.error("Snap library is required");

        this.svgDom = Entry.Dom(
            $('<svg id="globalSvg" width="200" height="200"' +
              'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: $('body') }
        );

        this.svgDom.css({
            position: 'fixed',
            width: 400,
            height: 400,
            left: '50%',
            top: '50%',
            display: 'none',
            'margin-left': '-200',
            'margin-top': '-200',
            'background-color': 'red',
            'z-index': '1111'
        });

        this.snap = Snap('#globalSvg');
    };

    gs.setView = function(view) {
        if (view == this._view) return;
        var data = view.block;
        if (data.isReadOnly() || !data.isMovable()) return;
        this._view = view;
        this.draw();
        this.resize();
        this.align();
    };

    gs.draw = function() {
        if (this._svg) this.remove();

        this.svg = this._view.svgGroup.clone();
        this.snap.append(this.svg);
        this.show();
    };

    gs.remove = function() {
        if (!this.svg) return;
        this.svg.remove();
        delete this.svg;
        delete this._view;
        this.hide();
    };

    gs.resize = function() {
        var bBox = this._view.svgGroup.getBBox();

        this.svgDom.css({
            width: bBox.width + 2,
            height: bBox.height
        });
    };

    gs.align = function() {
        var offsetX = this._view.getSkeleton().box(this._view).offsetX || 0;
        offsetX *= -1;
        var transform = "t" + (offsetX + 1) + " 1";
        this.svg.attr({transform: transform});
    };

    gs.show = function() {this.svgDom.css('display', 'block');};

    gs.hide = function() {this.svgDom.css('display', 'none');};

    gs.position = function() {

    };

})(Entry.GlobalSvg);
