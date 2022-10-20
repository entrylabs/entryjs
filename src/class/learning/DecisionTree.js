import * as tf from '@tensorflow/tfjs';
import _floor from 'lodash/floor';
import _max from 'lodash/max';
import _sum from 'lodash/sum';
import _mean from 'lodash/mean';
import LearningBase from './LearningBase';
import { DecisionTreeClassifier as DTClassifier } from 'ml-cart';
import Utils from './Utils';
const { callApi } = require('../../util/common');

export const classes = [
    'ai_learning_train',
    'ai_learning_decisionTree',
    'decisionTree_attr_1',
    'decisionTree_attr_2',
    'decisionTree_attr_3',
    'decisionTree_attr_4',
    'decisionTree_attr_5',
    'decisionTree_attr_6',
];

class DecisionTree extends LearningBase {
    type = 'decisionTree';

    init({ name, url, result, table, trainParam }) {
        this.name = name;
        this.trainParam = trainParam;
        this.result = result;
        this.table = table;
        this.trainCallback = (value) => {
            this.view.setValue(value);
        };
        this.isTrained = true;

        this.attrLength = table?.select?.[0]?.length || 0;

        this.fields = table?.select?.[0]?.map((index) => table?.fields[index]);
        this.predictFields = table?.select?.[1]?.map((index) => table?.fields[index]);
        this.load(`/uploads/${url}/model.json`);
        if (!Utils.isWebGlSupport()) {
            tf.setBackend('cpu');
        }
    }

    async train() {
        this.setTable();
        this.isTrained = false;
        this.trainCallback(1);
        const { testRate = 0, maxDepth = 3, minNumSamples = 3 } = this.trainParam;
        const { trainX, trainY, testArr, select, fields, valueMap, numClass } = getData(
            testRate,
            this.table
        );

        this.valueMap = Object.fromEntries(
            Object.entries(valueMap).map(([key, value]) => [value, key])
        );
        this.model = createModel(maxDepth, minNumSamples);
        this.model?.train(trainX, trainY);

        const { confusionMatrix, score } = evaluate(this.model, testArr, numClass);
        this.training = false;
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
        const xs = array.map(({ data }) => data);
        const preds = this.model.predict(xs);
        return preds.map((target) => ({
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
    const { epochs = 1, batchSize = 1 } = this.trainParam;
    this.totalDataSize = Math.ceil(table.length / batchSize) * epochs;

    const dataArray = table
        .map((row) => ({
            x: attr.map((i) => Utils.stringToNumber(i, row[i], tempMap, tempMapCount)),
            y: Utils.stringToNumber(predict[0], row[predict[0]], tempMap, tempMapCount),
        }))
        .map((row) => ({
            x: row.x,
            y: row.y - 1,
        }));
    const [train, test] = this.sliceArray(dataArray, testRate);

    return {
        trainX: train.map((v) => v.x),
        trainY: train.map((v) => v.y),
        testArr: test,
        select,
        fields,
        valueMap: { ...tempMap[predict[0]] },
        numClass: tempMapCount[predict[0]],
    };
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
