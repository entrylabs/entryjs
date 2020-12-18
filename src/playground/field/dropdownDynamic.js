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
        this.initialize(blockView);
    }

    initialize(blockView) {
        const promise = this.renderStart(blockView);
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
        if (promise instanceof Promise) {
            promise.then(() => {
                blockView.alignContent(false);
            });
        }
    }

    _isBlockInBoardWhenFunctionEdit() {
        const view = this._block.getView() || { _board: {} };
        return view._board.suffix === 'board' && Entry.Func.isEdit;
    }

    getTextByValue(value) {
        if (this._isBlockInBoardWhenFunctionEdit()) {
            return this.textElement.textContent;
        }

        return super.getTextByValue(value);
    }

    async _updateValue(reDraw) {
        const object = this._block.getCode().object;
        let options = [];
        if (Entry.container) {
            if (this._menuName) {
                options = await Entry.container.getDropdownList(this._menuName, object);
            } else {
                options = await this._menuGenerator();
            }
        }

        this._contents.options = options;
        this._updateOptions();

        if (reDraw && this._menuName === 'variables' && !this._isBlockInBoardWhenFunctionEdit()) {
            this.value = undefined;
        }
        this.applyValue(this.getOptionCheckedValue(), reDraw);
    }

    getTargetValue(key, useParent = false) {
        if (!key) {
            return;
        }
        const block = useParent ? this._block.thread._block : this._block;
        const { _schema, params: values = [] } = block || {};
        const { params = [] } = _schema || {};
        const idx = params.findIndex(({ dropdownSync }) => dropdownSync === key);
        return values[idx || 0];
    }

    getOptionCheckedValue() {
        const { options, defaultValue } = this._contents;
        let value = this.getValue();

        if (this._blockView.isInBlockMenu || !value || value == 'null') {
            value = options.length !== 0 && options[0] ? options[0][1] : null;
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
            const { view = {} } = this._block.getThread();
            if (view.reDraw) {
                view.reDraw();
            } else {
                this._block.view.reDraw();
            }
        });
        this.optionDomCreated();
    }
};
