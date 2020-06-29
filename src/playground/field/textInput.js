/*
 */
'use strict';

/*
 *
 */
Entry.FieldTextInput = function(content, blockView, index) {
    this._blockView = blockView;
    this._block = blockView.block;

    this.box = new Entry.BoxModel();

    this.svgGroup = null;

    this.position = content.position;
    this._contents = content;
    this._isClearBG = content.clearBG || false;
    this._index = index;
    this.value = this.getValue() || '';
    this._CONTENT_HEIGHT = this.getContentHeight();
    this._font_size = 12;
    this._neighborFields = null;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldTextInput);

(function(p) {
    var X_PADDING = 6,
        TEXT_Y_PADDING = 4;

    p._focusNeighbor = function(direction) {
        var fields = this.getNeighborFields();

        var idx = fields.indexOf(this);
        if (direction === 'prev') {
            idx--;
        } else {
            idx++;
        }
        var field = fields[idx];

        //no field to focus
        if (!field) {
            return;
        }

        this.destroyOption(undefined, true);
        field.renderOptions(fields);
    };

    p.renderStart = function() {
        var blockView = this._blockView;

        if (!this.svgGroup) {
            this.svgGroup = blockView.contentSvgGroup.elem('g');
        }

        if (!this.textElement) {
            this.textElement = this.svgGroup.elem('text', {
                x: X_PADDING / 2,
                y: TEXT_Y_PADDING,
                fill: this._contents.color || 'black',
                'font-size': this._font_size + 'px',
            });
        }

        var contents = this._contents;
        this.svgGroup.attr({ class: 'entry-input-field' });

        this._setTextValue();

        var width = this.getTextWidth();

        var y = this.position && this.position.y ? this.position.y : 0;
        var CONTENT_HEIGHT = this._CONTENT_HEIGHT;
        y -= CONTENT_HEIGHT / 2;
        if (!this._header)
            this._header = this.svgGroup.elem('rect', {
                width,
                y,
                height: CONTENT_HEIGHT,
                rx: 3,
                ry: 3,
                fill: '#fff',
                'fill-opacity': this._isClearBG ? 0 : 0.4,
            });
        else {
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
    };

    p.renderOptions = function(neighborFields) {
        if (neighborFields) {
            this._neighborFields = neighborFields;
        }

        var that = this;

        var blockView = this._blockView;

        var func = function(skipCommand, forceCommand) {
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

        var exitKeys = [13, 27];
        this.optionGroup.on('keyup', function(e) {
            that.applyValue(e);

            if (_.contains(exitKeys, e.keyCode || e.which))
                that.destroyOption(undefined, true);
        });

        this.optionGroup.on('keydown', function(e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode === 9) {
                e.preventDefault();
                that._focusNeighbor(e.shiftKey ? 'prev' : 'next');
            }
        });

        var { x, y } = this.getAbsolutePosFromDocument();
        x += 3;
        y -= this.box.height / 2 - 1;
        this.optionGroup.css({
            height: this._CONTENT_HEIGHT,
            left: x,
            top: y,
            width: that.box.width,
        });

        this.optionGroup.focus && this.optionGroup.focus();

        var optionGroup = this.optionGroup[0];
        optionGroup.setSelectionRange(0, optionGroup.value.length, 'backward');

        this.optionDomCreated();

        //normally option group is done editing and destroyed
        //before blur called
        this.optionGroup.one('blur', () => {
            this.isEditing() && this.destroyOption(undefined, true);
        });
    };

    p.applyValue = function() {
        this.setValue(this.optionGroup.val());
        this._setTextValue();
        this.resize();
    };

    p.resize = function() {
        var obj = { width: this.getTextWidth() };

        this._header.attr(obj);
        this.optionGroup.css(obj);
        this.box.set(obj);
        this._blockView.dAlignContent();
    };

    p.getTextWidth = function() {
        return this.getTextBBox().width + X_PADDING + 2;
    };

    p._setTextValue = function() {
        var newValue = this._convert(this.getValue(), this.getValue());
        if (this.textElement.textContent !== newValue)
            this.textElement.textContent = newValue;
    };

    p.getNeighborFields = function() {
        if (!this._neighborFields) {
            var FIELD_TEXT_INPUT = Entry.FieldTextInput;
            this._neighborFields = this._block
                .getRootBlock()
                .getThread()
                .view.getFields()
                .filter((f) => f instanceof FIELD_TEXT_INPUT);
        }

        return this._neighborFields;
    };
})(Entry.FieldTextInput.prototype);
