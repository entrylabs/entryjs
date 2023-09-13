import Variable from './variable';
import { GEHelper } from '../../graphicEngine/GEHelper';

class SttVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'stt', 'Invalid variable type given');
        super(variable);
    }

    updateView() {
        if (!this.view_) {
            return;
        }

        if (this.isVisible()) {
            this._adjustSingleViewPosition();
            this.textView_.text = this.getName();
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
            this._adjustSingleValueViewPosition();
            if (this._valueWidth === null) {
                this._valueWidth = this.valueView_.getMeasuredWidth();
            }

            this._adjustSingleViewBox('#32d27d');
        }
        Entry.requestUpdate = true;
    }

    _adjustSingleValueViewPosition() {
        this.valueView_.x = 12;
        if (GEHelper.isWebGL) {
            this.valueView_.y = this.GL_VAR_POS.VALUE_Y + 22;
        } else {
            this.valueView_.y = 1.5 + 22;
        }
    }

    _adjustSingleViewBox(boxFillAndStrokeColor) {
        const rectWidth = Math.max(this._valueWidth + 22, this._nameWidth + 10);
        const colorSet = EntryStatic.colorSet.canvas || {};
        this.rect_.graphics
            .clear()
            .f('#ffffff')
            .ss(1, 2, 0)
            .s(colorSet.border || '#aac5d5')
            .rr(0, -14, rectWidth, 45, 4);
        this.wrapper_.graphics
            .clear()
            .f(boxFillAndStrokeColor)
            .ss(1, 2, 0)
            .s(boxFillAndStrokeColor)
            .rr(4, 10, this._valueWidth + 15, 16, this.RECT_RADIUS);
    }

    checkVisible(removeBlock, notIncludeSelf) {
        if (!this.isVisible() || Entry.engine.isState('run')) {
            return;
        }
        const objects = Entry.container.getAllObjects();
        const sttTypes = [
            'speech_to_text_convert',
            'set_visible_speech_to_text',
            'speech_to_text_get_value',
        ];

        for (let i = 0, len = objects.length; i < len; i++) {
            const code = objects[i].script;
            for (let j = 0; j < sttTypes.length; j++) {
                const blocks = code.getBlockList(false, sttTypes[j]);
                if (notIncludeSelf) {
                    const index = blocks.indexOf(removeBlock);
                    if (index > -1) {
                        blocks.splice(index, 1);
                    }
                }
                if (blocks.length > 0) {
                    return;
                }
            }
        }
        this.setVisible(false);
    }

    reset() {
        this.setName(Lang.template.voice_title_text);
        this.setValue('-');
    }
}

export default SttVariable;
