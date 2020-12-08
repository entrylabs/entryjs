import { BillBoard } from '@entrylabs/tool';

export default class LearningChart {
    constructor(source) {
        this.modal = this.createChart(source);
        this.modal.show();
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }

    createChart(source) {
        const container = Entry.Dom('div', {
            class: 'entry-learning-chart',
            parent: $('body'),
        })[0];

        return new BillBoard({
            data: {
                source,
                title: 'title',
                description: 'description',
                togglePause: () => Entry.engine.togglePause(),
                stop: () => Entry.engine.toggleStop(),
                isIframe: self !== top,
            },
            container,
        });
    }
}