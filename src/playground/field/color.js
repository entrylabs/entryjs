/*
 */
'use strict';

import EntryTool from 'entry-tool';

/*
 *
 */
Entry.FieldColor = class FieldColor extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);
        this._block = blockView.block;
        this._blockView = blockView;

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
    }

    renderStart() {
        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }
        var { contentSvgGroup, renderMode } = this._blockView;
        this.svgGroup = contentSvgGroup.elem('g', {
            class: 'entry-field-color',
        });

        var x, y, WIDTH, HEIGHT;

        if (renderMode === Entry.BlockView.RENDER_MODE_TEXT) {
            var rect = this.svgGroup.elem('rect', {
                x: 0,
                rx: 3,
                ry: 3,
                fill: '#fff',
                'fill-opacity': 0.4,
            });

            this.textElement = this.svgGroup.elem('text').attr({
                style: 'white-space: pre;',
                'font-size': this._fontSize + 'px',
                'font-family': 'NanumGothic',
                class: 'dragNone',
                fill: this._color,
            });

            this.textElement.textContent = this._convert(this.getValue(), this.getValue());
            var bBox = this.textElement.getBoundingClientRect();
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
            var position = this._position;
            if (position) {
                x = position.x || 0;
                y = position.y || 0;
            } else {
                x = 0;
                y = -HEIGHT / 2;
            }

            this._header = this.svgGroup.elem('rect', {
                x: x,
                y: y,
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
        if(!action) {
            action = (skipCommand) => {
                this.applyValue(this.colorPicker.getData('color'));
                this.destroyOption(skipCommand);
                this._selectBlockView();
            };
        }
        this.disposeEvent = Entry.disposeEvent.attach(this, action);
    }

    renderOptions() {
        this._attachDisposeEvent();

        this.optionGroup = Entry.Dom('div', {
            class: 'entry-color-picker',
            parent: $('body'),
        });

        this.colorPicker = new EntryTool({
            type: 'colorPicker',
            data: {
                color: this.getValue(),
            },
            container: this.optionGroup[0],
        });

        this.optionGroup.bind('mousedown touchstart keyup keydown', (e) => e.stopPropagation());

        // this.optionGroup[0].appendChild(fragment);

        var { x, y } = this.getAbsolutePosFromDocument();
        y += this.box.height / 2 + 1;

        this.optionGroup.css({
            left: x,
            top: y,
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

    getContentWidth() {
        return 22;
    }

    static getWidgetColorList() {
        return [
            ['#FFFFFF', '#CCCCCC', '#C0C0C0', '#999999', '#666666', '#333333', '#000000'],
            ['#FFCCCC', '#FF6666', '#FF0000', '#CC0000', '#990000', '#660000', '#330000'],
            ['#FFCC99', '#FF9966', '#FF9900', '#FF6600', '#CC6600', '#993300', '#663300'],
            ['#FFFF99', '#FFFF66', '#FFCC66', '#FFCC33', '#CC9933', '#996633', '#663333'],
            ['#FFFFCC', '#FFFF33', '#FFFF00', '#FFCC00', '#999900', '#666600', '#333300'],
            ['#99FF99', '#66FF99', '#33FF33', '#33CC00', '#009900', '#006600', '#003300'],
            ['#99FFFF', '#33FFFF', '#66CCCC', '#00CCCC', '#339999', '#336666', '#003333'],
            ['#CCFFFF', '#66FFFF', '#33CCFF', '#3366FF', '#3333FF', '#000099', '#000066'],
            ['#CCCCFF', '#9999FF', '#6666CC', '#6633FF', '#6609CC', '#333399', '#330099'],
            ['#FFCCFF', '#FF99FF', '#CC66CC', '#CC33CC', '#993399', '#663366', '#330033'],
        ];
    }
};
