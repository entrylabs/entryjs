/*
 */
'use strict';

import { Angle } from '@entrylabs/tool';

Entry.FieldAngle = class FieldAngle extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);

        this.X_PADDING = 8;
        this.TEXT_Y_PADDING = 4;

        this._block = blockView.block;
        this._blockView = blockView;
        this.box = new Entry.BoxModel();
        this.svgGroup = null;
        this.position = content.position;
        this._contents = content;
        this._index = index;

        const value = this.getValue();
        this.setValue(FieldAngle._refineDegree(value !== undefined ? value : '90'));

        this._CONTENT_HEIGHT = this.getContentHeight();
        this.renderStart();
    }

    renderStart() {
        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }

        this.svgGroup = this._blockView.contentSvgGroup.elem('g', {
            class: 'entry-input-field',
        });

        this.textElement = this.svgGroup.elem('text', {
            x: this.X_PADDING / 2,
            y: this.TEXT_Y_PADDING,
            'font-size': '11px',
            'font-family': EntryStatic.fontFamily || 'NanumGothic',
        });

        this._setTextValue();

        const width = this.getTextWidth();
        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;

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
    }

    renderOptions() {
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-angle',
            parent: $('body'),
        });

        this.angleWidget = new Angle({
            data: {
                angle: this.getValue(),
                positionDom: this.svgGroup,
                onOutsideClick: (angle) => {
                    if (this.angleWidget) {
                        this._applyValue(FieldAngle._refineDegree(angle));
                        this._setTextValue();
                        this.destroyOption();
                    }
                },
            },
            container: this.optionGroup[0],
        })
            .on('click', (eventName, value) => {
                let nextValue = 0;
                switch (eventName) {
                    case 'buttonPressed': {
                        nextValue = this._getNextValue(value);
                        break;
                    }
                    case 'backButtonPressed': {
                        nextValue = this._getSubstringValue();
                        break;
                    }
                }
                this._applyValue(nextValue);
            })
            .on('change', (value) => {
                this._applyValue(String(value));
            });

        this.optionGroup.focus();
        this.optionGroup.select();
        this.optionDomCreated();
    }

    /**
     * 기존 값의 뒤에 새 값을 추가한다. 내부에서 모든 숫자는 문자열이다.
     * 규칙은 아래와 같다.
     *
     * - 마이너스 입력은 현재 값이 0 인 경우만 가능
     * - . 은 값에서 유일하게 하나만 허용한다.
     * - 현재 값이 0 혹은 -0 인 경우 0은 입력할 수 없다. 다른 숫자는 입력할 수 있다.
     *
     * @param value 이번에 입력된 값
     * @return {string} 규칙에 맞추어 정제된 값
     * @private
     */
    _getNextValue(value) {
        let returnValue = String(this.getValue());

        if (!FieldAngle._isValidInputValue(value)) {
            return returnValue;
        }

        switch (value) {
            case '-':
                if (returnValue === '0') {
                    return '-';
                }
                return returnValue;
            case '.':
                if (/\./.test(returnValue) || returnValue === '-') {
                    return returnValue;
                }
                break;
            case '0':
                if (returnValue.startsWith('0') || returnValue.startsWith('-0')) {
                    return returnValue;
                }
                break;
            default:
                if (returnValue === '0') {
                    return value;
                }
                break;
        }

        returnValue += value;
        return returnValue;
    }

    /**
     * 현재 값 블록에서 마지막 숫자를 삭제한 값을 반환한다.
     * 0 인 경우는 0 을 반환, - 인 경우는 0 을 반환한다.
     * @returns {string} 마지막 위치가 삭제된 블록 값
     * @private
     */
    _getSubstringValue() {
        let returnValue = String(this.getValue());
        if (returnValue.length === 1) {
            return '0';
        } else {
            return returnValue.slice(0, returnValue.length - 1);
        }
    }

    _applyValue(value) {
        let rangedValue = value;
        if (Entry.Utils.isNumber(value) && value.lastIndexOf('.') !== value.length - 1) {
            rangedValue = String(rangedValue % 360);
        }

        this.setValue(rangedValue);
        this.textElement.textContent = this.getValue();

        if (this.angleWidget) {
            this.angleWidget.data = {
                angle: FieldAngle._refineDegree(value),
            };
        }

        this.resize();
    }

    resize() {
        const obj = { width: this.getTextWidth() };

        this._header.attr(obj);
        if (this.optionGroup) {
            this.optionGroup.css(obj);
        }

        this.box.set(obj);
        this._blockView.dAlignContent();
    }

    getTextWidth() {
        if (!this.textElement) return this.X_PADDING;
        return this.getTextBBox().width + this.X_PADDING;
    }

    getText() {
        const value = this.getValue();
        const reg = /&value/gm;
        if (reg.test(value)) return value.replace(reg, '');
        return value + '\u00B0';
    }

    destroyOption() {
        if (this.angleWidget) {
            this.angleWidget.isShow && this.angleWidget.hide();
            this.angleWidget.remove();
            this.angleWidget = null;
        }
        if (this.optionGroup) {
            this.optionGroup.remove();
        }

        super.destroyOption();
    }

    _setTextValue() {
        this.textElement.textContent = this._convert(this.getText(), this.getValue());
    }

    static _refineDegree(value) {
        const reg = /&value/gm;
        if (reg.test(value)) return value;

        let refinedDegree = String(value).match(/[\d|\-|.|\+]+/g)[0] || 0;
        if (refinedDegree > 360) {
            refinedDegree %= 360;
        } else if (refinedDegree < 0) {
            refinedDegree = refinedDegree % 360;
        }
        refinedDegree = String(refinedDegree);

        if (refinedDegree.lastIndexOf('.') === refinedDegree.length - 1) {
            return refinedDegree.slice(0, refinedDegree.length - 1);
        }

        return refinedDegree;
    }

    static _isValidInputValue(value) {
        return Entry.Utils.isNumber(value) || value === '-' || value === '.';
    }
};
