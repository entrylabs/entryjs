'use strict';

import { DropdownExtra } from '@entrylabs/tool';

Entry.FieldDropdownExtra = class FieldDropdownExtra extends Entry.Field {
    constructor(content, blockView, index, renderMode, i, isDynamic) {
        super();
        if (isDynamic) {
            return;
        }
        this._block = blockView.block;
        this._blockView = blockView;

        this.box = new Entry.BoxModel();

        this.svgGroup = null;

        this._contents = content;
        this._noArrow = content.noArrow;

        const { bgColor, textColor } = content;
        let { arrowColor } = content;
        const { deletable, emphasized } = this._block;

        if (deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN || emphasized) {
            arrowColor = blockView._fillColor;
        }

        this._arrowColor = arrowColor;
        this._textColor = textColor || '#FFFFFF';
        this._bgColor = bgColor;
        this._index = index;
        this.setValue(this.getValue());

        this._CONTENT_HEIGHT = this.getContentHeight(content.dropdownHeight);

        this._font_size = this.getFontSize(content.fontSize);

        this._ROUND = content.roundValue || 2;

        this.renderStart();
    }

    renderStart() {
        const blockView = this._blockView;
        const X_PADDING = 20;
        const X_PADDING_SUBT = 10;
        const that = this;
        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        const arrowInfo = this.getArrow();

        if (!this.svgGroup) {
            this.svgGroup = blockView.contentSvgGroup.elem('g', {
                class: 'entry-field-dropdown',
            });
        }

        if (!this._header) {
            const rectInfo = {
                height: CONTENT_HEIGHT,
                y: -CONTENT_HEIGHT / 2,
                rx: that._ROUND,
                ry: that._ROUND,
            };

            if (this._bgColor) {
                rectInfo.fill = this._bgColor;
            } else {
                rectInfo.fill = '#fff';
                rectInfo['fill-opacity'] = 0.4;
            }

            this._header = this.svgGroup.elem('rect', rectInfo);
        }

        if (!this.textElement) {
            this.textElement = this.svgGroup.elem('text', {
                x: 5,
                style: 'white-space: pre;',
                fill: this._textColor,
                'font-size': `${+that._font_size}px`,
                'font-weight': 'bold',
                'font-family': EntryStatic.fontFamily || 'NanumGothic',
            });
        }

        if (!this._noArrow && !this._arrow) {
            this._arrow = this.svgGroup.elem('path', {
                d: `M 5.79 0.818
                L 3.339 3.8
                a 0.5 0.5 0 0 1 -0.772 0
                L 0.114 0.818
                A 0.5 0.5 0 0 1 0.5 0
                h 4.904
                a 0.5 0.5 0 0 1 0.387 0.818
                z
                `,
                fill: arrowInfo.color,
                stroke: arrowInfo.color,
            });
        }

        this._setTextValue();

        const bBox = this.getTextBBox();

        this.textElement.attr({
            y: bBox.height * 0.27,
        });

        let width = bBox.width + X_PADDING;

        if (this._noArrow) {
            width -= X_PADDING_SUBT;
        }

        this._header.attr({ width });

        if (!this._noArrow) {
            this._arrow.attr({
                transform: `translate(${width - arrowInfo.width - 5},${-arrowInfo.height / 2})`,
            });
        }

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width,
            height: CONTENT_HEIGHT,
        });
    }

    resize() {
        const X_PADDING = 20;
        const X_PADDING_SUBT = 10;
        const board = this._blockView.getBoard() || {};
        const { scale = 1 } = board || {};
        let width = this.textElement.getBoundingClientRect().width / scale + X_PADDING;
        if (!this._noArrow) {
            const arrowInfo = this.getArrow();
            this._arrow.attr({
                transform: `translate(${width - arrowInfo.width - 5},${-arrowInfo.height / 2})`,
            });
        } else {
            width -= X_PADDING_SUBT;
        }

        this._header.attr({
            width,
        });

        this.box.set({ width });
        this._block.view.dAlignContent();
    }

    _attachDisposeEvent(func) {
        let action = func;
        if (!action) {
            action = (skipCommand) => {
                this.destroyOption(skipCommand);
                this._selectBlockView();
            };
        }
        this.disposeEvent = Entry.disposeEvent.attach(this, action);
    }

    renderOptions() {
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-dropdown-extra',
            parent: $('body'),
        });
        const { options = [] } = this._contents;
        const convertedOptions = options.map(([key, value]) => [this._convert(key, value), value]);
        this.dropdownWidget = new DropdownExtra({
            type: 'dropdownExtraWidget',
            data: {
                eventTypes: ['mousedown', 'touchstart', 'wheel'],
                items: convertedOptions,
                positionDom: this.svgGroup,
                onOutsideClick: () => {
                    this.destroyOption();
                },
            },
            container: this.optionGroup[0],
        }).on('select', (item) => {
            this.applyValue(item[1]);
            this.destroyOption();
            const { view = {} } = this._block.getThread();
            if (view.reDraw) {
                view.reDraw();
            } else {
                this._block.view.reDraw();
            }
        });
        this.optionDomCreated();
    }

    applyValue(value) {
        if (this.value != value) {
            this.setValue(value);
        }
        this._setTextValue();
        this.resize();
    }

    getTextByValue(value) {
        const reg = /&value/gm;
        if (reg.test(value)) {
            return value.replace(reg, '');
        }

        if ((!value && typeof value !== 'number') || value === 'null') {
            return Lang.Blocks.no_target;
        }

        const matched = _.find(this._contents.options, ([, cValue]) => cValue == value);

        if (matched) {
            return _.head(matched);
        }

        //no match found
        //check should return value as it is
        if (this._shouldReturnValue(value)) {
            return value;
        }
        return Lang.Blocks.no_target;
    }

    getContentHeight(height) {
        return height || this._blockView.getSkeleton().dropdownHeight || 20;
    }

    getArrow() {
        return {
            color: this._arrowColor || this._blockView._schema.color,
            points: '0,0 6.4,0 3.2,4.2',
            height: 4.2,
            width: 6.4,
        };
    }

    _setTextValue() {
        const textValue = this.getTextByValue(this.getValue());
        const newValue = this._convert(textValue, this.getValue());
        if (this.getTextValue() !== newValue) {
            this.textElement.textContent = newValue;
        }
    }

    getTextValue() {
        return this.textElement.textContent;
    }

    destroyOption() {
        if (this.dropdownWidget) {
            this.dropdownWidget.isShow && this.dropdownWidget.hide();
            this.dropdownWidget.remove();
            this.dropdownWidget = null;
        }
        if (this.optionGroup) {
            this.optionGroup.remove();
        }
        super.destroyOption();
    }
};
