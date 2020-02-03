'use strict';

import { GEHelper } from '../../graphicEngine/GEHelper';
import { GEDragHelper } from '../../graphicEngine/GEDragHelper';
import CloudVariable from '../../extensions/CloudVariable';

/**
 * 기본 변수블록 객체
 * @param {Object} variable variableMetadata
 */
class Variable {
    get RECT_RADIUS() {
        return 7;
    }

    get GL_VAR_POS() {
        return {
            VALUE_Y: -8.5,
            LABEL_Y: -9.5,
        };
    }

    get GL_LIST_POS() {
        return {
            INDEX_Y: 5,
            VALUE_Y: 6,
        };
    }

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
        this.cloudVariable = CloudVariable.getInstance();

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

        if (!variable.isClone) {
            /** @type {boolean} */
            this.visible_ =
                variable.visible || typeof variable.visible === 'boolean' ? variable.visible : true;
            /** @type {number} */
            this.x_ = variable.x ? variable.x : null;
            /** @type {number} */
            this.y_ = variable.y ? variable.y : null;
            const fontFamily = EntryStatic.fontFamily || 'NanumGothic';
            this.BORDER = 6;
            this.FONT = `10pt ${fontFamily}`;
            this.VALUE_FONT = `9pt ${fontFamily}`;
        }

        Entry.addEventListener('workspaceChangeMode', this.updateView.bind(this));
    }

    /**
     * Generate variable view on canvas
     * @param {number} variableIndex index of this variable for render position
     */
    generateView(variableIndex) {
        const type = this.type;
        if (type === 'variable' || type === 'timer' || type === 'answer' || type === 'stt') {
            this.view_ = GEHelper.newContainer();
            this.rect_ = GEHelper.newGraphic();
            this.view_.addChild(this.rect_);
            this.view_.variable = this;
            this.view_.visible = this.visible_;
            this.view_.mouseEnabled = true;
            GEDragHelper.handleDrag(this.view_);

            // Stage 의 변수박스를 만든다.
            this.wrapper_ = GEHelper.newGraphic();
            this.view_.addChild(this.wrapper_);
            this.textView_ = GEHelper.textHelper.newText(
                'asdf',
                this.FONT,
                '#000000',
                'alphabetic'
            );
            this.textView_.x = 4;
            if (GEHelper.isWebGL) {
                this.textView_.y = this.GL_VAR_POS.LABEL_Y;
            } else {
                this.textView_.y = 2.5;
            }
            this.view_.addChild(this.textView_);
            this.valueView_ = GEHelper.textHelper.newText(
                'asdf',
                this.VALUE_FONT,
                '#ffffff',
                'alphabetic'
            );
            const variableLength = Entry.variableContainer.variables_.length;
            if (this.getX() && this.getY()) {
                this.setX(this.getX());
                this.setY(this.getY());
            } else {
                //TODO
                this.setX(10 - 240 + Math.floor((variableLength % 66) / 11) * 80);
                this.setY(variableIndex * 28 + 20 - 135 - Math.floor(variableLength / 11) * 264);
            }

            this.view_.addChild(this.valueView_);
            if (Entry.type === 'workspace') {
                this.view_.cursor = 'move';
            }
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
        }

        this.setVisible(this.isVisible());
        Entry.stage.loadVariable(this);
    }

    /**
     * this.view_ 를 수정 후, 엔트리에 새로 그리기 요청을 한다.
     * generateView 혹은 updateView 가 이상하게 그려진다면, 혹시 variableType 이 잘못되었는지 확인.
     */
    updateView() {
        if (!this.view_) {
            return;
        }

        if (this.isVisible()) {
            this._adjustSingleViewPosition();
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
            this._adjustSingleValueViewPosition();

            // INFO: Number체크는 slide 일때만 하도록 처리 기본 문자로 처리함(#4876)

            if (this._valueWidth === null) {
                this._valueWidth = this.valueView_.getMeasuredWidth();
            }
            const colorSet = EntryStatic.colorSet.canvas || {};
            this._adjustSingleViewBox(colorSet.variable || '#4f80ff');
        }

        Entry.requestUpdate = true;
    }

    /**
     * stage 내 변수 / 타이머 / 대답 뷰의 크기와 위치를 조정한다.
     * wrapper 의 이미지는 동일하다.
     * rr(RectRadius) 의 인자는 각각 x, y, width, height, radius
     * @param {string} boxFillAndStrokeColor
     * @protected
     */
    _adjustSingleViewBox(boxFillAndStrokeColor) {
        // TODO slider updateView 만 rect_.graphics 를 따로 씀. rr 인자 constants 로 묶을 것.
        const colorSet = EntryStatic.colorSet.canvas || {};
        this.rect_.graphics
            .clear()
            .f('#ffffff')
            .ss(1, 2, 0)
            .s(colorSet.border || '#aac5d5')
            .rr(0, -14, this._nameWidth + this._valueWidth + 35, 24, 4);
        this.wrapper_.graphics
            .clear()
            .f(boxFillAndStrokeColor)
            .ss(1, 2, 0)
            .s(boxFillAndStrokeColor)
            .rr(this._nameWidth + 14, -10, this._valueWidth + 15, 16, this.RECT_RADIUS);
    }

    _adjustSingleViewPosition() {
        this.view_.x = this.getX();
        this.view_.y = this.getY();
    }

    _adjustSingleValueViewPosition() {
        this.valueView_.x = this._nameWidth + 21;
        if (GEHelper.isWebGL) {
            this.valueView_.y = this.GL_VAR_POS.VALUE_Y;
        } else {
            this.valueView_.y = 1.5;
        }
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
        return this.value_;
        if (!this.isCloud_) {
            return this.value_;
        } else {
            const { value } =
                this.cloudVariable.get({
                    variableType: this.type,
                    id: this.id_,
                }) || {};
            return value || this.value_;
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
        this.value_ = value;
        this._valueWidth = null;
        this.updateView();
        Entry.requestUpdateTwice = true;
        return;
        if (!this.isCloud_) {
            this.value_ = value;
            this._valueWidth = null;
            this.updateView();
            Entry.requestUpdateTwice = true;
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.cloudVariable.set(
                        {
                            variableType: this.type,
                            id: this.id_,
                        },
                        value
                    );
                    this.value_ = value;
                    this._valueWidth = null;
                    this.updateView();
                    Entry.requestUpdateTwice = true;
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }
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
     * @param {!boolean} visibleState
     */
    setVisible(visibleState) {
        Entry.assert(typeof visibleState === 'boolean', 'Variable visible state must be boolean');
        if (this.visible_ === visibleState) {
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
     * @param {!entity model}variableModel
     * @protected
     */
    syncModel_(variableModel) {
        if (!this.isCloud_) {
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
        return Entry.Variable.create(Object.assign(this.toJSON(), { isClone: true }));
    }

    getType() {
        return this.type;
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
}

// Entry.Variable = Variable;
// add export
export default Variable;
