/*
 */
'use strict';
import { Dropdown } from '@entrylabs/tool';
import _cloneDeep from 'lodash/cloneDeep';
/*
 *
 */
Entry.FieldDropdownDynamic = class FieldDropdownDynamic extends Entry.FieldDropdown {
    constructor(content, blockView, index) {
        super(content, blockView, index, null, null, true);
        this._block = blockView.block;
        this._blockView = blockView;

        const box = new Entry.BoxModel();
        this.box = box;

        this.svgGroup = null;

        this._contents = content;

        if (content.needDeepCopy) {
            this._contents = _cloneDeep(content);
        }

        this._index = index;

        let { bgColor, textColor, arrowColor } = content;
        if (
            this._block.deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN ||
            this._block.emphasized
        ) {
            arrowColor = blockView._fillColor;
        }

        this._arrowColor = arrowColor;
        this._textColor = textColor || '#FFFFFF';
        this._bgColor = bgColor;

        const menuName = this._contents.menuName;
        if (_.isFunction(menuName)) {
            this._menuGenerator = menuName;
        } else {
            this._menuName = menuName;
        }

        this._CONTENT_HEIGHT = this.getContentHeight(content.dropdownHeight);
        this._font_size = this.getFontSize(content.fontSize);

        this._ROUND = content.roundValue || 3;
        this.renderStart(blockView);
        if (
            blockView &&
            blockView.getBoard() &&
            blockView.getBoard().workspace &&
            blockView.getBoard().workspace.changeEvent
        ) {
            blockView.getBoard().workspace.changeEvent.attach(this, () => {
                this._updateValue(true);
            });
        }
        this.optionChangeTriggeredEvent();
    }

    getIndexValue() {
        if (this._contents.targetIndex >= 0) {
            return this._block.data.params[this._contents.targetIndex];
        }
        return null;
    }

    _updateValue(reDraw) {
        const object = this._block.getCode().object;
        let options = [];
        if (Entry.container) {
            if (this._menuName) {
                options = Entry.container.getDropdownList(this._menuName, object);
            } else {
                options = this._menuGenerator(this.getIndexValue());
            }
        }

        this._contents.options = options;
        this._updateOptions();
        if (reDraw && this._menuName === 'variables') {
            this.value = undefined;
        }
        this.setValue(this.getOptionCheckedValue(), reDraw);
    }

    getOptionCheckedValue() {
        const { options, defaultValue } = this._contents;
        let value = this.getValue();

        if (this._blockView.isInBlockMenu || !value || value == 'null') {
            value = options.length !== 0 ? options[0][1] : null;
        }
        const matched = _.find(options, ([, cValue]) => cValue === value);
        if (!matched && defaultValue) {
            if (_.isFunction(defaultValue)) {
                return defaultValue(value, options);
            }
            return defaultValue;
        }
        return value;
    }

    renderOptions() {
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-dropdown',
            parent: $('body'),
        });
        const { options = [] } = this._contents;
        const convertedOptions = options.map(([key, value]) => [this._convert(key, value), value]);
        this.dropdownWidget = new Dropdown({
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
            $(this._blockView.contentSvgGroup).trigger('optionChanged', {
                block: this._block,
                value: this.getValue(),
                index: this._index,
            });
        });
        this.optionDomCreated();
    }

    optionChangeTriggeredEvent() {
        const targetIndex = this._contents.targetIndex;

        if (typeof targetIndex === 'undefined') {
            return;
        }

        $(this._blockView.contentSvgGroup).on('optionChanged', (e, data) => {
            if (this._block == data.block && targetIndex == data.index) {
                const options = this._menuGenerator(data.value);
                this._contents.options = options;
                const value = this.getValue();
                this.applyValue(
                    !options.find((x) => x[1] && x[1] === value) ? options[0][1] : value
                );
            }
        });
    }
};
