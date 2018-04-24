/**
 * @fileoverview Variable object for entry variable block.
 */
'use strict';

/**
 * Block variable constructor
 * @param {variable model} variable
 * @constructor
 */
Entry.Variable = function(variable) {
    Entry.assert(
        typeof variable.name == 'string',
        'Variable name must be given'
    );
    /** @type {string} */
    this.name_ = variable.name;
    /** @type {string} */
    this.id_ = variable.id ? variable.id : Entry.generateHash();
    this.type = variable.variableType ? variable.variableType : 'variable';
    /** @type {entry object.id} */
    this.object_ = variable.object || null;
    /** @type {boolean} */
    this.isCloud_ = variable.isCloud || false;

    this._nameWidth = null;
    this._valueWidth = null;

    /** @type {number||string} */
    var parsedValue = Entry.parseNumber(variable.value);
    if (typeof parsedValue == 'number') this.value_ = parsedValue;
    else if (!variable.value) this.value_ = 0;
    else this.value_ = variable.value;

    if (this.type == 'slide') {
        this.setMinValue(variable.minValue);
        this.setMaxValue(variable.maxValue);
    } else if (this.type == 'list')
        this.array_ = variable.array ? variable.array : [];

    if (!variable.isClone) {
        /** @type {boolean} */
        this.visible_ =
            variable.visible || typeof variable.visible == 'boolean'
                ? variable.visible
                : true;
        /** @type {number} */
        this.x_ = variable.x ? variable.x : null;
        /** @type {number} */
        this.y_ = variable.y ? variable.y : null;
        if (this.type == 'list') {
            this.width_ = variable.width ? variable.width : 100;
            this.height_ = variable.height ? variable.height : 120;
            this.scrollPosition = 0;
        }

        this.BORDER = 6;
        this.FONT = '10pt NanumGothic';
    }

    Entry.addEventListener('workspaceChangeMode', this.updateView.bind(this));
};

/**
 * Generate variable view on canvas
 * @param {number} variableIndex index of this variable for render position
 */
