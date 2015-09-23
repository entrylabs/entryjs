/*
 *
 */
"use strict";

goog.provide("Entry.Block");

goog.require("Entry.BlockModel");
goog.require("Entry.BoxModel");
goog.require("Entry.skeleton");


/*
 *
 */
Entry.Block = function(block, thread) {
    this.thread = thread;

    // block information
    this._schema = Entry.block[block.blockType];
    this._skeleton = Entry.skeleton[this._schema.skeleton];

    // Block model
    this._model = new Entry.BlockModel(block);
    this.box = new Entry.BoxModel();
    this.contentBox = new Entry.BoxModel();
    this.contentBox.observe(this, "render", ['width', 'height']);

    // content objects
    this._contents = [];
    this.magnets = {};

    // SVG Element
    this.svgGroup = null;
    this.fieldSvgGroup = null;
    this._path = null;
};

(function(p) {
    p.renderStart = function() {
        this.svgGroup = this.thread.svgGroup.group();
        this.svgGroup.attr({
            class: "block"
        });

        this._path = this.svgGroup.path(this._skeleton.path(this));
        this._path.attr({
            fill: this._schema.color
        });

        this.magnets = this._skeleton.magnets();
        this.fieldRenderStart();

        this.addControl();
    };

    /*
     *
     * @param {} animate
     */
    p.moveTo = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var transform = "t" + x + " " + y;
        if (animate) {
            this.svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        } else {
            this.svgGroup.attr({
                transform: transform
            });
        }
        this.box.set({ x: x, y: y });
    };

    p.moveBy = function(x, y, animate) {
        return this.moveTo(
            this.box.x + x,
            this.box.y + y,
            animate
        );
    };

    p.fieldRenderStart = function() {
        this.fieldSvgGroup = this.svgGroup.group();
        var contentPos = this._skeleton.contentPos();
        this.fieldSvgGroup.transform("t" + contentPos.x + ' ' + contentPos.y);

        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (typeof content === "string")
                this._contents.push(new Entry.FieldText(content, this));
        }
        this.alignContent();
    };

    p.alignContent = function() {
        var cursor = {x: 0, y: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y);

            // space between content
            if (i !== this._contents.length - 1)
                cursor.x += 5;

            var box = c.box;
            cursor.x += box.width;
        }

        this.contentBox.width = cursor.x;
    };

    p.render = function() {
        var path = this._skeleton.path(this);
        this._path.animate({
            d: path
        }, 200);
    };

    p.highlight = function() {
        var pathLen = this._path.getTotalLength();
        var path = this._path;
        this._path.attr({
            stroke: "#f00",
            strokeWidth: 2,
            "stroke-linecap": "round",
            "stroke-dasharray": pathLen + " " + pathLen,
            "stroke-dashoffset": pathLen
        });
        setInterval(function() {
            path.attr({"stroke-dashoffset": pathLen})
            .animate({"stroke-dashoffset": 0}, 600);
        }, 1800, mina.easeout);
        setTimeout(function() {
            setInterval(function() {
                path.animate({"stroke-dashoffset": - pathLen}, 600);
            }, 1800, mina.easeout);
        }, 1200);
    };

    p.addControl = function() {
        var that = this;
        this.svgGroup.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
    };

    // this function is call by itself
    p.onMouseDown = function(e) {
        switch(e.button) {
            case 0: // left button
                $(document).bind('mousemove.block', this.onMouseMove);
                $(document).bind('mouseup.block', this.onMouseUp);
                Entry.Playground.dragBlock = this;
                this.dragMode = true;
                this._offset = { x: e.clientX, y: e.clientY };
            break;
            case 1: // middle button
                break;
            case 2: // left button
                break;

        }
    };

    p.onMouseMove = function(e) {
        var block = Entry.Playground.dragBlock;
        block.moveBy(
            e.clientX - block._offset.x,
            e.clientY - block._offset.y,
            false
        );
        block._offset = { x: e.clientX, y: e.clientY };
        block.thread.align(false);
    };

    p.onMouseUp = function(e) {
        var block = Entry.Playground.dragBlock;
        block.dragMode = null;
        $(document).unbind('.block');
    };


})(Entry.Block.prototype);
