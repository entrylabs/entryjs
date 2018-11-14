'use strict';

import EntryTool from 'entry-tool';

Entry.FieldTextInput = class FieldTextInput extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);

        this.TEXT_Y_PADDING = 3;

        this._blockView = blockView;
        this.board = this._blockView.getBoard();
        this._block = blockView.block;

        this.box = new Entry.BoxModel();

        this.svgGroup = null;

        this.position = content.position;
        this._contents = content;
        this._isClearBG = content.clearBG || false;
        this._index = index;
        this.value = this.getValue() || '';
        this._CONTENT_HEIGHT = this.getContentHeight();
        this._font_size = 10;
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
                'font-family': 'NanumGothic',
            });
        }

        this.svgGroup.attr({ class: 'entry-input-field' });

        this._setTextValue();

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
        if (neighborFields) {
            this._neighborFields = neighborFields;
        }

        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-number-pad',
            parent: $('body'),
        });

        this.numberWidget = new EntryTool({
            type: 'numberWidget',
            data: {
                positionDom: this.svgGroup,
                onOutsideClick: () => {
                    if(this.numberWidget) {
                        this.numberWidget.hide();
                        this.isEditing() && this.destroyOption(undefined, true);
                    }
                },
            },
            container: this.optionGroup[0],
        }).on('click', (eventName, value) => {
            let prevValue = String(this.getValue());
            switch(eventName) {
                case 'buttonPressed':
                    this.applyValue(prevValue + value);
                    break;
                case 'backButtonPressed':
                    const nextValue = prevValue.substring(0, prevValue.length - 1);
                    this.applyValue(_.isEmpty(nextValue) ? 0 : nextValue);
                    break;
            }
        });


        /*
        TODO inputBox 로직. 분기를 통해 사용예정이므로 일단 살려둠 20181108 leegiwoong 불필요시 제거
        const that = this;
        const func = function(skipCommand, forceCommand) {
            skipCommand !== true && that.applyValue();
            that.destroyOption(skipCommand, forceCommand === true);
        };

        this._attachDisposeEvent(func);

        this.optionGroup = Entry.Dom('input', {
            class: 'entry-widget-input-field',
            parent: $('body'),
        });

        this.optionGroup.val(this.getValue());

        this.optionGroup.on('mousedown', function(e) {
            e.stopPropagation();
        });

        const exitKeys = [13, 27];
        this.optionGroup.on('keyup', function(e) {
            that.applyValue(e);

            if (_.includes(exitKeys, e.keyCode || e.which)) {
                that.destroyOption(undefined, true);
            }
        });

        this.optionGroup.on('keydown', function(e) {
            const keyCode = e.keyCode || e.which;

            if (keyCode === 9) {
                e.preventDefault();
                that._focusNeighbor(e.shiftKey ? 'prev' : 'next');
            }
        });
        const { scale = 1 } = this.board;
        this._font_size = 10 * scale;
        const { x, y } = this.getAbsolutePosFromDocument();
        const height = (this._CONTENT_HEIGHT - 4) * scale;
        this.optionGroup.css({
            height,
            left: x + 1,
            top: y + (scale - 1) * 4 + 2 * scale - 1 * (scale / 2) - this.box.height / 2,
            width: that.box.width * scale,
            'font-size': `${this._font_size}px`,
            'background-color': EntryStatic.colorSet.block.lighten.CALC,
        });

        this.optionGroup.focus && this.optionGroup.focus();

        const optionGroup = this.optionGroup[0];
        optionGroup.setSelectionRange(0, optionGroup.value.length, 'backward');

        //normally option group is done editing and destroyed
        //before blur called
        this.optionGroup.one('blur', () => {
            return;
        });*/

        this.optionDomCreated();
    }

    applyValue(value) {
        this.setValue(value);
        this._setTextValue();
        this.resize();
    }

    resize() {
        const { scale = 1 } = this.board;
        const size = { width: this.getTextWidth() * scale };
        const scaleSize = { width: this.getTextWidth() };
        this._header.attr(scaleSize);
        this.box.set(scaleSize);
        this.optionGroup.css(size);
        this._blockView.dAlignContent();
    }

    getTextWidth() {
        return Math.max(this.getTextBBox().width, 7);
    }

    _setTextValue() {
        const newValue = this._convert(this.getValue(), this.getValue());
        if (this.textElement.textContent !== newValue) {
            this.textElement.textContent = newValue;
        }
    }

    getNeighborFields() {
        if (!this._neighborFields) {
            const FIELD_TEXT_INPUT = Entry.FieldTextInput;
            this._neighborFields = this._block
            .getRootBlock()
            .getThread()
            .view.getFields()
            .filter((f) => {
                return f instanceof FIELD_TEXT_INPUT;
            });
        }

        return this._neighborFields;
    }
};
