import TextLearning, { classes as TextClasses } from './learning/TextLearning';
import Cluster, { classes as ClusterClasses } from './learning/Cluster';
import Regression, { classes as RegressionClasses } from './learning/Regression';
import ImageLearning, { classes as ImageClasses } from './learning/ImageLearning';
import Classification, { classes as ClassificationClasses } from './learning/Classification';
import NumberClassification, {
    classes as NumberClassificationClasses,
} from './learning/NumberClassification';
import DecisionTree, { classes as DecisionTreeClasses } from './learning/decisionTree';
import LogisticRegression, {
    classes as LogisticRegressionClasses,
} from './learning/logisticRegression';
import DataTable from './DataTable';

const banClasses = [
    ...ClusterClasses,
    ...RegressionClasses,
    ...TextClasses,
    ...ImageClasses,
    ...ClassificationClasses,
    ...NumberClassificationClasses,
    ...DecisionTreeClasses,
    ...LogisticRegressionClasses,
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
        const utilizeBlock = [];
        Object.values(Entry.AI_UTILIZE_BLOCK_LIST)
            .map((x) => Object.keys(x.getBlocks()))
            .forEach((category) => {
                category.forEach((block) => {
                    utilizeBlock.push(block);
                });
            });

        const { blocks } = EntryStatic.getAllBlocks().find(
            ({ category }) => category === 'ai_utilize'
        );
        blocks
            .filter((x) => !utilizeBlock.includes(x))
            .forEach((blockType) => {
                Entry.Utils.removeBlockByType(blockType);
            });
        this.banBlocks();
        this.destroy();
    }

    removeLearningBlocks() {
        if (!this.isLoaded) {
            return;
        }
        const { blocks } = EntryStatic.getAllBlocks().find(
            ({ category }) => category === 'ai_utilize'
        );
        blocks
            .filter((x) => Entry.block[x].class === 'ai_learning')
            .forEach((blockType) => {
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

        if (!url || !this.isEnable || !isActive) {
            return;
        }
        this.destroy();

        this.#labels = labels || classes.map(({ name }) => name);
        this.#type = type;
        this.#url = url;
        this.#oid = _id;
        this.name = name;
        this.#modelId = model || id;
        this.#recordTime = recordTime;
        this.result = result;

        if (this.#playground) {
            this.#playground.reloadPlayground();
        }

        if (type === 'text') {
            this.#module = new TextLearning({
                url,
                labels: this.#labels,
                type,
                recordTime,
            });
        } else if (type === 'number') {
            this.#tableData = tableData || createDataTable(classes, name);
            this.#module = new NumberClassification({
                name,
                result,
                url,
                trainParam,
                table: this.#tableData,
            });
            this.#labels = this.#module.getLabels();
        } else if (type === 'cluster') {
            this.#tableData = tableData || createDataTable(classes, name);
            this.#module = new Cluster({
                name,
                result,
                trainParam,
                table: this.#tableData,
            });
        } else if (type === 'regression') {
            this.#tableData = tableData || createDataTable(classes, name);
            this.#module = new Regression({
                name,
                result,
                url,
                trainParam,
                table: this.#tableData,
            });
        } else if (type === 'image') {
            this.#module = new ImageLearning({
                url,
                labels: this.#labels,
                type,
            });
        } else if (type === 'speech') {
            this.#module = new Classification({
                url,
                labels: this.#labels,
                type,
                recordTime,
            });
        } else if (type === 'logisticRegression') {
            this.#tableData = tableData || createDataTable(classes, name);
            this.#module = new LogisticRegression({
                name,
                result,
                url,
                trainParam,
                table: this.#tableData,
            });
        } else if (type === 'decisionTree') {
            this.#tableData = tableData || createDataTable(classes, name);
            this.#module = new DecisionTree({
                name,
                result,
                url,
                trainParam,
                table: this.#tableData,
            });
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
        return this.#module?.isTrained?.();
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
        return this.#module?.getTrainResult?.();
    }

    getPredictResult(index) {
        return this.#module?.getResult?.(index);
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
        if (this.#module && this.#module.predict) {
            this.result = await this.#module.predict(obj);
        }
        return [];
    }

    startPredict() {
        if (this.#module && this.#module.startPredict) {
            this.#module.startPredict();
        }
    }

    stopPredict() {
        if (this.#module && this.#module.stopPredict) {
            this.#module.stopPredict();
        }
    }

    unbanBlocks() {
        this.banBlocks();
        const blockMenu = getBlockMenu(this.#playground);
        if (blockMenu) {
            this.#module?.unbanBlocks?.(blockMenu);
        }
    }

    banBlocks() {
        const blockMenu = getBlockMenu(this.#playground);
        if (blockMenu) {
            banClasses.forEach((clazz) => {
                blockMenu.banClass(clazz);
            });
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
        this.#tableData = null;
        if (this.#module) {
            this.#module?.destroy?.();
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
        };
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

function createDataTable(classes, name) {
    if (!classes.length) {
        return;
    }
    try {
        const [{ samples }] = classes;
        const [sample = {}] = samples || [];
        let data = sample.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (data && data.id && !DataTable.getSource(data.id)) {
            DataTable.addSource(data, false);
        }
        return data;
    } catch (e) {
        console.log('set table error', e);
    }
}
