Entry.FieldLineBreak = class FieldLineBreak extends Entry.Field {
    constructor(content, blockView, index) {
        super();
        this._block = blockView.block;
        this._blockView = blockView;
        this._index = index;

        const box = new Entry.BoxModel();
        this.box = box;

        this.setValue(null);
        this.renderStart();
    }
    renderStart() {
        return;
    }

    align(targetStatementIndex) {
        const blockView = this._blockView;

        if (blockView._statements.length === 0) {
            return;
        }

        this.box.set({
            y:
                (blockView._statements[targetStatementIndex].height || 20) +
                Math.max(blockView.contentHeight % 1000, 30),
        });
    }
};
