import { BillBoard } from '@entrylabs/tool';

export default class LearningChart {
    constructor(modalData) {
        this.modal = this.createChart(modalData);
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
    
    createChart({ title = '', description = '', source }) {
        const container = Entry.Dom('div', {
            class: 'entry-learning-chart',
            parent: $('body'),
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
}