import _get from 'lodash/get';

Entry.BlockCountViewer = class {
    constructor() {
        if (!Entry.codeChangedEvent) {
            Entry.codeChangedEvent = new Entry.Event(window);
        }

        const updateView = () => {
            Entry.Utils.clearObjectsBlocksForEventThread();
            this.updateView();
        };

        Entry.codeChangedEvent.attach(this, updateView);
        Entry.addEventListener('loadComplete', updateView);
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
            const count = _get(blocks, 'length', 0);

            let langText = Lang.Workspace.use_blocks_project;
            if (count === 1) {
                langText = Lang.Workspace.use_block_project;
            }
            this.blockCountView.innerHTML = Entry.Utils.stringFormat(
                langText,
                `<strong>${Entry.shortenNumber(count)}</strong>`
            );
        }
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
};
