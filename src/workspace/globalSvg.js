'use strict';

goog.provide('Entry.GlobalSvg');

(function(gs) {
    gs.DONE = 0;
    gs.REMOVE = 1;
    gs.RETURN = 2;

    gs.createDom = function() {
        if (this.svgDom) return;

        this.svgDom = Entry.Dom(
            $('<svg id="globalSvg" width="200" height="200"' +
              'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: $('body') }
        );

        this.svgDom.css({
            position: 'fixed',
            width: 1,
            height: 1,
            display: 'none',
            overflow: 'visible',
            'z-index': '1111',
            'opacity': 0.8
        });

        this.svg = Entry.SVG('globalSvg');

        this.width = 0;
        this.left = 0;
        this.top = 0;
    };

    gs.setView = function(view, mode) {
        if (view == this._view) return;
        var data = view.block;
        if (data.isReadOnly() || !view.movable) return;
        this._view = view;
        this._mode = mode;
        this.draw();
        this.align();
        this.position();
        return true;
    };

    gs.draw = function() {
        var that = this;
        var blockView = this._view;
        if (this._svg) this.remove();
        var isVimMode = this._mode == Entry.Workspace.MODE_VIMBOARD;

        this.svgGroup = Entry.SVG.createElement(
            blockView.svgGroup.cloneNode(true),
            {'opacity':1}
        );

        //TODO selectAll function replace
        this.svg.appendChild(this.svgGroup);
        this.show();
        if (isVimMode) {
            var svg = $(this.svgGroup);
            svg.find('g').css({filter: 'none'});
            svg.find('path').velocity({
                opacity: 0
            }, {
                duration: 500
            });

            svg.find('text').velocity({
                fill: '#000000'
            }, {
                duration: 530
            });
        }
    };

    gs.remove = function() {
        if (!this.svgGroup) return;
        this.svgGroup.remove();
        delete this.svgGroup;
        delete this._view;
        delete this._offsetX;
        delete this._offsetY;
        delete this._startX;
        delete this._startY;
        this.hide();
    };

    gs.align = function() {
        var offsetX = this._view.getSkeleton().box(this._view).offsetX || 0;
        var offsetY = this._view.getSkeleton().box(this._view).offsetY || 0;
        offsetX *= -1;
        offsetX += 1;
        offsetY *= -1;
        offsetY += 1;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        var transform = "translate(" + offsetX + "," + offsetY + ')';
        this.svgGroup.attr({transform: transform});
    };

    gs.show = function() {this.svgDom.css('display', 'block');};

    gs.hide = function() {this.svgDom.css('display', 'none');};

    gs.position = function() {
        var that = this;
        var blockView = this._view;
        var pos = blockView.getAbsoluteCoordinate();
        var offset = blockView.getBoard().offset;
        this.left = pos.x + offset.left - this._offsetX;
        this.top = pos.y + offset.top - this._offsetY;

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

    gs.addControl = function(e) {
        this.onMouseDown.apply(this, arguments);
    };


    gs.onMouseDown = function(e) {
        this._startY = e.pageY;
        var that = this;
        e.stopPropagation();
        e.preventDefault();
        var doc = $(document);
        doc.bind('mousemove.block', onMouseMove);
        doc.bind('mouseup.block', onMouseUp);
        doc.bind('touchmove.block', onMouseMove);
        doc.bind('touchend.block', onMouseUp);
        this._startX = e.pageX;
        this._startY = e.pageY;

        function onMouseMove(e) {
            var newX = e.pageX;
            var newY = e.pageY;
            var dX = newX - that._startX;
            var dY = newY - that._startY;
            var newLeft = that.left + dX;
            var newTop = that.top + dY;
            that.svgDom.css({
                left : newLeft,
                top :  newTop,
            });
            that._startX = newX;
            that._startY = newY;
            that.left = newLeft;
            that.top = newTop;
        }

        function onMouseUp(e) {
            $(document).unbind('.block');
        }
    };

})(Entry.GlobalSvg);
