/**
 * @fileoverview Variable object for entry variable block.
 */


'use strict';

import {GEHelper} from '../graphicEngine/GEHelper';
import { GEDragHelper } from '../graphicEngine/GEDragHelper';

const RECT_RADIUS = 6; // round rect radius

const GL_VAR_POS = {
    VALUE_Y: -9,
    LABEL_Y: -9
}
const GL_LIST_POS = {
    INDEX_Y: 1,
    VALUE_Y: 1
}

/**
 * Block variable constructor
 * @param {variable model} variable
 * @constructor
 */
Entry.Variable = class Variable {
    constructor(variable) {
        Entry.assert(typeof variable.name === 'string', 'Variable name must be given');
        /** @type {string} */
        this.name_ = variable.name;
        /** @type {string} */
        this.id_ = variable.id ? variable.id : Entry.generateHash();
        this.type = variable.variableType || 'variable';
        /** @type {entry object.id} */
        this.object_ = variable.object || null;
        /** @type {boolean} */
        this.isCloud_ = variable.isCloud || false;
        this.cloudDate = variable.cloudDate || false;

        this._nameWidth = null;
        this._valueWidth = null;

        /** @type {number||string} */
        const parsedValue = Entry.parseNumber(variable.value);
        if (typeof parsedValue === 'number') {
            this.value_ = parsedValue;
        } else if (!variable.value) {
            this.value_ = 0;
        } else {
            this.value_ = variable.value;
        }

        if (this.type === 'slide') {
            this.setMinValue(variable.minValue);
            this.setMaxValue(variable.maxValue);
        } else if (this.type === 'list') {
            this.array_ = variable.array ? variable.array : [];
        }

        if (!variable.isClone) {
            /** @type {boolean} */
            this.visible_ =
                variable.visible || typeof variable.visible === 'boolean' ? variable.visible : true;
            /** @type {number} */
            this.x_ = variable.x ? variable.x : null;
            /** @type {number} */
            this.y_ = variable.y ? variable.y : null;
            if (this.type === 'list') {
                this.width_ = variable.width ? variable.width : 100;
                this.height_ = variable.height ? variable.height : 120;
                this.scrollPosition = 0;
            }

            this.BORDER = 6;
            this.FONT = '10pt NanumGothic';
        }

        Entry.addEventListener('workspaceChangeMode', this.updateView.bind(this));
    }

    _createListElementView(wrapperWidth) {
        let elementView = GEHelper.newContainer();
        const indexView = GEHelper.textHelper.newText('asdf', this.FONT, '#000000', 'middle');
        if(GEHelper.isWebGL) {
            indexView.y = GL_LIST_POS.INDEX_Y;
        } else {
            indexView.y = 5;
        }
        elementView.addChild(indexView);
        elementView.indexView = indexView;
        const valueWrapper = GEHelper.newGraphic();
        elementView.addChild(valueWrapper);
        elementView.valueWrapper = valueWrapper;
        elementView.valueWrapper.graphics
            .clear()
            .f('#1bafea')
            .rr(20, -2, wrapperWidth, 17, 2);

        const valueView = GEHelper.textHelper.newText('fdsa', this.FONT, '#eeeeee', 'middle');
        valueView.x = 24;
        if(GEHelper.isWebGL) {
            valueView.y = GL_LIST_POS.VALUE_Y;
        } else {
            valueView.y = 6;
        }
        elementView.addChild(valueView);
        elementView.valueView = valueView;
        elementView.x = this.BORDER;

        return elementView;
    }

    /**
     * Generate variable view on canvas
     * @param {number} variableIndex index of this variable for render position
     */
    generateView(variableIndex) {
        const type = this.type;
        if (type === 'variable' || type === 'timer' || type === 'answer') {
            this.view_ = GEHelper.newContainer();
            this.rect_ = GEHelper.newGraphic();
            this.view_.addChild(this.rect_);
            this.view_.variable = this;
            this.wrapper_ = GEHelper.newGraphic();
            this.view_.addChild(this.wrapper_);
            this.textView_ = GEHelper.textHelper.newText('asdf', this.FONT, '#000000', 'alphabetic');
            this.textView_.x = 4;
            if(GEHelper.isWebGL) {
                this.textView_.y = GL_VAR_POS.LABEL_Y;
            } else {
                this.textView_.y = 1;
            }
            this.view_.addChild(this.textView_);
            this.valueView_ = GEHelper.textHelper.newText('asdf', '10pt NanumGothic', '#ffffff', 'alphabetic');
            const variableLength = Entry.variableContainer.variables_.length;
            if (this.getX() && this.getY()) {
                this.setX(this.getX());
                this.setY(this.getY());
            } else {
                //TODO
                this.setX(10 - 240 + Math.floor((variableLength % 66) / 11) * 80);
                this.setY(variableIndex * 24 + 20 - 135 - Math.floor(variableLength / 11) * 264);
            }
            this.view_.visible = this.visible_;
            this.view_.mouseEnabled = true;
            this.view_.addChild(this.valueView_);
            if (Entry.type === 'workspace') {
                this.view_.cursor = 'move';
            }
            GEDragHelper.handleDrag(this.view_);
            this.view_.on(GEDragHelper.types.DOWN, function(evt) {
                if (Entry.type !== 'workspace') {
                    return;
                }
                this.offset = {
                    x: this.x - (evt.stageX * 0.75 - 240),
                    y: this.y - (evt.stageY * 0.75 - 135),
                };
            });

            this.view_.on(GEDragHelper.types.MOVE, function(evt) {
                if (Entry.type !== 'workspace') {
                    return;
                }
                this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
                this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
                this.variable.updateView();
            });
        } else if (type === 'slide') {
            const slide = this;
            this.view_ = GEHelper.newContainer();
            this.rect_ = GEHelper.newGraphic();
            this.view_.addChild(this.rect_);
            this.view_.variable = this;
            this.wrapper_ = GEHelper.newGraphic();
            this.view_.addChild(this.wrapper_);
            this.textView_ = GEHelper.textHelper.newText('name', this.FONT, '#000000', 'alphabetic');
            this.textView_.x = 4;
            if(GEHelper.isWebGL) {
                this.textView_.y = GL_VAR_POS.LABEL_Y;
            } else {
                this.textView_.y = 1;
            }
            this.view_.addChild(this.textView_);
            this.valueView_ = GEHelper.textHelper.newText('value', '10pt NanumGothic', '#ffffff', 'alphabetic');


            GEDragHelper.handleDrag(this.view_);
            this.view_.mouseEnabled = true;
            this.view_.mouseChildren = true;
            this.view_.on(GEDragHelper.types.DOWN, function(evt) {
                if (Entry.type !== 'workspace') {
                    return;
                }
                this.offset = {
                    x: this.x - (evt.stageX * 0.75 - 240),
                    y: this.y - (evt.stageY * 0.75 - 135),
                };
            });

            this.view_.on(GEDragHelper.types.MOVE, function(evt) {
                if (Entry.type !== 'workspace' || slide.isAdjusting) {
                    return;
                }
                this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
                this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
                this.variable.updateView();
            });
            this.view_.visible = this.visible_;
            this.view_.addChild(this.valueView_);

            let width = this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26;
            width = Math.max(width, 90);
            this.maxWidth = width - 20;

            this.slideBar_ = GEHelper.newGraphic();
            this.slideBar_.graphics
                .beginFill('#A0A1A1')
                .s('#A0A1A1')
                .ss(1)
                .dr(10, 10, this.maxWidth, 1.5);
            this.view_.addChild(this.slideBar_);

            const position = this.getSlidePosition(this.maxWidth);
            this.valueSetter_ = GEHelper.newGraphic();
            this.valueSetter_.graphics
                .beginFill('#1bafea')
                .s('#A0A1A1')
                .ss(1)
                .dc(position, 10 + 0.5, 3);
            this.valueSetter_.cursor = 'pointer';
            this.valueSetter_.mouseEnabled = true;
            GEDragHelper.handleDrag(this.valueSetter_);
            this.valueSetter_.on(GEDragHelper.types.DOWN, function(evt) {
                if (!Entry.engine.isState('run')) {
                    return;
                }
                slide.isAdjusting = true;
                this.offsetX = -(this.x - evt.stageX * 0.75 + 240);
            });

            this.valueSetter_.on(GEDragHelper.types.MOVE, function(evt) {
                if (!Entry.engine.isState('run')) {
                    return;
                }

                const oldOffsetX = this.offsetX;
                this.offsetX = -(this.x - evt.stageX * 0.75 + 240);
                if (oldOffsetX === this.offsetX) {
                    return;
                }
                const slideX = slide.getX();
                let value;
                if (slideX + 10 > this.offsetX) {
                    value = 0;
                } else if (slideX + slide.maxWidth + 10 > this.offsetX) {
                    value = this.offsetX - slideX;
                } else {
                    value = slide.maxWidth + 10;
                }
                slide.setSlideCommandX(value);
            });
            this.valueSetter_.on(GEDragHelper.types.UP, function() {
                slide.isAdjusting = false;
            });
            this.view_.addChild(this.valueSetter_);
            const variableLength = Entry.variableContainer.variables_.length;
            if (this.getX() && this.getY()) {
                this.setX(this.getX());
                this.setY(this.getY());
            } else {
                this.setX(10 - 240 + Math.floor(variableLength / 11) * 80);
                this.setY(variableIndex * 24 + 20 - 135 - Math.floor(variableLength / 11) * 264);
            }
        } else {
            this.view_ = GEHelper.newContainer();
            this.rect_ = GEHelper.newGraphic();
            this.view_.addChild(this.rect_);
            this.view_.mouseEnabled = true;
            this.view_.mouseChildren = true;
            this.view_.variable = this;
            this.titleView_ = GEHelper.textHelper.newText('asdf', this.FONT, '#000000', 'alphabetic', 'center');

            //todo [박봉배] textview_.width 를 $width 로 변경.
            this.titleView_.$width = this.width_ - 2 * this.BORDER;
            if(GEHelper.isWebGL) {
                this.titleView_.x = (this.width_ - this.titleView_.width) / 2;
                this.titleView_.y = this.BORDER -1;
            } else {
                this.titleView_.x = this.width_ / 2;
                this.titleView_.y = this.BORDER + 10;
            }
            this.view_.addChild(this.titleView_);

            this.resizeHandle_ = GEHelper.newGraphic();
            this.resizeHandle_.mouseEnabled = true;
            this.resizeHandle_.graphics
                .f('#1bafea')
                .ss(1, 0, 0)
                .s('#1bafea')
                .mt(0, -9)
                .lt(-9, 0)
                .lt(0, 0);
            this.view_.addChild(this.resizeHandle_);

            this.resizeHandle_.list = this;

            GEDragHelper.handleDrag(this.resizeHandle_);
            this.resizeHandle_.on(GEDragHelper.types.OVER, function() {
                this.cursor = 'nwse-resize';
            });

            this.resizeHandle_.on(GEDragHelper.types.DOWN, function(evt) {
                // if(Entry.type != 'workspace') return;
                this.list.isResizing = true;
                this.offset = {
                    x: evt.stageX * 0.75 - this.list.getWidth(),
                    y: evt.stageY * 0.75 - this.list.getHeight(),
                };
                this.parent.cursor = 'nwse-resize';
            });
            this.resizeHandle_.on(GEDragHelper.types.MOVE, function(evt) {
                // if(Entry.type != 'workspace') return;
                this.list.setWidth(evt.stageX * 0.75 - this.offset.x);
                this.list.setHeight(evt.stageY * 0.75 - this.offset.y);
                this.list.updateView();
            });

            GEDragHelper.handleDrag(this.view_);
            this.view_.on(GEDragHelper.types.OVER, function() {
                this.cursor = 'move';
            });

            this.view_.on(GEDragHelper.types.DOWN, function(evt) {
                if (Entry.type !== 'workspace' || this.variable.isResizing) {
                    return;
                }
                this.offset = {
                    x: this.x - (evt.stageX * 0.75 - 240),
                    y: this.y - (evt.stageY * 0.75 - 135),
                };
                this.cursor = 'move';
            });

            this.view_.on(GEDragHelper.types.UP, function() {
                this.cursor = 'initial';
                this.variable.isResizing = false;
            });

            this.view_.on(GEDragHelper.types.MOVE, function(evt) {
                if (Entry.type !== 'workspace' || this.variable.isResizing) {
                    return;
                }
                this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
                this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
                this.variable.updateView();
            });

            //todo [박봉배] 아래줄 삭제 하는게 맞겠죠? 리스트 아이템인데, 생성을 아래쪽에서 함.
            //this.elementView = this._createListElementView();
            this.scrollButton_ = GEHelper.newGraphic();
            this.scrollButton_.mouseEnabled = true;
            this.scrollButton_.cursor = 'pointer';
            GEDragHelper.handleDrag(this.scrollButton_);
            this.scrollButton_.graphics.f('#aaaaaa').rr(0, 0, 7, 30, 3.5);
            this.view_.addChild(this.scrollButton_);
            this.scrollButton_.y = 23;

            this.scrollButton_.list = this;
            this.scrollButton_.on(GEDragHelper.types.DOWN, function(evt) {
                // if(Entry.type != 'workspace') return;
                this.list.isResizing = true;
                this.offsetY = evt.stageY - this.y / 0.75;
            });
            this.scrollButton_.on(GEDragHelper.types.MOVE, function(evt) {
                // if(Entry.type != 'workspace') return;

                let stageY = evt.stageY;
                var yPos = (stageY - this.offsetY) * 0.75;
                var min = 23;
                var max = this.list.getHeight() - 40;
                if(yPos < min) yPos = min;
                if(yPos > max) yPos = max;
                this.y = yPos;
                this.list.updateView();
            });

            if (this.getX() && this.getY()) {
                this.setX(this.getX());
                this.setY(this.getY());
            } else {
                const listLength = Entry.variableContainer.lists_.length;
                this.setX(-Math.floor((listLength % 24) / 6) * 110 + 120);
                this.setY(variableIndex * 24 + 20 - 135 - Math.floor(listLength / 6) * 145);
            }
        }

        this.setVisible(this.isVisible());

        this.updateView();

        Entry.stage.loadVariable(this);
    }

    /**
     * Update this.view_
     */
    updateView() {
        if (!this.view_) {
            return;
        }

        if (this.isVisible()) {
            if (this.type === 'variable') {
                this.view_.x = this.getX();
                this.view_.y = this.getY();
                const oldContent = this.textView_.text;
                let newContent;
                if (this.object_) {
                    const obj = Entry.container.getObject(this.object_);
                    if (obj) {
                        newContent = `${obj.name}:${this.getName()}`;
                    } else {
                        newContent = this.getName();
                    }
                } else {
                    newContent = this.getName();
                }

                if (oldContent !== newContent) {
                    this.textView_.text = newContent;
                    this._nameWidth = null;
                }

                if (this.isNumber()) {
                    if (this.value_[0] !== 0 && Entry.isInteger(this.value_)) {
                        this.valueView_.text = `${this.getValue()}`;
                    } else {
                        this.valueView_.text = Number(this.getValue())
                            .toFixed(2)
                            .replace('.00', '');
                    }
                } else {
                    this.valueView_.text = this.getValue();
                }

                if (this._nameWidth === null) {
                    this._nameWidth = this.textView_.getMeasuredWidth();
                }
                this.valueView_.x = this._nameWidth + 14;
                if(GEHelper.isWebGL) {
                    this.valueView_.y = GL_VAR_POS.VALUE_Y;
                } else {
                    this.valueView_.y = 1;
                }

                // INFO: Number체크는 slide 일때만 하도록 처리 기본 문자로 처리함(#4876)

                if (this._valueWidth === null) {
                    this._valueWidth = this.valueView_.getMeasuredWidth();
                }
                this.rect_.graphics
                    .clear()
                    .f('#ffffff')
                    .ss(1, 2, 0)
                    .s('#A0A1A1')
                    .rr(0, -14, this._nameWidth + this._valueWidth + 26, 20, 4);
                this.wrapper_.graphics
                    .clear()
                    .f('#1bafea')
                    .ss(1, 2, 0)
                    .s('#1bafea')
                    .rr(this._nameWidth + 7, -11, this._valueWidth + 15, 14, RECT_RADIUS);
            } else if (this.type === 'slide') {
                this.view_.x = this.getX();
                this.view_.y = this.getY();
                const oldContent = this.textView_.text;
                let newContent;
                if (this.object_) {
                    const obj = Entry.container.getObject(this.object_);
                    if (obj) {
                        newContent = `${obj.name}:${this.getName()}`;
                    } else {
                        newContent = this.getName();
                    }
                } else {
                    newContent = this.getName();
                }

                if (oldContent !== newContent) {
                    this.textView_.text = newContent;
                    this._nameWidth = null;
                }

                if (this._nameWidth === null) {
                    this._nameWidth = this.textView_.getMeasuredWidth();
                }
                this.valueView_.x = this._nameWidth + 14;
                if(GEHelper.isWebGL) {
                    this.valueView_.y = GL_VAR_POS.VALUE_Y;
                } else {
                    this.valueView_.y = 1;
                }
                let value = String(this.getValue());

                if (this.isFloatPoint()) {
                    const reg = /\.(.*)/;

                    //check the value is float
                    const ret = reg.exec(value);
                    if (!ret) {
                        value += '.00';
                    } else {
                        while (reg.exec(value)[1].length < 2) {
                            value += '0';
                        }
                    }
                }

                this.valueView_.text = value;

                if (this._valueWidth === null) {
                    this._valueWidth = this.valueView_.getMeasuredWidth();
                }
                let width = this._nameWidth + this._valueWidth + 26;
                width = Math.max(width, 90);
                this.rect_.graphics
                    .clear()
                    .f('#ffffff')
                    .ss(1, 2, 0)
                    .s('#A0A1A1')
                    .rr(0, -14, width, 33, 4);
                this.wrapper_.graphics
                    .clear()
                    .f('#1bafea')
                    .ss(1, 2, 0)
                    .s('#1bafea')
                    .rr(this._nameWidth + 7, -11, this._valueWidth + 15, 14, RECT_RADIUS);

                width = this._nameWidth + this._valueWidth + 26;
                width = Math.max(width, 90);
                this.maxWidth = width - 20;

                this.slideBar_.graphics
                    .clear()
                    .beginFill('#A0A1A1')
                    .s('#A0A1A1')
                    .ss(1)
                    .dr(10, 10, this.maxWidth, 1.5);
                const position = this.getSlidePosition(this.maxWidth);
                this.valueSetter_.graphics
                    .clear()
                    .beginFill('#1bafea')
                    .s('#A0A1A1')
                    .ss(1)
                    .dc(position, 10 + 0.5, 3);
            } else if (this.type === 'list') {
                this.view_.x = this.getX();
                this.view_.y = this.getY();
                this.resizeHandle_.x = this.width_ - 2;
                this.resizeHandle_.y = this.height_ - 2;
                const arr = this.array_;

                let name = this.getName();
                if (this.object_) {
                    const obj = Entry.container.getObject(this.object_);
                    if (obj) {
                        name = `${obj.name}:${name}`;
                    }
                }

                this.titleView_.text = name;
                if (this.titleView_.getMeasuredWidth() > this.width_) {
                    name = `${name}..`;
                    while (this.titleView_.getMeasuredWidth() > this.width_) {
                        name = `${name.substr(0, name.length - 3)}..`;
                        this.titleView_.text = name;
                    }
                }
                if(GEHelper.isWebGL) {
                    this.titleView_.x = (this.width_ - this.titleView_.width)/ 2;
                } else {
                    this.titleView_.x = this.width_ / 2;
                }
                this.rect_.graphics
                    .clear()
                    .f('#ffffff')
                    .ss(1, 2, 0)
                    .s('#A0A1A1')
                    .rect(0, 0, this.width_, this.height_);

                let listChild;
                while (listChild = this.view_.children[4]) {
                    this.view_.removeChild(listChild);
                    listChild.destroy && listChild.destroy();
                }
                const maxView = Math.floor((this.getHeight() - 20) / 20);

                const isOverFlow = maxView < arr.length;
                const totalWidth = this.getWidth();
                let wrapperWidth = totalWidth - 2 * this.BORDER - (isOverFlow ? 30 : 20);

                if (isOverFlow) {
                    if (this.scrollButton_.y > this.getHeight() - 40) {
                        this.scrollButton_.y = this.getHeight() - 40;
                    }
                    //todo [박봉배] _createListElementView 로 코드 이동
                    // this.elementView.valueWrapper.graphics
                    //     .clear()
                    //     .f('#1bafea')
                    //     .rr(20, -2, wrapperWidth, 17, 2);
                    this.scrollButton_.x = totalWidth - 12;
                    this.scrollPosition = Math.floor(
                        (this.scrollButton_.y - 23) /
                            (this.getHeight() - 23 - 40) *
                            (arr.length - maxView)
                    );
                } else {
                    //todo [박봉배] _createListElementView 로 코드 이동
                    // this.elementView.valueWrapper.graphics
                    //     .clear()
                    //     .f('#1bafea')
                    //     .rr(20, -2, wrapperWidth, 17, 2);
                    this.scrollPosition = 0;
                }
                this.scrollButton_.visible = isOverFlow;

                const _cache = {};
                //because of min Width of list
                //maxLen can not be under 3
                //so start from 3
                let maxLen = 3;
                wrapperWidth -= 6;

                for (
                    let i = this.scrollPosition;
                    i < this.scrollPosition + maxView && i < arr.length;
                    i++
                ) {
                    this.elementView = this._createListElementView(wrapperWidth + 6);
                    if (
                        Entry.getMainWS() &&
                        Entry.getMainWS().getMode() === Entry.Workspace.MODE_VIMBOARD
                    ) {
                        this.elementView.indexView.text = i;
                    } else {
                        this.elementView.indexView.text = i + 1;
                    }

                    const text = String(arr[i].data);
                    const valueView = this.elementView.valueView;
                    const cachedText = _cache[text.substr(0, 150)];

                    if (cachedText) {
                        valueView.text = cachedText;
                    } else {
                        let execText = text.substr(0, maxLen);
                        let charIndex = maxLen;

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

                            let subCnt = 1;
                            while (valueView.getMeasuredWidth() > wrapperWidth) {
                                execText = `${execText.substr(0, execText.length - subCnt)}..`;
                                valueView.text = execText;
                                subCnt = 3;
                            }
                        } else {
                            execText = text;
                        }

                        _cache[text.substr(0, 150)] = execText;
                        maxLen = Math.max(execText.length, maxLen);
                    }

                    this.elementView.y = (i - this.scrollPosition) * 20 + 23;
                    this.view_.addChild(this.elementView);
                }
            } else if (this.type === 'answer') {
                this.view_.x = this.getX();
                this.view_.y = this.getY();
                this.textView_.text = this.getName();
                if(GEHelper.isWebGL) {
                    this.valueView_.y = GL_VAR_POS.VALUE_Y;
                } else {
                    this.valueView_.y = 1;
                }
                if (this.isNumber()) {
                    const v = Number(this.getValue());
                    if (parseInt(this.getValue(), 10) == this.getValue()) {
                        this.valueView_.text = v;
                    } else {
                        this.valueView_.text = Number(v)
                            .toFixed(1)
                            .replace('.00', '');
                    }
                } else {
                    this.valueView_.text = this.getValue();
                }
                if (this._nameWidth === null) {
                    this._nameWidth = this.textView_.getMeasuredWidth();
                }
                if (this._valueWidth === null) {
                    this._valueWidth = this.valueView_.getMeasuredWidth();
                }

                this.valueView_.x = this._nameWidth + 14;
                this.rect_.graphics
                    .clear()
                    .f('#ffffff')
                    .ss(1, 2, 0)
                    .s('#A0A1A1')
                    .rr(0, -14, this._nameWidth + this._valueWidth + 26, 20, 4);
                this.wrapper_.graphics
                    .clear()
                    .f('#F57DF1')
                    .ss(1, 2, 0)
                    .s('#F57DF1')
                    .rr(this._nameWidth + 7, -11, this._valueWidth + 15, 14, RECT_RADIUS);
            } else {
                this.view_.x = this.getX();
                this.view_.y = this.getY();
                this.textView_.text = this.getName();

                if (this._nameWidth === null) {
                    this._nameWidth = this.textView_.getMeasuredWidth();
                }

                this.valueView_.x = this._nameWidth + 14;
                if(GEHelper.isWebGL) {
                    this.valueView_.y = GL_VAR_POS.VALUE_Y;
                } else {
                    this.valueView_.y = 1;
                }
                if (this.isNumber()) {
                    this.valueView_.text = Number(this.getValue())
                        .toFixed(1)
                        .replace('.00', '');
                } else {
                    this.valueView_.text = this.getValue();
                }

                if (this._valueWidth === null) {
                    this._valueWidth = this.valueView_.getMeasuredWidth();
                }

                this.rect_.graphics
                    .clear()
                    .f('#ffffff')
                    .ss(1, 2, 0)
                    .s('#A0A1A1')
                    .rr(0, -14, this._nameWidth + this._valueWidth + 26, 20, 4);
                this.wrapper_.graphics
                    .clear()
                    .f('#ffbb14')
                    .ss(1, 2, 0)
                    .s('#ffa500')
                    .rr(this._nameWidth + 7, -11, this._valueWidth + 15, 14, RECT_RADIUS);
            }
        }
        Entry.requestUpdate = true;
    }

    /**
     * Variable name getter
     * @return {string}
     */
    getName() {
        return this.name_;
    }

    /**
     * Variable name setter
     * @param {!string} variableName
     */
    setName(variableName) {
        Entry.assert(typeof variableName === 'string', 'Variable name must be string');
        this.name_ = variableName;
        this._nameWidth = null;
        this.updateView();
        Entry.requestUpdateTwice = true;
    }

    /**
     * Variable id getter
     * @return {string}
     */
    getId() {
        return this.id_;
    }

    setId(id) {
        this.id_ = id;
    }

    /**
     * Variable value getter
     * @return {number}
     */
    getValue() {
        // INFO: Number체크는 slide 일때만 하도록 처리 기본 문자로 처리함(#4876)
        if (this.type === 'slide' && this.isNumber()) {
            return Number(this.value_);
        } else {
            return this.value_;
        }
    }

    /**
     * Verify value is number
     * @return {boolean}
     */
    isNumber() {
        return Entry.Utils.isNumber(this.value_);
    }

    /**
     * Variable value setter
     * @param {!string} variableValue
     */
    setValue(value) {
        if (this.type !== 'slide') {
            this.value_ = value;
        } else {
            const numValue = Number(value);
            if (numValue < this.minValue_) {
                this.value_ = this.minValue_;
            } else if (numValue > this.maxValue_) {
                this.value_ = this.maxValue_;
            } else {
                this.value_ = numValue;
            }
        }

        this._valueWidth = null;
        this.updateView();
        Entry.requestUpdateTwice = true;
    }

    /**
     * Variable visible state getter
     * @return {boolean}
     */
    isVisible() {
        return this.visible_;
    }

    /**
     * Variable visible state setter
     * @param {!string} visibleState
     */
    setVisible(visibleState) {
        Entry.assert(typeof visibleState === 'boolean', 'Variable visible state must be boolean');
        if (this.visible === visibleState) {
            return;
        }
        this.view_.visible = visibleState;
        this.visible_ = visibleState;
        this.updateView();
    }

    /**
     * X coordinate setter
     * @param {number} x
     */
    setX(x) {
        /** @type {number} */
        this.x_ = x;
        this.updateView();
    }

    /**
     * X coordinate getter
     * @return {number}
     */
    getX() {
        return this.x_;
    }

    /**
     * Y coordinate setter
     * @param {number} y
     */
    setY(y) {
        /** @type {number} */
        this.y_ = y;
        this.updateView();
    }

    /**
     * Y coordinate getter
     * @return {number}
     */
    getY() {
        return this.y_;
    }

    /**
     * width setter
     * @param {number} width
     */
    setWidth(width) {
        /** @type {number} */
        this.width_ = width < 100 ? 100 : width;
        this.updateView();
    }

    /**
     * width getter
     * @return {number}
     */
    getWidth() {
        return this.width_;
    }

    /**
     * height setter
     * @param {number} height
     */
    setHeight(height) {
        /** @type {number} */
        this.height_ = height < 100 ? 100 : height;
        this.updateView();
    }

    /**
     * height getter
     * @return {number}
     */
    getHeight() {
        return this.height_;
    }

    /**
     * save current state data to 'snapshot_'
     */
    takeSnapshot() {
        this.snapshot_ = this.toJSON();
    }

    /**
     * load snapshot to current variable
     */
    loadSnapshot() {
        this.snapshot_ && this.syncModel_(this.snapshot_);
        delete this.snapshot_;
    }

    /**
     * sync this model with parameter
     * @param {!entity model}
     * @private
     */
    syncModel_(variableModel) {
        const isCloud = this.isCloud_;
        if (this.type === 'list') {
            if (!isCloud) {
                this.array_ = variableModel.array;
            }
            this.setWidth(variableModel.width);
            this.setHeight(variableModel.height);
        }
        if (!isCloud) {
            this.setValue(variableModel.value);
        }

        this.setName(variableModel.name);
        this.setX(variableModel.x);
        this.setY(variableModel.y);
        this.setVisible(variableModel.visible);
        this.isCloud_ = variableModel.isCloud;
        this.cloudDate = variableModel.cloudDate;
    }

    /**
     * convert this variable's data to JSON.
     * @return {JSON}
     */
    toJSON() {
        const json = {};
        json.name = this.name_;
        json.id = this.id_;
        json.visible = this.visible_;
        json.value = this.value_;
        json.variableType = this.type;
        if (this.type === 'list') {
            json.width = this.getWidth();
            json.height = this.getHeight();
            json.array = JSON.parse(JSON.stringify(this.array_));
        } else if (this.type === 'slide') {
            json.minValue = this.minValue_;
            json.maxValue = this.maxValue_;
        }
        json.isCloud = this.isCloud_;
        json.cloudDate = this.cloudDate;
        json.object = this.object_;
        json.x = this.x_;
        json.y = this.y_;
        return json;
    }

    /**
     * Remove self
     */
    remove() {
        //this.parent.dialog = null;
        Entry.stage.removeVariable(this);
    }

    /**
     * clone self
     */
    clone() {
        return new Entry.Variable(Object.assign(this.toJSON(), { isClone: true }));
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getSlidePosition(width) {
        const minValue = this.minValue_;
        const maxValue = this.maxValue_;
        const value = this.value_;
        const ratio = Math.abs(value - minValue) / Math.abs(maxValue - minValue);
        return width * ratio + 10;
    }

    setSlideCommandX(value) {
        if(!this.valueSetter_.command) {
            this.valueSetter_.command = {};
        }
        const command = this.valueSetter_.command;
        let commandX = typeof value === 'undefined' ? 10 : value;
        commandX = Math.max(value, 10);
        commandX = Math.min(this.maxWidth + 10, value);
        command.x = commandX;
        this.updateSlideValueByView();
    }

    updateSlideValueByView() {
        const maxWidth = this.maxWidth;
        const position = Math.max(this.valueSetter_.command.x - 10, 0);
        let ratio = position / maxWidth;
        if (ratio < 0) {
            ratio = 0;
        }
        if (ratio > 1) {
            ratio = 1;
        }

        const minValue = parseFloat(this.minValue_);
        const maxValue = parseFloat(this.maxValue_);

        let value = (minValue + Number(Math.abs(maxValue - minValue) * ratio)).toFixed(2);
        value = parseFloat(value);

        if (value < minValue) {
            value = this.minValue_;
        } else if (value > maxValue) {
            value = this.maxValue_;
        }
        if (!this.isFloatPoint()) {
            value = Math.round(value);
        }

        this.setValue(value);
    }

    getMinValue() {
        return this.minValue_;
    }

    setMinValue(value) {
        this._valueWidth = null;

        const minValue = value || 0;
        this.minValue_ = minValue;
        if (this.value_ < minValue) {
            this.setValue(minValue);
        }
        this.isMinFloat = Entry.isFloat(this.minValue_);
        this.updateView();
    }

    getMaxValue() {
        return this.maxValue_;
    }

    setMaxValue(value) {
        this._valueWidth = null;

        const maxValue = value || 100;
        this.maxValue_ = maxValue;
        if (this.value_ > maxValue) {
            this.value_ = maxValue;
        }
        this.isMaxFloat = Entry.isFloat(this.maxValue_);
        this.updateView();
    }

    isFloatPoint() {
        return this.isMaxFloat || this.isMinFloat;
    }

    getCloudDate() {
        return this.cloudDate;
    }

    setCloudDate(cloudDate) {
        this.cloudDate = cloudDate;
    }

    getArray() {
        return this.array_;
    }

    setArray(array) {
        this.array_ = array;
        this.updateView();
        Entry.requestUpdateTwice = true;
    }
};
