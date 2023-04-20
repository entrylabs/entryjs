import * as tf from '@tensorflow/tfjs';
import _floor from 'lodash/floor';
import _max from 'lodash/max';
import _sum from 'lodash/sum';
import _mean from 'lodash/mean';
import _toNumber from 'lodash/toNumber';
import LearningBase from './LearningBase';
import { DecisionTreeClassifier as DTClassifier } from 'ml-cart';
import Utils from './Utils';
import Chart from './Chart';
const { callApi } = require('../../util/common');

export const classes = [
    'ai_learning_train',
    'ai_learning_decisiontree',
    'decisiontree_attr_1',
    'decisiontree_attr_2',
    'decisiontree_attr_3',
    'decisiontree_attr_4',
    'decisiontree_attr_5',
    'decisiontree_attr_6',
];

class DecisionTree extends LearningBase {
    type = 'decisiontree';

    init({ name, url, result, table, trainParam }) {
        this.name = name;
        this.trainParam = trainParam;
        this.result = result;
        this.table = table;
        this.trainCallback = (value) => {
            this.view.setValue(value);
        };
        this.trained = true;
        this.attrLength = table?.select?.[0]?.length || 0;

        this.fields = table?.select?.[0]?.map((index) => table?.fields[index]);
        this.predictFields = table?.select?.[1]?.map((index) => table?.fields[index]);
        this.load(`/uploads/${url}/model.json`);
        if (!Utils.isWebGlSupport()) {
            tf.setBackend('cpu');
        }
    }

    generateTree() {
        const { graphData, fields, valueMap } = this.result;
        this.tree = new Chart(
            {
                source: {
                    graphData,
                    fields,
                    valueMap,
                },
                title: Lang.AiLearning.tree_title,
            },
            'tree'
        );
    }

    openChart() {
        if (!this.tree) {
            this.generateTree();
        } else {
            this.tree.show();
        }
    }

    closeChart() {
        this.tree?.hide();
    }

    destroy() {
        if (this.tree) {
            this.tree.destroy();
            this.tree = null;
        }
        super.destroy();
    }

    async train() {
        this.setTable();
        this.trained = false;
        this.trainCallback(1);
        const {
            testRate = 0.2,
            maxDepth = 3,
            minNumSamples = 3,
            epochs = 1,
            batchSize = 1,
        } = this.trainParam;
        const { trainX, trainY, testArr, select, fields, valueMap, numClass } = getData(
            testRate,
            this.table,
            epochs,
            batchSize
        );

        this.valueMap = Object.fromEntries(
            Object.entries(valueMap).map(([key, value]) => [value, key])
        );
        this.model = createModel(maxDepth, minNumSamples);
        this.model?.train(trainX, trainY);

        const { confusionMatrix, score } = evaluate(this.model, testArr, numClass);
        this.trained = true;
        this.trainCallback(100);
        const { accuracy, f1, precision, recall } = score;
        this.result = {
            graphData: this.model.toJSON().root,
            select,
            fields,
            confusionMatrix,
            accuracy,
            f1,
            valueMap: this.valueMap,
            precision,
            recall,
        };
    }

    async load(url) {
        const { data } = await callApi(url, { url });
        const { model, result } = data;
        this.model = DTClassifier.load(model);
        this.valueMap = result?.valueMap;
        this.result = {
            ...result,
            graphData: this.model?.toJSON().root,
        };
    }

    async predict(array) {
        if (!this.model) {
            throw new Error("can't predict: no model");
        }
        const xs = [array];
        const preds = this.model.predict(xs);
        this.predictResult = preds.map((target) => ({
            className: this.valueMap[target + 1],
            probability: 1,
        }));
    }
}

export default DecisionTree;

function createModel(maxDepth, minNumSamples) {
    return new DTClassifier({
        gainFunction: 'gini', // 'gini' Only
        maxDepth,
        minNumSamples,
    });
}

function getData(testRate = 0.2, data) {
    const tempMap = {};
    const tempMapCount = {};
    const { select = [[0], [1]], data: table, fields } = data;
    const [attr, predict] = select;
    const filtered = table.filter(
        (row) => !select.flat().some((selected) => !_toNumber(row[selected]))
    );
    const dataArray = filtered
        .map((row) => ({
            x: attr.map((i) => Utils.stringToNumber(i, row[i], tempMap, tempMapCount)),
            y: Utils.stringToNumber(predict[0], row[predict[0]], tempMap, tempMapCount),
        }))
        .map((row) => ({
            x: row.x,
            y: row.y - 1,
        }));
    const [train, test] = sliceArray(dataArray, testRate);

    return {
        trainX: train.map((v) => v.x),
        trainY: train.map((v) => v.y),
        testArr: test,
        select,
        fields,
        valueMap: { ...tempMap[predict[0]] },
        numClass: tempMapCount[predict[0]] || 1,
    };
}

function sliceArray(dataArray, testRate) {
    Utils.shuffle(dataArray);
    const testNum = Math.floor(dataArray.length * testRate);
    const testArr = dataArray.slice(0, testNum);
    const trainArr = dataArray.slice(testNum, dataArray.length);
    return [trainArr, testArr];
}

function evaluate(model, validateData = [{ x: 0, y: 0 }], numClass) {
    const xs = validateData.map((data) => data.x);
    const ys = validateData.map((data) => data.y);
    const predictYs = model.predict(xs);
    const length = predictYs.length;
    // Confusion Matrix 생성
    const confusionMatrix = Array(numClass)
        .fill(0)
        .map(() => Array(numClass).fill(0));

    for (let idx = 0; idx < length; idx++) {
        confusionMatrix[ys[idx]][predictYs[idx]]++;
    }
    const score = Utils.getScores(confusionMatrix, numClass);
    return { confusionMatrix, score };
}
