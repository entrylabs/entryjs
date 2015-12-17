/*
 */
"use strict";

goog.provide("Entry.FieldAngle");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldAngle = function(content, blockView) {
    this._block = blockView.block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this.key = content.key;
    this.value = this.modValue(this._block.values[this.key]  || 0);

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldAngle);

Entry.FieldAngle.RADIUS = 49;
Entry.FieldAngle.FILL_PATH = 'M 0, 0 v -49 A 49,49 0 %LARGE 1 %X,%Y z';

(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        CONTENT_HEIGHT = 16;

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
        var RADIUS = Entry.FieldAngle.RADIUS;
        this.svgOptionGroup = this.appendSvgOptionGroup();
        var circle = this.svgOptionGroup.circle(
            0, 0, RADIUS
        );

        circle.attr({class:'entry-field-angle-circle'});

        //TODO
        this.svgOptionGroup.mousemove(function(e){
            var mousePos = [e.clientX, e.clientY];

            var absolutePos = that.getAbsolutePos();
            var zeroPos = [
                absolutePos.x + that.box.width/2,
                absolutePos.y + that.box.height/2
            ];
            var centerPos = [
                absolutePos.x + that.box.width/2,
                zeroPos[1] + RADIUS
            ];
            var angle = compute(mousePos, centerPos, zeroPos);
            function compute(p0, p1, p2) {
                if (Math.floor(p0[0]) == Math.floor(p1[0])) return 180;
                var a = Math.pow(p1[0]-p0[0],2) + Math.pow(p1[1]-p0[1],2),
                    b = Math.pow(p1[0]-p2[0],2) + Math.pow(p1[1]-p2[1],2),
                    c = Math.pow(p2[0]-p0[0],2) + Math.pow(p2[1]-p0[1],2);
                return Entry.toDegrees(Math.acos( (a+b-c) / Math.sqrt(4*a*b)));
            }

            angle = Math.round(angle / 15) * 15;
            if (mousePos[0] < centerPos[0]) angle = 360 - angle;

            that.value = angle;
            that.applyValue();
        });

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
        pos.y = pos.y + this.box.height/2 + Entry.FieldAngle.RADIUS + 1;

        this.svgOptionGroup.attr({
            class: 'entry-field-angle',
            transform: "t" + pos.x + " " + pos.y
        });
    };

    p.updateGraph = function() {
        if (this._fillPath) this._fillPath.remove();

        var RADIUS = Entry.FieldAngle.RADIUS;
        console.log(this.value);
        var angleRadians = Entry.toRadian(this.value);
        var x = Math.sin(angleRadians) * RADIUS;
        var y = Math.cos(angleRadians) * -RADIUS;
        var largeFlag = (angleRadians > Math.PI) ? 1 : 0;

        this._fillPath = this.svgOptionGroup.path(
            Entry.FieldAngle.FILL_PATH.
                replace('%X', x).
                replace('%Y', y).
                replace('%LARGE', largeFlag)
        );
        this._fillPath.attr({class:'entry-angle-fill-area'});

        this.svgOptionGroup.append(this._dividerGroup);

        if (this._indicator) this._indicator.remove();

        this._indicator = this.svgOptionGroup.line(
            0,0, x,y
        );

        this._indicator.attr({class:'entry-angle-indicator'});


    };

    p.applyValue = function(event) {
        var value = this.optionGroup.val();
        if (isNaN(value)) return;
        value = this.modValue(value);
        this._block.values[this.key] = value;
        this.value = value;
        this.textElement.node.textContent = this.getText();
        this.updateGraph();
        this.resize();
    };

    p.resize = function() {
        var width = this.getTextWidth();

        this._header.attr({width: width});
        this.optionGroup.css({width: width});

        this.box.set({width: width});
        this._block.view.alignContent();
    };

    p.getTextWidth = function() {
         return this.textElement.node.getComputedTextLength() + X_PADDING;
    };

    p.getText = function() {
        return this.value + '\u00B0';
    };

    p.modValue = function(value) {
        return value % 360;
    };

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
    };


})(Entry.FieldAngle.prototype);

