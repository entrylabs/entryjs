/*
 *
 */
'use strict';

/*
 *
 */
Entry.Field = function() {};

(function(p) {
    p.TEXT_LIMIT_LENGTH = 20;

    p.destroy = function() {
        const svgGroup = this.svgGroup;
        if (svgGroup) {
            svgGroup._isBinded = false;
            $(svgGroup).off('.fieldBindEvent');
        }
        this.destroyOption(true);
    };

    p.command = function(forceCommand) {
        const startValue = this._startValue;
        if (
            !this._blockView.isInBlockMenu &&
            !_.isUndefined(startValue) &&
            (forceCommand || startValue !== this.getValue())
        ) {
            Entry.do(
                'setFieldValue',
                this.pointer(),
                this._nextValue || this.getValue(),
                this._code
            );
            delete this._nextValue;
            delete this._code;
        }
        delete this._startValue;
    };

    p.destroyOption = function(skipCommand, forceCommand) {
        const _destroyFunc = _.partial(_.result, _, 'destroy');
        const _removeFunc = _.partial(_.result, _, 'remove');

        _destroyFunc(this.documentDownEvent);
        delete this.documentDownEvent;

        _destroyFunc(this.disposeEvent);
        delete this.documentDownEvent;

        _removeFunc(this.optionGroup);
        delete this.optionGroup;

        delete this._neighborFields;

        this.isEditing() && Entry.Utils.blur();
        this._isEditing = false;

        skipCommand !== true && this.command(forceCommand);
    };

    p._attachDisposeEvent = function(func) {
        const that = this;

        func =
            func ||
            function(skipCommand) {
                that.destroyOption(skipCommand);
            };
        that.disposeEvent = Entry.disposeEvent.attach(that, func);
    };

    p.align = function(x, y, animate = true) {
        const svgGroup = this.svgGroup;
        if (this._position) {
            if (this._position.x) {
                x = this._position.x;
            }
            if (this._position.y) {
                y = this._position.y;
            }
        }

        const transform = `translate(${  x  },${  y  })`;

        if (animate) {
            svgGroup.animate(
                {
                    transform,
                },
                300,
                mina.easeinout
            );
        } else {
            svgGroup.attr({
                transform,
            });
        }

        this.box.set({ x, y });
    };

    //get absolute position of field from parent board
    p.getAbsolutePosFromBoard = function() {
        const blockView = this._block.view;
        const contentPos = blockView.getContentPos();
        const absPos = blockView.getAbsoluteCoordinate();

        return {
            x: absPos.x + this.box.x + contentPos.x,
            y: absPos.y + this.box.y + contentPos.y,
        };
    };

    //get absolute position of field from parent document
    p.getAbsolutePosFromDocument = function() {
        const blockView = this._block.view;
        const board = blockView.getBoard();
        const { scale = 1 } = board || {};
        const contentPos = blockView.getContentPos();
        const absPos = blockView.getAbsoluteCoordinate();
        const offset = blockView.getBoard().svgDom.offset();
        return {
            x: absPos.x + this.box.x + contentPos.x * scale + offset.left,
            y: absPos.y + this.box.y + contentPos.y + offset.top - $(window).scrollTop(),
        };
    };

    //get relative position of field from blockView origin
    p.getRelativePos = function() {
        const contentPos = this._block.view.getContentPos();
        const { x, y } = this.box;

        return {
            x: x + contentPos.x,
            y: y + contentPos.y,
        };
    };

    p.truncate = function() {
        const value = String(this._convert(this.getValue()));
        const limit = this.TEXT_LIMIT_LENGTH;
        let ret = value.substring(0, limit);
        if (value.length > limit) {
            ret += '...';
        }
        return ret;
    };

    p.appendSvgOptionGroup = function() {
        return this._block.view.getBoard().svgGroup.elem('g');
    };

    p.getValue = function() {
        let data = this._block.params[this._index];

        const contents = this._contents;

        if (contents && !_.isEmpty(contents.reference)) {
            const reference = contents.reference.concat();
            if (reference[0][0] === '%') {
                data = this._block.params[parseInt(reference.shift().substr(1)) - 1];
            }
            if (!data) {
                return data;
            }

            return data.getDataByPointer(reference);
        } else {
            return data;
        }
    };

    p.setValue = function(value, reDraw) {
        if (this.value == value) {
            return;
        }

        this.value = value;

        const contents = this._contents;

        if (contents && !_.isEmpty(contents.reference)) {
            const ref = contents.reference.concat();
            const index = ref.pop();
            let targetBlock = this._block.params[this._index];
            if (ref.length && ref[0][0] === '%') {
                targetBlock = this._block.params[parseInt(ref.shift().substr(1)) - 1];
            }
            if (ref.length) {
                targetBlock = targetBlock.getDataByPointer(ref);
            }
            targetBlock.params[index] = value;
        } else {
            this._block.params[this._index] = value;
        }

        if (reDraw) {
            this._blockView.reDraw();
        }
    };

    p._isEditable = function() {
        if (Entry.ContextMenu.visible || this._blockView.getBoard().readOnly) {
            return false;
        }
        const dragMode = this._block.view.dragMode;
        if (dragMode == Entry.DRAG_MODE_DRAG) {
            return false;
        }
        const blockView = this._block.view;
        const board = blockView.getBoard();
        if (board.disableMouseEvent === true) {
            return false;
        }

        const selectedBlockView = board.workspace.selectedBlockView;

        if (!selectedBlockView || board != selectedBlockView.getBoard()) {
            return false;
        }

        const root = blockView.getSvgRoot();

        return root == selectedBlockView.svgGroup || $(root).has($(blockView.svgGroup));
    };

    p._selectBlockView = function() {
        const blockView = this._block.view;
        blockView.getBoard().setSelectedBlock(blockView);
    };

    p._bindRenderOptions = function() {
        if (this.svgGroup._isBinded) {
            return;
        }

        const that = this;

        this.svgGroup._isBinded = true;
        $(this.svgGroup).on('mouseup.fieldBindEvent touchend.fieldBindEvent', function(e) {
            if (that._isEditable()) {
                that._code = that.getCode();
                that.destroyOption();
                that._startValue = that.getValue();
                that.renderOptions();
                that._isEditing = true;
            }
        });
    };

    p.pointer = function(pointer = []) {
        return this._block.pointer([Entry.PARAM, this._index, ...pointer]);
    };

    p.getFontSize = function(size) {
        return size || this._blockView.getSkeleton().fontSize || 10;
    };

    p.getContentHeight = function() {
        return 20;
    };

    p._getRenderMode = function() {
        const mode = this._blockView.renderMode;
        return mode !== undefined ? mode : Entry.BlockView.RENDER_MODE_BLOCK;
    };

    p._convert = function(key, value) {
        value = value !== undefined ? value : this.getValue();
        const reg = /&value/gm;
        if (reg.test(value)) {
            return value.replace(reg, '');
        } else if (this._contents.converter) {
            return this._contents.converter(key, value);
        } else {
            return key;
        }
    };

    p._updateOptions = function() {
        const block = Entry.block[this._blockView.type];
        if (!block) {
            return;
        }

        const syntaxes = block.syntax;

        for (const key in syntaxes) {
            const syntax = syntaxes[key];
            if (!syntax) {
                continue;
            }
            if (syntax.length === 0) {
                continue;
            }

            const textParams = syntax[0].textParams;
            if (!textParams) {
                continue;
            }

            textParams[this._index].options = this._contents.options;
        }
    };

    p._shouldReturnValue = function(value) {
        const obj = this._block.getCode().object;
        return value === '?' || !obj || obj.constructor !== Entry.EntryObject;
    };

    p.isEditing = function(value) {
        return !!this._isEditing;
    };

    p.getDom = function(query) {
        if (_.isEmpty(query)) {
            return this.svgGroup;
        }

        query = [...query];

        const key = query.shift();
        if (key === 'option') {
            return this.optionGroup;
        }

        //default return value
        return this.svgGroup;
    };

    p.optionDomCreated = function() {
        this._blockView.getBoard().workspace.widgetUpdateEvent.notify();
    };

    p.fixNextValue = function(value) {
        this._nextValue = value;
    };

    p.getFieldRawType = function() {
        if (this instanceof Entry.FieldTextInput) {
            return 'textInput';
        } else if (this instanceof Entry.FieldDropdown) {
            return 'dropdown';
        } else if (this instanceof Entry.FieldDropdownDynamic) {
            return 'dropdownDynamic';
        } else if (this instanceof Entry.FieldKeyboard) {
            return 'keyboard';
        }
    };

    p.getTextValueByValue = function(value) {
        switch (this.getFieldRawType()) {
            case 'keyboard':
                return Entry.getKeyCodeMap()[value];
            case 'dropdown':
            case 'dropdownDynamic':
                return _.chain(this._contents.options)
                    .find(([, optionValue]) => {
                        return optionValue === value
                        ;
                    })
                    .head()
                    .value();
            case 'textInput':
                return value;
        }
    };

    p.getBoard = function() {
        return _.result(this._blockView, 'getBoard');
    };

    p.getCode = function() {
        return _.result(this.getBoard(), 'code');
    };

    p.getTextValue = function() {
        return this.getValue();
    };

    p.getIndex = function() {
        return this._index;
    };

    p.getTextBBox = (function() {
        const _cache = {};
        let svg;

        //make invisible svg dom to body
        //in order to calculate text width
        function generateDom() {
            svg = Entry.Dom(
                $(
                    '<svg id="invisibleBoard" class="entryBoard" width="1px" height="1px"' +
                        'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'
                ),
                { parent: $('body') }
            );
        }

        const clearDoms = Entry.Utils.debounce(function() {
            if (!svg) {
                return;
            }
            $(svg).empty();
        }, 500);

        return function() {
            if (window.fontLoaded && !svg) {
                generateDom();
            }

            const value = this.getTextValue();

            //empty string check
            if (!value) {
                return { width: 0, height: 0 };
            }

            const fontSize = this._font_size || '';

            const key = `${value  }&&${  fontSize}`;
            let bBox = _cache[key];

            if (bBox) {
                return bBox;
            }

            let textElement = this.textElement;
            if (svg) {
                textElement = textElement.cloneNode(true);
                svg.append(textElement);
            }

            bBox = textElement.getBoundingClientRect();
            clearDoms();
            const board = this._blockView.getBoard();
            const { scale = 1 } = board;
            bBox = {
                width: Math.round(bBox.width * 100) / 100 / scale,
                height: Math.round(bBox.height * 100) / 100 / scale,
            };

            if (fontSize && window.fontLoaded && bBox.width && bBox.height) {
                _cache[key] = bBox;
            }
            return bBox;
        };
    })();
})(Entry.Field.prototype);