Entry.Variable.prototype.generateView = function(variableIndex) {
    var type = this.type;
    if (type == 'variable' || type == 'timer' || type == 'answer') {
        this.view_ = new createjs.Container();
        this.rect_ = new createjs.Shape();
        this.view_.addChild(this.rect_);
        this.view_.variable = this;
        this.wrapper_ = new createjs.Shape();
        this.view_.addChild(this.wrapper_);
        this.textView_ = new createjs.Text('asdf', this.FONT, '#000000');
        this.textView_.textBaseline = 'alphabetic';
        this.textView_.x = 4;
        this.textView_.y = 1;
        this.view_.addChild(this.textView_);
        this.valueView_ = new createjs.Text(
            'asdf',
            '10pt NanumGothic',
            '#ffffff'
        );
        this.valueView_.textBaseline = 'alphabetic';
        var variableLength = Entry.variableContainer.variables_.length;
        if (this.getX() && this.getY()) {
            this.setX(this.getX());
            this.setY(this.getY());
        } else {
            //TODO
            this.setX(10 - 240 + Math.floor((variableLength % 66) / 11) * 80);
            this.setY(
                variableIndex * 24 +
                    20 -
                    135 -
                    Math.floor(variableLength / 11) * 264
            );
        }
        this.view_.visible = this.visible_;
        this.view_.addChild(this.valueView_);

        this.view_.on('mousedown', function(evt) {
            if (Entry.type != 'workspace') return;
            this.offset = {
                x: this.x - (evt.stageX * 0.75 - 240),
                y: this.y - (evt.stageY * 0.75 - 135),
            };
            this.cursor = 'move';
        });

        this.view_.on('pressmove', function(evt) {
            if (Entry.type != 'workspace') return;
            this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
            this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
            this.variable.updateView();
        });
    } else if (type == 'slide') {
        var slide = this;
        this.view_ = new createjs.Container();
        this.rect_ = new createjs.Shape();
        this.view_.addChild(this.rect_);
        this.view_.variable = this;
        this.wrapper_ = new createjs.Shape();
        this.view_.addChild(this.wrapper_);
        this.textView_ = new createjs.Text('name', this.FONT, '#000000');
        this.textView_.textBaseline = 'alphabetic';
        this.textView_.x = 4;
        this.textView_.y = 1;
        this.view_.addChild(this.textView_);
        this.valueView_ = new createjs.Text(
            'value',
            '10pt NanumGothic',
            '#ffffff'
        );
        this.valueView_.textBaseline = 'alphabetic';
        this.view_.on('mousedown', function(evt) {
            if (Entry.type != 'workspace') return;
            this.offset = {
                x: this.x - (evt.stageX * 0.75 - 240),
                y: this.y - (evt.stageY * 0.75 - 135),
            };
        });

        this.view_.on('pressmove', function(evt) {
            if (Entry.type != 'workspace' || slide.isAdjusting) return;
            this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
            this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
            this.variable.updateView();
        });
        this.view_.visible = this.visible_;
        this.view_.addChild(this.valueView_);

        var width =
            this.textView_.getMeasuredWidth() +
            this.valueView_.getMeasuredWidth() +
            26;
        width = Math.max(width, 90);
        this.maxWidth = width - 20;

        this.slideBar_ = new createjs.Shape();
        this.slideBar_.graphics
            .beginFill('#A0A1A1')
            .s('#A0A1A1')
            .ss(1)
            .dr(10, 10, this.maxWidth, 1.5);
        this.view_.addChild(this.slideBar_);

        var position = this.getSlidePosition(this.maxWidth);
        this.valueSetter_ = new createjs.Shape();
        this.valueSetter_.graphics
            .beginFill('#1bafea')
            .s('#A0A1A1')
            .ss(1)
            .dc(position, 10 + 0.5, 3);
        this.valueSetter_.cursor = 'pointer';
        this.valueSetter_.on('mousedown', function(evt) {
            if (!Entry.engine.isState('run')) return;

            slide.isAdjusting = true;
            this.offsetX = -(this.x - evt.stageX * 0.75 + 240);
        });

        this.valueSetter_.on('pressmove', function(evt) {
            if (!Entry.engine.isState('run')) return;

            var oldOffsetX = this.offsetX;
            this.offsetX = -(this.x - evt.stageX * 0.75 + 240);
            if (oldOffsetX === this.offsetX) return;
            var slideX = slide.getX();
            var value;
            if (slideX + 10 > this.offsetX) value = 0;
            else if (slideX + slide.maxWidth + 10 > this.offsetX)
                value = this.offsetX - slideX;
            else value = slide.maxWidth + 10;
            slide.setSlideCommandX(value);
        });
        this.valueSetter_.on('pressup', function(evt) {
            slide.isAdjusting = false;
        });
        this.view_.addChild(this.valueSetter_);
        var variableLength = Entry.variableContainer.variables_.length;
        if (this.getX() && this.getY()) {
            this.setX(this.getX());
            this.setY(this.getY());
        } else {
            this.setX(10 - 240 + Math.floor(variableLength / 11) * 80);
            this.setY(
                variableIndex * 24 +
                    20 -
                    135 -
                    Math.floor(variableLength / 11) * 264
            );
        }
    } else {
        this.view_ = new createjs.Container();
        this.rect_ = new createjs.Shape();
        this.view_.addChild(this.rect_);
        this.view_.variable = this;
        this.titleView_ = new createjs.Text('asdf', this.FONT, '#000');
        this.titleView_.textBaseline = 'alphabetic';
        this.titleView_.textAlign = 'center';
        this.titleView_.width = this.width_ - 2 * this.BORDER;
        this.titleView_.y = this.BORDER + 10;
        this.titleView_.x = this.width_ / 2;
        this.view_.addChild(this.titleView_);

        this.resizeHandle_ = new createjs.Shape();
        this.resizeHandle_.graphics
            .f('#1bafea')
            .ss(1, 0, 0)
            .s('#1bafea')
            .lt(0, -9)
            .lt(-9, 0)
            .lt(0, 0);
        this.view_.addChild(this.resizeHandle_);

        this.resizeHandle_.list = this;

        this.resizeHandle_.on('mouseover', function(evt) {
            this.cursor = 'nwse-resize';
        });

        this.resizeHandle_.on('mousedown', function(evt) {
            // if(Entry.type != 'workspace') return;
            this.list.isResizing = true;
            this.offset = {
                x: evt.stageX * 0.75 - this.list.getWidth(),
                y: evt.stageY * 0.75 - this.list.getHeight(),
            };
            this.parent.cursor = 'nwse-resize';
        });
        this.resizeHandle_.on('pressmove', function(evt) {
            // if(Entry.type != 'workspace') return;
            this.list.setWidth(evt.stageX * 0.75 - this.offset.x);
            this.list.setHeight(evt.stageY * 0.75 - this.offset.y);
            this.list.updateView();
        });

        this.view_.on('mouseover', function(evt) {
            this.cursor = 'move';
        });

        this.view_.on('mousedown', function(evt) {
            if (Entry.type != 'workspace' || this.variable.isResizing) return;
            this.offset = {
                x: this.x - (evt.stageX * 0.75 - 240),
                y: this.y - (evt.stageY * 0.75 - 135),
            };
            this.cursor = 'move';
        });

        this.view_.on('pressup', function(evt) {
            this.cursor = 'initial';
            this.variable.isResizing = false;
        });

        this.view_.on('pressmove', function(evt) {
            if (Entry.type != 'workspace' || this.variable.isResizing) return;
            this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
            this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
            this.variable.updateView();
        });

        this.elementView = new createjs.Container();
        var indexView = new createjs.Text('asdf', this.FONT, '#000');
        indexView.textBaseline = 'middle';
        indexView.y = 5;
        this.elementView.addChild(indexView);
        this.elementView.indexView = indexView;
        var valueWrapper = new createjs.Shape();
        this.elementView.addChild(valueWrapper);
        this.elementView.valueWrapper = valueWrapper;
        var valueView = new createjs.Text('fdsa', this.FONT, '#eee');
        valueView.x = 24;
        valueView.y = 6;
        valueView.textBaseline = 'middle';
        this.elementView.addChild(valueView);
        this.elementView.valueView = valueView;
        this.elementView.x = this.BORDER;

        this.scrollButton_ = new createjs.Shape();
        this.scrollButton_.graphics.f('#aaa').rr(0, 0, 7, 30, 3.5);
        this.view_.addChild(this.scrollButton_);
        this.scrollButton_.y = 23;

        this.scrollButton_.list = this;
        this.scrollButton_.on('mousedown', function(evt) {
            // if(Entry.type != 'workspace') return;
            this.list.isResizing = true;
            this.cursor = 'pointer';
            this.offsetY =
                !Entry.Utils.isNumber(this.offsetY) || this.offsetY < 0
                    ? evt.rawY / 2
                    : this.offsetY;
        });
        this.scrollButton_.on('pressmove', function(evt) {
            // if(Entry.type != 'workspace') return;
            if (this.moveAmount === undefined) {
                this.y = evt.target.y;
                this.moveAmount = true;
            } else {
                this.y =
                    evt.rawY / 2 -
                    this.offsetY +
                    23 * (this.list.height_ / 100);
            }

            if (this.y < 23) this.y = 23;
            if (this.y > this.list.getHeight() - 40)
                this.y = this.list.getHeight() - 40;
            this.list.updateView();
        });

        this.scrollButton_.on('pressup', function(evt) {
            this.moveAmount = undefined;
        });
        if (this.getX() && this.getY()) {
            this.setX(this.getX());
            this.setY(this.getY());
        } else {
            var listLength = Entry.variableContainer.lists_.length;
            this.setX(-Math.floor((listLength % 24) / 6) * 110 + 120);
            this.setY(
                variableIndex * 24 + 20 - 135 - Math.floor(listLength / 6) * 145
            );
        }
    }

    this.setVisible(this.isVisible());

    this.updateView();

    Entry.stage.loadVariable(this);
};

