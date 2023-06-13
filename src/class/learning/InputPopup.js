import PopupHelper from '../popup_helper';

export default class InputPopup {
    #popupKey = 'ai_learning';
    result = [];

    constructor(source) {
        this.generatePopupView(source);
    }

    open() {
        this.popupHelper.show(this.#popupKey);
    }

    getResult() {
        return this.result;
    }

    generatePopupView({ url, labels, type, recordTime }) {
        if (!this.popupHelper) {
            if (window.popupHelper) {
                this.popupHelper = window.popupHelper;
            } else {
                this.popupHelper = new PopupHelper(true);
            }
        }
        let isPauseClicked = false;
        this.popupHelper.addPopup(this.#popupKey, {
            type: 'confirm',
            title: Lang.Blocks.learn_popup_title,
            onShow: () => {
                this.popupHelper.addClass('learning_popup');
                isPauseClicked = false;
                localStorage.setItem(
                    this.#popupKey,
                    JSON.stringify({ url, labels, type, recordTime })
                );
                this.isLoading = true;
                this.result = [];
                if (Entry.engine.state == 'run') {
                    Entry.engine.togglePause({ visible: false });
                }
            },
            closeEvent: () => {
                this.isLoading = false;
                if (Entry.engine.state == 'pause' && !isPauseClicked) {
                    Entry.engine.togglePause({ visible: false });
                }
            },
            setPopupLayout: (popup) => {
                const content = Entry.Dom('div', {
                    class: 'contentArea',
                });
                const iframe = Entry.Dom('iframe', {
                    class: `learningInputPopup ${type}`,
                    src: `/learning/popup/${type}`
                });
                $(iframe).on('load', ({ target }) => {
                    target.contentWindow.addEventListener(
                        'message',
                        ({ data: eventData = {} }) => {
                            if (typeof eventData !== 'string') {
                                return;
                            }
                            const { key, data } = JSON.parse(eventData);
                            if (key === 'predict') {
                                this.result = data;
                                this.popupHelper.hide();
                            }
                            if (key === 'stop') {
                                this.popupHelper.hide();
                                Entry.engine.toggleStop();
                            }
                            if (key === 'pause') {
                                if (!isPauseClicked) {
                                    isPauseClicked = true;
                                    Entry.engine.togglePause({ visible: false });
                                }
                                Entry.engine.togglePause();
                            }
                            if (key === 'error') {
                                this.popupHelper.hide();
                                this.toastError();
                            }
                        },
                        false
                    );
                });
                content.append(iframe);
                popup.append(content);
            },
        });
    }

    toastError() {
        Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.ai_utilize_train_pop_error, true);
    }
}