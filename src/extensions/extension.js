import Dropper from './dropper';

export default class Extension {
    constructor() {
        this.render();
    }

    render() {
        this.view = Entry.Dom('div', {
            class: 'entryExtension',
            parent: $('body'),
        });
    }

    addExtension(key) {
        switch (key) {
            case 'Dropper':
                new Dropper(parent, 'a', 'c');
        }
    }
}
