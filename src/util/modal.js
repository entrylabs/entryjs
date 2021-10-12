Entry.Modal = class EntryModal {
    #modal = null;
    #isLmsModal = false;

    get modal() {
        if (!this.#modal) {
            if (window.EntryModal) {
                this.#modal = window.EntryModal;
            } else {
                this.#modal = entrylms;
                this.#isLmsModal = true;
            }
        }
        return this.#modal;
    }

    alert(content, title, options) {
        if (this.#isLmsModal) {
            return new Promise((resolve) => {
                this.modal.alert(content, title, options).on('hide', (result) => resolve(result));
            });
        }
        return this.modal.alert(content, title, options);
    }

    confirm(content, title, options) {
        return this.modal.confirm(content, title, options);
    }
};
