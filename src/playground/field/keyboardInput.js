/*
 */
'use strict';

/*
 *
 */
Entry.FieldKeyboard = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;

    this.box = new Entry.BoxModel();

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._index = index;
    this.setValue(String(this.getValue()));
    this._CONTENT_HEIGHT = this.getContentHeight();

    this._optionVisible = false;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldKeyboard);

(function(p) {
    const X_PADDING = 10;
    const TEXT_Y_PADDING = 4;

    p.renderStart = function() {
        if (this.svgGroup) {
            $(this.svgGroup).remove();
        }

        this.svgGroup = this._blockView.contentSvgGroup.elem('g', {
            class: 'entry-input-field',
        });

        this.textElement = this.svgGroup.elem('text').attr({
            x: X_PADDING / 2,
            y: TEXT_Y_PADDING,
            'font-size': '11px',
            'font-family': 'NanumGothic',
        });

        this._setTextValue();

        const width = this.getTextWidth() + 1;

        const CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        this._header = this.svgGroup.elem('rect', {
            x: 0,
            y: (_.result(this.position, 'y') || 0) - CONTENT_HEIGHT / 2,
            width,
            height: CONTENT_HEIGHT,
            rx: 3,
            ry: 3,
            fill: '#fff',
            'fill-opacity': 0.4,
        });

        this.svgGroup.appendChild(this.textElement);

        this._bindRenderOptions();

        this.box.set({
            x: 0,
            y: 0,
            width,
            height: CONTENT_HEIGHT,
        });
    };

    p.renderOptions = function() {
        if (Entry.keyPressed) {
            this.keyPressed = Entry.keyPressed.attach(this, this._keyboardControl);
        }
        this._optionVisible = true;

        this._attachDisposeEvent((skipCommand, forceCommand) => {
            this.destroyOption(skipCommand, forceCommand === true);
        });

        let { x, y } = this.getAbsolutePosFromDocument();

        x -= 12 + X_PADDING / 2;
        x += this.box.width / 2;

        y += this.box.height / 2 + 1;

        this.optionGroup = Entry.Dom('img', {
            class: 'entry-widget-keyboard-input',
            parent: $('body'),
        });

        this.optionGroup.on('load', this.optionDomCreated.bind(this));

        this.optionGroup[0].src = `${Entry.mediaFilePath}media/keyboard_workspace_widget.png`;

        this.optionGroup.on('mousedown', (e) => e.stopPropagation());
        this.optionGroup.css({ left: x, top: y });
    };

    p.destroyOption = function(skipCommand, forceCommand) {
        const _destroyFunc = _.partial(_.result, _, 'destroy');
        const _removeFunc = _.partial(_.result, _, 'remove');

        _destroyFunc(this.disposeEvent);
        delete this.disposeEvent;

        _removeFunc(this.optionGroup);
        delete this.optionGroup;

        this._optionVisible = false;
        this._isEditing = false;
        this.command(forceCommand);

        _destroyFunc(this.keyPressed);
        delete this.keyPressed;
    };

    p._keyboardControl = function(event) {
        event.stopPropagation && event.stopPropagation();
        event.preventDefault && event.preventDefault();
        if (!this._optionVisible) {
            return;
        }

        const value = event.keyCode;
        const text = Entry.getKeyCodeMap()[value];
        if (text !== undefined) {
            this.applyValue(text, value, false, true);
        }
    };

    p.applyValue = function(text, value, skipCommand, forceCommand) {
        this.setValue(String(value));
        this._setTextValue();
        this.resize();
        this.destroyOption(skipCommand, forceCommand);
    };

    p.resize = function() {
        const width = this.getTextWidth() + 1;
        this._header.attr({ width });
        this.box.set({ width });
        this._blockView.dAlignContent();
    };

    p.getTextWidth = function() {
        return this.textElement.getComputedTextLength() + X_PADDING;
    };

    p.destroy = function() {
        this.destroyOption();
        Entry.keyPressed && _.result(this.keyPressed, 'destroy');
    };

    p._setTextValue = function() {
        let value = this.getValue();
        value = this._convert(Entry.getKeyCodeMap()[value], value);
        this.textElement.textContent = _.isUndefined(value) ? Lang.Blocks.no_target : value;
    };
})(Entry.FieldKeyboard.prototype);
