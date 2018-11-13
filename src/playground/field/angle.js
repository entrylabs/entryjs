/*
 */
'use strict';

import EntryTool from 'entry-tool';

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
    this.setValue(this._refineDegree(value !== undefined ? value : '90'));

    this._CONTENT_HEIGHT = this.getContentHeight();
    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldAngle);

(function(p) {
    const X_PADDING = 8,
        TEXT_Y_PADDING = 4;

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
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-angle',
            parent: $('body'),
        });

        this.angleWidget = new EntryTool({
            type: 'angleWidget',
            data: {
                angle: this.getValue(),
                positionDom: this.svgGroup,
                onOutsideClick: () => {
                    if(this.angleWidget) {
                        this.angleWidget.hide();
                        this.applyValue(this.angleWidget.getData('angle'));
                        this.isEditing() && this.destroyOption(undefined, true);
                    }
                },
            },
            container: this.optionGroup[0],
        }).on('click', (eventName, value) => {
            switch(eventName) {
                case 'buttonPressed':{
                    this.applyValue(this.getValue() + value);
                    break;
                }
                case 'backButtonPressed':
                    const nextValue = this.getValue() / 10;
                    this.applyValue(nextValue);
                    break;
            }
        }).on('change', (value) => {
            this.applyValue(String(value));
        });

        this.optionGroup.focus();
        this.optionGroup.select();
        this.optionDomCreated();
    };

    p.applyValue = function(value) {
        if (!Entry.Utils.isNumber(value) || value === '') return;
        value = this._refineDegree(value);

        this.setValue(value);
        this.textElement.textContent = this.getValue();

        if(this.angleWidget) {
            this.angleWidget.data = {
                angle: value,
            };
        }

        this._setTextValue();
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

    p._refineDegree = function(value) {
        const reg = /&value/gm;
        if (reg.test(value)) return value;

        let refinedDegree = value;
        if (refinedDegree > 360) {
            refinedDegree %= 360;
        } else if (refinedDegree < 0) {
            refinedDegree = (refinedDegree % 360) + 360;
        }

        return refinedDegree;
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
