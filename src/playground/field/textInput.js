'use strict';

import { Number, Angle } from '@entrylabs/tool';

Entry.FieldTextInput = class FieldTextInput extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);
        const { data = {} } = blockView;
        const { type = 'text' } = data;
        this.type = type;
        this.TEXT_Y_PADDING = 3;

        this._blockView = blockView;
        this.board = this._blockView.getBoard();
        this._block = blockView.block;

        this.box = new Entry.BoxModel();

        this.svgGroup = null;
        this.optionWidget = null;
        this.optionInput = null;

        this.position = content.position;
        this._contents = content;
        this._isClearBG = content.clearBG || false;
        this._index = index;
        this._CONTENT_HEIGHT = this.getContentHeight();
        this._font_size = content.fontSize || 10;
        this._neighborFields = null;

        this.renderStart();
    }

    // 기본 모드의 keyEvent(tab) 용
    _focusNeighbor(direction) {
        const fields = this.getNeighborFields();

        let idx = fields.indexOf(this);
        if (direction === 'prev') {
            idx--;
        } else {
            idx++;
        }
        const field = fields[idx];

        //no field to focus
        if (!field) {
            return;
        }

        this.destroyOption(undefined, true);
        field.renderOptions(fields);
    }

    renderStart() {
        const blockView = this._blockView;

        if (!this.svgGroup) {
            this.svgGroup = blockView.contentSvgGroup.elem('g');
        }

        if (!this.textElement) {
            this.textElement = this.svgGroup.elem('text', {
                x: 0,
                y: this.TEXT_Y_PADDING,
                fill: this._contents.color || 'black',
                'font-size': `${this._font_size}px`,
                'font-weight': 'bold',
                'font-family': EntryStatic.fontFamily || 'NanumGothic',
            });
        }

        this.svgGroup.attr({ class: 'entry-input-field' });

        this._setConvertedValue();

        const width = this.getTextWidth();
        let y = this.position && this.position.y ? this.position.y : 0;
        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        y -= CONTENT_HEIGHT / 2;
        if (!this._header) {
            this._header = this.svgGroup.elem('rect', {
                width,
                x: 0,
                y,
                height: CONTENT_HEIGHT,
                rx: 0,
                ry: 3,
                fill: '#fff',
                'fill-opacity': 0,
            });
        } else {
            this._header.setAttribute('width', width);
        }

        if (this._isClearBG) {
            $(this._header).css({ stroke: 'none' });
        }

        this.svgGroup.appendChild(this.textElement);

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width,
            height: CONTENT_HEIGHT,
        });
    }

    renderOptions(neighborFields) {
        const { _block = {} } = this;
        const { defaultType = 'text' } = _block;
        if (neighborFields) {
            this._neighborFields = neighborFields;
        }

        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-parent',
            parent: $('body'),
        });

        if (Entry.isMobile()) {
            if (defaultType === 'number') {
                this.optionWidget = this._getNumberOptionWidget();
            } else if (defaultType === 'angle') {
                this.optionWidget = this._getAngleOptionWidget();
            } else {
                this.optionInput = this._getInputFieldOption();
                this._attachDisposeEvent();
            }
        } else {
            if (defaultType === 'angle') {
                this.optionInput = this._getInputFieldOption();
                this.optionWidget = this._getAngleOptionWidget(this.optionInput[0]);
            } else {
                this.optionInput = this._getInputFieldOption();
                this._attachDisposeEvent();
            }
        }

        this._setTextValue();
        this.optionDomCreated();
    }

    _getNumberOptionWidget() {
        return new Number({
            type: 'numberWidget',
            data: {
                eventTypes: ['mousedown', 'touchstart', 'wheel'],
                positionDom: this.svgGroup,
                onOutsideClick: () => {
                    this.destroyOption(undefined, true);
                },
            },
            container: this.optionGroup[0],
        }).on('click', (eventName, value) => {
            let prevValue = String(this.getValue());
            switch (eventName) {
                case 'buttonPressed':
                    if (prevValue === '0' && _.includes(['0', '.'], value) === false) {
                        prevValue = '';
                    }
                    this.applyValue(prevValue + value);
                    break;
                case 'backButtonPressed': {
                    const nextValue = prevValue.substring(0, prevValue.length - 1);
                    this.applyValue(_.isEmpty(nextValue) ? 0 : nextValue);
                    break;
                }
            }
        });
    }

    /**
     *
     * @param {Array} excludeDom outside 로 판단하지 않을 dom target list
     * @returns {EntryTool} Angle Widget
     * @private
     */
    _getAngleOptionWidget(...excludeDom) {
        return new Angle({
            type: 'angleWidget',
            data: {
                eventTypes: ['mousedown', 'touchstart', 'wheel'],
                angle: this.getValue(),
                outsideExcludeDom: excludeDom,
                positionDom: this.svgGroup,
                onOutsideClick: (angle) => {
                    this.applyValue(FieldTextInput._refineDegree(angle));
                    this.destroyOption();
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
                this.applyValue(nextValue);
            })
            .on('change', (value) => {
                this.applyValue(String(value));
            });
    }

    _getInputFieldOption() {
        const inputField = Entry.Dom('input', {
            class: 'entry-widget-input-field',
            parent: $('body'),
        });

        inputField.val(this.getValue());

        inputField.on('mousedown', (e) => {
            e.stopPropagation();
        });

        inputField.on('keyup', (e) => {
            this.applyValue(inputField[0].value, true);
            if (_.includes([13, 27], e.keyCode || e.which)) {
                this.destroyOption(undefined, true);
            }
        });

        inputField.on('keydown', (e) => {
            const keyCode = e.keyCode || e.which;

            if (keyCode === 9) {
                e.preventDefault();
                this._focusNeighbor(e.shiftKey ? 'prev' : 'next');
            }
        });

        inputField.on('blur', (e) => {
            console.log('blur');
            this.destroyOption(undefined, true);
        });

        const { scale = 1 } = this.board;
        this._font_size = 10 * scale;
        const { x, y } = this.getAbsolutePosFromDocument();
        const height = (this._CONTENT_HEIGHT - 4) * scale;
        inputField.css({
            height,
            left: x + 1,
            top: y + (scale - 1) * 4 + 2 * scale - 1 * (scale / 2) - this.box.height / 2,
            width: this.box.width * scale,
            'font-size': `${this._font_size}px`,
            'background-color': EntryStatic.colorSet.block.lighten.CALC,
        });

        inputField.focus && inputField.focus();

        inputField[0].setSelectionRange(0, inputField[0].value.length, 'backward');
        return inputField;
    }

    applyValue(value, isNotUpdate) {
        let result = value;
        if (this.optionWidget) {
            switch (this.optionWidget.type) {
                case 'angleWidget':
                    this.optionWidget.data = {
                        angle: FieldTextInput._refineDegree(value),
                    };
                    if (
                        Entry.Utils.isNumber(value) &&
                        value.lastIndexOf('.') !== value.length - 1
                    ) {
                        result = String(result % 360);
                    }
                    break;
            }
        }
        if (this.optionInput && !isNotUpdate) {
            this.optionInput.val(result);
        }

        this.setValue(result);
        this._setTextValue();
        this.resize();
    }

    resize() {
        const { scale = 1 } = this.board;
        const size = { width: this.getTextWidth() };
        const scaleSize = { width: this.getTextWidth() / scale };
        this._header.attr(scaleSize);
        this.box.set(scaleSize);
        this.optionInput && this.optionInput.css(size);
        this._blockView.dAlignContent();
    }

    destroyOption(skipCommand, forceCommand) {
        this._setConvertedValue();

        if (this.optionWidget) {
            this.optionWidget.isShow && this.optionWidget.hide();
            this.optionWidget.remove();
            delete this.optionWidget;
        }

        if (this.optionInput) {
            this.optionInput.remove();
            delete this.optionInput;
        }

        super.destroyOption(skipCommand, forceCommand);
    }

    getTextWidth() {
        return Math.max(this.getTextBBox().width, 7);
    }

    _setTextValue() {
        const value = this.getValue();
        if (this.textElement.textContent !== value) {
            this.textElement.textContent = value;
        }
    }

    _setConvertedValue() {
        const { _block = {} } = this;
        const { defaultType = 'text' } = _block;
        let value = this._convert(this.getValue(), this.getValue());

        if (defaultType === 'angle') {
            value += '°';
        }

        if (this.textElement.textContent !== value) {
            this.textElement.textContent = value;
        }
    }

    getNeighborFields() {
        if (!this._neighborFields) {
            const FIELD_TEXT_INPUT = Entry.FieldTextInput;
            this._neighborFields = this._block
                .getRootBlock()
                .getThread()
                .view.getFields()
                .filter((f) => f instanceof FIELD_TEXT_INPUT);
        }

        return this._neighborFields;
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
        returnValue = returnValue.replace('°', '');

        if (!FieldTextInput._isValidInputValue(value)) {
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
        const returnValue = String(this.getValue());
        if (returnValue.length === 1) {
            return '0';
        } else {
            return returnValue.slice(0, returnValue.length - 1);
        }
    }

    static _refineDegree(value) {
        const reg = /&value/gm;
        if (reg.test(value)) {
            return value;
        }

        const numberOnlyValue = String(value).match(/[\d|\-|.|\+]+/g);
        let refinedDegree = (numberOnlyValue && numberOnlyValue[0]) || '0';
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