/**
 * Update this.view_
 */
Entry.Variable.prototype.updateView = function() {
    if (!this.view_) return;

    if (this.isVisible()) {
        if (this.type == 'variable') {
            this.view_.x = this.getX();
            this.view_.y = this.getY();
            var oldContent = this.textView_.text;
            var newContent;
            if (this.object_) {
                var obj = Entry.container.getObject(this.object_);
                if (obj) newContent = obj.name + ':' + this.getName();
                else newContent = this.getName();
            } else newContent = this.getName();

            if (oldContent !== newContent) {
                this.textView_.text = newContent;
                this._nameWidth = null;
            }

            if (this.isNumber()) {
                if (this.value_[0] !== 0 && Entry.isInteger(this.value_))
                    this.valueView_.text = '' + this.getValue();
                else
                    this.valueView_.text = Number(this.getValue())
                        .toFixed(2)
                        .replace('.00', '');
            } else {
                this.valueView_.text = this.getValue();
            }

            if (this._nameWidth === null)
                this._nameWidth = this.textView_.getMeasuredWidth();
            this.valueView_.x = this._nameWidth + 14;
            this.valueView_.y = 1;
            // INFO: Number체크는 slide 일때만 하도록 처리 기본 문자로 처리함(#4876)

            if (this._valueWidth === null)
                this._valueWidth = this.valueView_.getMeasuredWidth();
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s('#A0A1A1')
                .rc(
                    0,
                    -14,
                    this._nameWidth + this._valueWidth + 26,
                    20,
                    4,
                    4,
                    4,
                    4
                );
            this.wrapper_.graphics
                .clear()
                .f('#1bafea')
                .ss(1, 2, 0)
                .s('#1bafea')
                .rc(
                    this._nameWidth + 7,
                    -11,
                    this._valueWidth + 15,
                    14,
                    7,
                    7,
                    7,
                    7
                );
        } else if (this.type == 'slide') {
            this.view_.x = this.getX();
            this.view_.y = this.getY();
            var oldContent = this.textView_.text;
            var newContent;
            if (this.object_) {
                var obj = Entry.container.getObject(this.object_);
                if (obj) newContent = obj.name + ':' + this.getName();
                else newContent = this.getName();
            } else newContent = this.getName();

            if (oldContent !== newContent) {
                this.textView_.text = newContent;
                this._nameWidth = null;
            }

            if (this._nameWidth === null)
                this._nameWidth = this.textView_.getMeasuredWidth();
            this.valueView_.x = this._nameWidth + 14;
            this.valueView_.y = 1;
            var value = String(this.getValue());

            if (this.isFloatPoint()) {
                var reg = /\.(.*)/;

                //check the value is float
                var ret = reg.exec(value);
                if (!ret) value += '.00';
                else {
                    while (reg.exec(value)[1].length < 2) value += '0';
                }
            }

            this.valueView_.text = value;

            if (this._valueWidth === null)
                this._valueWidth = this.valueView_.getMeasuredWidth();
            var width = this._nameWidth + this._valueWidth + 26;
            width = Math.max(width, 90);
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s('#A0A1A1')
                .rc(0, -14, width, 33, 4, 4, 4, 4);
            this.wrapper_.graphics
                .clear()
                .f('#1bafea')
                .ss(1, 2, 0)
                .s('#1bafea')
                .rc(
                    this._nameWidth + 7,
                    -11,
                    this._valueWidth + 15,
                    14,
                    7,
                    7,
                    7,
                    7
                );

            var width = this._nameWidth + this._valueWidth + 26;
            width = Math.max(width, 90);
            this.maxWidth = width - 20;

            this.slideBar_.graphics
                .clear()
                .beginFill('#A0A1A1')
                .s('#A0A1A1')
                .ss(1)
                .dr(10, 10, this.maxWidth, 1.5);
            var position = this.getSlidePosition(this.maxWidth);
            this.valueSetter_.graphics
                .clear()
                .beginFill('#1bafea')
                .s('#A0A1A1')
                .ss(1)
                .dc(position, 10 + 0.5, 3);
        } else if (this.type == 'list') {
            this.view_.x = this.getX();
            this.view_.y = this.getY();
            this.resizeHandle_.x = this.width_ - 2;
            this.resizeHandle_.y = this.height_ - 2;
            var arr = this.array_;

            var name = this.getName();
            if (this.object_) {
                var obj = Entry.container.getObject(this.object_);
                if (obj) name = obj.name + ':' + name;
            }

            this.titleView_.text = name;
            if (this.titleView_.getMeasuredWidth() > this.width_) {
                name = name + '..';
                while (this.titleView_.getMeasuredWidth() > this.width_) {
                    name = name.substr(0, name.length - 3) + '..';
                    this.titleView_.text = name;
                }
            }
            this.titleView_.x = this.width_ / 2;
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s('#A0A1A1')
                .rect(0, 0, this.width_, this.height_);

            while (this.view_.children[4])
                this.view_.removeChild(this.view_.children[4]);
            var maxView = Math.floor((this.getHeight() - 20) / 20);

            var isOverFlow = maxView < arr.length;
            var totalWidth = this.getWidth();
            var wrapperWidth =
                totalWidth - 2 * this.BORDER - (isOverFlow ? 30 : 20);

            if (isOverFlow) {
                if (this.scrollButton_.y > this.getHeight() - 40)
                    this.scrollButton_.y = this.getHeight() - 40;
                this.elementView.valueWrapper.graphics
                    .clear()
                    .f('#1bafea')
                    .rr(20, -2, wrapperWidth, 17, 2);
                this.scrollButton_.x = totalWidth - 12;
                this.scrollPosition = Math.floor(
                    (this.scrollButton_.y - 23) /
                        (this.getHeight() - 23 - 40) *
                        (arr.length - maxView)
                );
            } else {
                this.elementView.valueWrapper.graphics
                    .clear()
                    .f('#1bafea')
                    .rr(20, -2, wrapperWidth, 17, 2);
                this.scrollPosition = 0;
            }
            this.scrollButton_.visible = isOverFlow;

            var _cache = {};
            //because of min Width of list
            //maxLen can not be under 3
            //so start from 3
            var maxLen = 3;
            wrapperWidth -= 6;

            for (
                var i = this.scrollPosition;
                i < this.scrollPosition + maxView && i < arr.length;
                i++
            ) {
                if (
                    Entry.getMainWS() &&
                    Entry.getMainWS().getMode() ===
                        Entry.Workspace.MODE_VIMBOARD
                )
                    this.elementView.indexView.text = i;
                else this.elementView.indexView.text = i + 1;

                var text = String(arr[i].data);
                var valueView = this.elementView.valueView;
                var cachedText = _cache[text.substr(0, 150)];

                if (cachedText) valueView.text = cachedText;
                else {
                    var execText = text.substr(0, maxLen);
                    var charIndex = maxLen;

                    valueView.text = text;

                    if (valueView.getMeasuredWidth() > wrapperWidth) {
                        valueView.text = execText;

                        while (
                            valueView.getMeasuredWidth() < wrapperWidth &&
                            text[charIndex] !== undefined
                        ) {
                            execText += text[charIndex++];
                            valueView.text = execText;
                        }

                        var subCnt = 1;
                        while (valueView.getMeasuredWidth() > wrapperWidth) {
                            execText =
                                execText.substr(0, execText.length - subCnt) +
                                '..';
                            valueView.text = execText;
                            subCnt = 3;
                        }
                    } else execText = text;

                    _cache[text.substr(0, 150)] = execText;
                    maxLen = Math.max(execText.length, maxLen);
                }

                var view = this.elementView.clone(true);
                view.y = (i - this.scrollPosition) * 20 + 23;
                this.view_.addChild(view);
            }
        } else if (this.type == 'answer') {
            this.view_.x = this.getX();
            this.view_.y = this.getY();
            this.textView_.text = this.getName();
            this.valueView_.y = 1;
            if (this.isNumber()) {
                var v = Number(this.getValue());
                if (parseInt(this.getValue(), 10) == this.getValue())
                    this.valueView_.text = v;
                else
                    this.valueView_.text = Number(v)
                        .toFixed(1)
                        .replace('.00', '');
            } else {
                this.valueView_.text = this.getValue();
            }
            if (this._nameWidth === null)
                this._nameWidth = this.textView_.getMeasuredWidth();
            if (this._valueWidth === null)
                this._valueWidth = this.valueView_.getMeasuredWidth();

            this.valueView_.x = this._nameWidth + 14;
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s('#A0A1A1')
                .rc(
                    0,
                    -14,
                    this._nameWidth + this._valueWidth + 26,
                    20,
                    4,
                    4,
                    4,
                    4
                );
            this.wrapper_.graphics
                .clear()
                .f('#E457DC')
                .ss(1, 2, 0)
                .s('#E457DC')
                .rc(
                    this._nameWidth + 7,
                    -11,
                    this._valueWidth + 15,
                    14,
                    7,
                    7,
                    7,
                    7
                );
        } else {
            this.view_.x = this.getX();
            this.view_.y = this.getY();
            this.textView_.text = this.getName();

            if (this._nameWidth === null)
                this._nameWidth = this.textView_.getMeasuredWidth();

            this.valueView_.x = this._nameWidth + 14;
            this.valueView_.y = 1;
            if (this.isNumber())
                this.valueView_.text = Number(this.getValue())
                    .toFixed(1)
                    .replace('.00', '');
            else this.valueView_.text = this.getValue();

            if (this._valueWidth === null)
                this._valueWidth = this.valueView_.getMeasuredWidth();

            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s('#A0A1A1')
                .rc(
                    0,
                    -14,
                    this._nameWidth + this._valueWidth + 26,
                    20,
                    4,
                    4,
                    4,
                    4
                );
            this.wrapper_.graphics
                .clear()
                .f('#ffbb14')
                .ss(1, 2, 0)
                .s('orange')
                .rc(
                    this._nameWidth + 7,
                    -11,
                    this._valueWidth + 15,
                    14,
                    7,
                    7,
                    7,
                    7
                );
        }
    }
    Entry.requestUpdate = true;
};

