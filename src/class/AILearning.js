import PopupHelper from "./popup_helper";

export default class AILearning {
    #playground;
    #categoryName = 'ai_learning';
    #popupKey = 'ai_learning';
    #labels = [];
    #url;
    #type;
    #oid;
    #modelId;
    isLoaded = false;
    isLoading = false;
    result = [];
    isDisable = false;

    constructor(playground, isDiabled) {
        this.#playground = playground;
        this.isDisable = isDisable;
    }

    openManager() {
        Entry.dispatchEvent('openAIUtilizeTrainManager');
    }

    get labels() {
        return this.#labels;
    }

    getResult(index) {
        const defaultResult = {probability: 0, className: ''};
        if(index !== undefined && index > -1) {
            return this.result.find(({className}) => className === this.labels[index]) || defaultResult;
        }
        return this.result[0] || defaultResult;

    }

    load({url, labels, type, classes = [], model, id, _id } = {}) {
        if(!url ||  this.isDisable) {
            return ;
        }
        this.#labels = labels || classes.map(({name}) => name);
        this.#type = type;
        this.#url = url;
        this.#oid = _id;
        this.#modelId = model || id;
        this.unbanBlocks();
        this.generatePopupView({url, labels: this.#labels, type});
        if(this.#playground) {
            this.#playground.reloadPlayground()
        }
        this.isLoaded = true;
    }

    getId() {
        return this.#modelId;
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
        if(!this.isLoaded) {
            return;
        }
        return {
            labels: this.#labels,
            url: this.#url,
            type: this.#type,
            id: this.#modelId,
            _id: this.#oid,
        }
    }

    openInputPopup() {
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
        let isPauseClicked = false;
        this.popupHelper.addPopup(this.#popupKey, {
            type: 'confirm',
            title: Lang.Blocks.learn_popup_title,
            onShow: () => {
                this.popupHelper.addClass('learning_popup');
                isPauseClicked = false;
                localStorage.setItem(this.#popupKey, JSON.stringify({url, labels, type}));
                this.isLoading = true;
                this.result = [];
                if(Entry.engine.state == 'run') {
                    Entry.engine.togglePause({visible:false});
                }
            },
            closeEvent: () => {
                this.isLoading = false;
                if(Entry.engine.state == 'pause' && !isPauseClicked) {
                    Entry.engine.togglePause({visible:false});
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
                        const { key, data } = JSON.parse(eventData);
                        if(key === 'predict') {
                            this.result = data;
                            this.popupHelper.hide();
                        }
                        if(key === 'stop') {
                            this.popupHelper.hide();
                            Entry.engine.toggleStop()
                        }
                        if(key === 'pause') {
                            if(!isPauseClicked) {
                                isPauseClicked = true;
                                Entry.engine.togglePause({visible:false});
                            }
                            Entry.engine.togglePause();
                        }
                        if(key === 'error') {
                            this.popupHelper.hide();
                            Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.ai_utilize_train_pop_error, true);
                        }
                    }, false);
                });
                content.append(iframe);
                popup.append(content);
            },
        });
    }
}
