import singleInstance from '../core/singleInstance';
import { Dropper } from '@entrylabs/tool';

class DropperExtension {
    #view = null;
    #dropper = null;
    constructor() {
        return this.#createView();
    }

    #createView() {
        this.#view = Entry.Dom('div', {
            class: 'entryDropper',
            parent: $('.entryExtension'),
        });

        this.#dropper = new Dropper({
            isShow: false,
            container: this.#view[0],
        });

        return this.#dropper;
    }
}

export default singleInstance(DropperExtension);