/**
 * Variable name getter
 * @return {string}
 */
Entry.Variable.prototype.getName = function() {
    return this.name_;
};

/**
 * Variable name setter
 * @param {!string} variableName
 */
Entry.Variable.prototype.setName = function(variableName) {
    Entry.assert(
        typeof variableName == 'string',
        'Variable name must be string'
    );
    this.name_ = variableName;
    this._nameWidth = null;
    this.updateView();
    Entry.requestUpdateTwice = true;
};

/**
 * Variable id getter
 * @return {string}
 */
Entry.Variable.prototype.getId = function() {
    return this.id_;
};

/**
 * Variable value getter
 * @return {number}
 */
Entry.Variable.prototype.getValue = function() {
    // INFO: Number체크는 slide 일때만 하도록 처리 기본 문자로 처리함(#4876)
    if (this.type === 'slide' && this.isNumber()) return Number(this.value_);
    else return this.value_;
};

/**
 * Verify value is number
 * @return {boolean}
 */
Entry.Variable.prototype.isNumber = function() {
    return Entry.Utils.isNumber(this.value_);
};

/**
 * Variable value setter
 * @param {!string} variableValue
 */
Entry.Variable.prototype.setValue = function(value) {
    if (this.type != 'slide') this.value_ = value;
    else {
        value = Number(value);
        if (value < this.minValue_) this.value_ = this.minValue_;
        else if (value > this.maxValue_) this.value_ = this.maxValue_;
        else this.value_ = value;
    }

    this._valueWidth = null;
    this.updateView();
    Entry.requestUpdateTwice = true;
};

