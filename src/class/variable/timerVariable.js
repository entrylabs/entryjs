import Variable from './variable';

class TimerVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'timer', 'Invalid variable type given');
        super(variable);
    }

    updateView() {
        if (!this.view_) {
            return;
        }

        if (this.isVisible()) {
            this._adjustSingleViewPosition();
            this.textView_.text = this.getName();

            if (this._nameWidth === null) {
                this._nameWidth = this.textView_.getMeasuredWidth();
            }

            this._adjustSingleValueViewPosition();
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

            this._adjustSingleViewBox('#f4af18');
        }
        Entry.requestUpdate = true;
    }
}

export default TimerVariable;
