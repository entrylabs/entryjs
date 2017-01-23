"use strict";

goog.provide("Entry.RenderView");

goog.require("Entry.Dom");
goog.require("Entry.Utils");

Entry.RenderView = function(dom, align, scale) {
    this._align = align || "CENTER";

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    this.view = dom;
    this.viewOnly = true;
    this.suffix = 'renderView';
    this._scale = scale === undefined ? 1 : scale;

    this.visible = true;
    this.disableMouseEvent = true;
    this._svgId = 'renderView_' + new Date().getTime();
    this._generateView();

    this.offset = this.svgDom.offset();
    this._minBlockOffsetX = 0;
    this._setSize();

    this.svg = Entry.SVG(this._svgId , this.svgDom[0]);
    Entry.Utils.addFilters(this.svg, this.suffix);

    if (this.svg) {
        this.svgGroup = this.svg.elem("g");

        this.svgThreadGroup = this.svgGroup.elem("g");
        this.svgThreadGroup.board = this;

        this.svgBlockGroup = this.svgGroup.elem("g");
        this.svgBlockGroup.board = this;
    }
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null
    };

    p._generateView = function() {
        var parent = this.view;
        var that = this;

        this.renderViewContainer = Entry.Dom('div', {
            'class':'renderViewContainer',
            'parent':parent
        });

        this.svgDom = Entry.Dom(
            $('<svg id="' + this._svgId +'" class="renderView" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: this.renderViewContainer }
        );
    };

    p.changeCode = function(code, resizeImmediately) {
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        var that = this;
        this.code = code;

        if (!this.svg) {
            this.svg = Entry.SVG(this._svgId , this.svgDom[0]);
            this.svgGroup = this.svg.elem("g");

            this.svgThreadGroup = this.svgGroup.elem("g");
            this.svgThreadGroup.board = this;

            this.svgBlockGroup = this.svgGroup.elem("g");
            this.svgBlockGroup.board = this;
        }

        code.createView(this);
        this.align();
        this.resize(resizeImmediately);
    };

    p.align = function() {
        var threads = this.code.getThreads();
        if (!threads || threads.length === 0) return;
        var totalHeight = 0;
        var vPadding = 15,
            marginFromTop = 0,
            hPadding = this._getHorizontalPadding();

        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            var block = thread.getFirstBlock();
            var blockView = block.view;

            var height = blockView.svgGroup.getBBox().height;
            var className = Entry.block[block.type].class;
            var xPos = 0;
            var extensions = $(blockView.svgGroup).find('.extension');
            if (extensions) {
                for (var j=0; j<extensions.length; j++) {
                    var ext = extensions[j];
                    var currentXpos = parseFloat(ext.getAttribute('x'));
                    xPos = Math.min(xPos, currentXpos);
                }
            }
            this._minBlockOffsetX = Math.min(this._minBlockOffsetX, blockView.offsetX);
            blockView._moveTo(
                hPadding - xPos - blockView.offsetX,
                marginFromTop - blockView.offsetY,
                false
            );
            marginFromTop += height + vPadding;
        }
        this._setSize();
    };

    p.hide = function() {this.view.addClass('entryRemove');};

    p.show = function() {this.view.removeClass('entryRemove');};

    p._setSize = function() {
        if (this.svgDom) {
            this._svgWidth = this.svgDom.width();
            this.offset = this.svgDom.offset();
        }
        if (this.svgGroup)
            this._bBox = this.svgGroup.getBBox();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
    };

    p.resize = function(isImmediate) {
        if (!this.svg || !this._bBox) return;

        if (isImmediate) {
            run.call(this);
        } else {
            setTimeout(function() {
                run.call(this);
            }.bind(this), 0);
        }

        function run() {
            this._setSize();
            var width = Math.round(this._bBox.width);
            var height = Math.round(this._bBox.height);
            //svg is not on the screen
            if (width === 0 || height === 0)
                return;

            $(this.svg).css({
                'width': width + this._getHorizontalPadding() - this._minBlockOffsetX,
                'height': height + 5
            });

            //double check
            setTimeout(function() {
                var bBox = this.svgGroup.getBBox();
                if (Math.round(bBox.width) !== width ||
                    Math.round(bBox.height) !== height)
                    this.resize();
            }.bind(this), 1000);
        }
    };

    p.setDomSize = function(isImmediate) {
        if (this.svgBlockGroup)
            this.svgBlockGroup.attr('transform', 'scale(1)');
        this.code.view.reDraw();
        this.align();
        this.resize(isImmediate);
        if (this._scale !== 1) {
            window.setTimeout(function() {
                this.svgBlockGroup.attr('transform', 'scale(%scale)'.replace('%scale', this._scale));
                this.align();
                this.resize();
            }.bind(this), 0);
        }


    };

    p._getHorizontalPadding = function() {
        var marginMap = {
            'LEFT': 20,
            'LEFT_MOST': 0
        };
        var ret = marginMap[this._align];

        return ret !== undefined ? ret : this.svgDom.width()/2;
    };


})(Entry.RenderView.prototype);