/**
 * Variable visible state getter
 * @return {boolean}
 */
Entry.Variable.prototype.isVisible = function() {
    return this.visible_;
};

/**
 * Variable visible state setter
 * @param {!string} visibleState
 */
Entry.Variable.prototype.setVisible = function(visibleState) {
    Entry.assert(
        typeof visibleState == 'boolean',
        'Variable visible state must be boolean'
    );
    if (this.visible === visibleState) return;
    this.view_.visible = visibleState;
    this.visible_ = visibleState;
    this.updateView();
};

/**
 * X coordinate setter
 * @param {number} x
 */
Entry.Variable.prototype.setX = function(x) {
    /** @type {number} */
    this.x_ = x;
    this.updateView();
};

/**
 * X coordinate getter
 * @return {number}
 */
Entry.Variable.prototype.getX = function() {
    return this.x_;
};

/**
 * Y coordinate setter
 * @param {number} y
 */
Entry.Variable.prototype.setY = function(y) {
    /** @type {number} */
    this.y_ = y;
    this.updateView();
};

/**
 * Y coordinate getter
 * @return {number}
 */
Entry.Variable.prototype.getY = function() {
    return this.y_;
};

/**
 * width setter
 * @param {number} width
 */
Entry.Variable.prototype.setWidth = function(width) {
    /** @type {number} */
    width = width < 100 ? 100 : width;
    this.width_ = width;
    this.updateView();
};

