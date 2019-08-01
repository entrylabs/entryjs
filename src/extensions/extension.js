import Dropper from './dropper';
export default class Extension {
    #view = null;
    constructor() {
        this.renderView();
    }

    renderView() {
        console.log('renderView');
        if (!this.#view) {
            this.#view = Entry.Dom('div', {
                class: 'entryExtension',
                parent: $('body'),
            });
        }
    }

    static getExtension(key) {
        // this.renderView();
        switch (key) {
            case 'Dropper':
                return Dropper.getInstance();
        }
    }
}
