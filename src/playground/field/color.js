/*
 */
'use strict';

import { ColorPicker } from '@entrylabs/tool';
import Extension from '../../extensions/extension';

/*
 *
 */
Entry.FieldColor = class FieldColor extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);
        this._block = blockView.block;
        this._blockView = blockView;
        const board = blockView.getBoard();
        this.box = new Entry.BoxModel();
        this.svgGroup = null;
        this._contents = content;
        this._index = index;
        this._position = content.position;
        this._fontSize = content.fontSize || blockView.getSkeleton().fontSize || 10;
        this._color =
            content.color ||
            this._block.getSchema().fontColor ||
            blockView.getSkeleton().color ||
            'black';
        this.key = content.key;
        this.setValue(this.getValue() || '#FF0000');
        this._CONTENT_HEIGHT = this.getContentHeight();
        this._CONTENT_WIDTH = this.getContentWidth();

        this.renderStart();
        this.dropper = Extension.getExtension('Dropper');
    }

    renderStart() {
        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }
        const { contentSvgGroup, renderMode } = this._blockView;
        this.svgGroup = contentSvgGroup.elem('g', {
            class: 'entry-field-color',
        });

        let x, y, WIDTH, HEIGHT;

        if (renderMode === Entry.BlockView.RENDER_MODE_TEXT) {
            const rect = this.svgGroup.elem('rect', {
                x: 0,
                rx: 3,
                ry: 3,
                fill: '#fff',
                'fill-opacity': 0.4,
            });

            this.textElement = this.svgGroup.elem('text').attr({
                style: 'white-space: pre;',
                'font-size': `${this._fontSize}px`,
                'font-family': EntryStatic.fontFamily || 'NanumGothic',
                class: 'dragNone',
                fill: this._color,
            });

            this.textElement.textContent = this._convert(this.getValue(), this.getValue());
            const bBox = this.textElement.getBoundingClientRect();
            WIDTH = bBox.width + 12;
            HEIGHT = bBox.height;
            rect.attr({
                y: -HEIGHT / 2,
                width: WIDTH,
                height: HEIGHT,
            });
            this.textElement.attr({
                x: 6,
                y: bBox.height * 0.25,
            });
        } else {
            HEIGHT = this._CONTENT_HEIGHT;
            WIDTH = this._CONTENT_WIDTH;
            const position = this._position;
            if (position) {
                x = position.x || 0;
                y = position.y || 0;
            } else {
                x = 0;
                y = -HEIGHT / 2;
            }

            this._header = this.svgGroup.elem('rect', {
                x,
                y,
                rx: 2,
                ry: 2,
                width: 20, //WIDTH,
                height: 20, //HEIGHT,
                fill: this.getValue(),
                stroke: '#fff',
                'stroke-width': '1',
            });
        }

        this._bindRenderOptions();

        this.box.set({
            x,
            y,
            width: WIDTH,
            height: HEIGHT,
        });
    }

    _attachDisposeEvent(func) {
        let action = func;
        if (!action) {
            action = (skipCommand) => {
                // this.applyValue(this.colorPicker.getData('color'));
                this.destroyOption(skipCommand);
                this._selectBlockView();
            };
        }
        this.disposeEvent = Entry.disposeEvent.attach(this, action);
    }

    spoidClick = _.debounce(() => {
        this.isRunSpoid = true;
        this.colorPicker.data = {
            activeSpoid: true,
        };
        const { canvas } = Entry.stage.canvas || {};
        this.dropper
            .show({
                target: canvas,
            })
            .once('pick', (color) => {
                const data = { activeSpoid: false };
                if (color) {
                    this.applyValue(color);
                    data.color = color;
                }
                this.colorPicker.setData(data);
                delete this.isRunSpoid;
            });
    });

    renderOptions() {
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-color-picker',
            parent: $('body'),
        });
        this.colorPicker = new ColorPicker({
            data: {
                eventTypes: ['mousedown', 'touchstart', 'wheel'],
                color: this.getValue(),
                canTransparent: false,
                canSpoide: true,
                positionDom: this.svgGroup,
                // boundrayDom: this.boundrayDom,
                onOutsideClick: (color) => {
                    if (this.isRunSpoid) {
                        return;
                    }
                    if (this.colorPicker) {
                        this.colorPicker.hide();
                        color && this.applyValue(color);
                    }
                    this._attachDisposeEvent();
                },
                onSpoidClick: this.spoidClick,
            },
            container: this.optionGroup[0],
        }).on('change', (color) => {
            if (color) {
                this.colorPicker.setData({ color });
                this.applyValue(color);
            }
        });

        this.optionDomCreated();
    }

    applyValue(value) {
        if (this.value == value) {
            return;
        }

        this.setValue(value);

        if (this._header) {
            this._header.attr({ fill: value });
        } else if (this.textElement) {
            value = this.getValue();
            this.textElement.textContent = this._convert(value, value);
        }
    }

    destroyOption() {
        if (this.colorPicker) {
            this.colorPicker.isShow && this.colorPicker.hide();
            this.colorPicker.remove();
            this.colorPicker = null;
        }
        if (this.optionGroup) {
            this.optionGroup.remove();
        }
        super.destroyOption();
    }

    getContentWidth() {
        return 22;
    }
};
