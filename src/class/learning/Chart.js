import { BillBoard, Tree } from '@entrylabs/tool';

export default class LearningChart {
    constructor(modalData, type = 'chart') {
        if (type === 'tree') {
            this.modal = this.createTree(modalData);
        } else {
            this.modal = this.createChart(modalData);
        }
        this.modal.show();
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }

    destroy() {
        this.modal.hide();
        this.modal = null;
    }

    load(data) {
        this.modal.setData(data);
    }

    createChart({ title = '', description = '', source }) {
        const container = Entry.Dom('div', {
            class: 'entry-learning-chart',
            parent: $(Entry.modalContainer),
        })[0];

        return new BillBoard({
            data: {
                source,
                title,
                description,
                togglePause: () => Entry.engine.togglePause(),
                stop: () => Entry.engine.toggleStop(),
                isIframe: self !== top,
            },
            container,
        });
    }

    createTree({ title = '', source }) {
        const container = Entry.Dom('div', {
            class: 'entry-learning-chart',
            parent: $(Entry.modalContainer),
        })[0];

        return new Tree({
            data: {
                source,
                title,
                togglePause: () => Entry.engine.togglePause(),
                stop: () => Entry.engine.toggleStop(),
                isIframe: self !== top,
            },
            container,
        });
    }
}
