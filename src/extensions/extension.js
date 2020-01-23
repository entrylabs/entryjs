import Dropper from './dropper';

export default class Extension {
    #view = null;
    constructor() {
        this.renderView();
    }

    renderView() {
        if (!this.#view) {
            this.#view = Entry.Dom('div', {
                class: 'entryExtension',
                parent: $('body'),
            });
        }
    }

    static getExtension(key) {
        switch (key) {
            case 'Dropper':
                return Dropper.getInstance();
        }
    }
}
