import Variable from './variable';

class AnswerVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'answer', 'Invalid variable type given');
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

            this._adjustSingleViewBox('#F57DF1');
            Entry.requestUpdate = true;
        }
    }
}

export default AnswerVariable;
