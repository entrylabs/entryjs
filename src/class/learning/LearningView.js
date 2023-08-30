import { GEHelper } from '../../graphicEngine/GEHelper';
import { GEDragHelper } from '../../graphicEngine/GEDragHelper';

const GL_VAR_POS = {
    VALUE_Y: -8.5,
    LABEL_Y: -8,
    STATUS_Y: 8,
};
const STATUS = {
    READY: 0,
    LEARNING: 1,
    DONE: 2,
    NO_MODEL: 3,
};

export default class LearningView {
    constructor({ name = 'model name', status = STATUS.NO_MODEL, value = 0 } = {}) {
        this.id = Entry.generateHash();
        this.visible = true;
        this.value = value;
        const fontFamily = EntryStatic.fontFamily || "NanumGothic, 'Nanum Gothic'";
        this.BORDER = 6;
        this.FONT = `10pt ${fontFamily}`;
        this.VALUE_FONT = `9pt ${fontFamily}`;
        this.name = name;
        this.status = status;
        this.generateView();
        Entry.addEventListener('stop', () => {
            this.view_.visible = true;
            this.visible = true;
            this.setValue(0);
        });
    }

    setX(x) {
        this.x_ = x;
        this.updateView();
    }
    getX() {
        return this.x_;
    }
    setY(y) {
        this.y_ = y;
        this.updateView();
    }
    getY() {
        return this.y_;
    }
    isVisible() {
        return this.visible;
    }
    setVisible(visibleState) {
        this.view_.visible = visibleState;
        this.visible = visibleState;
        this.updateView();
    }
    setValue(value) {
        this.value = value;
        if (value == 0) {
            this.status = STATUS.READY;
        } else if (value === 100) {
            this.status = STATUS.DONE;
        } else if (value < 100) {
            this.status = STATUS.LEARNING;
        }
        this.updateView();
    }
    getValue() {
        return this.value;
    }
    destroy() {
        Entry.stage.removeVariable(this);
    }
    setStatus(status) {
        this.status = status;
        this.updateView();
    }

    generateView(variableIndex = 0) {
        this.view_ = GEHelper.newContainer();
        this.rect_ = GEHelper.newGraphic();
        this.view_.addChild(this.rect_);
        this.view_.variable = this;
        this.view_.visible = this.visible;
        this.view_.mouseEnabled = true;
        GEDragHelper.handleDrag(this.view_);

        this.wrapper_ = GEHelper.newGraphic();
        this.view_.addChild(this.wrapper_);
        this.textView_ = GEHelper.textHelper.newText(this.name, this.FONT, '#000000', 'alphabetic');
        this.textView_.x = 4;
        if (GEHelper.isWebGL) {
            this.textView_.y = GL_VAR_POS.LABEL_Y;
        } else {
            this.textView_.y = 1;
        }
        this.view_.addChild(this.textView_);
        this.statusView = GEHelper.textHelper.newText(
            Lang.AiLearning[`model_status_${this.status}`],
            this.FONT,
            '#000000',
            'alphabetic'
        );
        this.statusView.x = 4;
        if (GEHelper.isWebGL) {
            this.statusView.y = GL_VAR_POS.STATUS_Y;
        } else {
            this.statusView.y = 15;
        }
        this.view_.addChild(this.statusView);

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

        let width = this.textView_.getMeasuredWidth() + 26;
        width = Math.max(width, 90);
        this.maxWidth = width - 20;

        this.slideBar_ = GEHelper.newGraphic();
        this.slideBar_.graphics
            .beginFill('#d8d8d8')
            .s('#d8d8d8')
            .ss(1)
            .rr(6, 28, this.maxWidth, 5, 2);
        this.view_.addChild(this.slideBar_);
        const visibleValue = (this.value / 100) * this.maxWidth;
        this.valueBar = GEHelper.newGraphic();
        if (visibleValue > 0) {
            this.valueBar.graphics
                .beginFill('#4f80ff')
                .s('#4f80ff')
                .ss(1)
                .rr(6, 28, visibleValue, 5, 2);
        }
        this.view_.addChild(this.valueBar);
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
            let newContent = this.name;

            if (oldContent !== newContent) {
                this.textView_.text = newContent;
                this._nameWidth = null;
            }

            if (!this._nameWidth) {
                this._nameWidth = this.textView_.getMeasuredWidth();
            }

            const oldStatus = this.statusView.text;
            let newStatus = Lang.AiLearning[`model_status_${this.status}`];

            if (oldStatus !== newStatus) {
                this.statusView.text = newStatus;
            }

            let width = this._nameWidth + 35;
            const colorSet = EntryStatic.colorSet.canvas || {};
            width = Math.max(width, 90);
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s(colorSet.border || '#aac5d5')
                .rr(0, -14, width, 54, 4);

            width = this._nameWidth + 26;
            width = Math.max(width, 90);
            this.maxWidth = width - 16;
            const visibleValue = (this.value / 100) * this.maxWidth;
            this.slideBar_.graphics
                .clear()
                .beginFill('#d8d8d8')
                .s('#d8d8d8')
                .ss(1)
                .rr(6, 28, this.maxWidth + 4, 5, 2);
            if (visibleValue > 0) {
                this.valueBar.graphics
                    .clear()
                    .beginFill('#4f80ff')
                    .s('#4f80ff')
                    .ss(1)
                    .rr(6, 28, visibleValue, 5, 2);
            }
        }
        Entry.requestUpdate = true;
    }

    _adjustSingleViewPosition() {
        this.view_.x = this.getX();
        this.view_.y = this.getY();
    }
}