/**
 * width getter
 * @return {number}
 */
Entry.Variable.prototype.getWidth = function() {
    return this.width_;
};

Entry.Variable.prototype.isInList = function(x, y) {
    var xArea = this.getX() + this.width_;
    var yArea = this.getY() + this.height_;
    // if(Entry.engine.state == 'stop' && this.type== 'list');
};

/**
 * height setter
 * @param {number} height
 */
Entry.Variable.prototype.setHeight = function(height) {
    /** @type {number} */
    height = height < 100 ? 100 : height;
    this.height_ = height;
    this.updateView();
};

/**
 * height getter
 * @return {number}
 */
Entry.Variable.prototype.getHeight = function() {
    return this.height_;
};

/**
 * save current state data to 'snapshot_'
 */
Entry.Variable.prototype.takeSnapshot = function() {
    this.snapshot_ = this.toJSON();
};

/**
 * load snapshot to current variable
 */
Entry.Variable.prototype.loadSnapshot = function() {
    this.snapshot_ && this.syncModel_(this.snapshot_);
    delete this.snapshot_;
};

/**
 * sync this model with parameter
 * @param {!entity model}
 * @private
 */
Entry.Variable.prototype.syncModel_ = function(variableModel) {
    var isCloud = this.isCloud_;
    if (this.type == 'list') {
        if (!isCloud) this.array_ = variableModel.array;
        this.setWidth(variableModel.width);
        this.setHeight(variableModel.height);
    }
    if (!isCloud) this.setValue(variableModel.value);

    this.setName(variableModel.name);
    this.setX(variableModel.x);
    this.setY(variableModel.y);
    this.setVisible(variableModel.visible);
    this.isCloud_ = variableModel.isCloud;
};

