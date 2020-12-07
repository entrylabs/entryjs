import PopupHelper from './popup_helper';
import TextLearning from './learning/TextLearning';
import Cluster from './learning/Cluster';
import Regression from './learning/Regression';
import LearningView from './learning/LearningView';

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
    isEnable;
    #recordTime = 2000;
    #module = null;
    #tableData = null;
    #dynamicAttrClass = ['cluster', 'regression'];
    #variableAttrLength = 0;
    #chartEnable = false;

    getModule () {
        return this.#module;
    }
    
    constructor(playground, isEnable = true) {
        this.#playground = playground;
        this.isEnable = isEnable;

        this.id = Entry.generateHash();
        
        this.visible_ = true;

        const fontFamily = EntryStatic.fontFamily || 'NanumGothic';
        this.BORDER = 6;
        this.FONT = `10pt ${fontFamily}`;
        this.VALUE_FONT = `9pt ${fontFamily}`;
    }

    setTable(classes) {
        try {
            const [{samples}] = classes;
            const [{data}] = samples;
            if(typeof data === 'string') {
                return JSON.parse(data);
            }else {
                return data;
            }
        } catch(e) {
            console.log('set table error', e);
        }
    }

    removeAllBlocks() {
        const utilizeBlock  = Object.values(Entry.AI_UTILIZE_BLOCK_LIST).map(x => Object.keys(x.getBlocks())).flatten();
        const { blocks } = EntryStatic.getAllBlocks().find(({category}) => category === 'ai_utilize');
        blocks.filter(x => !utilizeBlock.includes(x)).forEach((blockType) => {
            Entry.Utils.removeBlockByType(blockType);
        });
        this.banBlocks();
        this.destroy();
    }

    isAvailable() {
        if (!this.isEnable) {
            return false;
        }
        if (!this.isLoaded) {
            this.toastError();
            throw new Error('ai learning model load error');
        }
        return true;
    }

    setVisible(visible) {
        if(this.view) {
            this.view.setVisible(visible);
        }
    }

    openManager() {
        if(this.isEnable) {
            Entry.dispatchEvent('openAIUtilizeTrainManager');
        } else {
            console.log('Disabled learning for offline');
        }
    }

    get labels() {
        return this.#labels;
    }

    getResult(index) {
        const defaultResult = {probability: 0, className: ''};
        const isAvailable = this.isAvailable();
        if (!isAvailable) {
            return defaultResult;
        }
        if(index !== undefined && index > -1) {
            return this.result.find(({className}) => className === this.labels[index]) || defaultResult;
        }
        return this.result[0] || defaultResult;

    }

    async predict(obj) {
        if(this.#module && this.#module.predict) {
            const result = await this.#module.predict(obj);
            this.result = result;
        }
        return [];
    }

    load(modelInfo) {
        const { 
            url, 
            labels, 
            type, 
            classes = [], 
            model, 
            id, 
            _id, 
            isActive = true, 
            name, 
            recordTime,
            trainParam,
            tableData,
            result,
        } = modelInfo || {};
        if(!url ||  !this.isEnable || !isActive) {
            return ;
        }
        if(this.view) {
            this.view.destroy();
            this.view = null;
        }
        this.#chartEnable = false;
        this.destroy();
        this.#labels = labels || classes.map(({name}) => name);
        this.#type = type;
        this.#url = url;
        this.#oid = _id;
        this.name = name;
        this.#modelId = model || id;
        this.#recordTime = recordTime;
        this.result = result;
        if(!tableData && classes.length) {
            this.#tableData = this.setTable(classes);
        } else {
            this.#tableData = tableData;
        }
        this.generatePopupView({url, labels: this.#labels, type, recordTime});
        if (this.#playground) {
            this.#playground.reloadPlayground()
        }
        if (type === 'text') {
            this.#module = new TextLearning();
            this.#module.load(`/uploads/${this.#url}/model.json`);
            this.unbanBlocks();
        } else if (type === 'cluster') {
            this.view = new LearningView({ name: this.name, status: 0 });
            this.#module = new Cluster({ 
                result, 
                trainParam, 
                table: this.#tableData,
                trainCallback: (value) => {
                    this.view.setValue(value)
                },
            });
            this.#variableAttrLength = this.#tableData?.select?.[0]?.length || 0;
            if(this.#variableAttrLength === 2) {
                this.#chartEnable = true;
            }
            this.unbanBlocks(['train']);
        } else if (type === 'regression') {
            this.view = new LearningView({ name: this.name, status: 0 });
            this.#module = new Regression({ 
                result,
                trainParam, 
                table: this.#tableData,
                trainCallback: (value) => {
                    this.view.setValue(value)
                },
             });
            this.#variableAttrLength = this.#tableData?.select?.[0]?.length || 0;
            if(this.#variableAttrLength === 1) {
                this.#chartEnable = true;
            }
            this.#module.load(`/uploads/${this.#url}/model.json`);
            this.unbanBlocks(['train']);
        } else {
            this.unbanBlocks();
        }
        this.isLoaded = true;
    }

    train() {
        if(this.#module && this.#module.train) {
            this.#module.train();
        }
    }

    isTrained() {
        if(this.#module && this.#module.isTrained) {
            return this.#module.isTrained;
        }
        return false;
    }

    setTrainOption(type, value) {
        if(this.#module && this.#module.setTrainOption) {
            this.#module.setTrainOption(type, value);
        }
    }

    getTrainOption() {
        if(this.#module && this.#module.getTrainOption) {
            return this.#module.getTrainOption();
        }
    }

    getTrainResult() {
        if(this.#module && this.#module.result) {
            return this.#module.result;
        }
    }

    getTableData() {
        return this.#tableData;
    }

    getResult() {
        if(this.#module && this.#module.result) {
            return this.#module.result;
        } 
    }

    getId() {
        return this.#modelId;
    }

    unbanBlocks(categories = ['classification']) {
        this.banBlocks();
        const blockMenu =  this.getBlockMenu(this.#playground);
        if (blockMenu) {
            blockMenu.unbanClass(this.#categoryName);
            blockMenu.unbanClass(`${this.#categoryName}_${this.#type}`);
            categories.forEach((category) => {
                blockMenu.unbanClass(`${this.#categoryName}_${category}`);
            });
            if(this.#dynamicAttrClass.includes(this.#type)) {
                blockMenu.unbanClass(`${this.#type}_attr_${this.#variableAttrLength}`);
            }
            if(this.#chartEnable) {
                blockMenu.unbanClass('ai_learning_train_chart');
            }
        }
    }

    banBlocks() {
        const blockMenu =  this.getBlockMenu(this.#playground);
        if (blockMenu) {
            blockMenu.banClass(this.#categoryName);
            blockMenu.banClass('ai_learning_classification');
            blockMenu.banClass('ai_learning_train');
            blockMenu.banClass(`${this.#categoryName}_text`);
            blockMenu.banClass(`${this.#categoryName}_image`);
            blockMenu.banClass(`${this.#categoryName}_speech`);
            blockMenu.banClass('ai_learning_train_chart');
            this.#dynamicAttrClass.forEach((type) => {
                blockMenu.banClass(`${this.#categoryName}_${type}`);
                for(let i = 1 ; i <= 3 ; i++) {
                    blockMenu.banClass(`${type}_attr_${i}`);
                }
            })
            
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
        this.isLoaded = false;
        this.#recordTime = 2000;
        this.#module = null;
        this.#tableData = null;
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
            recordTime: this.#recordTime,
            trainParam: this.getTrainOption(),
            result: this.getTrainResult(),
            tableData: this.#tableData,
        }
    }

    openInputPopup() {
        const isAvailable = this.isAvailable();
        if (!isAvailable) {
            return;
        }
        this.popupHelper.show(this.#popupKey);
    }

    toastError() {
        Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.ai_utilize_train_pop_error, true);
    }

    generatePopupView({url, labels, type, recordTime}) {
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
                localStorage.setItem(this.#popupKey, JSON.stringify({url, labels, type, recordTime}));
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
                    class: `learningInputPopup ${type}`,
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
                            this.toastError();
                        }
                    }, false);
                });
                content.append(iframe);
                popup.append(content);
            },
        });
    }
}
