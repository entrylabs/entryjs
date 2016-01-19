'use strict';

goog.provide('Entry.GlobalSvg');

(function(gs) {
    gs.DONE = 0;
    gs.REMOVE = 1;
    gs.RETURN = 2;

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
            display: 'none',
            'z-index': '1111'
        });

        this.snap = Snap('#globalSvg');

        this.width = 0;
        this.left = 0;
        this.top = 0;
    };

    gs.setView = function(view, mode) {
        if (view == this._view) {
            this.position();
            return;
        }
        var data = view.block;
        if (data.isReadOnly() || !view.movable) return;
        this._view = view;
        this._mode = mode;
        this.draw();
        this.resize();
        this.align();
        this.position();
    };

    gs.draw = function() {
        var that = this;
        var blockView = this._view;
        if (this._svg) this.remove();
        var isVimMode = this._mode == Entry.Workspace.MODE_VIMBOARD;

        this.svg = blockView.svgGroup.clone();
        if (isVimMode) {
            var svg = this.svg;
            svg.selectAll('path').animate({
                opacity: 0
            }, 500, mina.easeinout);

            svg.selectAll('text').animate({
                fill: '#000000'
            }, 530, mina.easeinout);
        }
        this.snap.append(this.svg);
        this.show();
        blockView.set({visible:false});
    };

    gs.remove = function() {
        if (!this.svg) return;
        this.svg.remove();
        delete this.svg;
        delete this._view;
        delete this._offsetX;
        delete this._offsetY;
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
        var offsetY = this._view.getSkeleton().box(this._view).offsetY || 1;
        offsetX *= -1;
        offsetY *= -1;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        var transform = "t" + (offsetX + 1) + " " + offsetY;
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
        this.top = matrix.f + offset.top - this._offsetY;

        this.svgDom.css({
            left: that.left,
            top: that.top
        });
    };

    gs.terminateDrag = function(blockView) {
        var mousePos = Entry.mouseCoordinate;
        var blockMenu = blockView.getBoard().workspace.blockMenu;
        var bLeft = blockMenu.offset.left;
        var bTop = blockMenu.offset.top;
        var bWidth = blockMenu.visible ? blockMenu.svgDom.width() : 0;
        if (mousePos.y > bTop && mousePos.x > bLeft + bWidth)
            return this.DONE;
        else if (mousePos.y > bTop && mousePos.x > bLeft && blockMenu.visible)
            return this.REMOVE;
        else return this.RETURN;
    };

})(Entry.GlobalSvg);