/**
 * convert this variable's data to JSON.
 * @return {JSON}
 */
Entry.Variable.prototype.toJSON = function() {
    var json = {};
    json.name = this.name_;
    json.id = this.id_;
    json.visible = this.visible_;
    json.value = this.value_;
    json.variableType = this.type;
    if (this.type == 'list') {
        json.width = this.getWidth();
        json.height = this.getHeight();
        json.array = JSON.parse(JSON.stringify(this.array_));
    } else if (this.type == 'slide') {
        json.minValue = this.minValue_;
        json.maxValue = this.maxValue_;
    }
    json.isCloud = this.isCloud_;
    json.object = this.object_;
    json.x = this.x_;
    json.y = this.y_;
    return json;
};

/**
 * Remove self
 */
Entry.Variable.prototype.remove = function() {
    //this.parent.dialog = null;
    Entry.stage.removeVariable(this);
};

/**
 * clone self
 */
Entry.Variable.prototype.clone = function() {
    var variable = this.toJSON();
    variable.isClone = true;
    variable = new Entry.Variable(variable);
    return variable;
};

Entry.Variable.prototype.getType = function() {
    return this.type;
};

Entry.Variable.prototype.setType = function(type) {
    this.type = type;
};

Entry.Variable.prototype.getSlidePosition = function(width) {
    var minValue = this.minValue_;
    var maxValue = this.maxValue_;
    var value = this.value_;
    var ratio = Math.abs(value - minValue) / Math.abs(maxValue - minValue);
    return width * ratio + 10;
};

Entry.Variable.prototype.setSlideCommandX = function(value) {
    var command = this.valueSetter_.graphics.command;
    value = typeof value == 'undefined' ? 10 : value;
    value = Math.max(value, 10);
    value = Math.min(this.maxWidth + 10, value);
    command.x = value;
    this.updateSlideValueByView();
};

Entry.Variable.prototype.updateSlideValueByView = function() {
    var maxWidth = this.maxWidth;
    var position = Math.max(this.valueSetter_.graphics.command.x - 10, 0);
    var ratio = position / maxWidth;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;

    var minValue = parseFloat(this.minValue_);
    var maxValue = parseFloat(this.maxValue_);

    var value = (
        minValue + Number(Math.abs(maxValue - minValue) * ratio)
    ).toFixed(2);
    value = parseFloat(value);

    if (value < minValue) value = this.minValue_;
    else if (value > maxValue) value = this.maxValue_;
    if (!this.isFloatPoint()) value = Math.round(value);

    this.setValue(value);
};

Entry.Variable.prototype.getMinValue = function() {
    return this.minValue_;
};

Entry.Variable.prototype.setMinValue = function(minValue) {
    this._valueWidth = null;

    minValue = minValue || 0;
    this.minValue_ = minValue;
    if (this.value_ < minValue) this.setValue(minValue);
    this.isMinFloat = Entry.isFloat(this.minValue_);
    this.updateView();
};

Entry.Variable.prototype.getMaxValue = function() {
    return this.maxValue_;
};

Entry.Variable.prototype.setMaxValue = function(maxValue) {
    this._valueWidth = null;

    maxValue = maxValue || 100;
    this.maxValue_ = maxValue;
    if (this.value_ > maxValue) this.value_ = maxValue;
    this.isMaxFloat = Entry.isFloat(this.maxValue_);
    this.updateView();
};

Entry.Variable.prototype.isFloatPoint = function() {
    return this.isMaxFloat || this.isMinFloat;
};
