/*
 */
'use strict';
import EntryTool from 'entry-tool';

/*
 *
 */
Entry.FieldDropdownDynamic = class FieldDropdownDynamic extends Entry.FieldDropdown {
    constructor(content, blockView, index) {
        super(content, blockView, index, null, null, true);
        this._block = blockView.block;
        this._blockView = blockView;

        var box = new Entry.BoxModel();
        this.box = box;

        this.svgGroup = null;

        this._contents = content;
        this._index = index;

        let { bgColor, textColor, arrowColor } = content;
        if (this._block.deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN || this._block.emphasized) {
            arrowColor = blockView._fillColor;
        }

        this._arrowColor = arrowColor;
        this._textColor = textColor || '#FFFFFF';
        this._bgColor = bgColor;

        var menuName = this._contents.menuName;
        console.log('_menuGenerator', menuName);
        if (_.isFunction(menuName)) this._menuGenerator = menuName;
        else this._menuName = menuName;

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
            blockView.getBoard().workspace.changeEvent.attach(this, this._updateValue);
        }
    };

    _updateValue() {
        var object = this._block.getCode().object;
        var options = [];
        if (Entry.container) {
            if (this._menuName) options = Entry.container.getDropdownList(this._menuName, object);
            else options = this._menuGenerator();
        }

        this._contents.options = options;
        var value = this.getValue();
        if (this._blockView.isInBlockMenu || !value || value == 'null')
            value = options.length !== 0 ? options[0][1] : null;

        this._updateOptions();
        this.setValue(value);
    };

    renderOptions() {
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-dropdown',
            parent: $('body'),
        });
        const { options = [] } = this._contents;
        this.dropdownWidget = new EntryTool({
            type: 'dropdownWidget',
            data: {
                items: options,
                positionDom: this.svgGroup,
                onOutsideClick: () => {
                    this.destroyOption();
                },
            },
            container: this.optionGroup[0],
        }).on('select', (item) => {
            this.applyValue(item[1]);
            this.destroyOption();
        });
        this.optionDomCreated();
    }
}
// Entry.Utils.inherit(Entry.FieldDropdown, Entry.FieldDropdownDynamic);
