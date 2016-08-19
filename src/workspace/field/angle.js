/*
 */
"use strict";

goog.provide("Entry.FieldAngle");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldAngle = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    var value = this.getValue();
    this.setValue(this.modValue(
        value !== undefined ? value : 90
    ));

    this._CONTENT_HEIGHT = this.getContentHeight();
    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldAngle);


(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        RADIUS = 49,
        FILL_PATH = 'M 0,0 v -49 A 49,49 0 %LARGE 1 %X,%Y z';

    p.renderStart = function() {
        if (this.svgGroup) $(this.svgGroup).remove();
        var blockView = this._blockView;
        var that = this;
        var contents = this._contents;

        this.svgGroup = blockView.contentSvgGroup.elem("g", {
            class: 'entry-input-field'
        });

        this.textElement =
            this.svgGroup.elem('text', {
                x:X_PADDING/2, y:TEXT_Y_PADDING,
                'font-size': '11px'
            });

        this.textElement.textContent = this.getText();

        var width = this.getTextWidth();

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        var y = this.position && this.position.y ? this.position.y : 0;
        y -= CONTENT_HEIGHT/2;
        this._header = this.svgGroup.elem('rect', {
                x: 0, y: y,
                rx: 3, ry: 3,
                width: width,
                height: CONTENT_HEIGHT, 'rx':3, 'ry': 3,
                fill: "#fff",
                'fill-opacity': 0.4
                });

        this.svgGroup.appendChild(this.textElement);

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT
        });
    };

    p.renderOptions = function() {
        var that = this;

        var blockView = this._block.view;
        var func = function() {
            that.applyValue();
            that.destroyOption();
        };

        this._attachDisposeEvent(func);

        //html option
        this.optionGroup = Entry.Dom('input', {
            class:'entry-widget-input-field',
            parent: $('body')
        });

        this.optionGroup.val(this.value);

        this.optionGroup.on('mousedown touchstart', function(e) {
            e.stopPropagation();
        });

        this.optionGroup.on('keyup', function(e){
            var exitKeys = [13, 27];
            var keyCode = e.keyCode || e.which;
            that.applyValue(e);

            if (exitKeys.indexOf(keyCode) > -1)
                that.destroyOption();
        });

        var pos = this.getAbsolutePosFromDocument();
        pos.y -= this.box.height/2;
        this.optionGroup.css({
            height: this._CONTENT_HEIGHT,
            left:pos.x,
            top:pos.y,
            width: that.box.width
        });

        //svg option dom
        this.svgOptionGroup = this.appendSvgOptionGroup();
        var circle = this.svgOptionGroup.elem('circle', {
            x:0, y:0, r:RADIUS,
            class:'entry-field-angle-circle'
        });

        $(this.svgOptionGroup).on('mousedown touchstart', function(e) {
            e.stopPropagation();
            that._updateByCoord(e);
        });

        this._dividerGroup = this.svgOptionGroup.elem('g');
        for (var a = 0; a < 360; a += 15) {
            this._dividerGroup.elem('line', {
                x1:RADIUS, y1:0,
                x2:RADIUS - (a % 45 === 0 ? 10 : 5), y2:0,
                transform: 'rotate(' + a + ', ' +  (0) + ', ' + (0) + ')',
                class: 'entry-angle-divider'
            });
        }

        var pos = this.getAbsolutePosFromBoard();
        pos.x = pos.x + this.box.width/2;
        pos.y = pos.y + this.box.height/2 + RADIUS + 1;

        this.svgOptionGroup.attr({
            class: 'entry-field-angle',
            transform: "translate(" + pos.x + "," + pos.y + ")"
        });

        $(this.svgOptionGroup).bind('mousemove touchmove',
            this._updateByCoord.bind(this));

        $(this.svgOptionGroup).bind('mouseup touchend',
            this.destroyOption.bind(this));
        this.updateGraph();
        this.optionGroup.focus();
        this.optionGroup.select();
    };

    p._updateByCoord = function(e) {
        var that = this;
        if (e.originalEvent && e.originalEvent.touches)
            e = e.originalEvent.touches[0];

        var mousePos = [e.clientX, e.clientY];
        var absolutePos = that.getAbsolutePosFromDocument();
        var zeroPos = [
            absolutePos.x + that.box.width/2,
            absolutePos.y + that.box.height/2 + 1
        ];

        that.optionGroup.val(that.modValue(
            compute(zeroPos, mousePos)));
        function compute(zeroPos, mousePos) {
            var dx = mousePos[0] - zeroPos[0];
            var dy = mousePos[1] - zeroPos[1] - RADIUS - 1;
            var angle = Math.atan(-dy / dx);
            angle = Entry.toDegrees(angle);
            angle = 90 - angle;
            if (dx < 0) angle += 180;
            else if (dy > 0) angle += 360;
            return Math.round(angle / 15) * 15;
        }
        that.applyValue();
    };

    p.updateGraph = function() {
        if (this._fillPath) this._fillPath.remove();

        var angleRadians = Entry.toRadian(this.getValue());
        var x = Math.sin(angleRadians) * RADIUS;
        var y = Math.cos(angleRadians) * -RADIUS;
        var largeFlag = (angleRadians > Math.PI) ? 1 : 0;


        this._fillPath = this.svgOptionGroup.elem('path', {
            d: FILL_PATH.
                replace('%X', x).
                replace('%Y', y).
                replace('%LARGE', largeFlag),
            class: 'entry-angle-fill-area'
        });

        this.svgOptionGroup.appendChild(this._dividerGroup);

        if (this._indicator) this._indicator.remove();

        this._indicator =
            this.svgOptionGroup.elem('line', {
                x1: 0, y1: 0, x2: x, y2: y
            });

        this._indicator.attr({class:'entry-angle-indicator'});
    };

    p.applyValue = function() {
        var value = this.optionGroup.val();
        if (isNaN(value) || value === '') return;
        value = this.modValue(value);
        this.setValue(value);
        this.updateGraph();
        this.textElement.textContent = this.getValue();
        if (this.optionGroup) this.optionGroup.val(value);
        this.resize();
    };

    p.resize = function() {
        var width = this.getTextWidth();

        this._header.attr({width: width});
        if (this.optionGroup)
            this.optionGroup.css({width: width});

        this.box.set({width: width});
        this._block.view.alignContent();
    };

    p.getTextWidth = function() {
        if (!this.textElement) return X_PADDING;
        return this.textElement.getComputedTextLength() + X_PADDING;
    };

    p.getText = function() {
        return this.getValue() + '\u00B0';
    };

    p.modValue = function(value) {return value % 360;};

    p.destroyOption = function() {
        if (this.disposeEvent) {
            Entry.disposeEvent.detach(this.disposeEvent);
            delete this.documentDownEvent;
        }

        if (this.optionGroup) {
            this.optionGroup.remove();
            delete this.optionGroup;
        }

        if (this.svgOptionGroup) {
            this.svgOptionGroup.remove();
            delete this.svgOptionGroup;
        }
        this.textElement.textContent = this.getText();
        this.command();
    };

})(Entry.FieldAngle.prototype);

