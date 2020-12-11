import TextLearning, { classes as TextClasses } from './learning/TextLearning';
import Cluster, { classes as ClusterClasses } from './learning/Cluster';
import Regression, { classes as RegressionClasses } from './learning/Regression';
import Classification, { classes as ClassificationClasses } from './learning/Classification';
import NumberClassification, { classes as NumberClassificationClasses } from './learning/NumberClassification';

const banClasses = [
    ...ClusterClasses,
    ...RegressionClasses,
    ...TextClasses,
    ...ClassificationClasses,
    ...NumberClassificationClasses,
];

export default class AILearning {
    #playground;
    #categoryName = 'ai_learning';
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
    
    constructor(playground, isEnable = true) {
        this.#playground = playground;
        this.isEnable = isEnable;
    }

    get labels() {
        return this.#labels;
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

    removeLearningBlocks() {
        if (!this.isLoaded) {
            return ;
        }
        const { blocks } = EntryStatic.getAllBlocks().find(({category}) => category === 'ai_utilize');
        blocks.filter(x => Entry.block[x].class === 'ai_learning').forEach((blockType) => {
            Entry.Utils.removeBlockByType(blockType);
        });
        this.banBlocks();
        this.destroy();
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
        this.destroy();

        this.#labels = labels || classes.map(({name}) => name);
        this.#type = type;
        this.#url = url;
        this.#oid = _id;
        this.name = name;
        this.#modelId = model || id;
        this.#recordTime = recordTime;
        this.result = result;

        if (!tableData && classes.length) {
            this.#tableData = createDataTable(classes);
        } else {
            this.#tableData = tableData;
        }
        
        if (this.#playground) {
            this.#playground.reloadPlayground()
        }
        
        if (type === 'text') {
            this.#module = new TextLearning({url, labels, type, recordTime});
        } else if(type === 'number'){
            this.#module = new NumberClassification({ 
                name,
                result,
                url,
                trainParam, 
                table: this.#tableData,
            });
        } else if (type === 'cluster') {
            this.#module = new Cluster({ 
                name,
                result, 
                trainParam, 
                table: this.#tableData,
            });
        } else if (type === 'regression') {
            this.#module = new Regression({ 
                name,
                result,
                url,
                trainParam, 
                table: this.#tableData,
             });
        } else if (type === 'image' || type === 'speech') {
            this.#module = new Classification({url, labels, type, recordTime});
        }

        if (this.#module) {
            this.unbanBlocks();
            this.isLoaded = true;
        }
    }

    openInputPopup() {
        this.#module?.openInputPopup?.();
    }
    
    train() {
        this.#module?.train?.();
    }

    isTrained() {
        return this.#module?.isTrained;
    }

    setTrainOption(type, value) {
        this.#module?.setTrainOption?.(type, value);
    }

    getTrainOption() {
        return this.#module?.getTrainOption?.();   
    }

    getTableData() {
        return this.#tableData;
    }

    getTrainResult() {
        return this.#module?.getTrainResult?.()
    }

    getPredictResult(index) {
        return this.#module?.getResult?.(index)
    }

    getId() {
        return this.#modelId;
    }

    setVisible(visible) {
        this.#module?.setVisible?.(visible);
    }

    setChartVisible(visible) {
        if (visible) {
            this.#module?.openChart?.();
        } else {
            this.#module?.closeChart?.();
        }
    }

    openManager() {
        if (this.isEnable) {
            Entry.dispatchEvent('openAIUtilizeTrainManager');
        } else {
            console.log('Disabled learning for offline');
        }
    }

    async predict(obj) {
        if(this.#module && this.#module.predict) {
            this.result = await this.#module.predict(obj);
        }
        return [];
    }


    unbanBlocks() {
        this.banBlocks();
        const blockMenu =  getBlockMenu(this.#playground);
        if (blockMenu) {
            this.#module?.unbanBlocks?.(blockMenu);
        }
    }

    banBlocks() {
        const blockMenu =  getBlockMenu(this.#playground);
        if (blockMenu) {       
            banClasses.forEach((clazz) => {
                blockMenu.banClass(clazz); 
            })
        }
    }

    destroy() {
        this.#labels = [];
        this.#url = null;
        this.#type = null;
        this.isLoading = false;
        this.result = [];
        this.isLoaded = false;
        this.#recordTime = 2000;
        this.#tableData  = null;
        if (this.#module) {
            this.#module.destroy();
            this.#module = null;
        }
    }

    toJSON() {
        if (!this.isLoaded) {
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
}

function getBlockMenu(playground) {
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

function createDataTable(classes) {
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