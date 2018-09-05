/*
 */
'use strict';

require('./field');

/*
 *
 */
Entry.FieldAngle = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;

    this.box = new Entry.BoxModel();

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    var value = this.getValue();
    this.setValue(this.modValue(value !== undefined ? value : 90));

    this._CONTENT_HEIGHT = this.getContentHeight();
    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldAngle);

(function(p) {
    var X_PADDING = 8,
        TEXT_Y_PADDING = 4,
        RADIUS = 47.5,
        FILL_PATH = 'M 0,0 v -47.5 A 47.5,47.5 0 %LARGE 1 %X,%Y z';

    p.renderStart = function(board, mode) {
        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }

        this.svgGroup = this._blockView.contentSvgGroup.elem('g', {
            class: 'entry-input-field',
        });

        this.textElement = this.svgGroup.elem('text', {
            x: X_PADDING / 2,
            y: TEXT_Y_PADDING,
            'font-size': '11px',
            'font-family': 'NanumGothic',
        });

        this._setTextValue();

        var width = this.getTextWidth();
        var CONTENT_HEIGHT = this._CONTENT_HEIGHT;

        this._header = this.svgGroup.elem('rect', {
            x: 0,
            y: (_.result(this.position, 'y') || 0) - CONTENT_HEIGHT / 2,
            rx: 3,
            ry: 3,
            width: width,
            height: CONTENT_HEIGHT,
            fill: '#fff',
            'fill-opacity': 0.4,
        });

        this.svgGroup.appendChild(this.textElement);

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width: width,
            height: CONTENT_HEIGHT,
        });
    };

    p.renderOptions = function() {
        this._attachDisposeEvent((skipCommand, forceCommand) => {
            skipCommand !== true && this.applyValue();
            this.destroyOption(skipCommand, forceCommand === true);
        });

        //html option
        this.optionGroup = Entry.Dom('input', {
            class: 'entry-widget-input-field',
            parent: $('body'),
        });

        this.optionGroup.val(this.value);

        this.optionGroup.on('mousedown touchstart', (e) => e.stopPropagation());

        this.optionGroup.on('keyup', (e) => {
            this.applyValue(e);

            if (_.includes([13, 27], e.keyCode || e.which))
                this.destroyOption(undefined, true);
        });

        var pos = this.getAbsolutePosFromDocument();
        pos.y -= this.box.height / 2;
        this.optionGroup.css({
            height: this._CONTENT_HEIGHT,
            left: pos.x,
            top: pos.y,
            width: this.box.width,
        });

        //svg option dom
        this.angleOptionGroup = this.appendSvgOptionGroup();
        var circle = this.angleOptionGroup.elem('circle', {
            x: 0,
            y: 0,
            r: RADIUS + 2.5,
            class: 'entry-field-angle-circle',
        });

        var dividerGroup = this.angleOptionGroup.elem('g');

        _.range(0, 360, 15).forEach((a) => {
            dividerGroup.elem('line', {
                x1: RADIUS,
                y1: 0,
                x2: RADIUS - (a % 45 === 0 ? 8.3 : 6),
                y2: 0,
                transform: 'rotate(' + a + ', ' + 0 + ', ' + 0 + ')',
                class: 'entry-angle-divider',
            });
        });

        var pos = this.getAbsolutePosFromBoard();
        pos.x = pos.x + this.box.width / 2;
        pos.y = pos.y + this.box.height / 2 + RADIUS + 5;

        this.angleOptionGroup.attr({
            class: 'entry-field-angle',
            transform: 'translate(' + pos.x + ',' + pos.y + ')',
        });

        var $angleOptionGroup = $(this.angleOptionGroup);

        $angleOptionGroup.bind('mousedown touchstart', (e) => {
            e.stopPropagation();
            $angleOptionGroup.bind(
                'mousemove.fieldAngle touchmove.fieldAngle',
                (e) => this._updateByCoord(e)
            );
            $angleOptionGroup.bind('mouseup touchend', () =>
                $angleOptionGroup.unbind('.fieldAngle')
            );
        });

        this._fillPath = this.angleOptionGroup.elem('path', {
            d: FILL_PATH.replace('%X', 0)
                .replace('%Y', 0)
                .replace('%LARGE', 1),
            class: 'entry-angle-fill-area',
        });

        this.angleOptionGroup.elem('circle', {
            cx: 0,
            cy: 0,
            r: '1.5px',
            fill: '#333333',
        });

        this._indicator = this.angleOptionGroup.elem('line', {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            class: 'entry-angle-indicator',
        });

        this._indicatorCap = this.angleOptionGroup.elem('circle', {
            cx: 0,
            cy: 0,
            r: '6px',
            fill: '#397dc6',
        });

        this.updateGraph();
        this.optionGroup.focus();
        this.optionGroup.select();
        this.optionDomCreated();
    };

    p._updateByCoord = function(e) {
        if (e.originalEvent && e.originalEvent.touches)
            e = e.originalEvent.touches[0];

        var mousePos = [e.clientX, e.clientY];
        var absolutePos = this.getAbsolutePosFromDocument();
        var zeroPos = [
            absolutePos.x + this.box.width / 2,
            absolutePos.y + this.box.height / 2 + 1,
        ];

        this.optionGroup.val(this.modValue(compute(zeroPos, mousePos)));
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
        this.applyValue();
    };

    p.updateGraph = function() {
        var angleRadians = Entry.toRadian(this.getValue());
        var sinVal = Math.sin(angleRadians);
        var cosVal = Math.cos(angleRadians);
        var x = sinVal * RADIUS;
        var y = cosVal * -RADIUS;
        var largeFlag = angleRadians > Math.PI ? 1 : 0;

        this._fillPath.attr({
            d: FILL_PATH.replace('%X', x)
                .replace('%Y', y)
                .replace('%LARGE', largeFlag),
        });

        this._indicator.attr({ x1: 0, y1: 0, x2: x, y2: y });

        x = sinVal * (RADIUS - 6);
        y = cosVal * -(RADIUS - 6);
        this._indicatorCap.attr({ cx: x, cy: y });
    };

    p.applyValue = function() {
        var value = this.optionGroup.val();
        if (!Entry.Utils.isNumber(value) || value === '') return;
        value = this.modValue(value);
        this.setValue(value);
        this.updateGraph();
        this.textElement.textContent = this.getValue();
        if (this.optionGroup) this.optionGroup.val(value);
        this.resize();
    };

    p.resize = function() {
        var obj = { width: this.getTextWidth() };

        this._header.attr(obj);
        if (this.optionGroup) {
            this.optionGroup.css(obj);
        }

        this.box.set(obj);
        this._blockView.dAlignContent();
    };

    p.getTextWidth = function() {
        if (!this.textElement) return X_PADDING;
        return this.getTextBBox().width + X_PADDING;
    };

    p.getText = function() {
        var value = this.getValue();
        var reg = /&value/gm;
        if (reg.test(value)) return value.replace(reg, '');
        return value + '\u00B0';
    };

    p.modValue = function(value) {
        var reg = /&value/gm;
        if (reg.test(value)) return value;
        return value % 360;
    };

    p.destroyOption = function(skipCommand, forceCommand) {
        var _destroyFunc = _.partial(_.result, _, 'destroy');
        var _removeFunc = _.partial(_.result, _, 'remove');

        _destroyFunc(this.disposeEvent);
        delete this.documentDownEvent;

        _removeFunc(this.optionGroup);
        delete this.optionGroup;

        _removeFunc(this.angleOptionGroup);
        delete this.angleOptionGroup;

        this._setTextValue();
        skipCommand !== true && this.command(forceCommand);
    };

    p._setTextValue = function() {
        this.textElement.textContent = this._convert(
            this.getText(),
            this.getValue()
        );
    };
})(Entry.FieldAngle.prototype);
