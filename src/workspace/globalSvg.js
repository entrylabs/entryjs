'use strict';

goog.provide('Entry.GlobalSvg');

(function(gs) {
    gs.createDom = function() {
        if (this.svgDom) return;
        if (typeof window.Snap !== "function")
            return console.error("Snap library is required");

        this.svgDom = Entry.Dom(
            $('<svg id="globalSvg" width="200" height="200"' +
              'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: $('body') }
        );

        this.svgDom.css({
            position: 'fixed',
            width: 0,
            height: 0,
            'background-color': 'orange',
            display: 'none',
            'z-index': '1111'
        });

        this.snap = Snap('#globalSvg');

        this.left = 0;
        this.top = 0;
    };

    gs.setView = function(view, mode) {
        if (view == this._view) {
            this.position();
            return;
        }
        var data = view.block;
        if (data.isReadOnly() || !data.isMovable()) return;
        this._view = view;
        this._mode = mode;
        this.draw();
        this.resize();
        this.align();
        this.position();
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
        delete this._offsetX;
        this.hide();
    };

    gs.resize = function() {
        var bBox = this._view.svgGroup.getBBox();

        this.svgDom.css({
            width: bBox.width + 2,
            height: bBox.height
        });
        this.width = bBox.width + 2;
    };

    gs.align = function() {
        var offsetX = this._view.getSkeleton().box(this._view).offsetX || 0;
        offsetX *= -1;
        this._offsetX = offsetX;
        var transform = "t" + (offsetX + 1) + " 0";
        this.svg.attr({transform: transform});
    };

    gs.show = function() {this.svgDom.css('display', 'block');};

    gs.hide = function() {this.svgDom.css('display', 'none');};

    gs.position = function() {
        var that = this;
        var blockView = this._view;
        var matrix = blockView.svgGroup.transform().globalMatrix;
        var offset = blockView.getBoard().svgDom.offset();
        this.left = matrix.e + offset.left - this._offsetX - 1;
        this.top = matrix.f + offset.top;

        var style = {
            left: that.left,
            top: that.top
        };

        if (this._mode == Entry.Workspace.MODE_VIMBOARD)
            style.opacity = 0.3;
        this.svgDom.css(style);
    };

})(Entry.GlobalSvg);
