/*
 */
'use strict';

import { LedPicker } from '@entrylabs/tool';
import Extension from '../../extensions/extension';

/*
 *
 */
Entry.FieldLed = class FieldLed extends Entry.Field {
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
        this.setValue(
            this.getValue() || [
                [0, 0, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0],
            ]
        );
        /*

        */
        this._CONTENT_HEIGHT = 20;
        this._CONTENT_WIDTH = this.getContentWidth();

        this.renderStart();
    }

    renderLed() {
        // if (this.svgGroup) {
        //     $(this.svgGroup).remove();
        // }
        // const { contentSvgGroup, renderMode } = this._blockView;
        // this.svgGroup = contentSvgGroup.elem('g', {
        //     class: 'entry-field-microbit-led',
        // });
        // let x, y, WIDTH, HEIGHT;
        //
        // HEIGHT = this._CONTENT_HEIGHT;
        // WIDTH = this._CONTENT_WIDTH + 10;
        //
        // const position = this._position;
        // if (position) {
        //     x = position.x || 0;
        //     y = position.y || 0;
        // } else {
        //     x = 0;
        //     y = -HEIGHT / 2;
        // }
        // this._header = this.svgGroup.elem('rect', {
        //     x,
        //     y,
        //     width: 35, //WIDTH,
        //     height: 20, //HEIGHT,
        //
        //     rx: 2,
        //     ry: 2,
        //
        //     fill: '#008380',
        // });
        let ledStatus = this.getValue();
        const ledDist = 3;
        const ledOffset = 0.5;

        ledStatus.map((leds, x_pos) => {
            return leds.map((led, y_pos) => {
                if (this._rect[`${x_pos}`][`${y_pos}`]) {
                    this._rect[`${x_pos}`][`${y_pos}`].remove();
                }

                return (this._rect[`${x_pos}`][`${y_pos}`] = this.svgGroup.elem('rect', {
                    x: y_pos * ledDist + 4,
                    y: x_pos * ledDist - 8 + ledOffset,
                    width: ledDist - ledOffset,
                    height: ledDist - ledOffset,
                    rx: 0.5,
                    ry: 0.5,
                    fill: ledStatus[x_pos][y_pos] ? '#ffffff' : '#00b6b1',
                }));
            });
        });
    }

    renderStart() {
        const blockView = this._blockView;
        const X_PADDING = 20;
        const X_PADDING_SUBT = 10;
        const that = this;
        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        const arrowInfo = this.getArrow();

        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }
        const { contentSvgGroup, renderMode } = this._blockView;
        this.svgGroup = contentSvgGroup.elem('g', {
            class: 'entry-field-microbit-led',
        });

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

        this._rect = [[], [], [], [], []];
        this.renderLed();
        this._arrow = this.svgGroup.elem('path', {
            d: `M 30.79 -1.182
            L 28.339 1.8
            a 0.5 0.5 0 0 1 -0.772 0
            L 25.114 -1.182
            A 0.5 0.5 0 0 1 25.5 -2
            h 4.904
            a 0.5 0.5 0 0 1 0.387 0.818
            z
            `,
            fill: arrowInfo.color,
            stroke: arrowInfo.color,
        });

        this._bindRenderOptions();

        this.box.set({
            x,
            y,
            width: WIDTH,
            height: HEIGHT,
        });
    }

    getArrow() {
        return {
            color: '#ffffff',
            points: '0,0 6.4,0 3.2,4.2',
            height: 4.2,
            width: 6.4,
        };
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
            class: 'entry-field-microbit-led',
            parent: $('body'),
        });
        this.ledPicker = new LedPicker({
            data: {
                eventTypes: ['mousedown', 'touchstart'],
                ledStatus: this.getValue(),
                canTransparent: false,
                positionDom: this.svgGroup,
                onOutsideClick: (ledMatrix) => {
                    if (this.ledPicker) {
                        this.ledPicker.hide();
                        ledMatrix && this.applyValue(ledMatrix);
                    }
                    this._attachDisposeEvent();
                },
            },
            container: this.optionGroup[0],
        }).on('change', (value) => {
            if (value) {
                this.applyValue(value);
            }
        });

        this.optionDomCreated();
    }

    applyValue(value) {
        this.setValue(value);
        this.renderLed();
    }

    destroyOption() {
        if (this.ledPicker) {
            this.ledPicker.isShow && this.ledPicker.hide();
            this.ledPicker.remove();
            this.ledPicker = null;
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
