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

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    this.setValue(this.modValue(this.getValue()));

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldAngle);


(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        CONTENT_HEIGHT = 16,
        RADIUS = 49,
        FILL_PATH = 'M 0, 0 v -49 A 49,49 0 %LARGE 1 %X,%Y z';

    p.renderStart = function(blockView) {
        var that = this;
        var contents = this._contents;

        this.svgGroup = blockView.contentSvgGroup.group();
        this.svgGroup.attr({
            class: 'entry-input-field'
        });

        this.textElement =
            this.svgGroup.text(
                X_PADDING/2, TEXT_Y_PADDING,
                that.getText()
            );

        this.textElement.attr({'font-size' : '9pt'});

        var width = this.getTextWidth();

        var y = this.position && this.position.y ? this.position.y : 0;
        y -= CONTENT_HEIGHT/2;
        this._header = this.svgGroup.rect(
                0, y,
                width,
                CONTENT_HEIGHT,
            3).attr({
                fill: "#fff",
                'fill-opacity': 0.4
                });

        this.svgGroup.append(this.textElement);

        this.svgGroup.mouseup(function(e) {
            if (that._block.view.dragMode == Entry.DRAG_MODE_MOUSEDOWN)
                that.renderOptions();
        });

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT
        });
    };

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();

        var blockView = this._block.view;
        this.documentDownEvent = Entry.documentMousedown.attach(
            this, function(){
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.applyValue();
                that.destroyOption();
            }
        );

        //html option
        this.optionGroup = Entry.Dom('input', {
            class:'entry-widget-input-field',
            parent: $('body')
        });

        this.optionGroup.val(this.value);

        this.optionGroup.on('mousedown', function(e) {
            e.stopPropagation();
        });

        this.optionGroup.on('keyup', function(e){
            var exitKeys = [13, 27];
            var keyCode = e.keyCode || e.which;
            that.applyValue(e);

            if (exitKeys.indexOf(keyCode) > -1)
                that.destroyOption();
        });

        var pos = this.getAbsolutePos();
        pos.y -= this.box.height/2;
        this.optionGroup.css({
            height: CONTENT_HEIGHT,
            left:pos.x,
            top:pos.y,
            width: that.box.width
        });

        this.optionGroup.select();

        //svg option dom
        this.svgOptionGroup = this.appendSvgOptionGroup();
        var circle = this.svgOptionGroup.circle(
            0, 0, RADIUS
        );

        circle.attr({class:'entry-field-angle-circle'});

        this._dividerGroup = this.svgOptionGroup.group();
        for (var a = 0; a < 360; a += 15) {
            this._dividerGroup.line(
                RADIUS, 0,
                RADIUS - (a % 45 === 0 ? 10 : 5), 0
            ).attr({
                transform: 'rotate(' + a + ', ' +  (0) + ', ' + (0) + ')',
                class: 'entry-angle-divider'
            });
        }
        var pos = this.getRelativePos();
        pos.x = pos.x + this.box.width/2;
        pos.y = pos.y + this.box.height/2 + RADIUS + 1;

        this.svgOptionGroup.attr({
            class: 'entry-field-angle',
            transform: "t" + pos.x + " " + pos.y
        });

        //TODO
        var absolutePos = that.getAbsolutePos();
        var zeroPos = [
            absolutePos.x + that.box.width/2,
            absolutePos.y + that.box.height/2 + 1
        ];
        this.svgOptionGroup.mousemove(function(e){
            var mousePos = [e.clientX, e.clientY];

            var angle = compute(zeroPos, mousePos);
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
            that.optionGroup.val(that.modValue(angle));
            that.applyValue();
        });
        this.updateGraph();
    };

    p.updateGraph = function() {
        if (this._fillPath) this._fillPath.remove();

        var angleRadians = Entry.toRadian(this.getValue());
        var x = Math.sin(angleRadians) * RADIUS;
        var y = Math.cos(angleRadians) * -RADIUS;
        var largeFlag = (angleRadians > Math.PI) ? 1 : 0;

        this._fillPath = this.svgOptionGroup.path(
            FILL_PATH.
                replace('%X', x).
                replace('%Y', y).
                replace('%LARGE', largeFlag)
        );
        this._fillPath.attr({class:'entry-angle-fill-area'});

        this.svgOptionGroup.append(this._dividerGroup);

        if (this._indicator) this._indicator.remove();

        this._indicator =
            this.svgOptionGroup.line(0,0, x,y);

        this._indicator.attr({class:'entry-angle-indicator'});
    };

    p.applyValue = function() {
        var value = this.optionGroup.val();
        if (isNaN(value)) return;
        value = this.modValue(value);
        this.setValue(value);
        this.updateGraph();
        this.textElement.node.textContent = this.getValue();
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
         return this.textElement.node.getComputedTextLength() + X_PADDING;
    };

    p.getText = function() {
        return this.getValue() + '\u00B0';
    };

    p.modValue = function(value) {return value % 360;};

    p.destroyOption = function() {
        if (this.documentDownEvent) {
            Entry.documentMousedown.detach(this.documentDownEvent);
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
        this.textElement.node.textContent = this.getText();
        this.resize();
    };
})(Entry.FieldAngle.prototype);

