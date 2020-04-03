import PopupHelper from "./popup_helper";

export default class AILearning {
    #playground;
    #categoryName = 'ai_learning';
    #popupKey = 'ai_learning';
    #labels = [];
    #url;
    #type;
    isLoading = false;
    result = [];

    constructor(playground) {
        this.#playground = playground;
    }

    openManager() {
        Entry.dispatchEvent('openAIUtilizeTrainManager');
    }

    get labels() {
        return this.#labels;
    }

    load({url, labels = [], type} = {}) {
        if(!url) {
            return ;
        }
        this.#labels = labels;
        this.#type = type;
        this.#url = url;
        this.unbanBlocks();
        this.generatePopupView({url, labels, type});
        if(this.#playground) {
            this.#playground.reloadPlayground()
        }
    }

    unbanBlocks() {
        const blockMenu =  this.getBlockMenu(this.#playground);
        if (blockMenu) {
            blockMenu.unbanClass(this.#categoryName);
        }
    }

    banBlocks() {
        const blockMenu =  this.getBlockMenu(this.#playground);
        if (blockMenu) {
            blockMenu.banClass(this.#categoryName);
        }
    }

    getBlockMenu = (playground) => {
        const { mainWorkspace } = playground;
        if (!mainWorkspace) {
            return;
        }

        const blockMenu = _.result(mainWorkspace, 'blockMenu');
        if (!blockMenu) {
            return;
        }
        return blockMenu;
    }

    destroy() {
        this.#labels = [];
        this.#url = null;
        this.#type = null;
        this.isLoading = false;
        this.result = [];
    }

    toJSON() {
        return {
            labels: this.#labels,
            url: this.#url,
            type: this.#type
        }
    }

    openInputPopup() {
        localStorage.setItem(this.#popupKey, JSON.stringify({url: this.#url, labels:this.#labels, type: this.#type}));
        if(Entry.engine.state == 'run') {
            Entry.engine.togglePause();
        }

        this.isLoading = true;
        this.result = [];
        this.popupHelper.show(this.#popupKey);
    }

    generatePopupView({url, labels, type}) {
        if (!this.popupHelper) {
            if (window.popupHelper) {
                this.popupHelper = window.popupHelper;
            } else {
                this.popupHelper = new PopupHelper(true);
            }
        }

        this.popupHelper.addPopup(this.#popupKey, {
            type: 'confirm',
            title: 'title',
            closeEvent: () => {
                if(Entry.engine.state == 'pause') {
                    Entry.engine.togglePause();
                }
            },
            setPopupLayout: (popup) => {
                const content = Entry.Dom('div', {
                    class: 'contentArea',
                });
                const iframe = Entry.Dom('iframe', {
                    class: 'learningInputPopup',
                    src: `/learning/popup/${type}`
                });
                $(iframe).on('load', ({target}) => {
                    target.contentWindow.addEventListener("message", ({data:eventData = {}}) => {
                        const { key, data } = eventData;
                        if(key === 'predict') {
                            this.result = data;
                            this.isLoading = false;
                            this.popupHelper.hide();
                        }
                    }, false);
                });
                content.append(iframe);
                popup.append(content);
            },
        });
    }
}
