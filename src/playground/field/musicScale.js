import { MusicScale } from '@entrylabs/tool';

Entry.FieldMusicScale = class FieldMusicScale extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);
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
        this.setValue(this.getValue() || 'C1');

        this._CONTENT_HEIGHT = this.getContentHeight(content.dropdownHeight);

        this._font_size = this.getFontSize(content.fontSize);

        this._ROUND = content.roundValue || 2;

        this.renderStart();
    }

    renderStart() {
        const blockView = this._blockView;
        const that = this;
        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        const arrowInfo = this.getArrow();

        if (!this.svgGroup) {
            this.svgGroup = blockView.contentSvgGroup.elem('g', {
                class: 'entry-field-music-scale',
            });
        }

        if (!this._header) {
            let x, y, WIDTH, HEIGHT;

            HEIGHT = this._CONTENT_HEIGHT;
            WIDTH = this._CONTENT_WIDTH + 10;
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
                width: 35, //WIDTH,
                height: 20, //HEIGHT,

                rx: 2,
                ry: 2,

                fill: '#008380',
            });
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
        this._updateTextRender();
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
        this._block.view?.dAlignContent();
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

    getArrow() {
        return {
            color: this._arrowColor || '#ffffff',
            points: '0,0 6.4,0 3.2,4.2',
            height: 4.2,
            width: 6.4,
        };
    }

    renderOptions(neighborFields) {
        this.optionGroup = Entry.Dom('div', {
            class: 'entry-widget-music-scale',
            parent: $('body'),
        });
        const currentValue = this.getValue();
        const scale = currentValue.substr(0, currentValue.length - 1);
        const octave = currentValue[currentValue.length - 1];
        this.optionWidget = new MusicScale({
            type: 'musicScaleWidget',
            data: {
                eventTypes: ['mousedown', 'touchstart', 'wheel'],
                positionDom: this.svgGroup,
                onOutsideClick: () => {
                    this.destroyOption();
                },
                scale: scale || 'C',
                octave: octave || 1,
            },
            container: this.optionGroup[0],
        }).on('click', (eventName, value) => {
            let prevValue = String(this.getValue());
            switch (eventName) {
                case 'changedValue':
                    if (prevValue === '0' && _.includes(['0', '.'], value) === false) {
                        prevValue = '';
                    }
                    this.applyValue(value);
                    break;
            }
        });
    }

    getContentHeight(height) {
        return height || this._blockView.getSkeleton().dropdownHeight || 20;
    }

    applyValue(value) {
        if (this.value != value) {
            this.setValue(value);
        }
        this._setTextValue();
        this.resize();
    }

    destroyOption(skipCommand, forceCommand) {
        if (this.optionWidget) {
            this.optionWidget.isShow && this.optionWidget.hide();
            this.optionWidget.remove();
            delete this.optionWidget;
        }
        if (this.optionGroup) {
            this.optionGroup.remove();
        }

        super.destroyOption();
    }

    getTextWidth() {
        return Math.max(this.getTextBBox().width, 7);
    }

    _updateTextRender() {
        const X_PADDING = 20;
        const X_PADDING_SUBT = 10;
        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        const arrowInfo = this.getArrow();
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

    _setTextValue() {
        const textValue = this.getValue();
        const newValue = this._convert(textValue, this.getValue());
        if (this.getTextValue() !== newValue) {
            const scale = newValue.substr(0, newValue.length - 1);
            const octave = newValue[newValue.length - 1];
            this.textElement.textContent = `${octave} ${Lang.Blocks.octave} ${scale}`;
        }
    }

    getTextValue() {
        return this.textElement.textContent;
    }
};
