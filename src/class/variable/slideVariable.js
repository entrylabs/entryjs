import Variable from './variable';
import { GEHelper } from '../../graphicEngine/GEHelper';
import { GEDragHelper } from '../../graphicEngine/GEDragHelper';

class SlideVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'slide', 'Invalid variable type given');
        super(variable);

        this.setMinValue(variable.minValue);
        this.setMaxValue(variable.maxValue);
    }

    generateView(variableIndex) {
        const slide = this;
        this.view_ = GEHelper.newContainer();
        this.rect_ = GEHelper.newGraphic();
        this.view_.addChild(this.rect_);
        this.view_.variable = this;
        this.view_.visible = this.visible_;
        this.view_.mouseEnabled = true;
        this.view_.mouseChildren = true;
        GEDragHelper.handleDrag(this.view_);

        this.wrapper_ = GEHelper.newGraphic();
        this.view_.addChild(this.wrapper_);
        this.textView_ = GEHelper.textHelper.newText('name', this.FONT, '#000000', 'alphabetic');
        this.textView_.x = 4;
        if (GEHelper.isWebGL) {
            this.textView_.y = this.GL_VAR_POS.LABEL_Y;
        } else {
            this.textView_.y = 1;
        }
        this.view_.addChild(this.textView_);
        this.valueView_ = GEHelper.textHelper.newText(
            'value',
            this.VALUE_FONT,
            '#ffffff',
            'alphabetic'
        );

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
        this.view_.addChild(this.valueView_);

        let width = this.textView_.getMeasuredWidth() + this.valueView_.getMeasuredWidth() + 26;
        width = Math.max(width, 90);
        this.maxWidth = width - 20;

        this.slideBar_ = GEHelper.newGraphic();
        this.slideBar_.graphics
            .beginFill('#d8d8d8')
            .s('#d8d8d8')
            .ss(1)
            .rr(10, 10, this.maxWidth, 15, 4);
        this.view_.addChild(this.slideBar_);

        const position = this.getSlidePosition(this.maxWidth);
        const { stage_variable_slider } = EntryStatic.images || {};
        this.valueSetter_ = GEHelper.newSpriteWithCallback(
            stage_variable_slider || `${Entry.mediaFilePath}stage_variable_slider.png`,
            () => {
                Entry.requestUpdate = true;
            }
        );
        this.valueSetter_.cursor = 'pointer';
        this.valueSetter_.scaleX = 0.8;
        this.valueSetter_.scaleY = 0.8;
        this.valueSetter_.mouseEnabled = true;
        this.valueSetter_.y = 9;
        this.valueSetter_.regX = 0.5;

        GEDragHelper.handleDrag(this.valueSetter_);
        this.valueSetter_.on(GEDragHelper.types.DOWN, function(evt) {
            if (!Entry.engine.isState('run')) {
                return;
            }
            slide.isAdjusting = true;
            this.offsetX = evt.stageX * 0.75 - this.x;
        });

        this.valueSetter_.on(GEDragHelper.types.MOVE, function(evt) {
            if (!Entry.engine.isState('run')) {
                return;
            }
            const value = (evt.stageX * 0.75) - this.offsetX + 5;
            //박봉배 - value 값의 min/max 는 다른곳에서 체크 하므로, 이곳에서는 로직 삭제 하겠음.
            slide.setSlideCommandX(value);
        });
        this.valueSetter_.on(GEDragHelper.types.UP, () => {
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

        this.setVisible(this.isVisible());
        Entry.stage.loadVariable(this);
    }

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

            if (this._nameWidth === null) {
                this._nameWidth = this.textView_.getMeasuredWidth();
            }
            this._adjustSingleValueViewPosition();
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
            let width = this._nameWidth + this._valueWidth + 35;
            const colorSet = EntryStatic.colorSet.canvas || {};
            width = Math.max(width, 90);
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s(colorSet.border || '#aac5d5')
                .rr(0, -14, width, 42, 4);
            this.wrapper_.graphics
                .clear()
                .f(colorSet.slideVariable || '#4f80ff')
                .ss(1, 2, 0)
                .s(colorSet.slideVariable || '#4f80ff')
                .rr(this._nameWidth + 14, -10, this._valueWidth + 15, 16, this.RECT_RADIUS);

            width = this._nameWidth + this._valueWidth + 26;
            width = Math.max(width, 90);
            this.maxWidth = width - 16;

            this.slideBar_.graphics
                .clear()
                .beginFill('#d8d8d8')
                .s('#d8d8d8')
                .ss(1)
                .rr(6, 16, this.maxWidth + 4, 5, 2);
            this.valueSetter_.x = this.getSlidePosition(this.maxWidth);


            // this.valueSetter_.graphics
            //     .clear()
            //     .beginFill('#1bafea')
            //     .s('#A0A1A1')
            //     .ss(1)
            //     .dc(position, 10 + 0.5, 3);
        }
        Entry.requestUpdate = true;
    }

    getValue() {
        if (this.isNumber()) {
            return Number(this.value_);
        } else {
            return this.value_;
        }
    }

    setValue(value) {
        const numValue = Number(value);
        if (numValue < this.minValue_) {
            this.value_ = this.minValue_;
        } else if (numValue > this.maxValue_) {
            this.value_ = this.maxValue_;
        } else {
            this.value_ = numValue;
        }

        this._valueWidth = null;
        this.updateView();
        Entry.requestUpdateTwice = true;
    }

    setSlideCommandX(value) {
        if (!this.valueSetter_.command) {
            this.valueSetter_.command = {};
        }
        let commandX = typeof value === 'undefined' ? 10 : value;
        commandX = Math.max(commandX, 10);
        commandX = Math.min(this.maxWidth + 10, commandX);
        this.valueSetter_.command.x = commandX;
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

    getSlidePosition(width) {
        const minValue = this.minValue_;
        const maxValue = this.maxValue_;
        const value = this.value_;
        const ratio = Math.abs(value - minValue) / Math.abs(maxValue - minValue);
        return width * ratio + 6;
    }

    toJSON() {
        const json = super.toJSON();
        json.minValue = this.minValue_;
        json.maxValue = this.maxValue_;

        return json;
    }
}

export default SlideVariable;
