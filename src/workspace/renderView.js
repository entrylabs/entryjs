"use strict";

goog.provide("Entry.RenderView");

goog.require("Entry.Dom");
goog.require("Entry.Utils");

Entry.RenderView = function(dom, align) {
    this._align = align || "CENTER";

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    this.view = dom;
    this.viewOnly = true;

    this.visible = true;
    this._svgId = 'renderView_' + new Date().getTime();
    this._generateView();

    this.offset = this.svgDom.offset();
    this.setWidth();


    this.svg = Entry.SVG(this._svgId);

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

    p.changeCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        var that = this;
        this.code = code;
        if (!this.svg) {
            this.svg = Entry.SVG(this._svgId);
            this.svgGroup = this.svg.elem("g");

            this.svgThreadGroup = this.svgGroup.elem("g");
            this.svgThreadGroup.board = this;

            this.svgBlockGroup = this.svgGroup.elem("g");
            this.svgBlockGroup.board = this;
        }

        code.createView(this);
        this.align();
    };

    p.align = function() {
        var threads = this.code.getThreads();
        if (!threads || threads.length === 0) return;
        var totalHeight = 0;
        var vPadding = 15,
            marginFromTop = 0,
            hPadding = this._align == 'LEFT' ? 20 : this.svgDom.width()/2;

        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            var block = thread.getFirstBlock();
            var blockView = block.view;

            var className = Entry.block[block.type].class;
            blockView._moveTo(
                hPadding - blockView.offsetX,
                marginFromTop - blockView.offsetY,
                false
            );
            var height = blockView.svgGroup.getBBox().height;
            marginFromTop += height + vPadding;
        }
        this.height = this.svgGroup.getBBox().height;
    };

    p.hide = function() {this.view.addClass('entryRemove');};

    p.show = function() {this.view.removeClass('entryRemove');};

    p.setWidth = function() {
        this._svgWidth = this.svgDom.width();
        this.offset = this.svgDom.offset();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
    };
})(Entry.RenderView.prototype);
