import _get from 'lodash/get';

Entry.BlockCountViewer = class {
    constructor() {
        Entry.codeChangedEvent = new Entry.Event(window);
        Entry.codeChangedEvent.attach(this, this.updateView);
        Entry.addEventListener('loadComplete', this.updateView.bind(this));
    }

    generateView(sceneView, option) {
        this.view_ = sceneView;
        if (!option || option === 'workspace' || option === 'playground') {
            const blockCountView = Entry.createElement('span').addClass('blockCountView');
            this.view_.appendChild(blockCountView);
            this.blockCountView = blockCountView;
            this.updateView();
        }
    }

    async updateView() {
        if (this.blockCountView) {
            const blocks = await Entry.Utils.getObjectsBlocksForEventThread();
            // const blocks = Entry.Utils.getObjectsBlocks();
            const count = _get(blocks, 'length', 0);
            //TODO 다국어 적용
            this.blockCountView.innerHTML = `블록 <strong>${count}</strong> 개`;
        }
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
};
