/*
 *
 */
"use strict";

goog.provide("Entry.BlockView");

/*
 *
 */
Entry.BlockView = function(block, board) {
    Entry.Model(this, false);
    this.block = block;
    this.set(block);
    this.svgGroup = board.svgBlockGroup.group();

    this._schema = Entry.block[block.type];
    this._skeleton = Entry.skeleton[this._schema.skeleton];
    this._contents = [];

    this.prevObserver = null;

    // observe
    this.block.observe(this, "_bindPrev", ["prev"]);
    this._bindPrev();

    this._startRender(block);
};

(function(p) {
    p.schema = {
        id: 0,
        type: Entry.STATIC.BLOCK_RENDER_MODEL,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        magneting: false
    };

    p._startRender = function(block) {
        this.svgGroup.attr({
            class: "block"
        });

        this.svgGroup.block = this;

        this.svgGroup.attr({
            transform: "t" + this.x + " " + this.y
        });

        var path = this._skeleton.path(this);

        this._darkenPath = this.svgGroup.path(path);
        this._darkenPath.attr({
            transform: "t0 1.1",
            fill: Entry.Utils.colorDarken(this._schema.color)
        });

        this._path = this.svgGroup.path(path);
        this._path.attr({
            fill: this._schema.color
        });

        this._startContentRender();
        this._render();
        this._addControl();
    };

    p._startContentRender = function() {
        this.contentSvgGroup = this.svgGroup.group();
        var contentPos = this._skeleton.contentPos();
        this.contentSvgGroup.transform("t" + contentPos.x + ' ' + contentPos.y);

        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (typeof content === "string")
                this._contents.push(new Entry.FieldText(content, this));
            else
                this._contents.push(
                    new Entry['Field' + content.type](content, this)
                );
        }
        this._alignContent();
    };

    p._alignContent = function(animate) {
        var cursor = {x: 0, y: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y, animate);

            // space between content
            if (i !== this._contents.length - 1)
                cursor.x += 5;

            var box = c.box;
            cursor.x += box.width;
        }

        this.contentWidth = cursor.x;
    };

    p._bindPrev = function() {
        if (this.prevObserver) this.prevObserver.destroy();
        if (this.block.prev) {
            this.prevObserver = this.block.prev.view.observe(
                this, "_align", ["x", "y"]
            );
            this._align();
        } else {

        }
    };

    p._render = function() {
        this.set(this._skeleton.box());
    };

    p._align = function() {
        var prevBlockView = this.block.prev.view;
        this.set({
            x: prevBlockView.x,
            y: prevBlockView.y + prevBlockView.height + 1
        });

        this.svgGroup.attr({
            transform: "t" + this.x + " " + this.y
        });
    };

    p._moveTo = function(x, y, animate) {
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
        this.set({ x: x, y: y });
    };

    p._moveBy = function(x, y, animate) {
        return this._moveTo(
            this.x + x,
            this.y + y,
            animate
        );
    };

    p._addControl = function() {
        var that = this;
        this.svgGroup.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
    };

    p.onMouseDown = function(e) {
        if (e.button === 0 || e instanceof Touch) {
            var doc = $(document);
            doc.bind('mousemove.block', onMouseMove);
            doc.bind('mouseup.block', onMouseUp);
            doc.bind('touchmove.block', onMouseMove);
            doc.bind('touchend.block', onMouseUp);
            //this._board.dragBlock = this;
            this.dragInstance = new Entry.DragInstance({
                startX: e.clientX,
                startY: e.clientY,
                offsetX: e.clientX,
                offsetY: e.clientY,
                mode: true
            });
            //this.thread.dominate();
        } else if (e.button === 1) {
            //this.enableHighlight();
        }
        else if (e.button === 2) {
        }

        var block = this;
        function onMouseMove(e) {
            if (e.originalEvent.touches) {
                e = e.originalEvent.touches[0];
            }
            var dragInstance = block.dragInstance;
            block._moveBy(
                e.clientX - dragInstance.offsetX,
                e.clientY - dragInstance.offsetY,
                false
            );
            dragInstance.set({
                 offsetX: e.clientX,
                 offsetY: e.clientY
            });
            //block.thread.align(false);
            //block._board.updateCloseMagnet(block);
        }

        function onMouseUp(e) {
            //block.terminateDrag();
            delete block.dragInstance;

            $(document).unbind('.block');
            //block._board.dragBlock = null;
        }
    };

})(Entry.BlockView.prototype);
